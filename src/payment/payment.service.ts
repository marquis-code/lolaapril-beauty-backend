import { Injectable, NotFoundException } from "@nestjs/common"
import { Model } from "mongoose"
import { Payment, PaymentDocument } from "./schemas/payment.schema"
import { CreatePaymentDto } from "./dto/create-payment.dto"
import { ApiResponse } from "../common/interfaces/common.interface"
import { PaymentQueryDto } from "./dto/payment-query.dto"
import { UpdatePaymentDto } from "./dto/update-payment.dto"
import { InjectModel } from "@nestjs/mongoose"

@Injectable()
export class PaymentService {
  constructor(@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>) {}

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
}
