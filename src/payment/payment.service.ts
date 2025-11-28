import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { Model, Types } from "mongoose"
import { Payment, PaymentDocument } from "./schemas/payment.schema"
import { CreatePaymentDto } from "./dto/create-payment.dto"
import { ApiResponse } from "../common/interfaces/common.interface"
import { PaymentQueryDto } from "./dto/payment-query.dto"
import { UpdatePaymentDto } from "./dto/update-payment.dto"
import { NotificationService } from '../notification/notification.service'
import { InjectModel } from "@nestjs/mongoose"
import { ConfigService } from '@nestjs/config'
import axios from 'axios'

@Injectable()
export class PaymentService {
  private readonly paystackSecretKey: string
  private readonly paystackBaseUrl = 'https://api.paystack.co'

  constructor(
    @InjectModel(Payment.name) 
    private paymentModel: Model<PaymentDocument>,
    private notificationService: NotificationService,
    private configService: ConfigService,
  ) {
    this.paystackSecretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY')
  }

async initializePayment(data: {
  email: string
  amount: number
  clientId: string
  appointmentId?: string
  bookingId?: string
  metadata?: any
}): Promise<ApiResponse<any>> {
  try {
    console.log('🚀 Initializing payment with data:', {
      email: data.email,
      amount: data.amount,
      clientId: data.clientId,
      hasMetadata: !!data.metadata,
      hasServices: !!data.metadata?.services
    })

    // Generate payment reference
    const paymentReference = await this.generatePaymentReference()

    // Convert amount to kobo (Paystack uses kobo for NGN)
    const amountInKobo = Math.round(data.amount * 100)

    // Get frontend URL with fallback
    const frontendUrl = this.configService.get('FRONTEND_URL') 
                     || this.configService.get('APP_URL') 
                     || 'http://localhost:3001'

    console.log('🔗 Using callback URL:', `${frontendUrl}/payment/callback`)

    // Initialize payment with Paystack
    const response = await axios.post(
      `${this.paystackBaseUrl}/transaction/initialize`,
      {
        email: data.email,
        amount: amountInKobo,
        reference: paymentReference,
        callback_url: `${frontendUrl}/payment/callback`,
        metadata: {
          clientId: data.clientId,
          appointmentId: data.appointmentId,
          bookingId: data.bookingId,
          custom_fields: [
            {
              display_name: "Client ID",
              variable_name: "client_id",
              value: data.clientId
            }
          ],
          ...data.metadata
        }
      },
      {
        headers: {
          Authorization: `Bearer ${this.paystackSecretKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.data.status) {
      throw new BadRequestException('Failed to initialize payment with Paystack')
    }

    console.log('✅ Paystack initialization successful')

    // Process payment items from metadata
    let paymentItems = []
    
    if (data.metadata?.services && Array.isArray(data.metadata.services)) {
      console.log(`📦 Processing ${data.metadata.services.length} services`)
      
      paymentItems = data.metadata.services.map((service: any, index: number) => {
        // Get serviceId from various possible field names
        const serviceId = service.serviceId || service._id || service.id
        
        // Convert to ObjectId if valid, otherwise generate new one
        let itemId: Types.ObjectId
        if (serviceId && Types.ObjectId.isValid(serviceId)) {
          itemId = new Types.ObjectId(serviceId)
          console.log(`  ✓ Service ${index + 1}: Using provided ID ${itemId}`)
        } else {
          itemId = new Types.ObjectId()
          console.log(`  ⚠ Service ${index + 1}: Generated new ID ${itemId}`)
        }
        
        return {
          itemType: 'service',
          itemId: itemId,
          itemName: service.serviceName || service.name || `Service ${index + 1}`,
          quantity: service.quantity || 1,
          unitPrice: service.price || 0,
          totalPrice: service.price || 0,
          discount: service.discount || 0,
          tax: service.tax || 0
        }
      })
    }
    
    // If no services provided, create a default item
    if (paymentItems.length === 0) {
      console.log('📦 No services provided, creating default payment item')
      
      paymentItems.push({
        itemType: 'service',
        itemId: new Types.ObjectId(),
        itemName: data.metadata?.serviceName || 'Payment',
        quantity: 1,
        unitPrice: data.amount,
        totalPrice: data.amount,
        discount: 0,
        tax: 0
      })
    }

    console.log(`💰 Creating payment record with ${paymentItems.length} items`)

    // Create pending payment record
    const payment = new this.paymentModel({
      clientId: new Types.ObjectId(data.clientId),
      appointmentId: data.appointmentId ? new Types.ObjectId(data.appointmentId) : undefined,
      bookingId: data.bookingId ? new Types.ObjectId(data.bookingId) : undefined,
      businessId: data.metadata?.businessId ? new Types.ObjectId(data.metadata.businessId) : undefined,
      paymentReference,
      items: paymentItems,
      subtotal: data.amount,
      totalAmount: data.amount,
      paymentMethod: 'online',
      status: 'pending',
      gatewayResponse: JSON.stringify(response.data.data),
      metadata: data.metadata
    })

    await payment.save()

    console.log('💳 Payment initialized successfully:', {
      paymentId: payment._id,
      reference: paymentReference,
      clientId: payment.clientId,
      bookingId: payment.bookingId,
      appointmentId: payment.appointmentId,
      itemsCount: payment.items.length,
      items: payment.items.map(item => ({
        itemId: item.itemId,
        itemName: item.itemName,
        price: item.totalPrice
      }))
    })

    return {
      success: true,
      data: {
        authorizationUrl: response.data.data.authorization_url,
        accessCode: response.data.data.access_code,
        reference: paymentReference,
        paymentId: payment._id.toString()
      },
      message: 'Payment initialized successfully'
    }
  } catch (error) {
    console.error('❌ Payment initialization error:', {
      message: error.message,
      name: error.name,
      stack: error.stack?.split('\n')[0]
    })
    
    if (axios.isAxiosError(error)) {
      console.error('🌐 Paystack API error:', {
        status: error.response?.status,
        data: error.response?.data
      })
      throw new BadRequestException(
        error.response?.data?.message || 'Failed to initialize payment with Paystack'
      )
    }
    
    // Log validation errors in detail
    if (error.name === 'ValidationError') {
      console.error('📋 Validation Error Details:', error.message)
      console.error('📋 Validation Errors:', error.errors)
    }
    
    throw new Error(`Failed to initialize payment: ${error.message}`)
  }
}

/**
 * Verify payment with Paystack - UPDATED to preserve IDs
 */
async verifyPayment(reference: string): Promise<ApiResponse<Payment>> {
  try {
    // Verify transaction with Paystack
    const response = await axios.get(
      `${this.paystackBaseUrl}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${this.paystackSecretKey}`
        }
      }
    )

    if (!response.data.status) {
      throw new BadRequestException('Payment verification failed')
    }

    const transactionData = response.data.data

    // Find payment by reference
    const payment = await this.paymentModel.findOne({ paymentReference: reference })

    if (!payment) {
      throw new NotFoundException('Payment record not found')
    }

    console.log('🔍 Verifying payment:', {
      reference,
      paymentId: payment._id,
      existingClientId: payment.clientId,
      existingBookingId: payment.bookingId,
      status: transactionData.status
    })

    // Update payment status based on Paystack response
    const updateData: any = {
      transactionId: transactionData.id.toString(),
      gatewayResponse: JSON.stringify(transactionData),
      updatedAt: new Date()
    }

    if (transactionData.status === 'success') {
      updateData.status = 'completed'
      updateData.paidAt = new Date()

      // Extract metadata from Paystack response if not already set
      if (!payment.bookingId && transactionData.metadata?.bookingId) {
        updateData.bookingId = new Types.ObjectId(transactionData.metadata.bookingId)
      }
      if (!payment.clientId && transactionData.metadata?.clientId) {
        updateData.clientId = new Types.ObjectId(transactionData.metadata.clientId)
      }

      // Send payment confirmation notification
      try {
        await this.notificationService.notifyPaymentConfirmation(
          payment._id.toString(),
          payment.clientId?.toString() || transactionData.metadata?.clientId,
          transactionData.metadata?.businessId || '',
          {
            clientName: transactionData.metadata?.clientName,
            amount: payment.totalAmount,
            method: payment.paymentMethod,
            transactionId: transactionData.id.toString(),
            serviceName: transactionData.metadata?.services?.map((s: any) => s.serviceName).join(', '),
            appointmentDate: transactionData.metadata?.preferredDate,
            businessName: 'Business Name', // You can get this from metadata
            receiptUrl: `${this.configService.get('FRONTEND_URL')}/receipts/${payment._id}`,
            clientEmail: transactionData.customer?.email,
            clientPhone: transactionData.metadata?.clientPhone
          }
        )
      } catch (notificationError) {
        console.error('Failed to send payment confirmation:', notificationError)
      }
    } else if (transactionData.status === 'failed') {
      updateData.status = 'failed'
    } else {
      updateData.status = 'processing'
    }

    const updatedPayment = await this.paymentModel.findByIdAndUpdate(
      payment._id,
      updateData,
      { new: true, runValidators: true }
    ).populate('clientId', 'firstName lastName email')
      .populate('bookingId')

    console.log('✅ Payment updated:', {
      paymentId: updatedPayment._id,
      status: updatedPayment.status,
      clientId: updatedPayment.clientId,
      bookingId: updatedPayment.bookingId,
      itemsCount: updatedPayment.items.length
    })

    return {
      success: true,
      data: updatedPayment,
      message: `Payment ${transactionData.status}`
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new BadRequestException(
        error.response?.data?.message || 'Failed to verify payment with Paystack'
      )
    }
    if (error instanceof NotFoundException) {
      throw error
    }
    throw new Error(`Failed to verify payment: ${error.message}`)
  }
}

  async handleWebhook(payload: any, signature: string): Promise<void> {
    try {
      // Verify webhook signature
      const crypto = require('crypto')
      const hash = crypto
        .createHmac('sha512', this.paystackSecretKey)
        .update(JSON.stringify(payload))
        .digest('hex')

      if (hash !== signature) {
        throw new BadRequestException('Invalid webhook signature')
      }

      // Handle different event types
      const event = payload.event

      switch (event) {
        case 'charge.success':
          await this.handleSuccessfulCharge(payload.data)
          break
        case 'charge.failed':
          await this.handleFailedCharge(payload.data)
          break
        case 'transfer.success':
        case 'transfer.failed':
          // Handle transfer events if needed
          break
        default:
          console.log(`Unhandled webhook event: ${event}`)
      }
    } catch (error) {
      console.error('Webhook handling error:', error)
      throw error
    }
  }

  private async handleSuccessfulCharge(data: any): Promise<void> {
    const payment = await this.paymentModel.findOne({ 
      paymentReference: data.reference 
    })

    if (payment && payment.status !== 'completed') {
      await this.paymentModel.findByIdAndUpdate(payment._id, {
        status: 'completed',
        transactionId: data.id.toString(),
        paidAt: new Date(),
        gatewayResponse: JSON.stringify(data),
        updatedAt: new Date()
      })
    }
  }

  private async handleFailedCharge(data: any): Promise<void> {
    const payment = await this.paymentModel.findOne({ 
      paymentReference: data.reference 
    })

    if (payment) {
      await this.paymentModel.findByIdAndUpdate(payment._id, {
        status: 'failed',
        gatewayResponse: JSON.stringify(data),
        updatedAt: new Date()
      })
    }
  }

  // Existing methods below...
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

    if (startDate || endDate) {
      filter.createdAt = {}
      if (startDate) filter.createdAt.$gte = new Date(startDate)
      if (endDate) filter.createdAt.$lte = new Date(endDate)
    }

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

    const payments = await this.paymentModel
      .find(filter)
      .populate("clientId", "firstName lastName email phone")
      .populate("appointmentId", "selectedDate selectedTime")
      .populate("bookingId", "bookingDate startTime")
      .populate("processedBy", "firstName lastName email")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .exec()

    const total = await this.paymentModel.countDocuments(filter).exec()

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
      const totalPayments = await this.paymentModel.countDocuments().exec()
      const completedPayments = await this.paymentModel.countDocuments({ status: "completed" }).exec()
      const pendingPayments = await this.paymentModel.countDocuments({ status: "pending" }).exec()
      
      const totalRevenueResult = await this.paymentModel.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]).exec()

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
          totalRevenue: totalRevenueResult[0]?.total || 0,
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

  private async generatePaymentReference(): Promise<string> {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return `PAY-${timestamp}-${random}`
  }


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


  // AGGRESSIVE FIX - Replace ALL the problematic methods at the bottom of your payment.service.ts

// async createPaymentFromBooking(
//   booking: any,
//   transactionReference: string,
//   paymentData: {
//     paymentMethod: string
//     gateway: string
//     status: string
//   }
// ): Promise<any> {
//   try {
//     const paymentMethodMap: Record<string, string> = {
//       'card': 'card',
//       'bank_transfer': 'bank_transfer',
//       'mobile_money': 'mobile_money',
//       'crypto': 'crypto',
//       'cash': 'cash',
//       'online': 'online'
//     }

//     const mappedMethod = paymentMethodMap[paymentData.paymentMethod] || 'online'

//     const paymentData = {
//       clientId: new Types.ObjectId(booking.clientId.toString()),
//       bookingId: new Types.ObjectId(booking._id.toString()),
//       businessId: new Types.ObjectId(booking.businessId.toString()),
//       paymentReference: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//       transactionId: transactionReference,
//       items: booking.services.map((service: any) => ({
//         itemType: 'service',
//         itemId: new Types.ObjectId(service.serviceId.toString()),
//         itemName: service.serviceName,
//         quantity: 1,
//         unitPrice: service.price,
//         totalPrice: service.price,
//         discount: 0,
//         tax: 0
//       })),
//       subtotal: booking.estimatedTotal,
//       totalTax: 0,
//       totalDiscount: 0,
//       totalAmount: booking.estimatedTotal,
//       paymentMethod: mappedMethod,
//       gateway: paymentData.gateway,
//       status: paymentData.status || 'completed',
//       paidAt: new Date(),
//       metadata: {
//         bookingNumber: booking.bookingNumber,
//         clientName: booking.clientName,
//         clientEmail: booking.clientEmail,
//         serviceName: booking.services.map((s: any) => s.serviceName).join(', ')
//       }
//     }

//     const paymentRecord = new this.paymentModel(paymentData)
//     await paymentRecord.save()
    
//     console.log('✅ Payment record created:', paymentRecord._id.toString())
    
//     // Return plain object directly
//     return JSON.parse(JSON.stringify(paymentRecord))
//   } catch (error: any) {
//     console.error('❌ Failed to create payment record:', error.message)
//     throw new BadRequestException(`Failed to create payment record: ${error.message}`)
//   }
// }

// FIXED: Rename parameter to avoid conflict
async createPaymentFromBooking(
  booking: any,
  transactionReference: string,
  paymentInfo: {  // ✅ Changed from 'paymentData' to 'paymentInfo'
    paymentMethod: string
    gateway: string
    status: string
  }
): Promise<any> {
  try {
    const paymentMethodMap: Record<string, string> = {
      'card': 'card',
      'bank_transfer': 'bank_transfer',
      'mobile_money': 'mobile_money',
      'crypto': 'crypto',
      'cash': 'cash',
      'online': 'online'
    }

    const mappedMethod = paymentMethodMap[paymentInfo.paymentMethod] || 'online'  // ✅ Now uses 'paymentInfo'

    const paymentData = {  // ✅ This is now the local variable (no conflict)
      clientId: new Types.ObjectId(booking.clientId.toString()),
      bookingId: new Types.ObjectId(booking._id.toString()),
      businessId: new Types.ObjectId(booking.businessId.toString()),
      paymentReference: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      transactionId: transactionReference,
      items: booking.services.map((service: any) => ({
        itemType: 'service',
        itemId: new Types.ObjectId(service.serviceId.toString()),
        itemName: service.serviceName,
        quantity: 1,
        unitPrice: service.price,
        totalPrice: service.price,
        discount: 0,
        tax: 0
      })),
      subtotal: booking.estimatedTotal,
      totalTax: 0,
      totalDiscount: 0,
      totalAmount: booking.estimatedTotal,
      paymentMethod: mappedMethod,  // ✅ Uses the mapped method
      gateway: paymentInfo.gateway,  // ✅ Now uses 'paymentInfo'
      status: paymentInfo.status || 'completed',  // ✅ Now uses 'paymentInfo'
      paidAt: new Date(),
      metadata: {
        bookingNumber: booking.bookingNumber,
        clientName: booking.clientName,
        clientEmail: booking.clientEmail,
        serviceName: booking.services.map((s: any) => s.serviceName).join(', ')
      }
    }

    const paymentRecord = new this.paymentModel(paymentData)
    await paymentRecord.save()
    
    console.log('✅ Payment record created:', paymentRecord._id.toString())
    
    // Return plain object directly
    return JSON.parse(JSON.stringify(paymentRecord))
  } catch (error: any) {
    console.error('❌ Failed to create payment record:', error.message)
    throw new BadRequestException(`Failed to create payment record: ${error.message}`)
  }
}

async createFailedPayment(data: {
  bookingId: string
  transactionReference: string
  errorMessage: string
  clientId: string
  businessId: string
  amount: number
}): Promise<any> {
  try {
    const failedPaymentData = {
      clientId: new Types.ObjectId(data.clientId),
      bookingId: new Types.ObjectId(data.bookingId),
      businessId: new Types.ObjectId(data.businessId),
      paymentReference: `PAY-FAILED-${Date.now()}`,
      transactionId: data.transactionReference,
      subtotal: data.amount,
      totalAmount: data.amount,
      paymentMethod: 'online',
      gateway: 'unknown',
      status: 'failed',
      metadata: {
        failureReason: data.errorMessage
      }
    }

    const failedPayment = new this.paymentModel(failedPaymentData)
    await failedPayment.save()
    
    return JSON.parse(JSON.stringify(failedPayment))
  } catch (error: any) {
    console.error('❌ Failed to create failed payment record:', error.message)
    throw new BadRequestException(`Failed to create failed payment record: ${error.message}`)
  }
}

async updatePaymentStatus(
  paymentId: string,
  status: 'completed' | 'failed' | 'pending' | 'cancelled' | 'refunded',
  transactionReference: string
): Promise<any> {
  try {
    const updateData: any = {
      status,
      transactionId: transactionReference
    }
    
    if (status === 'completed') {
      updateData.paidAt = new Date()
    }

    const payment = await this.paymentModel.findByIdAndUpdate(
      paymentId,
      updateData,
      { new: true }
    ).exec()

    if (!payment) {
      throw new NotFoundException(`Payment ${paymentId} not found`)
    }

    console.log('✅ Payment status updated:', status)
    return JSON.parse(JSON.stringify(payment))
  } catch (error: any) {
    console.error('❌ Failed to update payment status:', error.message)
    throw new BadRequestException(`Failed to update payment status: ${error.message}`)
  }
}

async getPaymentByBookingId(bookingId: string): Promise<any> {
  try {
    const payment = await this.paymentModel
      .findOne({ bookingId: new Types.ObjectId(bookingId) })
      .exec()
    
    if (!payment) {
      return null
    }
    
    return JSON.parse(JSON.stringify(payment))
  } catch (error: any) {
    console.error('❌ Failed to get payment by booking ID:', error.message)
    return null
  }
}

async initiateRefund(transactionReference: string, amount: number): Promise<void> {
  try {
    console.log(`💰 Initiating refund for transaction: ${transactionReference}, amount: ${amount}`)
    
    await this.paymentModel.updateOne(
      { transactionId: transactionReference },
      {
        status: 'refunded',
        refundedAmount: amount,
        refundedAt: new Date()
      }
    ).exec()

    console.log('✅ Refund initiated successfully')
  } catch (error: any) {
    console.error('❌ Failed to initiate refund:', error.message)
    throw new BadRequestException(`Failed to initiate refund: ${error.message}`)
  }
}
  

  // NEW: Initiate refund
  // async initiateRefund(transactionReference: string, amount: number): Promise<void> {
  //   try {
  //     console.log(`💰 Initiating refund for transaction: ${transactionReference}, amount: ${amount}`)
      
  //     // Update payment status to refunded
  //     await this.paymentModel.updateOne(
  //       { transactionId: transactionReference },
  //       {
  //         status: 'refunded',
  //         refundedAmount: amount,
  //         refundedAt: new Date()
  //       }
  //     ).exec()

  //     console.log('✅ Refund initiated successfully')
  //   } catch (error) {
  //     console.error('❌ Failed to initiate refund:', error.message)
  //     throw new BadRequestException(`Failed to initiate refund: ${error.message}`)
  //   }
  // }
}