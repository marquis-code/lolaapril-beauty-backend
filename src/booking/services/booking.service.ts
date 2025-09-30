// // src/modules/booking/services/booking.service.ts
// import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
// import { InjectModel } from '@nestjs/mongoose'
// import { Model, Types } from 'mongoose'
// import { Booking, BookingDocument } from '../schemas/booking.schema'
// import { CreateBookingDto } from '../dto/create-booking.dto'
// import { GetBookingsDto } from '../dto/get-bookings.dto'
// import { EventEmitter2 } from '@nestjs/event-emitter'
// import { Cron, CronExpression } from '@nestjs/schedule'

// @Injectable()
// export class BookingService {
//   private readonly logger = new Logger(BookingService.name)

//   constructor(
//     @InjectModel(Booking.name)
//     private bookingModel: Model<BookingDocument>,
//     private eventEmitter: EventEmitter2,
//   ) {}

//   async createBooking(createBookingData: any): Promise<BookingDocument> {
//     try {
//       // Set expiration time (30 minutes for payment)
//       const expiresAt = new Date(Date.now() + 30 * 60 * 1000)

//       const booking = new this.bookingModel({
//         ...createBookingData,
//         expiresAt,
//         clientId: new Types.ObjectId(createBookingData.clientId),
//         businessId: new Types.ObjectId(createBookingData.businessId),
//         services: createBookingData.services.map(service => ({
//           ...service,
//           serviceId: new Types.ObjectId(service.serviceId),
//           preferredStaffId: service.preferredStaffId ? 
//             new Types.ObjectId(service.preferredStaffId) : undefined
//         }))
//       })

//       const savedBooking = await booking.save()
      
//       // Emit event for any listeners
//       this.eventEmitter.emit('booking.created', savedBooking)
      
//       this.logger.log(`Booking created: ${savedBooking.bookingNumber}`)
      
//       return savedBooking
//     } catch (error) {
//       this.logger.error(`Failed to create booking: ${error.message}`)
//       throw error
//     }
//   }

//   async getBookingById(bookingId: string): Promise<BookingDocument> {
//     const booking = await this.bookingModel
//       .findById(bookingId)
//       .populate('services.serviceId', 'basicDetails pricingAndDuration')
//       .populate('services.preferredStaffId', 'firstName lastName')
//       .populate('processedBy', 'firstName lastName')

//     if (!booking) {
//       throw new NotFoundException('Booking not found')
//     }

//     return booking
//   }

//   async getBookings(query: GetBookingsDto & { businessId: string }): Promise<{
//     bookings: BookingDocument[]
//     total: number
//     page: number
//     limit: number
//   }> {
//     const filter: any = {
//       businessId: new Types.ObjectId(query.businessId)
//     }

//     if (query.clientId) {
//       filter.clientId = new Types.ObjectId(query.clientId)
//     }

//     if (query.status) {
//       filter.status = query.status
//     }

//     if (query.startDate && query.endDate) {
//       filter.preferredDate = {
//         $gte: new Date(query.startDate),
//         $lte: new Date(query.endDate)
//       }
//     }

//     const limit = parseInt(query.limit) || 50
//     const offset = parseInt(query.offset) || 0
//     const page = Math.floor(offset / limit) + 1

//     const [bookings, total] = await Promise.all([
//       this.bookingModel
//         .find(filter)
//         .populate('services.serviceId', 'basicDetails pricingAndDuration')
//         .populate('services.preferredStaffId', 'firstName lastName')
//         .sort({ createdAt: -1 })
//         .limit(limit)
//         .skip(offset),
//       this.bookingModel.countDocuments(filter)
//     ])

//     return {
//       bookings,
//       total,
//       page,
//       limit
//     }
//   }

//   async updateBookingStatus(
//     bookingId: string, 
//     status: string, 
//     updatedBy?: string, 
//     reason?: string
//   ): Promise<BookingDocument> {
//     const updateData: any = {
//       status,
//       updatedAt: new Date()
//     }

//     if (updatedBy) {
//       updateData.processedBy = new Types.ObjectId(updatedBy)
//     }

//     if (reason) {
//       if (status === 'cancelled') {
//         updateData.cancellationReason = reason
//         updateData.cancellationDate = new Date()
//       } else if (status === 'rejected') {
//         updateData.rejectionReason = reason
//       }
//     }

//     const booking = await this.bookingModel.findByIdAndUpdate(
//       bookingId,
//       updateData,
//       { new: true }
//     )

//     if (!booking) {
//       throw new NotFoundException('Booking not found')
//     }

//     // Emit status change event
//     this.eventEmitter.emit('booking.status.changed', {
//       booking,
//       previousStatus: booking.status,
//       newStatus: status,
//       updatedBy
//     })

//     this.logger.log(`Booking ${booking.bookingNumber} status changed to ${status}`)

//     return booking
//   }

//   async confirmBooking(bookingId: string, staffId: string, confirmedBy: string): Promise<BookingDocument> {
//     const booking = await this.bookingModel.findById(bookingId)
    
//     if (!booking) {
//       throw new NotFoundException('Booking not found')
//     }

//     if (booking.status !== 'pending') {
//       throw new BadRequestException('Booking is not in pending status')
//     }

//     booking.status = 'confirmed'
//     booking.processedBy = new Types.ObjectId(confirmedBy)
//     booking.updatedAt = new Date()

//     const savedBooking = await booking.save()

//     // Emit confirmation event
//     this.eventEmitter.emit('booking.confirmed', {
//       booking: savedBooking,
//       staffId,
//       confirmedBy
//     })

//     this.logger.log(`Booking ${booking.bookingNumber} confirmed by staff ${confirmedBy}`)

//     return savedBooking
//   }

//   async rejectBooking(bookingId: string, reason: string, rejectedBy: string): Promise<void> {
//     const booking = await this.bookingModel.findById(bookingId)
    
//     if (!booking) {
//       throw new NotFoundException('Booking not found')
//     }

//     if (booking.status !== 'pending') {
//       throw new BadRequestException('Booking is not in pending status')
//     }

//     booking.status = 'rejected'
//     booking.rejectionReason = reason
//     booking.processedBy = new Types.ObjectId(rejectedBy)
//     booking.updatedAt = new Date()

//     await booking.save()

//     // Emit rejection event
//     this.eventEmitter.emit('booking.rejected', {
//       booking,
//       reason,
//       rejectedBy
//     })

//     this.logger.log(`Booking ${booking.bookingNumber} rejected: ${reason}`)
//   }

//   async cancelBooking(bookingId: string, reason: string, cancelledBy: string): Promise<void> {
//     const booking = await this.bookingModel.findById(bookingId)
    
//     if (!booking) {
//       throw new NotFoundException('Booking not found')
//     }

//     if (['cancelled', 'expired'].includes(booking.status)) {
//       throw new BadRequestException('Booking is already cancelled or expired')
//     }

//     booking.status = 'cancelled'
//     booking.cancellationReason = reason
//     booking.cancellationDate = new Date()
//     booking.processedBy = new Types.ObjectId(cancelledBy)
//     booking.updatedAt = new Date()

//     await booking.save()

//     // Emit cancellation event
//     this.eventEmitter.emit('booking.cancelled', {
//       booking,
//       reason,
//       cancelledBy
//     })

//     this.logger.log(`Booking ${booking.bookingNumber} cancelled: ${reason}`)
//   }


//   async getClientBookings(clientId: string, status?: string): Promise<BookingDocument[]> {
//     const filter: any = {
//       clientId: new Types.ObjectId(clientId)
//     }

//     if (status) {
//       filter.status = status
//     }

//     return await this.bookingModel
//       .find(filter)
//       .populate('services.serviceId', 'basicDetails pricingAndDuration')
//       .populate('businessId', 'businessName contact address')
//       .sort({ createdAt: -1 })
//   }

//   async getTodayBookings(businessId: string): Promise<BookingDocument[]> {
//     const today = new Date()
//     const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
//     const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

//     return await this.bookingModel
//       .find({
//         businessId: new Types.ObjectId(businessId),
//         preferredDate: {
//           $gte: startOfDay,
//           $lt: endOfDay
//         }
//       })
//       .populate('services.serviceId', 'basicDetails pricingAndDuration')
//       .populate('services.preferredStaffId', 'firstName lastName')
//       .sort({ preferredStartTime: 1 })
//   }

//   async getPendingBookings(businessId: string): Promise<BookingDocument[]> {
//     return await this.bookingModel
//       .find({
//         businessId: new Types.ObjectId(businessId),
//         status: 'pending',
//         expiresAt: { $gt: new Date() }
//       })
//       .populate('services.serviceId', 'basicDetails pricingAndDuration')
//       .sort({ createdAt: 1 })
//   }

//   async getUpcomingBookings(
//     businessId: string,
//     days: number = 7
//   ): Promise<BookingDocument[]> {
//     const startDate = new Date()
//     const endDate = new Date()
//     endDate.setDate(endDate.getDate() + days)

//     return await this.bookingModel
//       .find({
//         businessId: new Types.ObjectId(businessId),
//         status: { $in: ['confirmed', 'pending'] },
//         preferredDate: {
//           $gte: startDate,
//           $lte: endDate
//         }
//       })
//       .populate('services.serviceId', 'basicDetails pricingAndDuration')
//       .sort({ preferredDate: 1, preferredStartTime: 1 })
//   }

//   async linkAppointment(bookingId: string, appointmentId: string): Promise<void> {
//     await this.bookingModel.findByIdAndUpdate(bookingId, {
//       appointmentId: new Types.ObjectId(appointmentId),
//       updatedAt: new Date()
//     })

//     this.logger.log(`Booking ${bookingId} linked to appointment ${appointmentId}`)
//   }

//   async extendBookingExpiry(bookingId: string, additionalMinutes: number = 30): Promise<BookingDocument> {
//     const booking = await this.bookingModel.findById(bookingId)
    
//     if (!booking) {
//       throw new NotFoundException('Booking not found')
//     }

//     if (booking.status !== 'pending') {
//       throw new BadRequestException('Can only extend pending bookings')
//     }

//     const newExpiryTime = new Date(booking.expiresAt.getTime() + additionalMinutes * 60 * 1000)
    
//     booking.expiresAt = newExpiryTime
//     booking.updatedAt = new Date()

//     const savedBooking = await booking.save()

//     this.logger.log(`Booking ${booking.bookingNumber} expiry extended by ${additionalMinutes} minutes`)

//     return savedBooking
//   }

//   async getBookingStats(businessId: string, startDate?: Date, endDate?: Date): Promise<any> {
//     const matchStage: any = {
//       businessId: new Types.ObjectId(businessId)
//     }

//     if (startDate && endDate) {
//       matchStage.createdAt = {
//         $gte: startDate,
//         $lte: endDate
//       }
//     }

//     const stats = await this.bookingModel.aggregate([
//       { $match: matchStage },
//       {
//         $group: {
//           _id: '$status',
//           count: { $sum: 1 },
//           totalValue: { $sum: '$estimatedTotal' }
//         }
//       }
//     ])

//     const totalBookings = await this.bookingModel.countDocuments(matchStage)

//     return {
//       totalBookings,
//       statusBreakdown: stats,
//       conversionRate: this.calculateConversionRate(stats)
//     }
//   }

//   // Automated cleanup of expired bookings
//   @Cron(CronExpression.EVERY_10_MINUTES)
//   async cleanupExpiredBookings(): Promise<void> {
//     try {
//       const expiredBookings = await this.bookingModel.find({
//         status: 'pending',
//         expiresAt: { $lt: new Date() }
//       })

//       if (expiredBookings.length > 0) {
//         await this.bookingModel.updateMany(
//           {
//             status: 'pending',
//             expiresAt: { $lt: new Date() }
//           },
//           {
//             status: 'expired',
//             updatedAt: new Date()
//           }
//         )

//         // Emit events for expired bookings
//         for (const booking of expiredBookings) {
//           this.eventEmitter.emit('booking.expired', booking)
//         }

//         this.logger.log(`Marked ${expiredBookings.length} bookings as expired`)
//       }
//     } catch (error) {
//       this.logger.error(`Failed to cleanup expired bookings: ${error.message}`)
//     }
//   }

//   // Send reminder for pending payments
//   @Cron(CronExpression.EVERY_5_MINUTES)
//   async sendPaymentReminders(): Promise<void> {
//     try {
//       const pendingBookings = await this.bookingModel.find({
//         status: 'pending',
//         remindersSent: { $lt: 3 }, // Max 3 reminders
//         expiresAt: { $gt: new Date() },
//         $or: [
//           { lastReminderAt: { $exists: false } },
//           { lastReminderAt: { $lt: new Date(Date.now() - 10 * 60 * 1000) } } // 10 minutes since last reminder
//         ]
//       })

//       for (const booking of pendingBookings) {
//         // Emit reminder event
//         this.eventEmitter.emit('booking.payment.reminder', booking)

//         // Update reminder count
//         booking.remindersSent += 1
//         booking.lastReminderAt = new Date()
//         await booking.save()
//       }

//       if (pendingBookings.length > 0) {
//         this.logger.log(`Sent payment reminders for ${pendingBookings.length} bookings`)
//       }
//     } catch (error) {
//       this.logger.error(`Failed to send payment reminders: ${error.message}`)
//     }
//   }

//   private calculateConversionRate(stats: any[]): number {
//     const confirmedCount = stats.find(s => s._id === 'confirmed')?.count || 0
//     const totalCount = stats.reduce((sum, s) => sum + s.count, 0)
    
//     return totalCount > 0 ? Math.round((confirmedCount / totalCount) * 100) : 0
//   }
// }


// src/modules/booking/services/booking.service.ts
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types, Document } from 'mongoose'
import { Booking, BookingDocument } from '../schemas/booking.schema'
import { CreateBookingDto } from '../dto/create-booking.dto'
import { GetBookingsDto } from '../dto/get-bookings.dto'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name)

  constructor(
    @InjectModel(Booking.name)
    private bookingModel: Model<BookingDocument>,
    private eventEmitter: EventEmitter2,
  ) {}

  async createBooking(createBookingData: any): Promise<BookingDocument> {
    try {
      // Set expiration time (30 minutes for payment)
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000)

      const bookingData = {
        ...createBookingData,
        expiresAt,
        clientId: new Types.ObjectId(createBookingData.clientId),
        businessId: new Types.ObjectId(createBookingData.businessId),
        services: createBookingData.services.map(service => ({
          ...service,
          serviceId: new Types.ObjectId(service.serviceId),
          preferredStaffId: service.preferredStaffId ? 
            new Types.ObjectId(service.preferredStaffId) : undefined
        }))
      }

      // Use create instead of new + save
      const [savedBooking] = await this.bookingModel.create([bookingData])
      const bookingId = savedBooking._id.toString()
      
      // Fetch the saved booking with lean for proper typing
      const bookingResult = await this.bookingModel
        .findById(bookingId)
        .lean<BookingDocument>()
        .exec()
      
      if (!bookingResult) {
        throw new Error('Failed to retrieve saved booking')
      }
      
      // Emit event for any listeners
      this.eventEmitter.emit('booking.created', bookingResult)
      
      this.logger.log(`Booking created: ${bookingResult.bookingNumber}`)
      
      return bookingResult
    } catch (error) {
      this.logger.error(`Failed to create booking: ${error.message}`)
      throw error
    }
  }

  async getBookingById(bookingId: string): Promise<BookingDocument> {
    const booking = await this.bookingModel
      .findById(bookingId)
      .populate('services.serviceId', 'basicDetails pricingAndDuration')
      .populate('services.preferredStaffId', 'firstName lastName')
      .populate('processedBy', 'firstName lastName')
      .lean<BookingDocument>()
      .exec()

    if (!booking) {
      throw new NotFoundException('Booking not found')
    }

    return booking
  }

  async getBookings(query: GetBookingsDto & { businessId: string }): Promise<{
    bookings: BookingDocument[]
    total: number
    page: number
    limit: number
  }> {
    const filter: any = {
      businessId: new Types.ObjectId(query.businessId)
    }

    if (query.clientId) {
      filter.clientId = new Types.ObjectId(query.clientId)
    }

    if (query.status) {
      filter.status = query.status
    }

    if (query.startDate && query.endDate) {
      filter.preferredDate = {
        $gte: new Date(query.startDate),
        $lte: new Date(query.endDate)
      }
    }

    const limit = parseInt(query.limit) || 50
    const offset = parseInt(query.offset) || 0
    const page = Math.floor(offset / limit) + 1

    // Execute queries sequentially to avoid complex union type
    const bookings = await this.bookingModel
      .find(filter)
      .populate('services.serviceId', 'basicDetails pricingAndDuration')
      .populate('services.preferredStaffId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .lean<BookingDocument[]>()
      .exec()

    const total = await this.bookingModel.countDocuments(filter).exec()

    return {
      bookings,
      total,
      page,
      limit
    }
  }

  async updateBookingStatus(
    bookingId: string, 
    status: string, 
    updatedBy?: string, 
    reason?: string
  ): Promise<BookingDocument> {
    const updateData: any = {
      status,
      updatedAt: new Date()
    }

    if (updatedBy) {
      updateData.processedBy = new Types.ObjectId(updatedBy)
    }

    if (reason) {
      if (status === 'cancelled') {
        updateData.cancellationReason = reason
        updateData.cancellationDate = new Date()
      } else if (status === 'rejected') {
        updateData.rejectionReason = reason
      }
    }

    const booking = await this.bookingModel
      .findByIdAndUpdate(bookingId, updateData, { new: true })
      .lean<BookingDocument>()
      .exec()

    if (!booking) {
      throw new NotFoundException('Booking not found')
    }

    // Emit status change event
    this.eventEmitter.emit('booking.status.changed', {
      booking,
      previousStatus: booking.status,
      newStatus: status,
      updatedBy
    })

    this.logger.log(`Booking ${booking.bookingNumber} status changed to ${status}`)

    return booking
  }

  async confirmBooking(bookingId: string, staffId: string, confirmedBy: string): Promise<BookingDocument> {
    const bookingDoc = await this.bookingModel.findById(bookingId).exec()
    
    if (!bookingDoc) {
      throw new NotFoundException('Booking not found')
    }

    if (bookingDoc.status !== 'pending') {
      throw new BadRequestException('Booking is not in pending status')
    }

    // Update fields
    bookingDoc.status = 'confirmed'
    bookingDoc.processedBy = new Types.ObjectId(confirmedBy)
    bookingDoc.updatedAt = new Date()

    await bookingDoc.save()

    // Fetch updated booking with lean for proper typing
    const booking = await this.bookingModel
      .findById(bookingId)
      .lean<BookingDocument>()
      .exec()

    if (!booking) {
      throw new NotFoundException('Booking not found after save')
    }

    // Emit confirmation event
    this.eventEmitter.emit('booking.confirmed', {
      booking,
      staffId,
      confirmedBy
    })

    this.logger.log(`Booking ${booking.bookingNumber} confirmed by staff ${confirmedBy}`)

    return booking
  }

  async rejectBooking(bookingId: string, reason: string, rejectedBy: string): Promise<void> {
    const bookingDoc = await this.bookingModel.findById(bookingId).exec()
    
    if (!bookingDoc) {
      throw new NotFoundException('Booking not found')
    }

    if (bookingDoc.status !== 'pending') {
      throw new BadRequestException('Booking is not in pending status')
    }

    bookingDoc.status = 'rejected'
    bookingDoc.rejectionReason = reason
    bookingDoc.processedBy = new Types.ObjectId(rejectedBy)
    bookingDoc.updatedAt = new Date()

    await bookingDoc.save()

    // Fetch for event emission
    const booking = await this.bookingModel
      .findById(bookingId)
      .lean<BookingDocument>()
      .exec()

    // Emit rejection event
    this.eventEmitter.emit('booking.rejected', {
      booking,
      reason,
      rejectedBy
    })

    this.logger.log(`Booking ${booking?.bookingNumber} rejected: ${reason}`)
  }

  async cancelBooking(bookingId: string, reason: string, cancelledBy: string): Promise<void> {
    const bookingDoc = await this.bookingModel.findById(bookingId).exec()
    
    if (!bookingDoc) {
      throw new NotFoundException('Booking not found')
    }

    if (['cancelled', 'expired'].includes(bookingDoc.status)) {
      throw new BadRequestException('Booking is already cancelled or expired')
    }

    bookingDoc.status = 'cancelled'
    bookingDoc.cancellationReason = reason
    bookingDoc.cancellationDate = new Date()
    bookingDoc.processedBy = new Types.ObjectId(cancelledBy)
    bookingDoc.updatedAt = new Date()

    await bookingDoc.save()

    // Fetch for event emission
    const booking = await this.bookingModel
      .findById(bookingId)
      .lean<BookingDocument>()
      .exec()

    // Emit cancellation event
    this.eventEmitter.emit('booking.cancelled', {
      booking,
      reason,
      cancelledBy
    })

    this.logger.log(`Booking ${booking?.bookingNumber} cancelled: ${reason}`)
  }


  async getClientBookings(clientId: string, status?: string): Promise<BookingDocument[]> {
    const filter: any = {
      clientId: new Types.ObjectId(clientId)
    }

    if (status) {
      filter.status = status
    }

    const bookings = await this.bookingModel
      .find(filter)
      .populate('services.serviceId', 'basicDetails pricingAndDuration')
      .populate('businessId', 'businessName contact address')
      .sort({ createdAt: -1 })
      .lean<BookingDocument[]>()
      .exec()

    return bookings
  }

  async getTodayBookings(businessId: string): Promise<BookingDocument[]> {
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

    const bookings = await this.bookingModel
      .find({
        businessId: new Types.ObjectId(businessId),
        preferredDate: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      })
      .populate('services.serviceId', 'basicDetails pricingAndDuration')
      .populate('services.preferredStaffId', 'firstName lastName')
      .sort({ preferredStartTime: 1 })
      .lean<BookingDocument[]>()
      .exec()

    return bookings
  }

  async getPendingBookings(businessId: string): Promise<BookingDocument[]> {
    const bookings = await this.bookingModel
      .find({
        businessId: new Types.ObjectId(businessId),
        status: 'pending',
        expiresAt: { $gt: new Date() }
      })
      .populate('services.serviceId', 'basicDetails pricingAndDuration')
      .sort({ createdAt: 1 })
      .lean<BookingDocument[]>()
      .exec()

    return bookings
  }

  async getUpcomingBookings(
    businessId: string,
    days: number = 7
  ): Promise<BookingDocument[]> {
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + days)

    const bookings = await this.bookingModel
      .find({
        businessId: new Types.ObjectId(businessId),
        status: { $in: ['confirmed', 'pending'] },
        preferredDate: {
          $gte: startDate,
          $lte: endDate
        }
      })
      .populate('services.serviceId', 'basicDetails pricingAndDuration')
      .sort({ preferredDate: 1, preferredStartTime: 1 })
      .lean<BookingDocument[]>()
      .exec()

    return bookings
  }

  async linkAppointment(bookingId: string, appointmentId: string): Promise<void> {
    await this.bookingModel.findByIdAndUpdate(bookingId, {
      appointmentId: new Types.ObjectId(appointmentId),
      updatedAt: new Date()
    }).exec()

    this.logger.log(`Booking ${bookingId} linked to appointment ${appointmentId}`)
  }

  async extendBookingExpiry(bookingId: string, additionalMinutes: number = 30): Promise<BookingDocument> {
    const bookingDoc = await this.bookingModel.findById(bookingId).exec()
    
    if (!bookingDoc) {
      throw new NotFoundException('Booking not found')
    }

    if (bookingDoc.status !== 'pending') {
      throw new BadRequestException('Can only extend pending bookings')
    }

    const newExpiryTime = new Date(bookingDoc.expiresAt.getTime() + additionalMinutes * 60 * 1000)
    
    // Use findByIdAndUpdate instead of save
    const booking = await this.bookingModel
      .findByIdAndUpdate(
        bookingId,
        {
          expiresAt: newExpiryTime,
          updatedAt: new Date()
        },
        { new: true }
      )
      .lean<BookingDocument>()
      .exec()

    if (!booking) {
      throw new NotFoundException('Booking not found after update')
    }

    this.logger.log(`Booking ${booking.bookingNumber} expiry extended by ${additionalMinutes} minutes`)

    return booking
  }

  async getBookingStats(businessId: string, startDate?: Date, endDate?: Date): Promise<any> {
    const matchStage: any = {
      businessId: new Types.ObjectId(businessId)
    }

    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: startDate,
        $lte: endDate
      }
    }

    const stats = await this.bookingModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$estimatedTotal' }
        }
      }
    ]).exec()

    const totalBookings = await this.bookingModel.countDocuments(matchStage).exec()

    return {
      totalBookings,
      statusBreakdown: stats,
      conversionRate: this.calculateConversionRate(stats)
    }
  }

  // Automated cleanup of expired bookings
  @Cron(CronExpression.EVERY_10_MINUTES)
  async cleanupExpiredBookings(): Promise<void> {
    try {
      const expiredBookings = await this.bookingModel
        .find({
          status: 'pending',
          expiresAt: { $lt: new Date() }
        })
        .lean<BookingDocument[]>()
        .exec()

      if (expiredBookings.length > 0) {
        await this.bookingModel.updateMany(
          {
            status: 'pending',
            expiresAt: { $lt: new Date() }
          },
          {
            status: 'expired',
            updatedAt: new Date()
          }
        ).exec()

        // Emit events for expired bookings
        for (const booking of expiredBookings) {
          this.eventEmitter.emit('booking.expired', booking)
        }

        this.logger.log(`Marked ${expiredBookings.length} bookings as expired`)
      }
    } catch (error) {
      this.logger.error(`Failed to cleanup expired bookings: ${error.message}`)
    }
  }

  // Send reminder for pending payments
  @Cron(CronExpression.EVERY_5_MINUTES)
  async sendPaymentReminders(): Promise<void> {
    try {
      const pendingBookingDocs = await this.bookingModel.find({
        status: 'pending',
        remindersSent: { $lt: 3 }, // Max 3 reminders
        expiresAt: { $gt: new Date() },
        $or: [
          { lastReminderAt: { $exists: false } },
          { lastReminderAt: { $lt: new Date(Date.now() - 10 * 60 * 1000) } } // 10 minutes since last reminder
        ]
      }).exec()

      for (const bookingDoc of pendingBookingDocs) {
        // Emit reminder event with lean version
        const bookingId = bookingDoc._id.toString()
        const booking = await this.bookingModel
          .findById(bookingId)
          .lean<BookingDocument>()
          .exec()
        
        if (booking) {
          this.eventEmitter.emit('booking.payment.reminder', booking)
        }

        // Update reminder count
        bookingDoc.remindersSent += 1
        bookingDoc.lastReminderAt = new Date()
        await bookingDoc.save()
      }

      if (pendingBookingDocs.length > 0) {
        this.logger.log(`Sent payment reminders for ${pendingBookingDocs.length} bookings`)
      }
    } catch (error) {
      this.logger.error(`Failed to send payment reminders: ${error.message}`)
    }
  }

  private calculateConversionRate(stats: any[]): number {
    const confirmedCount = stats.find(s => s._id === 'confirmed')?.count || 0
    const totalCount = stats.reduce((sum, s) => sum + s.count, 0)
    
    return totalCount > 0 ? Math.round((confirmedCount / totalCount) * 100) : 0
  }
}