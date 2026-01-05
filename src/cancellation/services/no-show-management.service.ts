// import { Injectable, Logger } from '@nestjs/common'
// import { InjectModel } from '@nestjs/mongoose'
// import { Model, Types } from 'mongoose'
// import { NoShowRecord, NoShowRecordDocument } from '../schemas/no-show-record.schema'
// import { ClientReliability, ClientReliabilityDocument } from '../schemas/client-reliability.schema'
// import { EventEmitter2 } from '@nestjs/event-emitter'

// // Define the return type for deposit check
// interface ClientReliabilityCheck {
//   requiresDeposit: boolean
//   reason: string
//   score: number
// }

// @Injectable()
// export class NoShowManagementService {
//   private readonly logger = new Logger(NoShowManagementService.name)

//   constructor(
//     @InjectModel(NoShowRecord.name)
//     private noShowModel: Model<NoShowRecordDocument>,
//     @InjectModel(ClientReliability.name)
//     private reliabilityModel: Model<ClientReliabilityDocument>,
//     private eventEmitter: EventEmitter2
//   ) {}

//   /**
//    * Record a no-show incident
//    */
//   async recordNoShow(data: {
//     clientId: string
//     businessId: string
//     appointmentId: string
//     bookingId?: string
//     appointmentDate: Date
//     scheduledTime: string
//     bookedAmount: number
//     depositAmount?: number
//     wasDeposited: boolean
//   }): Promise<void> {
//     // Create no-show record
//     const noShowRecord = await this.noShowModel.create({
//       clientId: new Types.ObjectId(data.clientId),
//       businessId: new Types.ObjectId(data.businessId),
//       appointmentId: new Types.ObjectId(data.appointmentId),
//       bookingId: data.bookingId ? new Types.ObjectId(data.bookingId) : undefined,
//       appointmentDate: data.appointmentDate,
//       scheduledTime: data.scheduledTime,
//       bookedAmount: data.bookedAmount,
//       depositAmount: data.depositAmount || 0,
//       wasDeposited: data.wasDeposited,
//       depositForfeited: data.wasDeposited,
//       type: 'no_show',
//       recordedAt: new Date()
//     })

//     // Update client reliability
//     await this.updateReliabilityScore(
//       data.clientId,
//       data.businessId,
//       'no_show'
//     )

//     // Emit event for notifications
//     this.eventEmitter.emit('no_show.recorded', {
//       noShowRecord,
//       clientId: data.clientId,
//       businessId: data.businessId
//     })

//     this.logger.log(
//       `No-show recorded for client ${data.clientId} on appointment ${data.appointmentId}`
//     )
//   }

//   /**
//    * Record late cancellation
//    */
//   async recordLateCancellation(data: {
//     clientId: string
//     businessId: string
//     appointmentId: string
//     bookingId?: string
//     appointmentDate: Date
//     scheduledTime: string
//     bookedAmount: number
//     penaltyCharged: number
//     hoursNotice: number
//   }): Promise<void> {
//     const type = data.hoursNotice < 24 ? 'late_cancellation' : 'same_day_cancellation'

//     await this.noShowModel.create({
//       clientId: new Types.ObjectId(data.clientId),
//       businessId: new Types.ObjectId(data.businessId),
//       appointmentId: new Types.ObjectId(data.appointmentId),
//       bookingId: data.bookingId ? new Types.ObjectId(data.bookingId) : undefined,
//       appointmentDate: data.appointmentDate,
//       scheduledTime: data.scheduledTime,
//       bookedAmount: data.bookedAmount,
//       penaltyCharged: data.penaltyCharged,
//       type,
//       recordedAt: new Date()
//     })

//     // Update reliability
//     await this.updateReliabilityScore(
//       data.clientId,
//       data.businessId,
//       type
//     )

//     this.logger.log(
//       `Late cancellation recorded for client ${data.clientId}: ${type}`
//     )
//   }

//   /**
//    * Update client reliability score
//    */
//   private async updateReliabilityScore(
//     clientId: string,
//     businessId: string,
//     incidentType: string
//   ): Promise<void> {
//     const updateData: any = {}

//     switch (incidentType) {
//       case 'no_show':
//         updateData.$inc = {
//           noShowCount: 1,
//           reliabilityScore: -15,
//           totalBookings: 1
//         }
//         updateData.$set = {
//           lastNoShowDate: new Date(),
//           requiresDeposit: true,
//           riskLevel: 'high'
//         }
//         break

//       case 'late_cancellation':
//       case 'same_day_cancellation':
//         updateData.$inc = {
//           lateCancellations: 1,
//           cancelledBookings: 1,
//           reliabilityScore: -10,
//           totalBookings: 1
//         }
//         updateData.$set = {
//           lastCancellationDate: new Date()
//         }
//         break

//       case 'completed':
//         updateData.$inc = {
//           completedBookings: 1,
//           onTimeArrivals: 1,
//           reliabilityScore: 2,
//           totalBookings: 1
//         }
//         updateData.$set = {
//           lastCompletedDate: new Date()
//         }
//         updateData.$min = { reliabilityScore: 100 }
//         break
//     }

//     await this.reliabilityModel
//       .findOneAndUpdate(
//         {
//           clientId: new Types.ObjectId(clientId),
//           businessId: new Types.ObjectId(businessId)
//         },
//         updateData,
//         { upsert: true, new: true }
//       )
//       .exec()

//     // Check if client should be flagged
//     const reliability = await this.getClientReliability(clientId, businessId)
    
//     if (reliability.noShowCount >= 3) {
//       await this.flagForReview(clientId, businessId, 'Multiple no-shows')
//     }
//   }

//   /**
//    * Get client reliability information
//    * Returns a plain object (not a Mongoose document)
//    */
//   async getClientReliability(
//     clientId: string,
//     businessId: string
//   ): Promise<any> {
//     const reliabilityDoc = await this.reliabilityModel
//       .findOne({
//         clientId: new Types.ObjectId(clientId),
//         businessId: new Types.ObjectId(businessId)
//       })
//       .exec()

//     if (!reliabilityDoc) {
//       // Create new and return plain object immediately
//       const created = await this.reliabilityModel.create({
//         clientId: new Types.ObjectId(clientId),
//         businessId: new Types.ObjectId(businessId),
//         reliabilityScore: 100,
//         riskLevel: 'low'
//       })
      
//       // Convert to plain JSON to avoid type complexity
//       return JSON.parse(JSON.stringify(created))
//     }

//     // Convert to plain JSON to avoid type complexity
//     return JSON.parse(JSON.stringify(reliabilityDoc))
//   }

//   /**
//    * Check if client should be required to pay deposit
//    */
//   async shouldRequireDeposit(
//     clientId: string,
//     businessId: string
//   ): Promise<ClientReliabilityCheck> {
//     const reliability = await this.getClientReliability(clientId, businessId)

//     if (reliability.isBlacklisted) {
//       return {
//         requiresDeposit: true,
//         reason: 'Client is blacklisted',
//         score: 0
//       }
//     }

//     // Require deposit if poor history
//     if (
//       reliability.noShowCount >= 2 ||
//       reliability.lateCancellations >= 3 ||
//       reliability.reliabilityScore < 70
//     ) {
//       return {
//         requiresDeposit: true,
//         reason: 'History of no-shows or late cancellations',
//         score: reliability.reliabilityScore
//       }
//     }

//     return {
//       requiresDeposit: false,
//       reason: 'Good reliability history',
//       score: reliability.reliabilityScore
//     }
//   }

//   /**
//    * Flag client for review
//    */
//   private async flagForReview(
//     clientId: string,
//     businessId: string,
//     reason: string
//   ): Promise<void> {
//     await this.reliabilityModel.updateOne(
//       {
//         clientId: new Types.ObjectId(clientId),
//         businessId: new Types.ObjectId(businessId)
//       },
//       {
//         $set: {
//           requiresDeposit: true,
//           riskLevel: 'high',
//           notes: reason
//         }
//       }
//     ).exec()

//     // Emit event for admin notification
//     this.eventEmitter.emit('client.flagged', {
//       clientId,
//       businessId,
//       reason
//     })

//     this.logger.warn(`Client ${clientId} flagged: ${reason}`)
//   }

//   /**
//    * Get no-show statistics for business
//    */
//   async getNoShowStats(
//     businessId: string,
//     startDate?: Date,
//     endDate?: Date
//   ): Promise<any> {
//     const matchStage: any = {
//       businessId: new Types.ObjectId(businessId)
//     }

//     if (startDate && endDate) {
//       matchStage.recordedAt = {
//         $gte: startDate,
//         $lte: endDate
//       }
//     }

//     const stats = await this.noShowModel.aggregate([
//       { $match: matchStage },
//       {
//         $group: {
//           _id: '$type',
//           count: { $sum: 1 },
//           totalLost: { $sum: '$bookedAmount' },
//           totalPenalties: { $sum: '$penaltyCharged' }
//         }
//       }
//     ]).exec()

//     return {
//       stats,
//       totalIncidents: stats.reduce((sum, s) => sum + s.count, 0),
//       totalRevenueLost: stats.reduce((sum, s) => sum + s.totalLost, 0),
//       totalPenaltiesCollected: stats.reduce((sum, s) => sum + s.totalPenalties, 0)
//     }
//   }
// }

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
  async recordNoShow(input: RecordNoShowInput): Promise<NoShowRecordDocument> {
    const record = await this.noShowModel.create({
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
  async recordLateCancellation(input: RecordLateCancellationInput): Promise<NoShowRecordDocument> {
    const type = input.hoursNotice < 24 
      ? 'same_day_cancellation' 
      : 'late_cancellation';

    const record = await this.noShowModel.create({
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

    const stats = await this.noShowModel.aggregate([
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

    stats.forEach(item => {
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
      records: records.map(r => ({
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
    const metrics = await this.reliabilityModel.aggregate([
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

    const trends = await this.noShowModel.aggregate([
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
    const formattedTrends = {};
    trends.forEach(item => {
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