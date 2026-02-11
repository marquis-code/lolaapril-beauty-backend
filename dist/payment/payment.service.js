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
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const payment_schema_1 = require("./schemas/payment.schema");
const booking_schema_1 = require("../booking/schemas/booking.schema");
const business_schema_1 = require("../business/schemas/business.schema");
const notification_service_1 = require("../notification/notification.service");
const pricing_service_1 = require("../pricing/pricing.service");
const commission_service_1 = require("../commission/services/commission.service");
const gateway_manager_service_1 = require("../integration/gateway-manager.service");
const jobs_service_1 = require("../jobs/jobs.service");
const cache_service_1 = require("../cache/cache.service");
const business_service_1 = require("../business/business.service");
let PaymentService = class PaymentService {
    constructor(paymentModel, bookingModel, businessModel, notificationService, configService, pricingService, commissionService, gatewayManager, jobsService, cacheService, businessService) {
        this.paymentModel = paymentModel;
        this.bookingModel = bookingModel;
        this.businessModel = businessModel;
        this.notificationService = notificationService;
        this.configService = configService;
        this.pricingService = pricingService;
        this.commissionService = commissionService;
        this.gatewayManager = gatewayManager;
        this.jobsService = jobsService;
        this.cacheService = cacheService;
        this.businessService = businessService;
        this.paystackBaseUrl = 'https://api.paystack.co';
        this.paystackSecretKey = this.configService.get('PAYSTACK_SECRET_KEY');
    }
    async getUserTransactions(userId) {
        try {
            const payments = await this.paymentModel
                .find({ clientId: new mongoose_2.Types.ObjectId(userId) })
                .populate({ path: 'bookingId', select: 'bookingReference scheduledDate status' })
                .populate({ path: 'appointmentId', select: 'appointmentReference scheduledDate status' })
                .populate({ path: 'businessId', select: 'businessName subdomain' })
                .sort({ createdAt: -1 })
                .exec();
            return {
                success: true,
                data: payments,
                message: 'User transactions retrieved successfully',
            };
        }
        catch (error) {
            console.error('❌ Error fetching user transactions:', error.message);
            throw new common_1.BadRequestException(`Failed to fetch user transactions: ${error.message}`);
        }
    }
    async resolveBusinessId(businessId, subdomain) {
        if (!businessId && !subdomain) {
            throw new common_1.BadRequestException('Either businessId or subdomain must be provided');
        }
        if (businessId) {
            return businessId;
        }
        const business = await this.businessService.getBySubdomain(subdomain);
        if (!business) {
            throw new common_1.NotFoundException(`Business not found with subdomain: ${subdomain}`);
        }
        return business._id.toString();
    }
    async initializePayment(data) {
        try {
            const businessId = await this.resolveBusinessId(data.businessId, data.subdomain);
            console.log('🚀 Initializing payment with data:', {
                email: data.email,
                amount: data.amount,
                clientId: data.clientId,
                businessId,
                gateway: data.gateway || 'paystack',
            });
            const business = await this.businessService.getById(businessId);
            const feeCalculation = await this.pricingService.calculateFees(businessId, data.amount);
            console.log('💰 Fee calculation:', feeCalculation);
            const paymentReference = await this.generatePaymentReference();
            const gateway = data.gateway || 'paystack';
            const frontendUrl = this.configService.get('FRONTEND_URL')
                || this.configService.get('APP_URL')
                || 'http://localhost:3001';
            const enrichedMetadata = {
                ...data.metadata,
                clientId: data.clientId,
                businessId,
                appointmentId: data.appointmentId,
                bookingId: data.bookingId,
                paymentReference,
                feeCalculation,
                callback_url: `${frontendUrl}/payment/callback`,
            };
            if (business.paymentSettings?.paystackSubaccountCode) {
                enrichedMetadata.subaccount = business.paymentSettings.paystackSubaccountCode;
                enrichedMetadata.platformFee = feeCalculation.totalPlatformFee;
                console.log('✅ Using subaccount for payment split:', {
                    subaccount: business.paymentSettings.paystackSubaccountCode,
                    platformFee: feeCalculation.totalPlatformFee,
                    businessReceives: feeCalculation.businessReceives,
                });
            }
            else {
                console.warn('⚠️ Business does not have a subaccount. Payment will not be split automatically.');
            }
            const gatewayResponse = await this.gatewayManager.processPayment(gateway, data.amount, {
                email: data.email,
                metadata: enrichedMetadata,
                reference: paymentReference,
            });
            const paymentItems = this.buildPaymentItems(data.metadata, data.amount);
            console.log(`💳 Creating payment record with ${paymentItems.length} items`);
            const paymentData = {
                clientId: new mongoose_2.Types.ObjectId(data.clientId),
                appointmentId: data.appointmentId ? new mongoose_2.Types.ObjectId(data.appointmentId) : undefined,
                bookingId: data.bookingId ? new mongoose_2.Types.ObjectId(data.bookingId) : undefined,
                businessId: new mongoose_2.Types.ObjectId(businessId),
                paymentReference,
                items: paymentItems,
                subtotal: feeCalculation.bookingAmount,
                totalAmount: data.amount,
                paymentMethod: 'online',
                gateway,
                status: 'pending',
                gatewayResponse: JSON.stringify(gatewayResponse),
                metadata: enrichedMetadata,
            };
            if (feeCalculation.totalPlatformFee !== undefined) {
                paymentData.platformFee = feeCalculation.totalPlatformFee;
            }
            if (feeCalculation.businessReceives !== undefined) {
                paymentData.businessReceives = feeCalculation.businessReceives;
            }
            const payment = new this.paymentModel(paymentData);
            await payment.save();
            console.log('✅ Payment initialized successfully:', {
                paymentId: payment._id,
                reference: paymentReference,
                gateway,
            });
            return {
                success: true,
                data: {
                    authorizationUrl: gatewayResponse.authorization_url || gatewayResponse.authorizationUrl,
                    accessCode: gatewayResponse.access_code || gatewayResponse.accessCode,
                    reference: paymentReference,
                    paymentId: payment._id.toString(),
                    feeBreakdown: feeCalculation,
                },
                message: 'Payment initialized successfully',
            };
        }
        catch (error) {
            console.error('❌ Payment initialization error:', error.message);
            throw new common_1.BadRequestException(`Failed to initialize payment: ${error.message}`);
        }
    }
    async verifyPayment(reference) {
        try {
            const cacheKey = `payment:verified:${reference}`;
            const cached = await this.cacheService.get(cacheKey);
            if (cached) {
                console.log('✅ Payment verification from cache');
                return cached;
            }
            const payment = await this.paymentModel.findOne({ paymentReference: reference });
            if (!payment) {
                throw new common_1.NotFoundException('Payment record not found');
            }
            console.log('🔍 Verifying payment:', {
                reference,
                paymentId: payment._id,
                gateway: payment.gateway,
                status: payment.status,
            });
            if (payment.status === 'completed') {
                const result = {
                    success: true,
                    data: payment,
                    message: 'Payment already completed',
                };
                await this.cacheService.set(cacheKey, result, 3600);
                return result;
            }
            const gatewayResponse = await this.gatewayManager.verifyPayment(payment.gateway || 'paystack', reference);
            console.log('🔐 Gateway verification response:', gatewayResponse.status);
            const updateData = {
                gatewayResponse: JSON.stringify(gatewayResponse),
                updatedAt: new Date(),
            };
            if (gatewayResponse.status === 'success') {
                updateData.status = 'completed';
                updateData.paidAt = new Date();
                updateData.transactionId = gatewayResponse.id?.toString() || gatewayResponse.reference;
                if (payment.bookingId) {
                    try {
                        const booking = await this.bookingModel.findByIdAndUpdate(payment.bookingId, {
                            status: 'confirmed',
                            updatedAt: new Date(),
                            $unset: { expiresAt: 1 },
                        }, { new: true });
                        console.log('✅ Booking status updated to confirmed and expiresAt cleared');
                        if (booking && payment.businessId) {
                            try {
                                const commissionCalc = await this.commissionService.calculateBookingCommission(booking);
                                await this.commissionService.updateBookingCommission(booking._id.toString(), {
                                    commissionRate: commissionCalc.commissionRate,
                                    commissionAmount: commissionCalc.commissionAmount,
                                    platformFee: commissionCalc.platformFee,
                                    processingFee: commissionCalc.processingFee,
                                });
                                console.log('✅ Commission calculated and updated');
                            }
                            catch (commissionError) {
                                console.error('❌ Failed to calculate commission:', commissionError);
                            }
                        }
                    }
                    catch (bookingError) {
                        console.error('❌ Failed to update booking status:', bookingError);
                    }
                }
                if (payment.businessId && payment.totalAmount) {
                    try {
                        const platformFee = payment.platformFee || payment.totalAmount * 0.05;
                        const businessReceivesAmount = payment.totalAmount - platformFee;
                        await this.jobsService.schedulePayout(payment.businessId.toString(), businessReceivesAmount, 'weekly');
                        console.log('✅ Payout job scheduled');
                    }
                    catch (payoutError) {
                        console.error('❌ Failed to schedule payout:', payoutError);
                    }
                }
                try {
                    await this.notificationService.notifyPaymentConfirmation(payment._id.toString(), payment.clientId.toString(), payment.businessId?.toString() || '', {
                        clientName: gatewayResponse.customer?.name || 'Customer',
                        amount: payment.totalAmount,
                        method: payment.paymentMethod,
                        transactionId: updateData.transactionId,
                        serviceName: payment.items.map(item => item.itemName).join(', '),
                        appointmentDate: payment.metadata?.preferredDate,
                        businessName: payment.metadata?.businessName || 'Business',
                        receiptUrl: `${this.configService.get('FRONTEND_URL')}/receipts/${payment._id}`,
                        clientEmail: gatewayResponse.customer?.email || payment.metadata?.clientEmail,
                        clientPhone: payment.metadata?.clientPhone,
                    });
                    console.log('✅ Payment confirmation notification sent');
                }
                catch (notificationError) {
                    console.error('❌ Failed to send notification:', notificationError);
                }
            }
            else if (gatewayResponse.status === 'failed') {
                updateData.status = 'failed';
                if (payment.bookingId) {
                    try {
                        await this.bookingModel.findByIdAndUpdate(payment.bookingId, {
                            status: 'payment_failed',
                            updatedAt: new Date(),
                        });
                        console.log('✅ Booking status updated to payment_failed');
                    }
                    catch (bookingError) {
                        console.error('❌ Failed to update booking status:', bookingError);
                    }
                }
            }
            else {
                updateData.status = 'processing';
            }
            const updatedPayment = await this.paymentModel.findByIdAndUpdate(payment._id, updateData, { new: true, runValidators: true })
                .populate('clientId', 'firstName lastName email')
                .populate('bookingId')
                .exec();
            console.log('✅ Payment updated:', {
                paymentId: updatedPayment._id,
                status: updatedPayment.status,
            });
            const result = {
                success: true,
                data: updatedPayment,
                message: `Payment ${gatewayResponse.status}`,
            };
            if (updatedPayment.status === 'completed') {
                await this.cacheService.set(cacheKey, result, 3600);
            }
            return result;
        }
        catch (error) {
            console.error('❌ Payment verification error:', error.message);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            if (axios_1.default.isAxiosError(error)) {
                throw new common_1.BadRequestException(error.response?.data?.message || 'Failed to verify payment');
            }
            throw new common_1.BadRequestException(`Failed to verify payment: ${error.message}`);
        }
    }
    async handleWebhook(payload, signature, source) {
        try {
            const crypto = require('crypto');
            const hash = crypto
                .createHmac('sha512', this.paystackSecretKey)
                .update(JSON.stringify(payload))
                .digest('hex');
            if (hash !== signature) {
                throw new common_1.BadRequestException('Invalid webhook signature');
            }
            console.log(`📨 Processing ${source} webhook:`, payload.event);
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
                    console.log(`Transfer event: ${event}`);
                    break;
                default:
                    console.log(`Unhandled webhook event: ${event}`);
            }
        }
        catch (error) {
            console.error('❌ Webhook handling error:', error);
            throw error;
        }
    }
    async handleSuccessfulCharge(data) {
        let payment = await this.paymentModel.findOne({
            paymentReference: data.reference
        });
        if (!payment && data.metadata?.reference) {
            console.log('⚠️ Webhook: Payment not found with Paystack reference, trying backend reference from metadata');
            payment = await this.paymentModel.findOne({
                paymentReference: data.metadata.reference
            });
        }
        if (!payment && data.metadata?.metadata?.paymentReference) {
            console.log('⚠️ Webhook: Trying nested metadata.metadata.paymentReference');
            payment = await this.paymentModel.findOne({
                paymentReference: data.metadata.metadata.paymentReference
            });
        }
        if (!payment) {
            console.log('\n🔴 ========================================');
            console.log('⚠️ WEBHOOK ERROR: Payment Record Not Found');
            console.log('========================================');
            console.log('📌 Top-level reference:', data.reference);
            console.log('📌 Metadata reference:', data.metadata?.reference);
            console.log('📌 Nested metadata reference:', data.metadata?.metadata?.paymentReference);
            console.log('📌 Expected format: PAY-{timestamp}-{random}');
            console.log('\n💡 ISSUE:');
            console.log('   Paystack is NOT using the backend-generated reference.');
            console.log('   This means the reference field was not passed correctly to Paystack API.');
            console.log('\n✅ SOLUTION:');
            console.log('   Restart the backend to apply the Paystack service fix.');
            console.log('   The fix ensures the reference is passed at the root level of the payload.');
            console.log('\n📋 Full webhook data:');
            console.log(JSON.stringify(data, null, 2));
            console.log('========================================\n');
            return;
        }
        console.log('✅ Payment found:', {
            paymentId: payment._id,
            reference: payment.paymentReference,
            webhookTopLevelRef: data.reference,
            webhookMetadataRef: data.metadata?.reference
        });
        if (payment.status === 'completed') {
            console.log('✅ Webhook: Payment already processed (idempotent check)', {
                reference: data.reference,
                paymentId: payment._id,
                status: payment.status
            });
            return;
        }
        const cacheKey = `webhook:processing:${data.reference}`;
        const isProcessing = await this.cacheService.get(cacheKey);
        if (isProcessing) {
            console.log('⏳ Webhook: Already processing this payment, skipping duplicate');
            return;
        }
        await this.cacheService.set(cacheKey, 'processing', 60);
        try {
            console.log('🎉 Webhook: Processing successful payment', {
                reference: data.reference,
                amount: data.amount,
                paymentId: payment._id,
                currentStatus: payment.status
            });
            await this.verifyPayment(data.reference);
            console.log('✅ Webhook: Full payment verification completed');
            await this.cacheService.set(`webhook:completed:${data.reference}`, 'done', 86400);
        }
        catch (verifyError) {
            console.error('❌ Webhook: Payment verification failed:', verifyError.message);
            await this.paymentModel.findByIdAndUpdate(payment._id, {
                status: 'completed',
                transactionId: data.id.toString(),
                paidAt: new Date(),
                gatewayResponse: JSON.stringify(data),
                updatedAt: new Date(),
            });
            if (payment.bookingId) {
                await this.bookingModel.findByIdAndUpdate(payment.bookingId, { status: 'confirmed', updatedAt: new Date() });
            }
            console.log('✅ Webhook: Payment status updated (fallback)');
        }
        finally {
            await this.cacheService.del(cacheKey);
        }
    }
    async handleFailedCharge(data) {
        const payment = await this.paymentModel.findOne({
            paymentReference: data.reference
        });
        if (!payment) {
            console.log('⚠️ Webhook: Payment record not found for reference:', data.reference);
            return;
        }
        if (payment.status === 'failed') {
            console.log('✅ Webhook: Payment already marked as failed (idempotent check)');
            return;
        }
        await this.paymentModel.findByIdAndUpdate(payment._id, {
            status: 'failed',
            gatewayResponse: JSON.stringify(data),
            updatedAt: new Date(),
        });
        if (payment.bookingId) {
            await this.bookingModel.findByIdAndUpdate(payment.bookingId, { status: 'payment_failed', updatedAt: new Date() });
        }
        console.log('✅ Webhook: Payment failed');
    }
    async createPaymentFromBooking(booking, transactionReference, paymentInfo) {
        try {
            const paymentMethodMap = {
                'card': 'card',
                'bank_transfer': 'bank_transfer',
                'mobile_money': 'mobile_money',
                'crypto': 'crypto',
                'cash': 'cash',
                'online': 'online',
            };
            const mappedMethod = paymentMethodMap[paymentInfo.paymentMethod] || 'online';
            let feeCalculation;
            try {
                feeCalculation = await this.pricingService.calculateFees(booking.businessId.toString(), paymentInfo.amount);
            }
            catch (feeError) {
                console.warn('⚠️ Fee calculation failed, using default:', feeError.message);
                feeCalculation = {
                    bookingAmount: paymentInfo.amount,
                    totalPlatformFee: paymentInfo.amount * 0.05,
                    businessReceives: paymentInfo.amount * 0.95,
                };
            }
            const paymentData = {
                clientId: new mongoose_2.Types.ObjectId(booking.clientId.toString()),
                bookingId: new mongoose_2.Types.ObjectId(booking._id.toString()),
                businessId: new mongoose_2.Types.ObjectId(booking.businessId.toString()),
                paymentReference: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                transactionId: transactionReference,
                items: booking.services.map((service) => ({
                    itemType: 'service',
                    itemId: new mongoose_2.Types.ObjectId(service.serviceId.toString()),
                    itemName: service.serviceName,
                    quantity: 1,
                    unitPrice: service.price,
                    totalPrice: service.price,
                    discount: 0,
                    tax: 0,
                })),
                subtotal: paymentInfo.amount,
                totalTax: 0,
                totalDiscount: 0,
                totalAmount: paymentInfo.amount,
                paymentMethod: mappedMethod,
                gateway: paymentInfo.gateway,
                status: paymentInfo.status || 'completed',
                paidAt: paymentInfo.status === 'completed' ? new Date() : undefined,
                metadata: {
                    bookingNumber: booking.bookingNumber,
                    clientName: booking.clientName,
                    clientEmail: booking.clientEmail,
                    serviceName: booking.services.map((s) => s.serviceName).join(', '),
                    paymentType: paymentInfo.paymentType || 'full',
                    bookingTotal: booking.estimatedTotal,
                },
            };
            if (feeCalculation.totalPlatformFee !== undefined) {
                paymentData.platformFee = feeCalculation.totalPlatformFee;
            }
            if (feeCalculation.businessReceives !== undefined) {
                paymentData.businessReceives = feeCalculation.businessReceives;
            }
            const paymentRecord = new this.paymentModel(paymentData);
            await paymentRecord.save();
            console.log('✅ Payment record created:', {
                paymentId: paymentRecord._id.toString(),
                amount: paymentInfo.amount,
                type: paymentInfo.paymentType || 'full',
                bookingTotal: booking.estimatedTotal,
            });
            if (paymentInfo.status === 'completed') {
                try {
                    const commissionCalc = await this.commissionService.calculateBookingCommission(booking);
                    await this.commissionService.updateBookingCommission(booking._id.toString(), {
                        commissionRate: commissionCalc.commissionRate,
                        commissionAmount: commissionCalc.commissionAmount,
                        platformFee: commissionCalc.platformFee,
                        processingFee: commissionCalc.processingFee,
                    });
                    console.log('✅ Commission calculated and updated');
                }
                catch (error) {
                    console.error('⚠️ Commission calculation failed:', error.message);
                }
            }
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
                clientId: new mongoose_2.Types.ObjectId(data.clientId),
                bookingId: new mongoose_2.Types.ObjectId(data.bookingId),
                businessId: new mongoose_2.Types.ObjectId(data.businessId),
                paymentReference: `PAY-FAILED-${Date.now()}`,
                transactionId: data.transactionReference,
                subtotal: data.amount,
                totalAmount: data.amount,
                paymentMethod: 'online',
                gateway: 'unknown',
                status: 'failed',
                metadata: {
                    failureReason: data.errorMessage,
                },
            };
            const failedPayment = new this.paymentModel(failedPaymentData);
            await failedPayment.save();
            console.log('✅ Failed payment record created');
            return JSON.parse(JSON.stringify(failedPayment));
        }
        catch (error) {
            console.error('❌ Failed to create failed payment record:', error.message);
            throw new common_1.BadRequestException(`Failed to create failed payment record: ${error.message}`);
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
                },
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
                    receiptUrl: `${this.configService.get('FRONTEND_URL')}/receipts/${savedPayment._id}`,
                    clientEmail: appointment.clientEmail,
                    clientPhone: appointment.clientPhone,
                });
            }
            catch (notificationError) {
                console.error('⚠️ Notification failed:', notificationError);
            }
            return savedPayment;
        }
        catch (error) {
            console.error('❌ Error creating payment for appointment:', error);
            throw error;
        }
    }
    async updatePaymentStatus(paymentId, status, transactionReference) {
        try {
            const updateData = {
                status,
                transactionId: transactionReference,
                updatedAt: new Date(),
            };
            if (status === 'completed') {
                updateData.paidAt = new Date();
            }
            const payment = await this.paymentModel.findByIdAndUpdate(paymentId, updateData, { new: true }).exec();
            if (!payment) {
                throw new common_1.NotFoundException(`Payment ${paymentId} not found`);
            }
            if (payment.paymentReference) {
                await this.cacheService.del(`payment:verified:${payment.paymentReference}`);
            }
            console.log('✅ Payment status updated:', status);
            return JSON.parse(JSON.stringify(payment));
        }
        catch (error) {
            console.error('❌ Failed to update payment status:', error.message);
            throw new common_1.BadRequestException(`Failed to update payment status: ${error.message}`);
        }
    }
    async processRefund(businessId, id, refundAmount, refundReason) {
        try {
            const payment = await this.paymentModel.findOne({ _id: id, businessId });
            if (!payment) {
                throw new common_1.NotFoundException('Payment not found');
            }
            if (payment.status !== 'completed') {
                throw new common_1.BadRequestException('Can only refund completed payments');
            }
            const totalRefunded = (payment.refundedAmount || 0) + refundAmount;
            if (totalRefunded > payment.totalAmount) {
                throw new common_1.BadRequestException('Refund amount exceeds payment total');
            }
            try {
                await this.gatewayManager.refundPayment(payment.gateway || 'paystack', payment.transactionId, refundAmount);
            }
            catch (gatewayError) {
                console.error('⚠️ Gateway refund failed:', gatewayError.message);
                throw new common_1.BadRequestException(`Refund failed: ${gatewayError.message}`);
            }
            const newStatus = totalRefunded === payment.totalAmount ? 'refunded' : 'partially_refunded';
            const updatedPayment = await this.paymentModel.findOneAndUpdate({ _id: id, businessId }, {
                refundedAmount: totalRefunded,
                refundedAt: new Date(),
                refundReason,
                status: newStatus,
                updatedAt: new Date(),
            }, { new: true, runValidators: true });
            if (payment.paymentReference) {
                await this.cacheService.del(`payment:verified:${payment.paymentReference}`);
            }
            console.log('✅ Refund processed successfully');
            return {
                success: true,
                data: updatedPayment,
                message: 'Refund processed successfully',
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to process refund: ${error.message}`);
        }
    }
    async initiateRefund(businessId, transactionReference, amount) {
        try {
            console.log(`💰 Initiating refund for transaction: ${transactionReference}`);
            const payment = await this.paymentModel.findOne({ transactionId: transactionReference, businessId });
            if (!payment) {
                throw new common_1.NotFoundException('Payment not found');
            }
            await this.processRefund(businessId, payment._id.toString(), amount, 'Refund requested');
            console.log('✅ Refund initiated successfully');
        }
        catch (error) {
            console.error('❌ Failed to initiate refund:', error.message);
            throw new common_1.BadRequestException(`Failed to initiate refund: ${error.message}`);
        }
    }
    async create(createPaymentDto) {
        try {
            const payment = new this.paymentModel(createPaymentDto);
            const savedPayment = await payment.save();
            return {
                success: true,
                data: savedPayment,
                message: 'Payment created successfully',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to create payment: ${error.message}`);
        }
    }
    async findAll() {
        try {
            const payments = await this.paymentModel
                .find()
                .populate('clientId', 'profile.firstName profile.lastName profile.email')
                .sort({ createdAt: -1 });
            return {
                success: true,
                data: payments,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to fetch payments: ${error.message}`);
        }
    }
    async findAllWithQuery(query) {
        const { page = 1, limit = 10, clientId, appointmentId, bookingId, status, paymentMethod, startDate, endDate, search, sortBy = 'createdAt', sortOrder = 'desc', } = query;
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
                { paymentReference: { $regex: search, $options: 'i' } },
                { transactionId: { $regex: search, $options: 'i' } },
                { notes: { $regex: search, $options: 'i' } },
            ];
        }
        const skip = (page - 1) * limit;
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
        const payments = await this.paymentModel
            .find(filter)
            .populate('clientId', 'firstName lastName email phone')
            .populate('appointmentId', 'selectedDate selectedTime')
            .populate('bookingId', 'bookingDate startTime')
            .populate('processedBy', 'firstName lastName email')
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
                .populate('clientId', 'profile.firstName profile.lastName profile.email');
            if (!payment) {
                throw new common_1.NotFoundException('Payment not found');
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
            throw new common_1.BadRequestException(`Failed to fetch payment: ${error.message}`);
        }
    }
    async update(id, updatePaymentDto) {
        try {
            const payment = await this.paymentModel
                .findByIdAndUpdate(id, { ...updatePaymentDto, updatedAt: new Date() }, { new: true })
                .populate('clientId', 'firstName lastName email phone')
                .populate('processedBy', 'firstName lastName email')
                .exec();
            if (!payment) {
                throw new common_1.NotFoundException('Payment not found');
            }
            return {
                success: true,
                data: payment,
                message: 'Payment updated successfully',
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to update payment: ${error.message}`);
        }
    }
    async updateStatus(id, status, transactionId) {
        try {
            const updateData = { status, updatedAt: new Date() };
            if (status === 'completed') {
                updateData.paidAt = new Date();
            }
            if (transactionId) {
                updateData.transactionId = transactionId;
            }
            const payment = await this.paymentModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
            if (!payment) {
                throw new common_1.NotFoundException('Payment not found');
            }
            return {
                success: true,
                data: payment,
                message: 'Payment status updated successfully',
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to update payment status: ${error.message}`);
        }
    }
    async remove(id) {
        try {
            const result = await this.paymentModel.findByIdAndDelete(id);
            if (!result) {
                throw new common_1.NotFoundException('Payment not found');
            }
            return {
                success: true,
                message: 'Payment deleted successfully',
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to delete payment: ${error.message}`);
        }
    }
    async getPaymentByAppointment(appointmentId) {
        try {
            const payment = await this.paymentModel
                .findOne({ appointmentId: new mongoose_2.Types.ObjectId(appointmentId) })
                .exec();
            return payment;
        }
        catch (error) {
            console.error('❌ Error getting payment by appointment:', error);
            return null;
        }
    }
    async getPaymentByBookingId(bookingId) {
        try {
            const payment = await this.paymentModel
                .findOne({ bookingId: new mongoose_2.Types.ObjectId(bookingId) })
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
    async getPaymentStats() {
        try {
            const totalPayments = await this.paymentModel.countDocuments().exec();
            const completedPayments = await this.paymentModel.countDocuments({ status: 'completed' }).exec();
            const pendingPayments = await this.paymentModel.countDocuments({ status: 'pending' }).exec();
            const totalRevenueResult = await this.paymentModel.aggregate([
                { $match: { status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } },
            ]).exec();
            const platformFeeResult = await this.paymentModel.aggregate([
                { $match: { status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$platformFee' } } },
            ]).exec();
            const paymentMethodStats = await this.paymentModel.aggregate([
                { $match: { status: 'completed' } },
                { $group: { _id: '$paymentMethod', count: { $sum: 1 }, total: { $sum: '$totalAmount' } } },
                { $sort: { total: -1 } },
            ]);
            const gatewayStats = await this.paymentModel.aggregate([
                { $match: { status: 'completed' } },
                { $group: { _id: '$gateway', count: { $sum: 1 }, total: { $sum: '$totalAmount' } } },
                { $sort: { total: -1 } },
            ]);
            return {
                success: true,
                data: {
                    totalPayments,
                    completedPayments,
                    totalRevenue: totalRevenueResult[0]?.total || 0,
                    totalPlatformFees: platformFeeResult[0]?.total || 0,
                    pendingPayments,
                    paymentMethodStats,
                    gatewayStats,
                },
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to get payment stats: ${error.message}`);
        }
    }
    async generatePaymentReference() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        return `PAY-${timestamp}-${random}`;
    }
    buildPaymentItems(metadata, amount) {
        let paymentItems = [];
        if (metadata?.services && Array.isArray(metadata.services)) {
            console.log(`📦 Processing ${metadata.services.length} services`);
            paymentItems = metadata.services.map((service, index) => {
                const serviceId = service.serviceId || service._id || service.id;
                let itemId;
                if (serviceId && mongoose_2.Types.ObjectId.isValid(serviceId)) {
                    itemId = new mongoose_2.Types.ObjectId(serviceId);
                }
                else {
                    itemId = new mongoose_2.Types.ObjectId();
                }
                return {
                    itemType: 'service',
                    itemId,
                    itemName: service.serviceName || service.name || `Service ${index + 1}`,
                    quantity: service.quantity || 1,
                    unitPrice: service.price || 0,
                    totalPrice: service.price || 0,
                    discount: service.discount || 0,
                    tax: service.tax || 0,
                };
            });
        }
        if (paymentItems.length === 0) {
            console.log('📦 No services provided, creating default payment item');
            paymentItems.push({
                itemType: 'service',
                itemId: new mongoose_2.Types.ObjectId(),
                itemName: metadata?.serviceName || 'Payment',
                quantity: 1,
                unitPrice: amount,
                totalPrice: amount,
                discount: 0,
                tax: 0,
            });
        }
        return paymentItems;
    }
};
PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __param(1, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __param(2, (0, mongoose_1.InjectModel)(business_schema_1.Business.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        notification_service_1.NotificationService,
        config_1.ConfigService,
        pricing_service_1.PricingService,
        commission_service_1.CommissionService,
        gateway_manager_service_1.GatewayManagerService,
        jobs_service_1.JobsService,
        cache_service_1.CacheService,
        business_service_1.BusinessService])
], PaymentService);
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map