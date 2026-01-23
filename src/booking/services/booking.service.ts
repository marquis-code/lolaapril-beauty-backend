

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
    // DEBUG: Log what we're receiving
    console.log('📥 Received booking data:', JSON.stringify(createBookingData, null, 2))
    
    // Generate booking number
    const bookingNumber = await this.generateBookingNumber(createBookingData.businessId)
    
    // Set expiration time (30 minutes for payment)
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000)

    const bookingData = {
      bookingNumber,
      clientId: new Types.ObjectId(createBookingData.clientId),
      businessId: new Types.ObjectId(createBookingData.businessId),
      services: createBookingData.services.map((service: any) => {
        console.log('📋 Mapping service:', service)
        return {
          serviceId: new Types.ObjectId(service.serviceId),
          serviceName: service.serviceName,
          duration: service.duration,
          bufferTime: service.bufferTime || 0,
          price: service.price,
          preferredStaffId: service.preferredStaffId ? 
            new Types.ObjectId(service.preferredStaffId) : undefined
        }
      }),
      preferredDate: createBookingData.preferredDate,
      preferredStartTime: createBookingData.preferredStartTime,
      estimatedEndTime: createBookingData.estimatedEndTime,
      totalDuration: createBookingData.totalDuration,
      totalBufferTime: createBookingData.totalBufferTime || 0,
      estimatedTotal: createBookingData.estimatedTotal,
      clientName: createBookingData.clientName,
      clientEmail: createBookingData.clientEmail,
      clientPhone: createBookingData.clientPhone,
      specialRequests: createBookingData.specialRequests,
      bookingNotes: createBookingData.bookingNotes,
      status: createBookingData.status || 'pending',
      bookingSource: createBookingData.bookingSource || 'online',
      expiresAt,
      metadata: createBookingData.metadata || { platform: 'web' }
    }

    console.log('💾 Saving booking data:', JSON.stringify(bookingData, null, 2))

    // Create and save the booking
    const savedBooking = await this.bookingModel.create(bookingData)
    
    console.log('✅ Booking saved with ID:', savedBooking._id)
    
    // Use lean() to get plain object without type complexity
    const bookingResult = await this.bookingModel
      .findById(savedBooking._id)
      .lean<BookingDocument>()
      .exec()
    
    if (!bookingResult) {
      throw new Error('Failed to retrieve saved booking')
    }
    
    // Emit event for any listeners
    this.eventEmitter.emit('booking.created', {
      businessId: bookingResult.businessId.toString(),
      booking: bookingResult
    })
    
    this.logger.log(`Booking created: ${bookingResult.bookingNumber} - Total: ₦${bookingResult.estimatedTotal}`)
    
    return bookingResult
  } catch (error) {
    this.logger.error(`Failed to create booking: ${error.message}`)
    this.logger.error(`Stack: ${error.stack}`)
    
    // Additional debug info
    if (error.name === 'ValidationError') {
      this.logger.error('Validation errors:', JSON.stringify(error.errors, null, 2))
    }
    
    throw error
  }
}

// ADD THIS METHOD - Generate unique booking number
private async generateBookingNumber(businessId: string): Promise<string> {
  const today = new Date()
  const datePrefix = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`
  
  // Count bookings for today
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  
  const count = await this.bookingModel.countDocuments({
    businessId: new Types.ObjectId(businessId),
    createdAt: {
      $gte: startOfDay,
      $lt: endOfDay
    }
  }).exec()
  
  const sequence = (count + 1).toString().padStart(4, '0')
  
  return `BK-${datePrefix}-${sequence}`
}

  // async getBookingById(bookingId: string): Promise<BookingDocument> {
  //   const booking = await this.bookingModel
  //     .findById(bookingId)
  //     .populate('services.serviceId', 'basicDetails pricingAndDuration')
  //     .populate('services.preferredStaffId', 'firstName lastName')
  //     .populate('processedBy', 'firstName lastName')
  //     .lean<BookingDocument>()
  //     .exec()

  //   if (!booking) {
  //     throw new NotFoundException('Booking not found')
  //   }

  //   return booking
  // }

  

  async getBookingById(bookingId: string): Promise<BookingDocument> {
  try {
    console.log('🔍 Looking for booking:', bookingId)
    
    // First, try to find the booking without populate
    const booking = await this.bookingModel
      .findById(bookingId)
      .lean<BookingDocument>()
      .exec()

    if (!booking) {
      console.log('❌ Booking not found:', bookingId)
      throw new NotFoundException('Booking not found')
    }

    console.log('✅ Booking found:', booking.bookingNumber)
    return booking
    
  } catch (error) {
    console.error('❌ Error fetching booking:', error.message)
    throw new NotFoundException('Booking not found')
  }
}


// Replace the getBookings method in booking.service.ts

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
    // Handle both single status string and array of statuses
    if (Array.isArray(query.status)) {
      filter.status = { $in: query.status }
    } else {
      filter.status = query.status
    }
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

  // Execute queries - removed services.preferredStaffId populate
  const bookings = await this.bookingModel
    .find(filter)
    .populate('services.serviceId', 'basicDetails pricingAndDuration')
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

async updateBooking(
  bookingId: string,
  updateData: Partial<Booking>
): Promise<BookingDocument> {
  const booking = await this.bookingModel
    .findByIdAndUpdate(
      bookingId,
      {
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      },
      { new: true }
    )
    .lean<BookingDocument>()
    .exec()

  if (!booking) {
    throw new NotFoundException('Booking not found')
  }

  return booking
}

// Also fix getTodayBookings method
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
    .sort({ preferredStartTime: 1 })
    .lean<BookingDocument[]>()
    .exec()

  return bookings
}

// Fix getUpcomingBookings method
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
  // async getBookings(query: GetBookingsDto & { businessId: string }): Promise<{
  //   bookings: BookingDocument[]
  //   total: number
  //   page: number
  //   limit: number
  // }> {
  //   const filter: any = {
  //     businessId: new Types.ObjectId(query.businessId)
  //   }

  //   if (query.clientId) {
  //     filter.clientId = new Types.ObjectId(query.clientId)
  //   }

  //   if (query.status) {
  //     filter.status = query.status
  //   }

  //   if (query.startDate && query.endDate) {
  //     filter.preferredDate = {
  //       $gte: new Date(query.startDate),
  //       $lte: new Date(query.endDate)
  //     }
  //   }

  //   const limit = parseInt(query.limit) || 50
  //   const offset = parseInt(query.offset) || 0
  //   const page = Math.floor(offset / limit) + 1

  //   // Execute queries sequentially to avoid complex union type
  //   const bookings = await this.bookingModel
  //     .find(filter)
  //     .populate('services.serviceId', 'basicDetails pricingAndDuration')
  //     .populate('services.preferredStaffId', 'firstName lastName')
  //     .sort({ createdAt: -1 })
  //     .limit(limit)
  //     .skip(offset)
  //     .lean<BookingDocument[]>()
  //     .exec()

  //   const total = await this.bookingModel.countDocuments(filter).exec()

  //   return {
  //     bookings,
  //     total,
  //     page,
  //     limit
  //   }
  // }

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

  async rescheduleBooking(
    bookingId: string,
    newPreferredDate: Date,
    newPreferredStartTime: string,
    reason?: string,
    rescheduledBy?: string
  ): Promise<BookingDocument> {
    const bookingDoc = await this.bookingModel.findById(bookingId).exec()

    if (!bookingDoc) {
      throw new NotFoundException('Booking not found')
    }

    if (['cancelled', 'expired', 'completed'].includes(bookingDoc.status)) {
      throw new BadRequestException(
        `Cannot reschedule booking with status: ${bookingDoc.status}`
      )
    }

    // Calculate new estimated end time based on total duration
    const totalDuration = bookingDoc.totalDuration || 60
    const [hours, minutes] = newPreferredStartTime.split(':').map(Number)
    const startDate = new Date(newPreferredDate)
    startDate.setHours(hours, minutes, 0, 0)
    const endDate = new Date(startDate.getTime() + totalDuration * 60000)
    const newEstimatedEndTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`

    // Store old date/time for history
    const oldDate = bookingDoc.preferredDate
    const oldTime = bookingDoc.preferredStartTime

    // Update booking with new schedule
    bookingDoc.preferredDate = newPreferredDate
    bookingDoc.preferredStartTime = newPreferredStartTime
    bookingDoc.estimatedEndTime = newEstimatedEndTime
    bookingDoc.updatedAt = new Date()

    if (rescheduledBy) {
      bookingDoc.processedBy = new Types.ObjectId(rescheduledBy)
    }

    await bookingDoc.save()

    // Fetch updated booking for return
    const booking = await this.bookingModel
      .findById(bookingId)
      .lean<BookingDocument>()
      .exec()

    if (!booking) {
      throw new NotFoundException('Booking not found after update')
    }

    // Emit rescheduled event
    this.eventEmitter.emit('booking.rescheduled', {
      booking,
      oldDate,
      oldTime,
      newDate: newPreferredDate,
      newTime: newPreferredStartTime,
      reason
    })

    this.logger.log(
      `Booking ${booking.bookingNumber} rescheduled from ${oldDate.toISOString().split('T')[0]} ${oldTime} to ${newPreferredDate.toISOString().split('T')[0]} ${newPreferredStartTime}`
    )

    return booking
  }

  async getClientBookings(clientId: string, status?: string): Promise<BookingDocument[]> {
    console.log('🔍 [GET CLIENT BOOKINGS] ==========================================')
    console.log('🔍 [GET CLIENT BOOKINGS] Input clientId:', clientId)
    console.log('🔍 [GET CLIENT BOOKINGS] Input clientId type:', typeof clientId)
    console.log('🔍 [GET CLIENT BOOKINGS] Status filter:', status)
    
    // Convert string to ObjectId for comparison
    const clientObjectId = new Types.ObjectId(clientId)
    console.log('🔍 [GET CLIENT BOOKINGS] Converted to ObjectId:', clientObjectId.toString())
    
    const filter: any = {
      clientId: clientObjectId
    }

    // If status is provided, filter by it, otherwise return all bookings for the client
    if (status) {
      if (Array.isArray(status)) {
        filter.status = { $in: status }
      } else {
        filter.status = status
      }
    }
    // No else clause - return all bookings regardless of status when no filter provided

    console.log('🔍 [GET CLIENT BOOKINGS] Final Filter:', JSON.stringify(filter, null, 2))

    const bookings = await this.bookingModel
      .find(filter)
      .populate('services.serviceId', 'basicDetails pricingAndDuration')
      .populate('businessId', 'businessName contact address')
      .sort({ createdAt: -1 })
      .lean<BookingDocument[]>()
      .exec()

    console.log('✅ [GET CLIENT BOOKINGS] Found bookings:', bookings.length)
    if (bookings.length > 0) {
      bookings.forEach((booking, index) => {
        console.log(`📋 Booking ${index + 1}:`, {
          _id: booking._id,
          bookingNumber: booking.bookingNumber,
          status: booking.status,
          clientId: booking.clientId.toString(),
          clientIdMatches: booking.clientId.toString() === clientId,
          amount: booking.estimatedTotal,
          date: booking.preferredDate
        })
      })
    } else {
      console.log('⚠️ [GET CLIENT BOOKINGS] No bookings found for clientId:', clientId)
      console.log('⚠️ [GET CLIENT BOOKINGS] Searching with ObjectId:', clientObjectId.toString())
      
      // Debug: Check all bookings in DB to help troubleshoot
      const allBookings = await this.bookingModel
        .find()
        .select('clientId bookingNumber status')
        .limit(10)
        .lean()
        .exec()
      
      console.log('🔍 [DEBUG] Sample bookings in database:')
      allBookings.forEach(b => {
        console.log(`  - ${b.bookingNumber}: clientId=${b.clientId.toString()}, status=${(b as any).status}`)
      })
    }

    return bookings
  }

  // async getTodayBookings(businessId: string): Promise<BookingDocument[]> {
  //   const today = new Date()
  //   const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  //   const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

  //   const bookings = await this.bookingModel
  //     .find({
  //       businessId: new Types.ObjectId(businessId),
  //       preferredDate: {
  //         $gte: startOfDay,
  //         $lt: endOfDay
  //       }
  //     })
  //     .populate('services.serviceId', 'basicDetails pricingAndDuration')
  //     .populate('services.preferredStaffId', 'firstName lastName')
  //     .sort({ preferredStartTime: 1 })
  //     .lean<BookingDocument[]>()
  //     .exec()

  //   return bookings
  // }

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

  // async getUpcomingBookings(
  //   businessId: string,
  //   days: number = 7
  // ): Promise<BookingDocument[]> {
  //   const startDate = new Date()
  //   const endDate = new Date()
  //   endDate.setDate(endDate.getDate() + days)

  //   const bookings = await this.bookingModel
  //     .find({
  //       businessId: new Types.ObjectId(businessId),
  //       status: { $in: ['confirmed', 'pending'] },
  //       preferredDate: {
  //         $gte: startDate,
  //         $lte: endDate
  //       }
  //     })
  //     .populate('services.serviceId', 'basicDetails pricingAndDuration')
  //     .sort({ preferredDate: 1, preferredStartTime: 1 })
  //     .lean<BookingDocument[]>()
  //     .exec()

  //   return bookings
  // }

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