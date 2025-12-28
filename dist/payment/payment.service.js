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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const payment_schema_1 = require("./schemas/payment.schema");
const booking_schema_1 = require("../booking/schemas/booking.schema");
const notification_service_1 = require("../notification/notification.service");
const mongoose_2 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
let PaymentService = class PaymentService {
    constructor(paymentModel, bookingModel, notificationService, configService) {
        this.paymentModel = paymentModel;
        this.bookingModel = bookingModel;
        this.notificationService = notificationService;
        this.configService = configService;
        this.paystackBaseUrl = 'https://api.paystack.co';
        this.paystackSecretKey = this.configService.get('PAYSTACK_SECRET_KEY');
    }
    async initializePayment(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        try {
            console.log('🚀 Initializing payment with data:', {
                email: data.email,
                amount: data.amount,
                clientId: data.clientId,
                hasMetadata: !!data.metadata,
                hasServices: !!((_a = data.metadata) === null || _a === void 0 ? void 0 : _a.services)
            });
            const paymentReference = await this.generatePaymentReference();
            const amountInKobo = Math.round(data.amount * 100);
            const frontendUrl = this.configService.get('FRONTEND_URL')
                || this.configService.get('APP_URL')
                || 'http://localhost:3001';
            console.log('🔗 Using callback URL:', `${frontendUrl}/payment/callback`);
            const response = await axios_1.default.post(`${this.paystackBaseUrl}/transaction/initialize`, {
                email: data.email,
                amount: amountInKobo,
                reference: paymentReference,
                callback_url: `${frontendUrl}/payment/callback`,
                metadata: Object.assign({ clientId: data.clientId, appointmentId: data.appointmentId, bookingId: data.bookingId, custom_fields: [
                        {
                            display_name: "Client ID",
                            variable_name: "client_id",
                            value: data.clientId
                        }
                    ] }, data.metadata)
            }, {
                headers: {
                    Authorization: `Bearer ${this.paystackSecretKey}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.data.status) {
                throw new common_1.BadRequestException('Failed to initialize payment with Paystack');
            }
            console.log('✅ Paystack initialization successful');
            let paymentItems = [];
            if (((_b = data.metadata) === null || _b === void 0 ? void 0 : _b.services) && Array.isArray(data.metadata.services)) {
                console.log(`📦 Processing ${data.metadata.services.length} services`);
                paymentItems = data.metadata.services.map((service, index) => {
                    const serviceId = service.serviceId || service._id || service.id;
                    let itemId;
                    if (serviceId && mongoose_1.Types.ObjectId.isValid(serviceId)) {
                        itemId = new mongoose_1.Types.ObjectId(serviceId);
                        console.log(`  ✓ Service ${index + 1}: Using provided ID ${itemId}`);
                    }
                    else {
                        itemId = new mongoose_1.Types.ObjectId();
                        console.log(`  ⚠ Service ${index + 1}: Generated new ID ${itemId}`);
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
                    };
                });
            }
            if (paymentItems.length === 0) {
                console.log('📦 No services provided, creating default payment item');
                paymentItems.push({
                    itemType: 'service',
                    itemId: new mongoose_1.Types.ObjectId(),
                    itemName: ((_c = data.metadata) === null || _c === void 0 ? void 0 : _c.serviceName) || 'Payment',
                    quantity: 1,
                    unitPrice: data.amount,
                    totalPrice: data.amount,
                    discount: 0,
                    tax: 0
                });
            }
            console.log(`💰 Creating payment record with ${paymentItems.length} items`);
            const payment = new this.paymentModel({
                clientId: new mongoose_1.Types.ObjectId(data.clientId),
                appointmentId: data.appointmentId ? new mongoose_1.Types.ObjectId(data.appointmentId) : undefined,
                bookingId: data.bookingId ? new mongoose_1.Types.ObjectId(data.bookingId) : undefined,
                businessId: ((_d = data.metadata) === null || _d === void 0 ? void 0 : _d.businessId) ? new mongoose_1.Types.ObjectId(data.metadata.businessId) : undefined,
                paymentReference,
                items: paymentItems,
                subtotal: data.amount,
                totalAmount: data.amount,
                paymentMethod: 'online',
                status: 'pending',
                gatewayResponse: JSON.stringify(response.data.data),
                metadata: data.metadata
            });
            await payment.save();
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
            });
            return {
                success: true,
                data: {
                    authorizationUrl: response.data.data.authorization_url,
                    accessCode: response.data.data.access_code,
                    reference: paymentReference,
                    paymentId: payment._id.toString()
                },
                message: 'Payment initialized successfully'
            };
        }
        catch (error) {
            console.error('❌ Payment initialization error:', {
                message: error.message,
                name: error.name,
                stack: (_e = error.stack) === null || _e === void 0 ? void 0 : _e.split('\n')[0]
            });
            if (axios_1.default.isAxiosError(error)) {
                console.error('🌐 Paystack API error:', {
                    status: (_f = error.response) === null || _f === void 0 ? void 0 : _f.status,
                    data: (_g = error.response) === null || _g === void 0 ? void 0 : _g.data
                });
                throw new common_1.BadRequestException(((_j = (_h = error.response) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.message) || 'Failed to initialize payment with Paystack');
            }
            if (error.name === 'ValidationError') {
                console.error('📋 Validation Error Details:', error.message);
                console.error('📋 Validation Errors:', error.errors);
            }
            throw new Error(`Failed to initialize payment: ${error.message}`);
        }
    }
    async verifyPayment(reference) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        try {
            const response = await axios_1.default.get(`${this.paystackBaseUrl}/transaction/verify/${reference}`, {
                headers: {
                    Authorization: `Bearer ${this.paystackSecretKey}`
                }
            });
            if (!response.data.status) {
                throw new common_1.BadRequestException('Payment verification failed');
            }
            const transactionData = response.data.data;
            const payment = await this.paymentModel.findOne({ paymentReference: reference });
            if (!payment) {
                throw new common_1.NotFoundException('Payment record not found');
            }
            console.log('🔍 Verifying payment:', {
                reference,
                paymentId: payment._id,
                existingClientId: payment.clientId,
                existingBookingId: payment.bookingId,
                status: transactionData.status
            });
            const updateData = {
                transactionId: transactionData.id.toString(),
                gatewayResponse: JSON.stringify(transactionData),
                updatedAt: new Date()
            };
            if (transactionData.status === 'success') {
                updateData.status = 'completed';
                updateData.paidAt = new Date();
                if (!payment.bookingId && ((_a = transactionData.metadata) === null || _a === void 0 ? void 0 : _a.bookingId)) {
                    updateData.bookingId = new mongoose_1.Types.ObjectId(transactionData.metadata.bookingId);
                }
                if (!payment.clientId && ((_b = transactionData.metadata) === null || _b === void 0 ? void 0 : _b.clientId)) {
                    updateData.clientId = new mongoose_1.Types.ObjectId(transactionData.metadata.clientId);
                }
                if (payment.bookingId) {
                    try {
                        await this.bookingModel.findByIdAndUpdate(payment.bookingId, {
                            status: 'confirmed',
                            updatedAt: new Date()
                        });
                        console.log('✅ Booking status updated to confirmed:', payment.bookingId);
                    }
                    catch (bookingError) {
                        console.error('❌ Failed to update booking status:', bookingError);
                    }
                }
                try {
                    await this.notificationService.notifyPaymentConfirmation(payment._id.toString(), ((_c = payment.clientId) === null || _c === void 0 ? void 0 : _c.toString()) || ((_d = transactionData.metadata) === null || _d === void 0 ? void 0 : _d.clientId), ((_e = transactionData.metadata) === null || _e === void 0 ? void 0 : _e.businessId) || '', {
                        clientName: (_f = transactionData.metadata) === null || _f === void 0 ? void 0 : _f.clientName,
                        amount: payment.totalAmount,
                        method: payment.paymentMethod,
                        transactionId: transactionData.id.toString(),
                        serviceName: (_h = (_g = transactionData.metadata) === null || _g === void 0 ? void 0 : _g.services) === null || _h === void 0 ? void 0 : _h.map((s) => s.serviceName).join(', '),
                        appointmentDate: (_j = transactionData.metadata) === null || _j === void 0 ? void 0 : _j.preferredDate,
                        businessName: 'Business Name',
                        receiptUrl: `${this.configService.get('FRONTEND_URL')}/receipts/${payment._id}`,
                        clientEmail: (_k = transactionData.customer) === null || _k === void 0 ? void 0 : _k.email,
                        clientPhone: (_l = transactionData.metadata) === null || _l === void 0 ? void 0 : _l.clientPhone
                    });
                }
                catch (notificationError) {
                    console.error('Failed to send payment confirmation:', notificationError);
                }
            }
            else if (transactionData.status === 'failed') {
                updateData.status = 'failed';
                if (payment.bookingId) {
                    try {
                        await this.bookingModel.findByIdAndUpdate(payment.bookingId, {
                            status: 'payment_failed',
                            updatedAt: new Date()
                        });
                        console.log('✅ Booking status updated to payment_failed:', payment.bookingId);
                    }
                    catch (bookingError) {
                        console.error('❌ Failed to update booking status:', bookingError);
                    }
                }
            }
            else {
                updateData.status = 'processing';
            }
            const updatedPayment = await this.paymentModel.findByIdAndUpdate(payment._id, updateData, { new: true, runValidators: true }).populate('clientId', 'firstName lastName email')
                .populate('bookingId');
            console.log('✅ Payment updated:', {
                paymentId: updatedPayment._id,
                status: updatedPayment.status,
                clientId: updatedPayment.clientId,
                bookingId: updatedPayment.bookingId,
                itemsCount: updatedPayment.items.length
            });
            return {
                success: true,
                data: updatedPayment,
                message: `Payment ${transactionData.status}`
            };
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                throw new common_1.BadRequestException(((_o = (_m = error.response) === null || _m === void 0 ? void 0 : _m.data) === null || _o === void 0 ? void 0 : _o.message) || 'Failed to verify payment with Paystack');
            }
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to verify payment: ${error.message}`);
        }
    }
    async handleWebhook(payload, signature) {
        try {
            const crypto = require('crypto');
            const hash = crypto
                .createHmac('sha512', this.paystackSecretKey)
                .update(JSON.stringify(payload))
                .digest('hex');
            if (hash !== signature) {
                throw new common_1.BadRequestException('Invalid webhook signature');
            }
            const event = payload.event;
            switch (event) {
                case 'charge.success':
                    await this.handleSuccessfulCharge(payload.data);
                    break;
                case 'charge.failed':
                    await this.handleFailedCharge(payload.data);
                    break;
                case 'transfer.success':
                case 'transfer.failed':
                    break;
                default:
                    console.log(`Unhandled webhook event: ${event}`);
            }
        }
        catch (error) {
            console.error('Webhook handling error:', error);
            throw error;
        }
    }
    async handleSuccessfulCharge(data) {
        const payment = await this.paymentModel.findOne({
            paymentReference: data.reference
        });
        if (payment && payment.status !== 'completed') {
            await this.paymentModel.findByIdAndUpdate(payment._id, {
                status: 'completed',
                transactionId: data.id.toString(),
                paidAt: new Date(),
                gatewayResponse: JSON.stringify(data),
                updatedAt: new Date()
            });
        }
    }
    async handleFailedCharge(data) {
        const payment = await this.paymentModel.findOne({
            paymentReference: data.reference
        });
        if (payment) {
            await this.paymentModel.findByIdAndUpdate(payment._id, {
                status: 'failed',
                gatewayResponse: JSON.stringify(data),
                updatedAt: new Date()
            });
        }
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
    async generatePaymentReference() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `PAY-${timestamp}-${random}`;
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
    async createPaymentFromBooking(booking, transactionReference, paymentInfo) {
        try {
            const paymentMethodMap = {
                'card': 'card',
                'bank_transfer': 'bank_transfer',
                'mobile_money': 'mobile_money',
                'crypto': 'crypto',
                'cash': 'cash',
                'online': 'online'
            };
            const mappedMethod = paymentMethodMap[paymentInfo.paymentMethod] || 'online';
            const paymentData = {
                clientId: new mongoose_1.Types.ObjectId(booking.clientId.toString()),
                bookingId: new mongoose_1.Types.ObjectId(booking._id.toString()),
                businessId: new mongoose_1.Types.ObjectId(booking.businessId.toString()),
                paymentReference: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                transactionId: transactionReference,
                items: booking.services.map((service) => ({
                    itemType: 'service',
                    itemId: new mongoose_1.Types.ObjectId(service.serviceId.toString()),
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
                paymentMethod: mappedMethod,
                gateway: paymentInfo.gateway,
                status: paymentInfo.status || 'completed',
                paidAt: new Date(),
                metadata: {
                    bookingNumber: booking.bookingNumber,
                    clientName: booking.clientName,
                    clientEmail: booking.clientEmail,
                    serviceName: booking.services.map((s) => s.serviceName).join(', ')
                }
            };
            const paymentRecord = new this.paymentModel(paymentData);
            await paymentRecord.save();
            console.log('✅ Payment record created:', paymentRecord._id.toString());
            return JSON.parse(JSON.stringify(paymentRecord));
        }
        catch (error) {
            console.error('❌ Failed to create payment record:', error.message);
            throw new common_1.BadRequestException(`Failed to create payment record: ${error.message}`);
        }
    }
    async createFailedPayment(data) {
        try {
            const failedPaymentData = {
                clientId: new mongoose_1.Types.ObjectId(data.clientId),
                bookingId: new mongoose_1.Types.ObjectId(data.bookingId),
                businessId: new mongoose_1.Types.ObjectId(data.businessId),
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
            };
            const failedPayment = new this.paymentModel(failedPaymentData);
            await failedPayment.save();
            return JSON.parse(JSON.stringify(failedPayment));
        }
        catch (error) {
            console.error('❌ Failed to create failed payment record:', error.message);
            throw new common_1.BadRequestException(`Failed to create failed payment record: ${error.message}`);
        }
    }
    async updatePaymentStatus(paymentId, status, transactionReference) {
        try {
            const updateData = {
                status,
                transactionId: transactionReference
            };
            if (status === 'completed') {
                updateData.paidAt = new Date();
            }
            const payment = await this.paymentModel.findByIdAndUpdate(paymentId, updateData, { new: true }).exec();
            if (!payment) {
                throw new common_1.NotFoundException(`Payment ${paymentId} not found`);
            }
            console.log('✅ Payment status updated:', status);
            return JSON.parse(JSON.stringify(payment));
        }
        catch (error) {
            console.error('❌ Failed to update payment status:', error.message);
            throw new common_1.BadRequestException(`Failed to update payment status: ${error.message}`);
        }
    }
    async getPaymentByBookingId(bookingId) {
        try {
            const payment = await this.paymentModel
                .findOne({ bookingId: new mongoose_1.Types.ObjectId(bookingId) })
                .exec();
            if (!payment) {
                return null;
            }
            return JSON.parse(JSON.stringify(payment));
        }
        catch (error) {
            console.error('❌ Failed to get payment by booking ID:', error.message);
            return null;
        }
    }
    async initiateRefund(transactionReference, amount) {
        try {
            console.log(`💰 Initiating refund for transaction: ${transactionReference}, amount: ${amount}`);
            await this.paymentModel.updateOne({ transactionId: transactionReference }, {
                status: 'refunded',
                refundedAmount: amount,
                refundedAt: new Date()
            }).exec();
            console.log('✅ Refund initiated successfully');
        }
        catch (error) {
            console.error('❌ Failed to initiate refund:', error.message);
            throw new common_1.BadRequestException(`Failed to initiate refund: ${error.message}`);
        }
    }
};
PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(payment_schema_1.Payment.name)),
    __param(0, (0, mongoose_2.InjectModel)(payment_schema_1.Payment.name)),
    __param(1, (0, mongoose_2.InjectModel)(booking_schema_1.Booking.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        notification_service_1.NotificationService,
        config_1.ConfigService])
], PaymentService);
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map