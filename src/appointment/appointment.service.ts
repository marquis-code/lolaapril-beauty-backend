import { Injectable, NotFoundException, ConflictException, Inject, Logger } from "@nestjs/common"
import { Model, Types } from "mongoose"
import { Appointment, AppointmentDocument } from "./schemas/appointment.schema"
import { CreateAppointmentDto } from "./dto/create-appointment.dto"
import { UpdateAppointmentDto } from "./dto/update-appointment.dto"
import { AppointmentQueryDto } from "./dto/appointment-query.dto"
import { InjectModel } from "@nestjs/mongoose"
import { PaymentService } from '../payment/payment.service'
import { NotificationService } from '../notification/notification.service'
import { StaffService } from '../staff/staff.service'
import { SalesService } from '../sales/sales.service'
import { EmailService } from '../notification/email.service'
import { EmailTemplatesService } from '../notification/templates/email-templates.service'
import { GoogleCalendarService } from '../integration/google-calendar.service'
import { ScheduledReminder, ScheduledReminderDocument } from '../jobs/schemas/scheduled-reminder.schema'
import { ConfigService } from '@nestjs/config'
import { Client, ClientDocument } from '../client/schemas/client.schema' // ✅ Added Client model import

@Injectable()
export class AppointmentService {
  private readonly logger = new Logger(AppointmentService.name)
  // constructor(
  // @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>) {}
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(ScheduledReminder.name)
    private scheduledReminderModel: Model<ScheduledReminderDocument>,
    private paymentService: PaymentService,
    private notificationService: NotificationService,
    private staffService: StaffService,
    private salesService: SalesService,
    private emailService: EmailService,
    private emailTemplatesService: EmailTemplatesService,
    private googleCalendarService: GoogleCalendarService,
    private configService: ConfigService,
    @InjectModel(Client.name)
    private clientModel: Model<ClientDocument>, // fixed space typo
  ) { }

  async create(createAppointmentDto: CreateAppointmentDto & { businessId: string }): Promise<Appointment> {
    // Check for time slot conflicts
    const conflictingAppointment = await this.appointmentModel.findOne({
      selectedDate: createAppointmentDto.selectedDate,
      selectedTime: createAppointmentDto.selectedTime,
      status: { $nin: ["cancelled", "no_show"] },
      ...(createAppointmentDto.assignedStaff && { assignedStaff: createAppointmentDto.assignedStaff }),
      "businessInfo.businessId": createAppointmentDto.businessId,
    })

    if (conflictingAppointment) {
      throw new ConflictException("Time slot is already booked")
    }

    const appointment = new this.appointmentModel({
      ...createAppointmentDto,
      businessInfo: {
        ...(createAppointmentDto as any).businessInfo,
        businessId: createAppointmentDto.businessId,
      },
    })
    return appointment.save()
  }

  // async findAll(query: AppointmentQueryDto) {
  //   const {
  //     page = 1,
  //     limit = 10,
  //     clientId,
  //     status,
  //     date,
  //     startDate,
  //     endDate,
  //     assignedStaff,
  //     search,
  //     sortBy = "createdAt",
  //     sortOrder = "desc",
  //   } = query

  //   const filter: any = {}

  //   if (clientId) filter.clientId = clientId
  //   if (status) filter.status = status
  //   if (assignedStaff) filter.assignedStaff = assignedStaff

  //   // Date filtering
  //   if (date) {
  //     filter.selectedDate = date
  //   } else if (startDate || endDate) {
  //     filter.selectedDate = {}
  //     if (startDate) filter.selectedDate.$gte = startDate
  //     if (endDate) filter.selectedDate.$lte = endDate
  //   }

  //   // Search functionality
  //   if (search) {
  //     filter.$or = [
  //       { "serviceDetails.serviceName": { $regex: search, $options: "i" } },
  //       { "serviceDetails.serviceDescription": { $regex: search, $options: "i" } },
  //       { customerNotes: { $regex: search, $options: "i" } },
  //     ]
  //   }

  //   const skip = (page - 1) * limit
  //   const sortOptions: any = {}
  //   sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1

  //   const [appointments, total] = await Promise.all([
  //     this.appointmentModel
  //       .find(filter)
  //       .populate("clientId", "firstName lastName email phone")
  //       .populate("assignedStaff", "firstName lastName email")
  //       .sort(sortOptions)
  //       .skip(skip)
  //       .limit(limit)
  //       .exec(),
  //     this.appointmentModel.countDocuments(filter),
  //   ])

  //   return {
  //     appointments,
  //     pagination: {
  //       page,
  //       limit,
  //       total,
  //       pages: Math.ceil(total / limit),
  //     },
  //   }
  // }

  async findAll(query: AppointmentQueryDto & { businessId: string }) {
    const {
      page = 1,
      limit = 10,
      clientId,
      status,
      date,
      startDate,
      endDate,
      assignedStaff,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query

    const filter: any = { "businessInfo.businessId": query.businessId }

    if (clientId) filter.clientId = clientId
    if (status) filter.status = status
    if (assignedStaff) filter.assignedStaff = assignedStaff

    // Date filtering
    if (date) {
      filter.selectedDate = date
    } else if (startDate || endDate) {
      filter.selectedDate = {}
      if (startDate) filter.selectedDate.$gte = startDate
      if (endDate) filter.selectedDate.$lte = endDate
    }

    // Search functionality
    if (search) {
      filter.$or = [
        { "serviceDetails.serviceName": { $regex: search, $options: "i" } },
        { "serviceDetails.serviceDescription": { $regex: search, $options: "i" } },
        { customerNotes: { $regex: search, $options: "i" } },
      ]
    }

    const skip = (page - 1) * limit
    const sortOptions: any = {}
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1

    // Execute queries separately to avoid complex union type inference issues
    const appointments = await this.appointmentModel
      .find(filter)
      .populate("clientId", "profile")
      .populate("assignedStaff", "firstName lastName email")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .exec()

    const total = await this.appointmentModel.countDocuments(filter)

    return {
      appointments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentModel
      .findById(id)
      .populate("clientId", "profile")
      .populate("assignedStaff", "firstName lastName email")
      .exec()

    if (!appointment) {
      throw new NotFoundException("Appointment not found")
    }
    return appointment
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    // If updating time/date, check for conflicts
    if (updateAppointmentDto.selectedDate || updateAppointmentDto.selectedTime) {
      const existingAppointment = await this.appointmentModel.findById(id)
      if (!existingAppointment) {
        throw new NotFoundException("Appointment not found")
      }

      const newDate = updateAppointmentDto.selectedDate || existingAppointment.selectedDate
      const newTime = updateAppointmentDto.selectedTime || existingAppointment.selectedTime
      const newStaff = updateAppointmentDto.assignedStaff || existingAppointment.assignedStaff

      const conflictingAppointment = await this.appointmentModel.findOne({
        _id: { $ne: id },
        selectedDate: newDate,
        selectedTime: newTime,
        status: { $nin: ["cancelled", "no_show"] },
        ...(newStaff && { assignedStaff: newStaff }),
      })

      if (conflictingAppointment) {
        throw new ConflictException("Time slot is already booked")
      }
    }

    const appointment = await this.appointmentModel
      .findByIdAndUpdate(id, updateAppointmentDto, { new: true })
      .populate("clientId", "profile")
      .populate("assignedStaff", "firstName lastName email")
      .exec()

    if (!appointment) {
      throw new NotFoundException("Appointment not found")
    }
    return appointment
  }

  async remove(id: string): Promise<void> {
    const result = await this.appointmentModel.findByIdAndDelete(id)
    if (!result) {
      throw new NotFoundException("Appointment not found")
    }
  }

  async updateStatus(id: string, status: string, cancellationReason?: string): Promise<Appointment> {
    const updateData: any = { status }

    if (status === "cancelled" && cancellationReason) {
      updateData.cancellationReason = cancellationReason
      updateData.cancellationDate = new Date()
    }

    const appointment = await this.appointmentModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate("clientId", "profile")
      .populate("assignedStaff", "firstName lastName email")
      .exec()

    if (!appointment) {
      throw new NotFoundException("Appointment not found")
    }

    // Trigger full completion logic if status is set to completed
    if (status === 'completed') {
      return this.completeAppointment(id);
    }

    return appointment
  }

  async assignStaff(id: string, staffId: string): Promise<Appointment> {
    const appointment = await this.appointmentModel
      .findByIdAndUpdate(id, { assignedStaff: staffId }, { new: true })
      .populate("clientId", "profile")
      .populate("assignedStaff", "firstName lastName email")
      .exec()

    if (!appointment) {
      throw new NotFoundException("Appointment not found")
    }
    return appointment
  }

  async getAppointmentsByDate(businessId: string, date: string): Promise<Appointment[]> {
    return this.appointmentModel
      .find({
        selectedDate: date,
        status: { $nin: ["cancelled", "no_show"] },
        "businessInfo.businessId": businessId,
      })
      .populate("clientId", "profile")
      .populate("assignedStaff", "firstName lastName email")
      .sort({ selectedTime: 1 })
      .exec()
  }

  async getAppointmentsByStaff(businessId: string, staffId: string, date?: string): Promise<Appointment[]> {
    const filter: any = {
      assignedStaff: staffId,
      status: { $nin: ["cancelled", "no_show"] },
      "businessInfo.businessId": businessId,
    }
    if (date) filter.selectedDate = date

    return this.appointmentModel
      .find(filter)
      .populate("clientId", "profile")
      .sort({ selectedDate: 1, selectedTime: 1 })
      .exec()
  }

  async getAppointmentStats() {
    const today = new Date().toISOString().split("T")[0]

    const stats = await this.appointmentModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending_confirmation"] }, 1, 0] } },
          confirmed: { $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
          todayAppointments: {
            $sum: { $cond: [{ $eq: ["$selectedDate", today] }, 1, 0] },
          },
        },
      },
    ])

    const revenueStats = await this.appointmentModel.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$paymentDetails.total.amount" },
          averageBookingValue: { $avg: "$paymentDetails.total.amount" },
        },
      },
    ])

    return {
      overview: stats[0] || { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, todayAppointments: 0 },
      revenue: revenueStats[0] || { totalRevenue: 0, averageBookingValue: 0 },
    }
  }

  // async getAvailableTimeSlots(date: string, staffId?: string): Promise<string[]> {
  //   const bookedSlots = await this.appointmentModel
  //     .find({
  //       selectedDate: date,
  //       status: { $nin: ["cancelled", "no_show"] },
  //       ...(staffId && { assignedStaff: staffId }),
  //     })
  //     .select("selectedTime")
  //     .exec()

  //   const bookedTimes = bookedSlots.map((slot) => slot.selectedTime)

  //   // Generate available time slots (9 AM to 6 PM, 30-minute intervals)
  //   const allSlots = []
  //   for (let hour = 9; hour < 18; hour++) {
  //     allSlots.push(`${hour.toString().padStart(2, "0")}:00`)
  //     allSlots.push(`${hour.toString().padStart(2, "0")}:30`)
  //   }

  //   return allSlots.filter((slot) => !bookedTimes.includes(slot))
  // }

  async getAvailableTimeSlots(date: string, staffId?: string): Promise<string[]> {
    const bookedSlots = await this.appointmentModel
      .find({
        selectedDate: date,
        status: { $nin: ["cancelled", "no_show"] },
        ...(staffId && { assignedStaff: staffId }),
      })
      .select("selectedTime")
      .exec() as { selectedTime: string }[]

    const bookedTimes = bookedSlots.map((slot) => slot.selectedTime)

    // Generate available time slots (9 AM to 6 PM, 30-minute intervals)
    const allSlots = []
    for (let hour = 9; hour < 18; hour++) {
      allSlots.push(`${hour.toString().padStart(2, "0")}:00`)
      allSlots.push(`${hour.toString().padStart(2, "0")}:30`)
    }

    return allSlots.filter((slot) => !bookedTimes.includes(slot))
  }

  // Add this import at the top of your file if not present:
  // import { Types } from 'mongoose'

  // REPLACE the entire createFromBooking method in your AppointmentService with this:

  // REPLACE createFromBooking in your AppointmentService with THIS:

  async createFromBooking(booking: any): Promise<any> {
    try {
      // ✅ IDEMPOTENCY CHECK: Check if an appointment already exists for this booking
      const existingAppointment = await this.appointmentModel.findOne({
        bookingId: booking._id
      }).exec();

      if (existingAppointment) {
        this.logger.log(`⚠️ Appointment already exists for booking ${booking._id}, returning existing one.`)
        return this.mapToPlainObject(existingAppointment);
      }
      // Parse the booking date
      const bookingDate = booking.preferredDate instanceof Date
        ? booking.preferredDate
        : new Date(booking.preferredDate)

      // Calculate total duration in hours and minutes
      const totalMinutes = booking.services.reduce((sum, s) => sum + s.duration + (s.bufferTime || 0), 0)
      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60

      // Calculate end time
      const [startHour, startMin] = booking.preferredStartTime.split(':').map(Number)
      const endTotalMinutes = startHour * 60 + startMin + totalMinutes
      const endHour = Math.floor(endTotalMinutes / 60) % 24
      const endMin = endTotalMinutes % 60
      const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`

      // Get day of week
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const dayOfWeek = daysOfWeek[bookingDate.getDay()]

      // Format date as YYYY-MM-DD
      const dateString = bookingDate.toISOString().split('T')[0]

      // ✅ FIND OR CREATE CLIENT
      // The booking has a User ID (from users collection), but Appointment needs a Client ID (from clients collection)
      let clientId = booking.clientId;

      try {
        // Try to find a client record by email in this business
        let client = await this.clientModel.findOne({
          'profile.email': booking.clientEmail.toLowerCase(),
          businessId: new Types.ObjectId(booking.businessId)
        }).exec();

        if (!client) {
          this.logger.log(`Creating new client record for ${booking.clientEmail}`);

          // Create new client if not found
          const newClientData: any = {
            businessId: new Types.ObjectId(booking.businessId),
            profile: {
              firstName: booking.clientName.split(' ')[0] || 'Unknown',
              lastName: booking.clientName.split(' ').slice(1).join(' ') || 'Client',
              email: booking.clientEmail,
              phone: {
                countryCode: '+234', // Default or parse from input
                number: booking.clientPhone || ''
              }
            },
            additionalInfo: {
              clientSource: 'booking_automation',
              preferredLanguage: 'en'
            },
            isActive: true
          };

          client = await (this.clientModel as any).create(newClientData);
          // await client.save(); // create() saves automatically
        }

        clientId = client._id;
        this.logger.log(`✅ Using Client ID: ${clientId} for appointment`);
      } catch (error) {
        this.logger.error(`Error finding/creating client: ${error.message}`);
        // Fallback to booking.clientId (even if it might be a User ID, better than nothing)
      }

      // Build appointment data matching YOUR schema
      const appointmentData = {
        clientId: clientId, // ✅ Now points to a valid Client document

        businessInfo: {
          businessId: booking.businessId.toString(),
          businessName: booking.businessName || 'Business',
          rating: 0,
          reviewCount: 0,
          address: booking.businessAddress || 'Address not provided'
        },

        bookingSource: booking.bookingSource, // ✅ Populated bookingSource

        selectedServices: booking.services.map(service => ({
          serviceId: service.serviceId.toString(),
          serviceName: service.serviceName,
          serviceType: 'standard',
          selectedOption: {
            optionId: service.serviceId.toString(),
            optionName: service.serviceName,
            duration: {
              hours: Math.floor(service.duration / 60),
              minutes: service.duration % 60
            },
            description: service.serviceName,
            price: {
              currency: 'NGN',
              amount: service.price
            }
          },
          additionalServices: []
        })),

        totalDuration: {
          hours: hours,
          minutes: minutes
        },

        selectedDate: bookingDate,
        selectedTime: booking.preferredStartTime,

        appointmentDetails: {
          date: dateString,
          dayOfWeek: dayOfWeek,
          startTime: booking.preferredStartTime,
          endTime: endTime,
          duration: `${hours}h ${minutes}m`
        },

        serviceDetails: {
          serviceName: booking.services.map(s => s.serviceName).join(', '),
          serviceDescription: booking.services.map(s => s.serviceName).join(', '),
          price: {
            currency: 'NGN',
            amount: booking.estimatedTotal
          }
        },

        paymentDetails: {
          paymentMethod: 'pending',
          subtotal: {
            currency: 'NGN',
            amount: booking.estimatedTotal
          },
          tax: {
            currency: 'NGN',
            amount: 0,
            rate: 0
          },
          total: {
            currency: 'NGN',
            amount: booking.estimatedTotal
          },
          paymentStatus: {
            payNow: {
              currency: 'NGN',
              amount: booking.estimatedTotal
            },
            payAtVenue: {
              currency: 'NGN',
              amount: 0
            }
          }
        },

        paymentInstructions: {
          paymentUrl: '',
          confirmationPolicy: 'Payment required to confirm booking'
        },

        customerNotes: booking.specialRequests || '',

        status: 'confirmed',

        bookingId: booking._id,
        bookingNumber: booking.bookingNumber,

        appointmentNumber: '',
        reminderSent: false
      }

      // Create appointment
      const appointment = new this.appointmentModel(appointmentData)
      await appointment.save()

      // Generate appointment number
      if (!appointment.appointmentNumber) {
        appointment.appointmentNumber = await this.generateAppointmentNumber(
          booking.businessId.toString()
        )
        await appointment.save()
      }

      // Return plain object
      return {
        _id: appointment._id,
        appointmentNumber: appointment.appointmentNumber,
        clientId: appointment.clientId,
        businessInfo: appointment.businessInfo,
        selectedServices: appointment.selectedServices,
        totalDuration: appointment.totalDuration,
        selectedDate: appointment.selectedDate,
        selectedTime: appointment.selectedTime,
        appointmentDetails: appointment.appointmentDetails,
        serviceDetails: appointment.serviceDetails,
        paymentDetails: appointment.paymentDetails,
        status: appointment.status,
        bookingId: appointment.bookingId,
        bookingNumber: appointment.bookingNumber,
        customerNotes: appointment.customerNotes,
        createdAt: appointment.createdAt
      }

    } catch (error) {
      throw error
    }
  }

  private mapToPlainObject(appointment: any): any {
    return {
      _id: appointment._id,
      appointmentNumber: appointment.appointmentNumber,
      clientId: appointment.clientId,
      businessInfo: appointment.businessInfo,
      selectedServices: appointment.selectedServices,
      totalDuration: appointment.totalDuration,
      selectedDate: appointment.selectedDate,
      selectedTime: appointment.selectedTime,
      appointmentDetails: appointment.appointmentDetails,
      serviceDetails: appointment.serviceDetails,
      paymentDetails: appointment.paymentDetails,
      status: appointment.status,
      bookingId: appointment.bookingId,
      bookingNumber: appointment.bookingNumber,
      customerNotes: appointment.customerNotes,
      createdAt: appointment.createdAt
    }
  }

  private async generateAppointmentNumber(businessId: string): Promise<string> {
    const today = new Date()
    const datePrefix = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`

    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

    const count = await this.appointmentModel.countDocuments({
      'businessInfo.businessId': businessId,
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    }).exec()

    const sequence = (count + 1).toString().padStart(4, '0')

    return `APT-${datePrefix}-${sequence}`
  }

  //   async createFromBooking(booking: any): Promise<any> {
  //   const appointmentData = {
  //     bookingId: booking._id,
  //     clientId: booking.clientId,
  //     businessId: booking.businessId,
  //     appointmentNumber: await this.generateAppointmentNumber(),
  //     clientName: booking.clientName,
  //     clientEmail: booking.clientEmail,
  //     clientPhone: booking.clientPhone,
  //     services: booking.services.map(service => ({
  //       serviceId: service.serviceId,
  //       serviceName: service.serviceName,
  //       duration: service.duration,
  //       price: service.price,
  //     })),
  //     scheduledDate: booking.preferredDate,
  //     scheduledStartTime: booking.preferredStartTime,
  //     scheduledEndTime: booking.estimatedEndTime,
  //     totalDuration: booking.totalDuration,
  //     totalAmount: booking.estimatedTotal,
  //     status: 'scheduled'
  //   }

  //   const appointment = new this.appointmentModel(appointmentData)
  //   return await appointment.save()
  // }

  // private async generateAppointmentNumber(): Promise<string> {
  //   const today = new Date()
  //   const year = today.getFullYear()
  //   const month = String(today.getMonth() + 1).padStart(2, '0')
  //   const day = String(today.getDate()).padStart(2, '0')

  //   const count = await this.appointmentModel.countDocuments({
  //     createdAt: {
  //       $gte: new Date(year, today.getMonth(), today.getDate()),
  //       $lt: new Date(year, today.getMonth(), today.getDate() + 1)
  //     }
  //   })

  //   return `APT-${year}${month}${day}-${String(count + 1).padStart(3, '0')}`
  // }

  // Enhanced completeAppointment with post-completion workflows
  async completeAppointment(appointmentId: string): Promise<any> {
    const appointment = await this.appointmentModel.findById(appointmentId)

    if (!appointment) {
      throw new NotFoundException('Appointment not found')
    }

    // 1. Update appointment status
    appointment.status = 'completed'
    appointment.checkOutTime = new Date()
    appointment.actualEndTime = new Date()

    if (!appointment.actualStartTime) {
      appointment.actualStartTime = appointment.checkInTime || new Date()
    }

    await appointment.save()

    // 2. Complete staff assignments
    try {
      const assignments = await this.staffService.getStaffAssignments(
        appointment._id.toString(),
        appointment.selectedDate,
        appointment.selectedDate
      )

      for (const assignment of assignments) {
        if (assignment.status !== 'completed') {
          await this.staffService.completeStaffAssignment(
            assignment._id.toString(),
            {
              actualStartTime: appointment.actualStartTime || new Date(appointment.selectedDate + 'T' + appointment.selectedTime),
              actualEndTime: appointment.actualEndTime || new Date(),
              completionNotes: 'Service completed successfully'
            }
          )
        }
      }
    } catch (error) {
      console.error('Staff assignment completion error (non-blocking):', error.message)
    }

    // 3. Create payment if not exists
    try {
      const existingPayment = await this.paymentService.getPaymentByAppointment(appointmentId)
      if (!existingPayment) {
        await this.paymentService.createPaymentForAppointment(appointment)
      }
    } catch (error) {
      console.error('Payment creation error (non-blocking):', error.message)
    }

    // 4. ★ CREATE SALE RECORD — Only completed services count as sales
    let saleRecord = null;
    try {
      saleRecord = await this.salesService.createFromAppointment(
        appointment,
        appointment.businessInfo.businessId,
      );
      console.log(`✅ Sale created: ${saleRecord.saleNumber} for appointment ${appointmentId}`);
    } catch (error) {
      console.error('Sale creation error (non-blocking):', error.message);
    }

    // 5. ★ SEND THANK-YOU EMAIL with review link
    try {
      // Ensure clientId is populated to get email
      await appointment.populate('clientId');
      const client = appointment.clientId as any;
      const clientEmail = client?.profile?.email;
      const clientName = client?.profile?.firstName || 'Valued Customer';

      if (clientEmail) {
        const frontendUrl = this.configService.get('FRONTEND_URL', 'https://lolaapril.com');
        const { subject: thankYouSubject, html: thankYouHtml } = this.emailTemplatesService.thankYouAndReview({
          clientName: clientName,
          businessName: appointment.businessInfo?.businessName || 'Our Salon',
          serviceName: appointment.serviceDetails?.serviceName || 'your service',
          appointmentId: appointmentId,
          businessId: appointment.businessInfo?.businessId || '',
        });

        await this.emailService.sendEmail(
          clientEmail,
          thankYouSubject,
          thankYouHtml,
        );
        console.log(`📧 Thank-you email sent for appointment ${appointmentId}`);
      }
    } catch (error) {
      console.error('Thank-you email error (non-blocking):', error.message);
    }

    // 6. ★ SEND SALE RECORDED NOTIFICATION to business
    try {
      if (saleRecord) {
        const { subject: saleSubject, html: saleNotificationHtml } = this.emailTemplatesService.saleRecorded({
          businessName: appointment.businessInfo?.businessName || 'Business',
          clientName: 'Customer',
          serviceName: appointment.serviceDetails?.serviceName || 'Service',
          saleNumber: saleRecord.saleNumber,
          totalAmount: appointment.paymentDetails?.total?.amount || 0,
          completedAt: new Date().toISOString(),
        });

        const staffEmail = this.configService.get('STAFF_NOTIFICATION_EMAIL');
        if (staffEmail) {
          await this.emailService.sendEmail(
            staffEmail,
            saleSubject,
            saleNotificationHtml,
          );
        }
      }
    } catch (error) {
      console.error('Sale notification error (non-blocking):', error.message);
    }

    // 7. ★ SCHEDULE 2-WEEK RE-BOOK REMINDER
    try {
      const twoWeeksLater = new Date();
      twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);

      const reminder = new this.scheduledReminderModel({
        type: 'rebook',
        userId: appointment.clientId?.toString(),
        businessId: appointment.businessInfo?.businessId,
        appointmentId: appointment._id.toString(),
        scheduledFor: twoWeeksLater,
        metadata: {
          serviceName: appointment.serviceDetails?.serviceName || 'Service',
          businessName: appointment.businessInfo?.businessName || 'Our Salon',
        },
      });
      await reminder.save();
      console.log(`📅 Re-book reminder scheduled for ${twoWeeksLater.toISOString()}`);
    } catch (error) {
      console.error('Scheduled reminder error (non-blocking):', error.message);
    }

    // 8. Send completion notification (existing)
    try {
      await this.notificationService.notifyAppointmentCompletion(
        appointmentId,
        appointment.clientId.toString(),
        appointment.businessInfo.businessId,
        {
          clientName: appointment.clientId,
          serviceName: appointment.serviceDetails.serviceName,
          appointmentDate: appointment.selectedDate,
          appointmentTime: appointment.selectedTime,
          businessName: appointment.businessInfo.businessName,
          appointmentNumber: appointment.appointmentNumber || appointmentId,
        }
      )
    } catch (error) {
      console.error('Failed to send completion notification:', error)
    }

    return {
      appointment,
      sale: saleRecord ? {
        saleNumber: saleRecord.saleNumber,
        totalAmount: saleRecord.totalAmount,
        status: saleRecord.status,
      } : null,
      rebookReminderScheduled: true,
      thankYouEmailSent: true,
    };
  }
}
