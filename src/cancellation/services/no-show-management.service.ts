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
//     // Use exec() without lean() to get document first, then convert
//     const reliabilityDoc = await this.reliabilityModel
//       .findOne({
//         clientId: new Types.ObjectId(clientId),
//         businessId: new Types.ObjectId(businessId)
//       })
//       .exec()

//     if (!reliabilityDoc) {
//       const newReliability = await this.reliabilityModel.create({
//         clientId: new Types.ObjectId(clientId),
//         businessId: new Types.ObjectId(businessId),
//         reliabilityScore: 100,
//         riskLevel: 'low'
//       })
      
//       return newReliability.toObject()
//     }

//     return reliabilityDoc.toObject()
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

import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { NoShowRecord, NoShowRecordDocument } from '../schemas/no-show-record.schema'
import { ClientReliability, ClientReliabilityDocument } from '../schemas/client-reliability.schema'
import { EventEmitter2 } from '@nestjs/event-emitter'

// Define the return type for deposit check
interface ClientReliabilityCheck {
  requiresDeposit: boolean
  reason: string
  score: number
}

@Injectable()
export class NoShowManagementService {
  private readonly logger = new Logger(NoShowManagementService.name)

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
  async recordNoShow(data: {
    clientId: string
    businessId: string
    appointmentId: string
    bookingId?: string
    appointmentDate: Date
    scheduledTime: string
    bookedAmount: number
    depositAmount?: number
    wasDeposited: boolean
  }): Promise<void> {
    // Create no-show record
    const noShowRecord = await this.noShowModel.create({
      clientId: new Types.ObjectId(data.clientId),
      businessId: new Types.ObjectId(data.businessId),
      appointmentId: new Types.ObjectId(data.appointmentId),
      bookingId: data.bookingId ? new Types.ObjectId(data.bookingId) : undefined,
      appointmentDate: data.appointmentDate,
      scheduledTime: data.scheduledTime,
      bookedAmount: data.bookedAmount,
      depositAmount: data.depositAmount || 0,
      wasDeposited: data.wasDeposited,
      depositForfeited: data.wasDeposited,
      type: 'no_show',
      recordedAt: new Date()
    })

    // Update client reliability
    await this.updateReliabilityScore(
      data.clientId,
      data.businessId,
      'no_show'
    )

    // Emit event for notifications
    this.eventEmitter.emit('no_show.recorded', {
      noShowRecord,
      clientId: data.clientId,
      businessId: data.businessId
    })

    this.logger.log(
      `No-show recorded for client ${data.clientId} on appointment ${data.appointmentId}`
    )
  }

  /**
   * Record late cancellation
   */
  async recordLateCancellation(data: {
    clientId: string
    businessId: string
    appointmentId: string
    bookingId?: string
    appointmentDate: Date
    scheduledTime: string
    bookedAmount: number
    penaltyCharged: number
    hoursNotice: number
  }): Promise<void> {
    const type = data.hoursNotice < 24 ? 'late_cancellation' : 'same_day_cancellation'

    await this.noShowModel.create({
      clientId: new Types.ObjectId(data.clientId),
      businessId: new Types.ObjectId(data.businessId),
      appointmentId: new Types.ObjectId(data.appointmentId),
      bookingId: data.bookingId ? new Types.ObjectId(data.bookingId) : undefined,
      appointmentDate: data.appointmentDate,
      scheduledTime: data.scheduledTime,
      bookedAmount: data.bookedAmount,
      penaltyCharged: data.penaltyCharged,
      type,
      recordedAt: new Date()
    })

    // Update reliability
    await this.updateReliabilityScore(
      data.clientId,
      data.businessId,
      type
    )

    this.logger.log(
      `Late cancellation recorded for client ${data.clientId}: ${type}`
    )
  }

  /**
   * Update client reliability score
   */
  private async updateReliabilityScore(
    clientId: string,
    businessId: string,
    incidentType: string
  ): Promise<void> {
    const updateData: any = {}

    switch (incidentType) {
      case 'no_show':
        updateData.$inc = {
          noShowCount: 1,
          reliabilityScore: -15,
          totalBookings: 1
        }
        updateData.$set = {
          lastNoShowDate: new Date(),
          requiresDeposit: true,
          riskLevel: 'high'
        }
        break

      case 'late_cancellation':
      case 'same_day_cancellation':
        updateData.$inc = {
          lateCancellations: 1,
          cancelledBookings: 1,
          reliabilityScore: -10,
          totalBookings: 1
        }
        updateData.$set = {
          lastCancellationDate: new Date()
        }
        break

      case 'completed':
        updateData.$inc = {
          completedBookings: 1,
          onTimeArrivals: 1,
          reliabilityScore: 2,
          totalBookings: 1
        }
        updateData.$set = {
          lastCompletedDate: new Date()
        }
        updateData.$min = { reliabilityScore: 100 }
        break
    }

    await this.reliabilityModel
      .findOneAndUpdate(
        {
          clientId: new Types.ObjectId(clientId),
          businessId: new Types.ObjectId(businessId)
        },
        updateData,
        { upsert: true, new: true }
      )
      .exec()

    // Check if client should be flagged
    const reliability = await this.getClientReliability(clientId, businessId)
    
    if (reliability.noShowCount >= 3) {
      await this.flagForReview(clientId, businessId, 'Multiple no-shows')
    }
  }

  /**
   * Get client reliability information
   * Returns a plain object (not a Mongoose document)
   */
  async getClientReliability(
    clientId: string,
    businessId: string
  ): Promise<any> {
    const reliabilityDoc = await this.reliabilityModel
      .findOne({
        clientId: new Types.ObjectId(clientId),
        businessId: new Types.ObjectId(businessId)
      })
      .exec()

    if (!reliabilityDoc) {
      // Create new and return plain object immediately
      const created = await this.reliabilityModel.create({
        clientId: new Types.ObjectId(clientId),
        businessId: new Types.ObjectId(businessId),
        reliabilityScore: 100,
        riskLevel: 'low'
      })
      
      // Convert to plain JSON to avoid type complexity
      return JSON.parse(JSON.stringify(created))
    }

    // Convert to plain JSON to avoid type complexity
    return JSON.parse(JSON.stringify(reliabilityDoc))
  }

  /**
   * Check if client should be required to pay deposit
   */
  async shouldRequireDeposit(
    clientId: string,
    businessId: string
  ): Promise<ClientReliabilityCheck> {
    const reliability = await this.getClientReliability(clientId, businessId)

    if (reliability.isBlacklisted) {
      return {
        requiresDeposit: true,
        reason: 'Client is blacklisted',
        score: 0
      }
    }

    // Require deposit if poor history
    if (
      reliability.noShowCount >= 2 ||
      reliability.lateCancellations >= 3 ||
      reliability.reliabilityScore < 70
    ) {
      return {
        requiresDeposit: true,
        reason: 'History of no-shows or late cancellations',
        score: reliability.reliabilityScore
      }
    }

    return {
      requiresDeposit: false,
      reason: 'Good reliability history',
      score: reliability.reliabilityScore
    }
  }

  /**
   * Flag client for review
   */
  private async flagForReview(
    clientId: string,
    businessId: string,
    reason: string
  ): Promise<void> {
    await this.reliabilityModel.updateOne(
      {
        clientId: new Types.ObjectId(clientId),
        businessId: new Types.ObjectId(businessId)
      },
      {
        $set: {
          requiresDeposit: true,
          riskLevel: 'high',
          notes: reason
        }
      }
    ).exec()

    // Emit event for admin notification
    this.eventEmitter.emit('client.flagged', {
      clientId,
      businessId,
      reason
    })

    this.logger.warn(`Client ${clientId} flagged: ${reason}`)
  }

  /**
   * Get no-show statistics for business
   */
  async getNoShowStats(
    businessId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {
    const matchStage: any = {
      businessId: new Types.ObjectId(businessId)
    }

    if (startDate && endDate) {
      matchStage.recordedAt = {
        $gte: startDate,
        $lte: endDate
      }
    }

    const stats = await this.noShowModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalLost: { $sum: '$bookedAmount' },
          totalPenalties: { $sum: '$penaltyCharged' }
        }
      }
    ]).exec()

    return {
      stats,
      totalIncidents: stats.reduce((sum, s) => sum + s.count, 0),
      totalRevenueLost: stats.reduce((sum, s) => sum + s.totalLost, 0),
      totalPenaltiesCollected: stats.reduce((sum, s) => sum + s.totalPenalties, 0)
    }
  }
}