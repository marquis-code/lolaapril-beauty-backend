import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Model, Types } from 'mongoose';
import { 
  NoShowRecord, 
  NoShowRecordDocument 
} from '../schemas/no-show-record.schema';
import { 
  ClientReliability, 
  ClientReliabilityDocument 
} from '../schemas/client-reliability.schema';

export interface RecordNoShowInput {
  clientId: string;
  businessId: string;
  appointmentId: string;
  bookingId: string;
  appointmentDate: Date;
  scheduledTime: string;
  bookedAmount: number;
  depositAmount?: number;
  wasDeposited?: boolean;
}

export interface RecordLateCancellationInput {
  clientId: string;
  businessId: string;
  appointmentId: string;
  bookingId: string;
  appointmentDate: Date;
  scheduledTime: string;
  bookedAmount: number;
  penaltyCharged: number;
  hoursNotice: number;
}

@Injectable()
export class NoShowManagementService {
  private readonly logger = new Logger(NoShowManagementService.name);

  constructor(
    @InjectModel(NoShowRecord.name)
    private noShowModel: Model<NoShowRecordDocument>,
    @InjectModel(ClientReliability.name)
    private reliabilityModel: Model<ClientReliabilityDocument>,
    private eventEmitter: EventEmitter2
  ) {}

  /**
   * Record a no-show incident
   */
  async recordNoShow(input: RecordNoShowInput): Promise<any> {
    // NUCLEAR FIX: Cast result immediately
    const record: any = await this.noShowModel.create({
      clientId: new Types.ObjectId(input.clientId),
      businessId: new Types.ObjectId(input.businessId),
      appointmentId: new Types.ObjectId(input.appointmentId),
      bookingId: new Types.ObjectId(input.bookingId),
      appointmentDate: input.appointmentDate,
      scheduledTime: input.scheduledTime,
      bookedAmount: input.bookedAmount,
      depositAmount: input.depositAmount || 0,
      wasDeposited: input.wasDeposited || false,
      depositForfeited: input.wasDeposited || false,
      type: 'no_show',
      recordedAt: new Date()
    });

    // Update reliability score
    await this.updateReliabilityScore(
      input.clientId,
      input.businessId,
      'no_show'
    );

    // Emit event
    this.eventEmitter.emit('no-show.recorded', {
      clientId: input.clientId,
      businessId: input.businessId,
      appointmentId: input.appointmentId
    });

    this.logger.warn(`No-show recorded for client ${input.clientId}`);
    return record;
  }

  /**
   * Record a late cancellation
   */
  async recordLateCancellation(input: RecordLateCancellationInput): Promise<any> {
    const type = input.hoursNotice < 24 
      ? 'same_day_cancellation' 
      : 'late_cancellation';

    // NUCLEAR FIX: Cast result immediately
    const record: any = await this.noShowModel.create({
      clientId: new Types.ObjectId(input.clientId),
      businessId: new Types.ObjectId(input.businessId),
      appointmentId: new Types.ObjectId(input.appointmentId),
      bookingId: new Types.ObjectId(input.bookingId),
      appointmentDate: input.appointmentDate,
      scheduledTime: input.scheduledTime,
      bookedAmount: input.bookedAmount,
      penaltyCharged: input.penaltyCharged,
      type,
      recordedAt: new Date()
    });

    // Update reliability score
    await this.updateReliabilityScore(
      input.clientId,
      input.businessId,
      type
    );

    this.logger.log(`Late cancellation recorded for client ${input.clientId}`);
    return record;
  }

  /**
   * Get client reliability metrics
   */
  async getClientReliability(
    clientId: string,
    businessId: string
  ): Promise<ClientReliabilityDocument | null> {
    return this.reliabilityModel.findOne({
      clientId: new Types.ObjectId(clientId),
      businessId: new Types.ObjectId(businessId)
    }).exec();
  }

  /**
   * Check if client should require deposit
   */
  async shouldRequireDeposit(
    clientId: string,
    businessId: string
  ): Promise<{
    requiresDeposit: boolean;
    reason: string;
    score: number;
    riskLevel: string;
  }> {
    const reliability = await this.getClientReliability(clientId, businessId);

    if (!reliability) {
      return {
        requiresDeposit: false,
        reason: 'New client - no history',
        score: 100,
        riskLevel: 'low'
      };
    }

    if (reliability.isBlacklisted) {
      return {
        requiresDeposit: true,
        reason: `Client is blacklisted: ${reliability.blacklistReason}`,
        score: reliability.reliabilityScore,
        riskLevel: 'high'
      };
    }

    if (reliability.requiresDeposit) {
      return {
        requiresDeposit: true,
        reason: `Poor reliability history: ${reliability.noShowCount} no-shows, score: ${reliability.reliabilityScore}`,
        score: reliability.reliabilityScore,
        riskLevel: reliability.riskLevel || 'medium'
      };
    }

    return {
      requiresDeposit: false,
      reason: 'Good reliability history',
      score: reliability.reliabilityScore,
      riskLevel: reliability.riskLevel || 'low'
    };
  }

  /**
   * Get no-show statistics for business
   */
  async getNoShowStats(
    businessId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {
    const matchQuery: any = {
      businessId: new Types.ObjectId(businessId)
    };

    if (startDate || endDate) {
      matchQuery.recordedAt = {};
      if (startDate) matchQuery.recordedAt.$gte = startDate;
      if (endDate) matchQuery.recordedAt.$lte = endDate;
    }

    const stats: any = await this.noShowModel.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalRevenueLost: { $sum: '$bookedAmount' },
          totalPenaltiesCharged: { $sum: '$penaltyCharged' },
          totalDepositsForfeited: {
            $sum: { $cond: ['$depositForfeited', '$depositAmount', 0] }
          }
        }
      }
    ]).exec();

    const summary = {
      noShows: 0,
      lateCancellations: 0,
      sameDayCancellations: 0,
      totalIncidents: 0,
      revenueLost: 0,
      penaltiesCollected: 0,
      depositsForfeited: 0
    };

    stats.forEach((item: any) => {
      summary.totalIncidents += item.count;
      summary.revenueLost += item.totalRevenueLost;
      summary.penaltiesCollected += item.totalPenaltiesCharged;
      summary.depositsForfeited += item.totalDepositsForfeited;

      if (item._id === 'no_show') {
        summary.noShows = item.count;
      } else if (item._id === 'late_cancellation') {
        summary.lateCancellations = item.count;
      } else if (item._id === 'same_day_cancellation') {
        summary.sameDayCancellations = item.count;
      }
    });

    return summary;
  }

  /**
   * Update reliability score based on incident type
   */
  async updateReliabilityScore(
    clientId: string,
    businessId: string,
    incidentType: 'no_show' | 'late_cancellation' | 'same_day_cancellation' | 'completed'
  ): Promise<void> {
    const scoreChanges = {
      no_show: -15,
      late_cancellation: -10,
      same_day_cancellation: -5,
      completed: 2
    };

    const reliability = await this.reliabilityModel.findOne({
      clientId: new Types.ObjectId(clientId),
      businessId: new Types.ObjectId(businessId)
    });

    const scoreChange = scoreChanges[incidentType] || 0;

    if (reliability) {
      // Update existing record
      reliability.reliabilityScore = Math.max(
        0,
        Math.min(100, reliability.reliabilityScore + scoreChange)
      );

      if (incidentType === 'no_show') {
        reliability.noShowCount += 1;
        reliability.lastNoShowDate = new Date();
      } else if (incidentType === 'late_cancellation' || incidentType === 'same_day_cancellation') {
        reliability.lateCancellations += 1;
        reliability.lastCancellationDate = new Date();
      } else if (incidentType === 'completed') {
        reliability.completedBookings += 1;
        reliability.lastCompletedDate = new Date();
      }

      reliability.totalBookings += 1;

      // Determine if deposit should be required
      reliability.requiresDeposit = 
        reliability.noShowCount >= 2 || 
        reliability.reliabilityScore < 60;

      // Set risk level
      if (reliability.reliabilityScore >= 80) {
        reliability.riskLevel = 'low';
      } else if (reliability.reliabilityScore >= 50) {
        reliability.riskLevel = 'medium';
      } else {
        reliability.riskLevel = 'high';
      }

      await reliability.save();
    } else {
      // Create new record
      const newReliability = new this.reliabilityModel({
        clientId: new Types.ObjectId(clientId),
        businessId: new Types.ObjectId(businessId),
        reliabilityScore: 100 + scoreChange,
        totalBookings: 1,
        completedBookings: incidentType === 'completed' ? 1 : 0,
        noShowCount: incidentType === 'no_show' ? 1 : 0,
        lateCancellations: 
          incidentType === 'late_cancellation' || incidentType === 'same_day_cancellation' ? 1 : 0,
        lastNoShowDate: incidentType === 'no_show' ? new Date() : undefined,
        lastCancellationDate: 
          incidentType === 'late_cancellation' || incidentType === 'same_day_cancellation' 
            ? new Date() 
            : undefined,
        lastCompletedDate: incidentType === 'completed' ? new Date() : undefined,
        requiresDeposit: incidentType === 'no_show',
        riskLevel: incidentType === 'no_show' ? 'medium' : 'low'
      });

      await newReliability.save();
    }

    this.logger.log(
      `Updated reliability score for client ${clientId}: ${incidentType}`
    );
  }

  /**
   * Get client history
   */
  async getClientHistory(
    clientId: string,
    businessId: string,
    limit: number = 20
  ): Promise<any> {
    const records = await this.noShowModel
      .find({
        clientId: new Types.ObjectId(clientId),
        businessId: new Types.ObjectId(businessId)
      })
      .sort({ recordedAt: -1 })
      .limit(limit)
      .exec();

    return {
      total: records.length,
      records: records.map((r: any) => ({
        id: r._id,
        type: r.type,
        appointmentDate: r.appointmentDate,
        scheduledTime: r.scheduledTime,
        bookedAmount: r.bookedAmount,
        penaltyCharged: r.penaltyCharged || 0,
        depositForfeited: r.depositForfeited || false,
        recordedAt: r.recordedAt
      }))
    };
  }

  /**
   * Get reliability metrics for business
   */
  async getReliabilityMetrics(businessId: string): Promise<any> {
    const metrics: any = await this.reliabilityModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(businessId)
        }
      },
      {
        $group: {
          _id: null,
          totalClients: { $sum: 1 },
          avgReliabilityScore: { $avg: '$reliabilityScore' },
          clientsRequiringDeposit: {
            $sum: { $cond: ['$requiresDeposit', 1, 0] }
          },
          blacklistedClients: {
            $sum: { $cond: ['$isBlacklisted', 1, 0] }
          },
          highRiskClients: {
            $sum: { 
              $cond: [
                { $eq: ['$riskLevel', 'high'] },
                1,
                0
              ]
            }
          }
        }
      }
    ]).exec();

    return metrics[0] || {
      totalClients: 0,
      avgReliabilityScore: 100,
      clientsRequiringDeposit: 0,
      blacklistedClients: 0,
      highRiskClients: 0
    };
  }

  /**
   * Get cancellation trends over time
   */
  async getCancellationTrends(
    businessId: string,
    startDate: Date,
    endDate: Date,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Promise<any> {
    const groupFormat = {
      day: { $dateToString: { format: '%Y-%m-%d', date: '$recordedAt' } },
      week: { $dateToString: { format: '%Y-W%V', date: '$recordedAt' } },
      month: { $dateToString: { format: '%Y-%m', date: '$recordedAt' } }
    };

    const trends: any = await this.noShowModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(businessId),
          recordedAt: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: {
            period: groupFormat[groupBy],
            type: '$type'
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$bookedAmount' },
          totalPenalties: { $sum: '$penaltyCharged' }
        }
      },
      {
        $sort: { '_id.period': 1 }
      }
    ]).exec();

    // Format the results
    const formattedTrends: any = {};
    trends.forEach((item: any) => {
      const period = item._id.period;
      if (!formattedTrends[period]) {
        formattedTrends[period] = {
          period,
          noShows: 0,
          lateCancellations: 0,
          sameDayCancellations: 0,
          totalIncidents: 0,
          revenueLost: 0,
          penaltiesCollected: 0
        };
      }

      const data = formattedTrends[period];
      data.totalIncidents += item.count;
      data.revenueLost += item.totalAmount;
      data.penaltiesCollected += item.totalPenalties;

      if (item._id.type === 'no_show') {
        data.noShows += item.count;
      } else if (item._id.type === 'late_cancellation') {
        data.lateCancellations += item.count;
      } else if (item._id.type === 'same_day_cancellation') {
        data.sameDayCancellations += item.count;
      }
    });

    return {
      groupBy,
      startDate,
      endDate,
      trends: Object.values(formattedTrends)
    };
  }

  /**
   * Record completed appointment (improves reliability score)
   */
  async recordCompletedAppointment(
    clientId: string,
    businessId: string,
    appointmentId: string
  ): Promise<void> {
    await this.updateReliabilityScore(
      clientId,
      businessId,
      'completed'
    );

    this.logger.log(
      `Completed appointment recorded for client ${clientId}`
    );
  }

  /**
   * Blacklist a client
   */
  async blacklistClient(
    clientId: string,
    businessId: string,
    reason: string,
    adminId: string
  ): Promise<void> {
    await this.reliabilityModel.updateOne(
      {
        clientId: new Types.ObjectId(clientId),
        businessId: new Types.ObjectId(businessId)
      },
      {
        $set: {
          isBlacklisted: true,
          blacklistReason: reason,
          blacklistedAt: new Date(),
          requiresDeposit: true,
          riskLevel: 'high'
        }
      },
      { upsert: true }
    ).exec();

    // Emit event for notifications
    this.eventEmitter.emit('client.blacklisted', {
      clientId,
      businessId,
      reason,
      adminId
    });

    this.logger.warn(`Client ${clientId} blacklisted by admin ${adminId}: ${reason}`);
  }

  /**
   * Remove client from blacklist
   */
  async unblacklistClient(
    clientId: string,
    businessId: string,
    adminId: string
  ): Promise<void> {
    await this.reliabilityModel.updateOne(
      {
        clientId: new Types.ObjectId(clientId),
        businessId: new Types.ObjectId(businessId)
      },
      {
        $set: {
          isBlacklisted: false,
          blacklistReason: null,
          blacklistedAt: null
        }
      }
    ).exec();

    // Emit event
    this.eventEmitter.emit('client.unblacklisted', {
      clientId,
      businessId,
      adminId
    });

    this.logger.log(`Client ${clientId} removed from blacklist by admin ${adminId}`);
  }
}