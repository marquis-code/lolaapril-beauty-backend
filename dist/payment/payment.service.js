"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const payment_schema_1 = require("./schemas/payment.schema");
const notification_service_1 = require("../notification/notification.service");
const mongoose_2 = require("@nestjs/mongoose");
let PaymentService = class PaymentService {
    constructor(paymentModel, notificationService) {
        this.paymentModel = paymentModel;
        this.notificationService = notificationService;
    }
    async create(createPaymentDto) {
        try {
            const payment = new this.paymentModel(createPaymentDto);
            const savedPayment = await payment.save();
            return {
                success: true,
                data: savedPayment,
                message: "Payment created successfully",
            };
        }
        catch (error) {
            throw new Error(`Failed to create payment: ${error.message}`);
        }
    }
    async findAll() {
        try {
            const payments = await this.paymentModel
                .find()
                .populate("clientId", "profile.firstName profile.lastName profile.email")
                .sort({ createdAt: -1 });
            return {
                success: true,
                data: payments,
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch payments: ${error.message}`);
        }
    }
    async findAllWithQuery(query) {
        const { page = 1, limit = 10, clientId, appointmentId, bookingId, status, paymentMethod, startDate, endDate, search, sortBy = "createdAt", sortOrder = "desc", } = query;
        const filter = {};
        if (clientId)
            filter.clientId = clientId;
        if (appointmentId)
            filter.appointmentId = appointmentId;
        if (bookingId)
            filter.bookingId = bookingId;
        if (status)
            filter.status = status;
        if (paymentMethod)
            filter.paymentMethod = paymentMethod;
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate)
                filter.createdAt.$gte = new Date(startDate);
            if (endDate)
                filter.createdAt.$lte = new Date(endDate);
        }
        if (search) {
            filter.$or = [
                { paymentReference: { $regex: search, $options: "i" } },
                { transactionId: { $regex: search, $options: "i" } },
                { notes: { $regex: search, $options: "i" } },
            ];
        }
        const skip = (page - 1) * limit;
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
        const payments = await this.paymentModel
            .find(filter)
            .populate("clientId", "firstName lastName email phone")
            .populate("appointmentId", "selectedDate selectedTime")
            .populate("bookingId", "bookingDate startTime")
            .populate("processedBy", "firstName lastName email")
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .exec();
        const total = await this.paymentModel.countDocuments(filter).exec();
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
        };
    }
    async findOne(id) {
        try {
            const payment = await this.paymentModel
                .findById(id)
                .populate("clientId", "profile.firstName profile.lastName profile.email");
            if (!payment) {
                throw new common_1.NotFoundException("Payment not found");
            }
            return {
                success: true,
                data: payment,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to fetch payment: ${error.message}`);
        }
    }
    async updateStatus(id, status, transactionId) {
        try {
            const updateData = { status, updatedAt: new Date() };
            if (status === "completed") {
                updateData.paidAt = new Date();
            }
            if (transactionId) {
                updateData.transactionId = transactionId;
            }
            const payment = await this.paymentModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
            if (!payment) {
                throw new common_1.NotFoundException("Payment not found");
            }
            return {
                success: true,
                data: payment,
                message: "Payment status updated successfully",
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to update payment status: ${error.message}`);
        }
    }
    async processRefund(id, refundAmount, refundReason) {
        try {
            const payment = await this.paymentModel.findById(id);
            if (!payment) {
                throw new common_1.NotFoundException("Payment not found");
            }
            if (payment.status !== "completed") {
                throw new Error("Can only refund completed payments");
            }
            const totalRefunded = (payment.refundedAmount || 0) + refundAmount;
            if (totalRefunded > payment.totalAmount) {
                throw new Error("Refund amount exceeds payment total");
            }
            const newStatus = totalRefunded === payment.totalAmount ? "refunded" : "partially_refunded";
            const updatedPayment = await this.paymentModel.findByIdAndUpdate(id, {
                refundedAmount: totalRefunded,
                refundedAt: new Date(),
                refundReason,
                status: newStatus,
                updatedAt: new Date(),
            }, { new: true, runValidators: true });
            return {
                success: true,
                data: updatedPayment,
                message: "Refund processed successfully",
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to process refund: ${error.message}`);
        }
    }
    async getPaymentStats() {
        var _a;
        try {
            const totalPayments = await this.paymentModel.countDocuments().exec();
            const completedPayments = await this.paymentModel.countDocuments({ status: "completed" }).exec();
            const pendingPayments = await this.paymentModel.countDocuments({ status: "pending" }).exec();
            const totalRevenueResult = await this.paymentModel.aggregate([
                { $match: { status: "completed" } },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } },
            ]).exec();
            const paymentMethodStats = await this.paymentModel.aggregate([
                { $match: { status: "completed" } },
                { $group: { _id: "$paymentMethod", count: { $sum: 1 }, total: { $sum: "$totalAmount" } } },
                { $sort: { total: -1 } },
            ]);
            return {
                success: true,
                data: {
                    totalPayments,
                    completedPayments,
                    totalRevenue: ((_a = totalRevenueResult[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
                    pendingPayments,
                    paymentMethodStats,
                },
            };
        }
        catch (error) {
            throw new Error(`Failed to get payment stats: ${error.message}`);
        }
    }
    async update(id, updatePaymentDto) {
        try {
            const payment = await this.paymentModel
                .findByIdAndUpdate(id, Object.assign(Object.assign({}, updatePaymentDto), { updatedAt: new Date() }), { new: true })
                .populate("clientId", "firstName lastName email phone")
                .populate("processedBy", "firstName lastName email")
                .exec();
            if (!payment) {
                throw new common_1.NotFoundException("Payment not found");
            }
            return {
                success: true,
                data: payment,
                message: "Payment updated successfully",
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to update payment: ${error.message}`);
        }
    }
    async remove(id) {
        try {
            const result = await this.paymentModel.findByIdAndDelete(id);
            if (!result) {
                throw new common_1.NotFoundException("Payment not found");
            }
            return {
                success: true,
                message: "Payment deleted successfully",
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to delete payment: ${error.message}`);
        }
    }
    async createPaymentFromBooking(booking, transactionReference, paymentData) {
        const paymentItems = booking.services.map(service => ({
            itemType: 'service',
            itemId: service.serviceId.toString(),
            itemName: service.serviceName,
            quantity: 1,
            unitPrice: service.price,
            totalPrice: service.price,
            discount: 0,
            tax: service.price * 0.1
        }));
        const subtotal = booking.estimatedTotal;
        const totalTax = paymentItems.reduce((sum, item) => sum + item.tax, 0);
        const payment = new this.paymentModel({
            clientId: booking.clientId,
            bookingId: booking._id,
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
        });
        return await payment.save();
    }
    async createFailedPayment(data) {
        const payment = new this.paymentModel({
            clientId: new mongoose_1.Types.ObjectId(data.clientId),
            bookingId: new mongoose_1.Types.ObjectId(data.bookingId),
            businessId: new mongoose_1.Types.ObjectId(data.businessId),
            paymentReference: data.transactionReference,
            transactionId: data.transactionReference,
            items: [],
            subtotal: data.amount,
            totalAmount: data.amount,
            paymentMethod: 'unknown',
            status: 'failed',
            gatewayResponse: data.errorMessage
        });
        return await payment.save();
    }
    async initiateRefund(transactionReference, amount) {
        console.log(`Refund initiated for ${transactionReference}: ${amount}`);
    }
    async generatePaymentReference() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `PAY-${timestamp}-${random}`;
    }
    async getPaymentByAppointment(appointmentId) {
        try {
            const payment = await this.paymentModel.findOne({
                appointmentId: new mongoose_1.Types.ObjectId(appointmentId)
            }).exec();
            return payment;
        }
        catch (error) {
            console.error('Error getting payment by appointment:', error);
            return null;
        }
    }
    async createPaymentForAppointment(appointment) {
        try {
            const paymentData = {
                appointmentId: appointment._id,
                clientId: appointment.clientId,
                businessId: appointment.businessInfo.businessId,
                amount: appointment.paymentDetails.total.amount,
                currency: appointment.paymentDetails.total.currency,
                paymentMethod: appointment.paymentDetails.paymentMethod,
                status: 'completed',
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
            };
            const payment = new this.paymentModel(paymentData);
            const savedPayment = await payment.save();
            try {
                await this.notificationService.notifyPaymentConfirmation(savedPayment._id.toString(), appointment.clientId.toString(), appointment.businessInfo.businessId, {
                    clientName: appointment.clientId,
                    amount: paymentData.amount,
                    method: paymentData.paymentMethod,
                    transactionId: savedPayment._id.toString(),
                    serviceName: appointment.serviceDetails.serviceName,
                    appointmentDate: appointment.selectedDate,
                    businessName: appointment.businessInfo.businessName,
                    receiptUrl: `${process.env.FRONTEND_URL}/receipts/${savedPayment._id}`,
                    clientEmail: appointment.clientEmail,
                    clientPhone: appointment.clientPhone,
                });
            }
            catch (notificationError) {
                console.error('Failed to send payment confirmation notification:', notificationError);
            }
            return savedPayment;
        }
        catch (error) {
            console.error('Error creating payment for appointment:', error);
            throw error;
        }
    }
    async updatePaymentStatus(paymentId, status, metadata) {
        try {
            const updateData = {
                status,
                updatedAt: new Date()
            };
            if (metadata) {
                updateData.metadata = Object.assign(Object.assign({}, updateData.metadata), metadata);
            }
            const payment = await this.paymentModel.findByIdAndUpdate(paymentId, updateData, { new: true }).exec();
            if (!payment) {
                throw new common_1.NotFoundException('Payment not found');
            }
            return payment;
        }
        catch (error) {
            console.error('Error updating payment status:', error);
            throw error;
        }
    }
    async getPaymentsByClient(clientId, limit = 10, offset = 0) {
        try {
            const payments = await this.paymentModel
                .find({ clientId: new mongoose_1.Types.ObjectId(clientId) })
                .sort({ transactionDate: -1 })
                .limit(limit)
                .skip(offset)
                .populate('appointmentId', 'selectedDate selectedTime serviceDetails')
                .exec();
            const total = await this.paymentModel.countDocuments({
                clientId: new mongoose_1.Types.ObjectId(clientId)
            });
            return {
                payments,
                pagination: {
                    total,
                    limit,
                    offset,
                    hasMore: total > (offset + limit)
                }
            };
        }
        catch (error) {
            console.error('Error getting payments by client:', error);
            throw error;
        }
    }
};
PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(payment_schema_1.Payment.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        notification_service_1.NotificationService])
], PaymentService);
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map