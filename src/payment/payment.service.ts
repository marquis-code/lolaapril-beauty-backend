import { Injectable, NotFoundException } from "@nestjs/common"
import { Model, Types } from "mongoose"
import { Payment, PaymentDocument } from "./schemas/payment.schema"
import { CreatePaymentDto } from "./dto/create-payment.dto"
import { ApiResponse } from "../common/interfaces/common.interface"
import { PaymentQueryDto } from "./dto/payment-query.dto"
import { UpdatePaymentDto } from "./dto/update-payment.dto"
import { NotificationService } from '../notification/notification.service'
import { InjectModel } from "@nestjs/mongoose"

@Injectable()
export class PaymentService {
   constructor(
    @InjectModel(Payment.name) 
    private paymentModel: Model<PaymentDocument>,
    private notificationService: NotificationService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<ApiResponse<Payment>> {
    try {
      const payment = new this.paymentModel(createPaymentDto)
      const savedPayment = await payment.save()

      return {
        success: true,
        data: savedPayment,
        message: "Payment created successfully",
      }
    } catch (error) {
      throw new Error(`Failed to create payment: ${error.message}`)
    }
  }

  async findAll(): Promise<ApiResponse<Payment[]>> {
    try {
      const payments = await this.paymentModel
        .find()
        .populate("clientId", "profile.firstName profile.lastName profile.email")
        .sort({ createdAt: -1 })

      return {
        success: true,
        data: payments,
      }
    } catch (error) {
      throw new Error(`Failed to fetch payments: ${error.message}`)
    }
  }

  async findAllWithQuery(query: PaymentQueryDto) {
    const {
      page = 1,
      limit = 10,
      clientId,
      appointmentId,
      bookingId,
      status,
      paymentMethod,
      startDate,
      endDate,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query

    const filter: any = {}

    if (clientId) filter.clientId = clientId
    if (appointmentId) filter.appointmentId = appointmentId
    if (bookingId) filter.bookingId = bookingId
    if (status) filter.status = status
    if (paymentMethod) filter.paymentMethod = paymentMethod

    // Date filtering
    if (startDate || endDate) {
      filter.createdAt = {}
      if (startDate) filter.createdAt.$gte = new Date(startDate)
      if (endDate) filter.createdAt.$lte = new Date(endDate)
    }

    // Search functionality
    if (search) {
      filter.$or = [
        { paymentReference: { $regex: search, $options: "i" } },
        { transactionId: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } },
      ]
    }

    const skip = (page - 1) * limit
    const sortOptions: any = {}
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1

    const [payments, total] = await Promise.all([
      this.paymentModel
        .find(filter)
        .populate("clientId", "firstName lastName email phone")
        .populate("appointmentId", "selectedDate selectedTime")
        .populate("bookingId", "bookingDate startTime")
        .populate("processedBy", "firstName lastName email")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.paymentModel.countDocuments(filter),
    ])

    return {
      success: true,
      data: {
        payments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    }
  }

  async findOne(id: string): Promise<ApiResponse<Payment>> {
    try {
      const payment = await this.paymentModel
        .findById(id)
        .populate("clientId", "profile.firstName profile.lastName profile.email")

      if (!payment) {
        throw new NotFoundException("Payment not found")
      }

      return {
        success: true,
        data: payment,
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new Error(`Failed to fetch payment: ${error.message}`)
    }
  }

  async updateStatus(id: string, status: string, transactionId?: string): Promise<ApiResponse<Payment>> {
    try {
      const updateData: any = { status, updatedAt: new Date() }

      if (status === "completed") {
        updateData.paidAt = new Date()
      }

      if (transactionId) {
        updateData.transactionId = transactionId
      }

      const payment = await this.paymentModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })

      if (!payment) {
        throw new NotFoundException("Payment not found")
      }

      return {
        success: true,
        data: payment,
        message: "Payment status updated successfully",
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new Error(`Failed to update payment status: ${error.message}`)
    }
  }

  async processRefund(id: string, refundAmount: number, refundReason: string): Promise<ApiResponse<Payment>> {
    try {
      const payment = await this.paymentModel.findById(id)

      if (!payment) {
        throw new NotFoundException("Payment not found")
      }

      if (payment.status !== "completed") {
        throw new Error("Can only refund completed payments")
      }

      const totalRefunded = (payment.refundedAmount || 0) + refundAmount

      if (totalRefunded > payment.totalAmount) {
        throw new Error("Refund amount exceeds payment total")
      }

      const newStatus = totalRefunded === payment.totalAmount ? "refunded" : "partially_refunded"

      const updatedPayment = await this.paymentModel.findByIdAndUpdate(
        id,
        {
          refundedAmount: totalRefunded,
          refundedAt: new Date(),
          refundReason,
          status: newStatus,
          updatedAt: new Date(),
        },
        { new: true, runValidators: true },
      )

      return {
        success: true,
        data: updatedPayment,
        message: "Refund processed successfully",
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new Error(`Failed to process refund: ${error.message}`)
    }
  }

  async getPaymentStats(): Promise<ApiResponse<any>> {
    try {
      const [totalPayments, completedPayments, totalRevenue, pendingPayments] = await Promise.all([
        this.paymentModel.countDocuments(),
        this.paymentModel.countDocuments({ status: "completed" }),
        this.paymentModel.aggregate([
          { $match: { status: "completed" } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]),
        this.paymentModel.countDocuments({ status: "pending" }),
      ])

      const paymentMethodStats = await this.paymentModel.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: "$paymentMethod", count: { $sum: 1 }, total: { $sum: "$totalAmount" } } },
        { $sort: { total: -1 } },
      ])

      return {
        success: true,
        data: {
          totalPayments,
          completedPayments,
          totalRevenue: totalRevenue[0]?.total || 0,
          pendingPayments,
          paymentMethodStats,
        },
      }
    } catch (error) {
      throw new Error(`Failed to get payment stats: ${error.message}`)
    }
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<ApiResponse<Payment>> {
    try {
      const payment = await this.paymentModel
        .findByIdAndUpdate(id, { ...updatePaymentDto, updatedAt: new Date() }, { new: true })
        .populate("clientId", "firstName lastName email phone")
        .populate("processedBy", "firstName lastName email")
        .exec()

      if (!payment) {
        throw new NotFoundException("Payment not found")
      }

      return {
        success: true,
        data: payment,
        message: "Payment updated successfully",
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new Error(`Failed to update payment: ${error.message}`)
    }
  }

  async remove(id: string): Promise<ApiResponse<void>> {
    try {
      const result = await this.paymentModel.findByIdAndDelete(id)
      if (!result) {
        throw new NotFoundException("Payment not found")
      }

      return {
        success: true,
        message: "Payment deleted successfully",
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new Error(`Failed to delete payment: ${error.message}`)
    }
  }

  //Added

    async createPaymentFromBooking(
    booking: any, 
    transactionReference: string,
    paymentData: any
  ): Promise<any> {
    const paymentItems = booking.services.map(service => ({
      itemType: 'service',
      itemId: service.serviceId.toString(),
      itemName: service.serviceName,
      quantity: 1,
      unitPrice: service.price,
      totalPrice: service.price,
      discount: 0,
      tax: service.price * 0.1 // 10% tax
    }))

    const subtotal = booking.estimatedTotal
    const totalTax = paymentItems.reduce((sum, item) => sum + item.tax, 0)

    const payment = new this.paymentModel({
      clientId: booking.clientId,
      bookingId: booking._id, // Link to booking
      businessId: booking.businessId,
      paymentReference: await this.generatePaymentReference(),
      transactionId: transactionReference,
      items: paymentItems,
      subtotal,
      totalTax,
      totalAmount: subtotal,
      paymentMethod: paymentData.paymentMethod || 'card',
      gatewayResponse: paymentData.gateway || 'unknown',
      status: paymentData.status || 'completed',
      paidAt: new Date()
    })

    return await payment.save()
  }

  async createFailedPayment(data: {
    bookingId: string
    transactionReference: string
    errorMessage: string
    clientId: string
    businessId: string
    amount: number
  }): Promise<any> {
    const payment = new this.paymentModel({
      clientId: new Types.ObjectId(data.clientId),
      bookingId: new Types.ObjectId(data.bookingId),
      businessId: new Types.ObjectId(data.businessId),
      paymentReference: data.transactionReference,
      transactionId: data.transactionReference,
      items: [],
      subtotal: data.amount,
      totalAmount: data.amount,
      paymentMethod: 'unknown',
      status: 'failed',
      gatewayResponse: data.errorMessage
    })

    return await payment.save()
  }

    async initiateRefund(transactionReference: string, amount: number): Promise<void> {
    // Implement refund logic with your payment provider
    // Example for Paystack:
    /*
    const response = await axios.post('https://api.paystack.co/refund', {
      transaction: transactionReference,
      amount: amount * 100 // Convert to kobo
    }, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    })
    */
    console.log(`Refund initiated for ${transactionReference}: ${amount}`)
  }

  private async generatePaymentReference(): Promise<string> {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return `PAY-${timestamp}-${random}`
  }


  // async updatePaymentStatus(
  //   paymentId: string,
  //   status: string,
  //   transactionId?: string
  // ): Promise<PaymentDocument> {
  //   const payment = await this.paymentModel.findById(paymentId)
    
  //   if (!payment) {
  //     throw new NotFoundException('Payment not found')
  //   }

  //   payment.status = status
  //   if (transactionId) {
  //     payment.transactionId = transactionId
  //   }

  //   if (status === 'completed') {
  //     payment.paidAt = new Date()
      
  //     // Send payment confirmation notification
  //     await this.notificationService.notifyPaymentConfirmation(
  //       paymentId,
  //       payment.clientId.toString(),
  //       payment.businessId.toString(),
  //       {
  //         // Payment details for notification
  //       }
  //     )
  //   }

  //   return await payment.save()
  // }

  // async createPaymentForAppointment(
  //   appointment: any,
  //   transactionReference?: string,
  //   paymentData?: any
  // ): Promise<PaymentDocument> {
  //   // Your existing payment creation logic
  //   const payment = new this.paymentModel({
  //     // ... payment creation logic
  //   })

  //   if (transactionReference) {
  //     payment.transactionId = transactionReference
  //     payment.paymentReference = transactionReference
  //   }

  //   if (paymentData) {
  //     payment.paymentMethod = paymentData.method
  //     payment.gatewayResponse = paymentData.gateway
  //   }

  //   return await payment.save()
  // }

  async getPaymentByAppointment(appointmentId: string): Promise<any> {
    try {
      // Assuming you have a Payment model - replace with your actual payment model
      const payment = await this.paymentModel.findOne({
        appointmentId: new Types.ObjectId(appointmentId)
      }).exec()

      return payment
    } catch (error) {
      console.error('Error getting payment by appointment:', error)
      return null
    }
  }



    /**
     * Create payment for completed appointment
     */
    async createPaymentForAppointment(appointment: any): Promise<any> {
      try {
        const paymentData = {
          appointmentId: appointment._id,
          clientId: appointment.clientId,
          businessId: appointment.businessInfo.businessId,
          amount: appointment.paymentDetails.total.amount,
          currency: appointment.paymentDetails.total.currency,
          paymentMethod: appointment.paymentDetails.paymentMethod,
          status: 'completed', // Since appointment is completed
          transactionDate: new Date(),
          description: `Payment for ${appointment.serviceDetails.serviceName}`,
          serviceDetails: {
            serviceName: appointment.serviceDetails.serviceName,
            serviceDescription: appointment.serviceDetails.serviceDescription,
          },
          metadata: {
            appointmentNumber: appointment.appointmentNumber,
            appointmentDate: appointment.selectedDate,
            appointmentTime: appointment.selectedTime,
          }
        }
  
        // Create the payment record
        const payment = new this.paymentModel(paymentData)
        const savedPayment = await payment.save()
  
        // Send payment confirmation notification
        try {
          await this.notificationService.notifyPaymentConfirmation(
            savedPayment._id.toString(),
            appointment.clientId.toString(),
            appointment.businessInfo.businessId,
            {
              clientName: appointment.clientId, // This should be populated with actual client data
              amount: paymentData.amount,
              method: paymentData.paymentMethod,
              transactionId: savedPayment._id.toString(),
              serviceName: appointment.serviceDetails.serviceName,
              appointmentDate: appointment.selectedDate,
              businessName: appointment.businessInfo.businessName,
              receiptUrl: `${process.env.FRONTEND_URL}/receipts/${savedPayment._id}`,
              clientEmail: appointment.clientEmail, // Assuming this field exists
              clientPhone: appointment.clientPhone, // Assuming this field exists
            }
          )
        } catch (notificationError) {
          console.error('Failed to send payment confirmation notification:', notificationError)
        }
  
        return savedPayment
      } catch (error) {
        console.error('Error creating payment for appointment:', error)
        throw error
      }
    }
  
    /**
     * Update payment status
     */
    async updatePaymentStatus(paymentId: string, status: string, metadata?: any): Promise<any> {
      try {
        const updateData: any = { 
          status, 
          updatedAt: new Date() 
        }
  
        if (metadata) {
          updateData.metadata = { ...updateData.metadata, ...metadata }
        }
  
        const payment = await this.paymentModel.findByIdAndUpdate(
          paymentId,
          updateData,
          { new: true }
        ).exec()
  
        if (!payment) {
          throw new NotFoundException('Payment not found')
        }
  
        return payment
      } catch (error) {
        console.error('Error updating payment status:', error)
        throw error
      }
    }
  
    /**
     * Get payments by client
     */
    async getPaymentsByClient(clientId: string, limit = 10, offset = 0): Promise<any> {
      try {
        const payments = await this.paymentModel
          .find({ clientId: new Types.ObjectId(clientId) })
          .sort({ transactionDate: -1 })
          .limit(limit)
          .skip(offset)
          .populate('appointmentId', 'selectedDate selectedTime serviceDetails')
          .exec()
  
        const total = await this.paymentModel.countDocuments({ 
          clientId: new Types.ObjectId(clientId) 
        })
  
        return {
          payments,
          pagination: {
            total,
            limit,
            offset,
            hasMore: total > (offset + limit)
          }
        }
      } catch (error) {
        console.error('Error getting payments by client:', error)
        throw error
      }
    }


}
