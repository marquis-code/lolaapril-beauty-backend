// import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
// import { Model, Types } from "mongoose"
// import { Payment, PaymentDocument } from "./schemas/payment.schema"
// import { CreatePaymentDto } from "./dto/create-payment.dto"
// import { ApiResponse } from "../common/interfaces/common.interface"
// import { PaymentQueryDto } from "./dto/payment-query.dto"
// import { UpdatePaymentDto } from "./dto/update-payment.dto"
// import { NotificationService } from '../notification/notification.service'
// import { InjectModel } from "@nestjs/mongoose"
// import { ConfigService } from '@nestjs/config'
// import axios from 'axios'

// @Injectable()
// export class PaymentService {
//     private readonly paystackBaseUrl = 'https://api.paystack.co'

//   constructor(
//     @InjectModel(Payment.name) 
//     private paymentModel: Model<PaymentDocument>,
//     private notificationService: NotificationService,
//     private configService: ConfigService,
//   ) {
//     this.paystackSecretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY')
//   }

//    /**
//    * Initialize payment with Paystack
//    */
//   async initializePayment(data: {
//     email: string
//     amount: number
//     clientId: string
//     appointmentId?: string
//     bookingId?: string
//     metadata?: any
//   }): Promise<ApiResponse<any>> {
//     try {
//       // Generate payment reference
//       const paymentReference = await this.generatePaymentReference()

//       // Convert amount to kobo (Paystack uses kobo for NGN)
//       const amountInKobo = Math.round(data.amount * 100)

//       // Initialize payment with Paystack
//       const response = await axios.post(
//         `${this.paystackBaseUrl}/transaction/initialize`,
//         {
//           email: data.email,
//           amount: amountInKobo,
//           reference: paymentReference,
//           callback_url: `${this.configService.get('FRONTEND_URL')}/payment/callback`,
//           metadata: {
//             clientId: data.clientId,
//             appointmentId: data.appointmentId,
//             bookingId: data.bookingId,
//             custom_fields: [
//               {
//                 display_name: "Client ID",
//                 variable_name: "client_id",
//                 value: data.clientId
//               }
//             ],
//             ...data.metadata
//           }
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${this.paystackSecretKey}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       )

//       if (!response.data.status) {
//         throw new BadRequestException('Failed to initialize payment')
//       }

//       // Create pending payment record
//       const payment = new this.paymentModel({
//         clientId: new Types.ObjectId(data.clientId),
//         appointmentId: data.appointmentId ? new Types.ObjectId(data.appointmentId) : undefined,
//         bookingId: data.bookingId ? new Types.ObjectId(data.bookingId) : undefined,
//         paymentReference,
//         items: [],
//         subtotal: data.amount,
//         totalAmount: data.amount,
//         paymentMethod: 'online',
//         status: 'pending',
//         gatewayResponse: JSON.stringify(response.data.data)
//       })

//       await payment.save()

//       return {
//         success: true,
//         data: {
//           authorizationUrl: response.data.data.authorization_url,
//           accessCode: response.data.data.access_code,
//           reference: paymentReference
//         },
//         message: 'Payment initialized successfully'
//       }
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         throw new BadRequestException(
//           error.response?.data?.message || 'Failed to initialize payment with Paystack'
//         )
//       }
//       throw new Error(`Failed to initialize payment: ${error.message}`)
//     }
//   }

//   async verifyPayment(reference: string): Promise<ApiResponse<Payment>> {
//     try {
//       // Verify transaction with Paystack
//       const response = await axios.get(
//         `${this.paystackBaseUrl}/transaction/verify/${reference}`,
//         {
//           headers: {
//             Authorization: `Bearer ${this.paystackSecretKey}`
//           }
//         }
//       )

//       if (!response.data.status) {
//         throw new BadRequestException('Payment verification failed')
//       }

//       const transactionData = response.data.data

//       // Find payment by reference
//       const payment = await this.paymentModel.findOne({ paymentReference: reference })

//       if (!payment) {
//         throw new NotFoundException('Payment record not found')
//       }

//       // Update payment status based on Paystack response
//       const updateData: any = {
//         transactionId: transactionData.id.toString(),
//         gatewayResponse: JSON.stringify(transactionData),
//         updatedAt: new Date()
//       }

//       if (transactionData.status === 'success') {
//         updateData.status = 'completed'
//         updateData.paidAt = new Date()

//         // Send payment confirmation notification
//         try {
//           await this.notificationService.notifyPaymentConfirmation(
//             payment._id.toString(),
//             payment.clientId.toString(),
//             transactionData.metadata?.businessId || '',
//             {
//               amount: payment.totalAmount,
//               method: payment.paymentMethod,
//               transactionId: transactionData.id.toString(),
//               receiptUrl: `${this.configService.get('FRONTEND_URL')}/receipts/${payment._id}`
//             }
//           )
//         } catch (notificationError) {
//           console.error('Failed to send payment confirmation:', notificationError)
//         }
//       } else if (transactionData.status === 'failed') {
//         updateData.status = 'failed'
//       } else {
//         updateData.status = 'processing'
//       }

//       const updatedPayment = await this.paymentModel.findByIdAndUpdate(
//         payment._id,
//         updateData,
//         { new: true, runValidators: true }
//       )

//       return {
//         success: true,
//         data: updatedPayment,
//         message: `Payment ${transactionData.status}`
//       }
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         throw new BadRequestException(
//           error.response?.data?.message || 'Failed to verify payment with Paystack'
//         )
//       }
//       if (error instanceof NotFoundException) {
//         throw error
//       }
//       throw new Error(`Failed to verify payment: ${error.message}`)
//     }
//   }


//   async handleWebhook(payload: any, signature: string): Promise<void> {
//     try {
//       // Verify webhook signature
//       const crypto = require('crypto')
//       const hash = crypto
//         .createHmac('sha512', this.paystackSecretKey)
//         .update(JSON.stringify(payload))
//         .digest('hex')

//       if (hash !== signature) {
//         throw new BadRequestException('Invalid webhook signature')
//       }

//       // Handle different event types
//       const event = payload.event

//       switch (event) {
//         case 'charge.success':
//           await this.handleSuccessfulCharge(payload.data)
//           break
//         case 'charge.failed':
//           await this.handleFailedCharge(payload.data)
//           break
//         case 'transfer.success':
//         case 'transfer.failed':
//           // Handle transfer events if needed
//           break
//         default:
//           console.log(`Unhandled webhook event: ${event}`)
//       }
//     } catch (error) {
//       console.error('Webhook handling error:', error)
//       throw error
//     }
//   }


//  async initiateRefund(transactionReference: string, amount?: number): Promise<ApiResponse<any>> {
//     try {
//       const payment = await this.paymentModel.findOne({ 
//         paymentReference: transactionReference 
//       })

//       if (!payment) {
//         throw new NotFoundException('Payment not found')
//       }

//       if (payment.status !== 'completed') {
//         throw new BadRequestException('Can only refund completed payments')
//       }

//       const refundAmount = amount || payment.totalAmount
//       const amountInKobo = Math.round(refundAmount * 100)

//       const response = await axios.post(
//         `${this.paystackBaseUrl}/refund`,
//         {
//           transaction: payment.transactionId || transactionReference,
//           amount: amountInKobo
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${this.paystackSecretKey}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       )

//       if (!response.data.status) {
//         throw new BadRequestException('Refund initiation failed')
//       }

//       // Update payment record
//       const totalRefunded = (payment.refundedAmount || 0) + refundAmount
//       const newStatus = totalRefunded === payment.totalAmount ? 'refunded' : 'partially_refunded'

//       await this.paymentModel.findByIdAndUpdate(payment._id, {
//         refundedAmount: totalRefunded,
//         refundedAt: new Date(),
//         status: newStatus,
//         gatewayResponse: JSON.stringify(response.data.data),
//         updatedAt: new Date()
//       })

//       return {
//         success: true,
//         data: response.data.data,
//         message: 'Refund initiated successfully'
//       }
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         throw new BadRequestException(
//           error.response?.data?.message || 'Failed to initiate refund'
//         )
//       }
//       throw error
//     }
//   }


//    async create(createPaymentDto: CreatePaymentDto): Promise<ApiResponse<Payment>> {
//     try {
//       const payment = new this.paymentModel(createPaymentDto)
//       const savedPayment = await payment.save()

//       return {
//         success: true,
//         data: savedPayment,
//         message: "Payment created successfully",
//       }
//     } catch (error) {
//       throw new Error(`Failed to create payment: ${error.message}`)
//     }
//   }

//   async findAll(): Promise<ApiResponse<Payment[]>> {
//     try {
//       const payments = await this.paymentModel
//         .find()
//         .populate("clientId", "profile.firstName profile.lastName profile.email")
//         .sort({ createdAt: -1 })

//       return {
//         success: true,
//         data: payments,
//       }
//     } catch (error) {
//       throw new Error(`Failed to fetch payments: ${error.message}`)
//     }
//   }

//   async findAllWithQuery(query: PaymentQueryDto) {
//     const {
//       page = 1,
//       limit = 10,
//       clientId,
//       appointmentId,
//       bookingId,
//       status,
//       paymentMethod,
//       startDate,
//       endDate,
//       search,
//       sortBy = "createdAt",
//       sortOrder = "desc",
//     } = query

//     const filter: any = {}

//     if (clientId) filter.clientId = clientId
//     if (appointmentId) filter.appointmentId = appointmentId
//     if (bookingId) filter.bookingId = bookingId
//     if (status) filter.status = status
//     if (paymentMethod) filter.paymentMethod = paymentMethod

//     if (startDate || endDate) {
//       filter.createdAt = {}
//       if (startDate) filter.createdAt.$gte = new Date(startDate)
//       if (endDate) filter.createdAt.$lte = new Date(endDate)
//     }

//     if (search) {
//       filter.$or = [
//         { paymentReference: { $regex: search, $options: "i" } },
//         { transactionId: { $regex: search, $options: "i" } },
//         { notes: { $regex: search, $options: "i" } },
//       ]
//     }

//     const skip = (page - 1) * limit
//     const sortOptions: any = {}
//     sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1

//     const payments = await this.paymentModel
//       .find(filter)
//       .populate("clientId", "firstName lastName email phone")
//       .populate("appointmentId", "selectedDate selectedTime")
//       .populate("bookingId", "bookingDate startTime")
//       .populate("processedBy", "firstName lastName email")
//       .sort(sortOptions)
//       .skip(skip)
//       .limit(limit)
//       .exec()

//     const total = await this.paymentModel.countDocuments(filter).exec()

//     return {
//       success: true,
//       data: {
//         payments,
//         pagination: {
//           page,
//           limit,
//           total,
//           pages: Math.ceil(total / limit),
//         },
//       },
//     }
//   }


//   private async handleSuccessfulCharge(data: any): Promise<void> {
//     const payment = await this.paymentModel.findOne({ 
//       paymentReference: data.reference 
//     })

//     if (payment && payment.status !== 'completed') {
//       await this.paymentModel.findByIdAndUpdate(payment._id, {
//         status: 'completed',
//         transactionId: data.id.toString(),
//         paidAt: new Date(),
//         gatewayResponse: JSON.stringify(data),
//         updatedAt: new Date()
//       })
//     }
//   }

//   private async handleFailedCharge(data: any): Promise<void> {
//     const payment = await this.paymentModel.findOne({ 
//       paymentReference: data.reference 
//     })

//     if (payment) {
//       await this.paymentModel.findByIdAndUpdate(payment._id, {
//         status: 'failed',
//         gatewayResponse: JSON.stringify(data),
//         updatedAt: new Date()
//       })
//     }
//   }

//   // async create(createPaymentDto: CreatePaymentDto): Promise<ApiResponse<Payment>> {
//   //   try {
//   //     const payment = new this.paymentModel(createPaymentDto)
//   //     const savedPayment = await payment.save()

//   //     return {
//   //       success: true,
//   //       data: savedPayment,
//   //       message: "Payment created successfully",
//   //     }
//   //   } catch (error) {
//   //     throw new Error(`Failed to create payment: ${error.message}`)
//   //   }
//   // }

//   // async findAll(): Promise<ApiResponse<Payment[]>> {
//   //   try {
//   //     const payments = await this.paymentModel
//   //       .find()
//   //       .populate("clientId", "profile.firstName profile.lastName profile.email")
//   //       .sort({ createdAt: -1 })

//   //     return {
//   //       success: true,
//   //       data: payments,
//   //     }
//   //   } catch (error) {
//   //     throw new Error(`Failed to fetch payments: ${error.message}`)
//   //   }
//   // }

//   // async findAllWithQuery(query: PaymentQueryDto) {
//   //   const {
//   //     page = 1,
//   //     limit = 10,
//   //     clientId,
//   //     appointmentId,
//   //     bookingId,
//   //     status,
//   //     paymentMethod,
//   //     startDate,
//   //     endDate,
//   //     search,
//   //     sortBy = "createdAt",
//   //     sortOrder = "desc",
//   //   } = query

//   //   const filter: any = {}

//   //   if (clientId) filter.clientId = clientId
//   //   if (appointmentId) filter.appointmentId = appointmentId
//   //   if (bookingId) filter.bookingId = bookingId
//   //   if (status) filter.status = status
//   //   if (paymentMethod) filter.paymentMethod = paymentMethod

//   //   // Date filtering
//   //   if (startDate || endDate) {
//   //     filter.createdAt = {}
//   //     if (startDate) filter.createdAt.$gte = new Date(startDate)
//   //     if (endDate) filter.createdAt.$lte = new Date(endDate)
//   //   }

//   //   // Search functionality
//   //   if (search) {
//   //     filter.$or = [
//   //       { paymentReference: { $regex: search, $options: "i" } },
//   //       { transactionId: { $regex: search, $options: "i" } },
//   //       { notes: { $regex: search, $options: "i" } },
//   //     ]
//   //   }

//   //   const skip = (page - 1) * limit
//   //   const sortOptions: any = {}
//   //   sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1

//   //   // Execute queries sequentially to avoid TypeScript union type complexity
//   //   const payments = await this.paymentModel
//   //     .find(filter)
//   //     .populate("clientId", "firstName lastName email phone")
//   //     .populate("appointmentId", "selectedDate selectedTime")
//   //     .populate("bookingId", "bookingDate startTime")
//   //     .populate("processedBy", "firstName lastName email")
//   //     .sort(sortOptions)
//   //     .skip(skip)
//   //     .limit(limit)
//   //     .exec()

//   //   const total = await this.paymentModel.countDocuments(filter).exec()

//   //   return {
//   //     success: true,
//   //     data: {
//   //       payments,
//   //       pagination: {
//   //         page,
//   //         limit,
//   //         total,
//   //         pages: Math.ceil(total / limit),
//   //       },
//   //     },
//   //   }
//   // }

//   async findOne(id: string): Promise<ApiResponse<Payment>> {
//     try {
//       const payment = await this.paymentModel
//         .findById(id)
//         .populate("clientId", "profile.firstName profile.lastName profile.email")

//       if (!payment) {
//         throw new NotFoundException("Payment not found")
//       }

//       return {
//         success: true,
//         data: payment,
//       }
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error
//       }
//       throw new Error(`Failed to fetch payment: ${error.message}`)
//     }
//   }

//   async updateStatus(id: string, status: string, transactionId?: string): Promise<ApiResponse<Payment>> {
//     try {
//       const updateData: any = { status, updatedAt: new Date() }

//       if (status === "completed") {
//         updateData.paidAt = new Date()
//       }

//       if (transactionId) {
//         updateData.transactionId = transactionId
//       }

//       const payment = await this.paymentModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })

//       if (!payment) {
//         throw new NotFoundException("Payment not found")
//       }

//       return {
//         success: true,
//         data: payment,
//         message: "Payment status updated successfully",
//       }
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error
//       }
//       throw new Error(`Failed to update payment status: ${error.message}`)
//     }
//   }

//   async processRefund(id: string, refundAmount: number, refundReason: string): Promise<ApiResponse<Payment>> {
//     try {
//       const payment = await this.paymentModel.findById(id)

//       if (!payment) {
//         throw new NotFoundException("Payment not found")
//       }

//       if (payment.status !== "completed") {
//         throw new Error("Can only refund completed payments")
//       }

//       const totalRefunded = (payment.refundedAmount || 0) + refundAmount

//       if (totalRefunded > payment.totalAmount) {
//         throw new Error("Refund amount exceeds payment total")
//       }

//       const newStatus = totalRefunded === payment.totalAmount ? "refunded" : "partially_refunded"

//       const updatedPayment = await this.paymentModel.findByIdAndUpdate(
//         id,
//         {
//           refundedAmount: totalRefunded,
//           refundedAt: new Date(),
//           refundReason,
//           status: newStatus,
//           updatedAt: new Date(),
//         },
//         { new: true, runValidators: true },
//       )

//       return {
//         success: true,
//         data: updatedPayment,
//         message: "Refund processed successfully",
//       }
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error
//       }
//       throw new Error(`Failed to process refund: ${error.message}`)
//     }
//   }

//   async getPaymentStats(): Promise<ApiResponse<any>> {
//     try {
//       // Execute queries sequentially to avoid TypeScript union type complexity
//       const totalPayments = await this.paymentModel.countDocuments().exec()
//       const completedPayments = await this.paymentModel.countDocuments({ status: "completed" }).exec()
//       const pendingPayments = await this.paymentModel.countDocuments({ status: "pending" }).exec()
      
//       const totalRevenueResult = await this.paymentModel.aggregate([
//         { $match: { status: "completed" } },
//         { $group: { _id: null, total: { $sum: "$totalAmount" } } },
//       ]).exec()

//       const paymentMethodStats = await this.paymentModel.aggregate([
//         { $match: { status: "completed" } },
//         { $group: { _id: "$paymentMethod", count: { $sum: 1 }, total: { $sum: "$totalAmount" } } },
//         { $sort: { total: -1 } },
//       ])

//       return {
//         success: true,
//         data: {
//           totalPayments,
//           completedPayments,
//           totalRevenue: totalRevenueResult[0]?.total || 0,
//           pendingPayments,
//           paymentMethodStats,
//         },
//       }
//     } catch (error) {
//       throw new Error(`Failed to get payment stats: ${error.message}`)
//     }
//   }

//   async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<ApiResponse<Payment>> {
//     try {
//       const payment = await this.paymentModel
//         .findByIdAndUpdate(id, { ...updatePaymentDto, updatedAt: new Date() }, { new: true })
//         .populate("clientId", "firstName lastName email phone")
//         .populate("processedBy", "firstName lastName email")
//         .exec()

//       if (!payment) {
//         throw new NotFoundException("Payment not found")
//       }

//       return {
//         success: true,
//         data: payment,
//         message: "Payment updated successfully",
//       }
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error
//       }
//       throw new Error(`Failed to update payment: ${error.message}`)
//     }
//   }

//   async remove(id: string): Promise<ApiResponse<void>> {
//     try {
//       const result = await this.paymentModel.findByIdAndDelete(id)
//       if (!result) {
//         throw new NotFoundException("Payment not found")
//       }

//       return {
//         success: true,
//         message: "Payment deleted successfully",
//       }
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error
//       }
//       throw new Error(`Failed to delete payment: ${error.message}`)
//     }
//   }

//   //Added

//     async createPaymentFromBooking(
//     booking: any, 
//     transactionReference: string,
//     paymentData: any
//   ): Promise<any> {
//     const paymentItems = booking.services.map(service => ({
//       itemType: 'service',
//       itemId: service.serviceId.toString(),
//       itemName: service.serviceName,
//       quantity: 1,
//       unitPrice: service.price,
//       totalPrice: service.price,
//       discount: 0,
//       tax: service.price * 0.1 // 10% tax
//     }))

//     const subtotal = booking.estimatedTotal
//     const totalTax = paymentItems.reduce((sum, item) => sum + item.tax, 0)

//     const payment = new this.paymentModel({
//       clientId: booking.clientId,
//       bookingId: booking._id, // Link to booking
//       businessId: booking.businessId,
//       paymentReference: await this.generatePaymentReference(),
//       transactionId: transactionReference,
//       items: paymentItems,
//       subtotal,
//       totalTax,
//       totalAmount: subtotal,
//       paymentMethod: paymentData.paymentMethod || 'card',
//       gatewayResponse: paymentData.gateway || 'unknown',
//       status: paymentData.status || 'completed',
//       paidAt: new Date()
//     })

//     return await payment.save()
//   }

//   async createFailedPayment(data: {
//     bookingId: string
//     transactionReference: string
//     errorMessage: string
//     clientId: string
//     businessId: string
//     amount: number
//   }): Promise<any> {
//     const payment = new this.paymentModel({
//       clientId: new Types.ObjectId(data.clientId),
//       bookingId: new Types.ObjectId(data.bookingId),
//       businessId: new Types.ObjectId(data.businessId),
//       paymentReference: data.transactionReference,
//       transactionId: data.transactionReference,
//       items: [],
//       subtotal: data.amount,
//       totalAmount: data.amount,
//       paymentMethod: 'unknown',
//       status: 'failed',
//       gatewayResponse: data.errorMessage
//     })

//     return await payment.save()
//   }

//   //   async initiateRefund(transactionReference: string, amount: number): Promise<void> {
//   //   // Implement refund logic with your payment provider
//   //   // Example for Paystack:
//   //   /*
//   //   const response = await axios.post('https://api.paystack.co/refund', {
//   //     transaction: transactionReference,
//   //     amount: amount * 100 // Convert to kobo
//   //   }, {
//   //     headers: {
//   //       Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
//   //     }
//   //   })
//   //   */
//   //   console.log(`Refund initiated for ${transactionReference}: ${amount}`)
//   // }

//   private async generatePaymentReference(): Promise<string> {
//     const timestamp = Date.now()
//     const random = Math.floor(Math.random() * 1000)
//     return `PAY-${timestamp}-${random}`
//   }


//   // async updatePaymentStatus(
//   //   paymentId: string,
//   //   status: string,
//   //   transactionId?: string
//   // ): Promise<PaymentDocument> {
//   //   const payment = await this.paymentModel.findById(paymentId)
    
//   //   if (!payment) {
//   //     throw new NotFoundException('Payment not found')
//   //   }

//   //   payment.status = status
//   //   if (transactionId) {
//   //     payment.transactionId = transactionId
//   //   }

//   //   if (status === 'completed') {
//   //     payment.paidAt = new Date()
      
//   //     // Send payment confirmation notification
//   //     await this.notificationService.notifyPaymentConfirmation(
//   //       paymentId,
//   //       payment.clientId.toString(),
//   //       payment.businessId.toString(),
//   //       {
//   //         // Payment details for notification
//   //       }
//   //     )
//   //   }

//   //   return await payment.save()
//   // }

//   // async createPaymentForAppointment(
//   //   appointment: any,
//   //   transactionReference?: string,
//   //   paymentData?: any
//   // ): Promise<PaymentDocument> {
//   //   // Your existing payment creation logic
//   //   const payment = new this.paymentModel({
//   //     // ... payment creation logic
//   //   })

//   //   if (transactionReference) {
//   //     payment.transactionId = transactionReference
//   //     payment.paymentReference = transactionReference
//   //   }

//   //   if (paymentData) {
//   //     payment.paymentMethod = paymentData.method
//   //     payment.gatewayResponse = paymentData.gateway
//   //   }

//   //   return await payment.save()
//   // }

//   async getPaymentByAppointment(appointmentId: string): Promise<any> {
//     try {
//       // Assuming you have a Payment model - replace with your actual payment model
//       const payment = await this.paymentModel.findOne({
//         appointmentId: new Types.ObjectId(appointmentId)
//       }).exec()

//       return payment
//     } catch (error) {
//       console.error('Error getting payment by appointment:', error)
//       return null
//     }
//   }



//     /**
//      * Create payment for completed appointment
//      */
//     async createPaymentForAppointment(appointment: any): Promise<any> {
//       try {
//         const paymentData = {
//           appointmentId: appointment._id,
//           clientId: appointment.clientId,
//           businessId: appointment.businessInfo.businessId,
//           amount: appointment.paymentDetails.total.amount,
//           currency: appointment.paymentDetails.total.currency,
//           paymentMethod: appointment.paymentDetails.paymentMethod,
//           status: 'completed', // Since appointment is completed
//           transactionDate: new Date(),
//           description: `Payment for ${appointment.serviceDetails.serviceName}`,
//           serviceDetails: {
//             serviceName: appointment.serviceDetails.serviceName,
//             serviceDescription: appointment.serviceDetails.serviceDescription,
//           },
//           metadata: {
//             appointmentNumber: appointment.appointmentNumber,
//             appointmentDate: appointment.selectedDate,
//             appointmentTime: appointment.selectedTime,
//           }
//         }
  
//         // Create the payment record
//         const payment = new this.paymentModel(paymentData)
//         const savedPayment = await payment.save()
  
//         // Send payment confirmation notification
//         try {
//           await this.notificationService.notifyPaymentConfirmation(
//             savedPayment._id.toString(),
//             appointment.clientId.toString(),
//             appointment.businessInfo.businessId,
//             {
//               clientName: appointment.clientId, // This should be populated with actual client data
//               amount: paymentData.amount,
//               method: paymentData.paymentMethod,
//               transactionId: savedPayment._id.toString(),
//               serviceName: appointment.serviceDetails.serviceName,
//               appointmentDate: appointment.selectedDate,
//               businessName: appointment.businessInfo.businessName,
//               receiptUrl: `${process.env.FRONTEND_URL}/receipts/${savedPayment._id}`,
//               clientEmail: appointment.clientEmail, // Assuming this field exists
//               clientPhone: appointment.clientPhone, // Assuming this field exists
//             }
//           )
//         } catch (notificationError) {
//           console.error('Failed to send payment confirmation notification:', notificationError)
//         }
  
//         return savedPayment
//       } catch (error) {
//         console.error('Error creating payment for appointment:', error)
//         throw error
//       }
//     }
  
//     /**
//      * Update payment status
//      */
//     async updatePaymentStatus(paymentId: string, status: string, metadata?: any): Promise<any> {
//       try {
//         const updateData: any = { 
//           status, 
//           updatedAt: new Date() 
//         }
  
//         if (metadata) {
//           updateData.metadata = { ...updateData.metadata, ...metadata }
//         }
  
//         const payment = await this.paymentModel.findByIdAndUpdate(
//           paymentId,
//           updateData,
//           { new: true }
//         ).exec()
  
//         if (!payment) {
//           throw new NotFoundException('Payment not found')
//         }
  
//         return payment
//       } catch (error) {
//         console.error('Error updating payment status:', error)
//         throw error
//       }
//     }
  
//     /**
//      * Get payments by client
//      */
//     async getPaymentsByClient(clientId: string, limit = 10, offset = 0): Promise<any> {
//       try {
//         const payments = await this.paymentModel
//           .find({ clientId: new Types.ObjectId(clientId) })
//           .sort({ transactionDate: -1 })
//           .limit(limit)
//           .skip(offset)
//           .populate('appointmentId', 'selectedDate selectedTime serviceDetails')
//           .exec()
  
//         const total = await this.paymentModel.countDocuments({ 
//           clientId: new Types.ObjectId(clientId) 
//         })
  
//         return {
//           payments,
//           pagination: {
//             total,
//             limit,
//             offset,
//             hasMore: total > (offset + limit)
//           }
//         }
//       } catch (error) {
//         console.error('Error getting payments by client:', error)
//         throw error
//       }
//     }


// }


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

  /**
   * Initialize payment with Paystack
   */
  async initializePayment(data: {
    email: string
    amount: number
    clientId: string
    appointmentId?: string
    bookingId?: string
    metadata?: any
  }): Promise<ApiResponse<any>> {
    try {
      // Generate payment reference
      const paymentReference = await this.generatePaymentReference()

      // Convert amount to kobo (Paystack uses kobo for NGN)
      const amountInKobo = Math.round(data.amount * 100)

      // Initialize payment with Paystack
      const response = await axios.post(
        `${this.paystackBaseUrl}/transaction/initialize`,
        {
          email: data.email,
          amount: amountInKobo,
          reference: paymentReference,
          callback_url: `${this.configService.get('FRONTEND_URL')}/payment/callback`,
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
        throw new BadRequestException('Failed to initialize payment')
      }

      // Create pending payment record
      const payment = new this.paymentModel({
        clientId: new Types.ObjectId(data.clientId),
        appointmentId: data.appointmentId ? new Types.ObjectId(data.appointmentId) : undefined,
        bookingId: data.bookingId ? new Types.ObjectId(data.bookingId) : undefined,
        paymentReference,
        items: [],
        subtotal: data.amount,
        totalAmount: data.amount,
        paymentMethod: 'online',
        status: 'pending',
        gatewayResponse: JSON.stringify(response.data.data)
      })

      await payment.save()

      return {
        success: true,
        data: {
          authorizationUrl: response.data.data.authorization_url,
          accessCode: response.data.data.access_code,
          reference: paymentReference
        },
        message: 'Payment initialized successfully'
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new BadRequestException(
          error.response?.data?.message || 'Failed to initialize payment with Paystack'
        )
      }
      throw new Error(`Failed to initialize payment: ${error.message}`)
    }
  }

  /**
   * Verify payment with Paystack
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

      // Update payment status based on Paystack response
      const updateData: any = {
        transactionId: transactionData.id.toString(),
        gatewayResponse: JSON.stringify(transactionData),
        updatedAt: new Date()
      }

      if (transactionData.status === 'success') {
        updateData.status = 'completed'
        updateData.paidAt = new Date()

        // Send payment confirmation notification
        try {
          await this.notificationService.notifyPaymentConfirmation(
            payment._id.toString(),
            payment.clientId.toString(),
            transactionData.metadata?.businessId || '',
            {
              amount: payment.totalAmount,
              method: payment.paymentMethod,
              transactionId: transactionData.id.toString(),
              receiptUrl: `${this.configService.get('FRONTEND_URL')}/receipts/${payment._id}`
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
      )

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

  /**
   * Handle Paystack webhook
   */
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

  /**
   * Refund payment via Paystack
   */
  async initiateRefund(transactionReference: string, amount?: number): Promise<ApiResponse<any>> {
    try {
      const payment = await this.paymentModel.findOne({ 
        paymentReference: transactionReference 
      })

      if (!payment) {
        throw new NotFoundException('Payment not found')
      }

      if (payment.status !== 'completed') {
        throw new BadRequestException('Can only refund completed payments')
      }

      const refundAmount = amount || payment.totalAmount
      const amountInKobo = Math.round(refundAmount * 100)

      const response = await axios.post(
        `${this.paystackBaseUrl}/refund`,
        {
          transaction: payment.transactionId || transactionReference,
          amount: amountInKobo
        },
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.data.status) {
        throw new BadRequestException('Refund initiation failed')
      }

      // Update payment record
      const totalRefunded = (payment.refundedAmount || 0) + refundAmount
      const newStatus = totalRefunded === payment.totalAmount ? 'refunded' : 'partially_refunded'

      await this.paymentModel.findByIdAndUpdate(payment._id, {
        refundedAmount: totalRefunded,
        refundedAt: new Date(),
        status: newStatus,
        gatewayResponse: JSON.stringify(response.data.data),
        updatedAt: new Date()
      })

      return {
        success: true,
        data: response.data.data,
        message: 'Refund initiated successfully'
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new BadRequestException(
          error.response?.data?.message || 'Failed to initiate refund'
        )
      }
      throw error
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
}