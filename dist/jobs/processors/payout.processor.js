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
var PayoutProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const payment_schema_1 = require("../../payment/schemas/payment.schema");
const booking_schema_1 = require("../../booking/schemas/booking.schema");
const gateway_manager_service_1 = require("../../integration/gateway-manager.service");
const notification_service_1 = require("../../notification/notification.service");
const commission_calculator_service_1 = require("../../commission/services/commission-calculator.service");
let PayoutProcessor = PayoutProcessor_1 = class PayoutProcessor {
    constructor(paymentModel, bookingModel, gatewayManager, notificationService, commissionCalculatorService) {
        this.paymentModel = paymentModel;
        this.bookingModel = bookingModel;
        this.gatewayManager = gatewayManager;
        this.notificationService = notificationService;
        this.commissionCalculatorService = commissionCalculatorService;
        this.logger = new common_1.Logger(PayoutProcessor_1.name);
    }
    async handlePayout(job) {
        const { tenantId, amount, period } = job.data;
        try {
            this.logger.log(`Processing payout for tenant ${tenantId}: $${amount}`);
            const eligibility = await this.verifyPayoutEligibility(tenantId, amount);
            if (!eligibility.eligible) {
                throw new Error(eligibility.reason);
            }
            const fees = await this.calculatePayoutFees(tenantId, amount);
            const netAmount = amount - fees.totalPlatformFee;
            const bankDetails = await this.getTenantBankDetails(tenantId);
            if (!bankDetails) {
                throw new Error('Bank account details not configured');
            }
            const transferResult = await this.initiateTransfer(tenantId, netAmount, bankDetails, period);
            const payoutRecord = await this.recordPayoutTransaction({
                tenantId,
                amount,
                fees: fees.totalPlatformFee,
                netAmount,
                transactionId: transferResult.transactionId,
                period,
                status: 'completed'
            });
            await this.updatePaymentRecords(tenantId, payoutRecord._id);
            await this.sendPayoutConfirmation(tenantId, {
                amount,
                netAmount,
                fees: fees.totalPlatformFee,
                payoutId: payoutRecord._id.toString(),
                transactionId: transferResult.transactionId
            });
            this.logger.log(`Payout completed successfully: ${payoutRecord._id}`);
            return {
                success: true,
                payoutId: payoutRecord._id.toString(),
                amount,
                fees: fees.totalPlatformFee,
                netAmount,
                transactionId: transferResult.transactionId
            };
        }
        catch (error) {
            this.logger.error(`Payout failed for tenant ${tenantId}: ${error.message}`, error.stack);
            await this.recordFailedPayout(tenantId, amount, error.message);
            await this.sendPayoutFailureNotification(tenantId, error.message);
            return {
                success: false,
                payoutId: `FAILED-${Date.now()}`,
                amount,
                fees: 0,
                netAmount: 0,
                error: error.message
            };
        }
    }
    async schedulePayouts(job) {
        try {
            this.logger.log('Scheduling payouts for eligible tenants');
            const eligibleTenants = await this.findEligibleTenants();
            this.logger.log(`Found ${eligibleTenants.length} eligible tenants`);
            for (const tenant of eligibleTenants) {
                const payoutAmount = await this.calculateTenantPayout(tenant.tenantId);
                if (payoutAmount > 0) {
                    await job.queue.add('process-payout', {
                        tenantId: tenant.tenantId,
                        amount: payoutAmount,
                        period: tenant.payoutSchedule || 'weekly',
                        startDate: tenant.lastPayoutDate,
                        endDate: new Date()
                    }, {
                        attempts: 3,
                        backoff: {
                            type: 'exponential',
                            delay: 60000
                        }
                    });
                    this.logger.log(`Scheduled payout for tenant ${tenant.tenantId}: $${payoutAmount}`);
                }
            }
        }
        catch (error) {
            this.logger.error('Failed to schedule payouts', error.stack);
            throw error;
        }
    }
    async verifyPayoutEligibility(tenantId, amount) {
        const minThreshold = 100;
        if (amount < minThreshold) {
            return {
                eligible: false,
                reason: `Amount below minimum threshold of $${minThreshold}`
            };
        }
        const pendingPayouts = await this.paymentModel.countDocuments({
            businessId: new mongoose_2.Types.ObjectId(tenantId),
            status: 'pending',
            'metadata.payoutStatus': 'processing'
        });
        if (pendingPayouts > 0) {
            return {
                eligible: false,
                reason: 'Pending payout already in progress'
            };
        }
        return { eligible: true };
    }
    async calculatePayoutFees(tenantId, amount) {
        const summary = await this.commissionCalculatorService.getBusinessCommissionSummary(tenantId);
        const platformFeePercentage = 2.5;
        const platformFee = (amount * platformFeePercentage) / 100;
        return {
            totalPlatformFee: platformFee,
            commissionDeductions: summary.summary.totalCommissions || 0,
            breakdown: {
                platformFee,
                commissions: summary.summary.totalCommissions || 0
            }
        };
    }
    async getTenantBankDetails(tenantId) {
        return {
            accountNumber: 'XXXXXXXXXX',
            bankCode: 'XXX',
            accountName: 'Business Account'
        };
    }
    async initiateTransfer(tenantId, amount, bankDetails, period) {
        try {
            const gateway = 'paystack';
            const transferResult = await this.gatewayManager.processTransfer(gateway, amount, {
                recipient: bankDetails.accountNumber,
                bankCode: bankDetails.bankCode,
                accountName: bankDetails.accountName,
                reference: `PAYOUT-${tenantId}-${Date.now()}`,
                reason: `${period} payout`
            });
            return transferResult;
        }
        catch (error) {
            this.logger.error('Transfer initiation failed', error.stack);
            throw error;
        }
    }
    async recordPayoutTransaction(data) {
        const payoutRecord = await this.paymentModel.create({
            businessId: new mongoose_2.Types.ObjectId(data.tenantId),
            paymentReference: `PAYOUT-${Date.now()}`,
            transactionId: data.transactionId,
            subtotal: data.amount,
            totalAmount: data.netAmount,
            paymentMethod: 'bank_transfer',
            status: data.status,
            gateway: 'paystack',
            metadata: {
                type: 'payout',
                period: data.period,
                fees: data.fees,
                processedAt: new Date()
            }
        });
        return payoutRecord;
    }
    async updatePaymentRecords(tenantId, payoutId) {
        await this.paymentModel.updateMany({
            businessId: new mongoose_2.Types.ObjectId(tenantId),
            status: 'completed',
            'metadata.payoutStatus': { $ne: 'paid' }
        }, {
            $set: {
                'metadata.payoutStatus': 'paid',
                'metadata.payoutId': payoutId,
                'metadata.paidOutAt': new Date()
            }
        });
    }
    async sendPayoutConfirmation(tenantId, details) {
        try {
            this.logger.log(`Sending payout confirmation to tenant ${tenantId}`);
        }
        catch (error) {
            this.logger.error('Failed to send payout confirmation', error.stack);
        }
    }
    async recordFailedPayout(tenantId, amount, errorMessage) {
        await this.paymentModel.create({
            businessId: new mongoose_2.Types.ObjectId(tenantId),
            paymentReference: `PAYOUT-FAILED-${Date.now()}`,
            subtotal: amount,
            totalAmount: amount,
            paymentMethod: 'bank_transfer',
            status: 'failed',
            metadata: {
                type: 'payout',
                error: errorMessage,
                failedAt: new Date()
            }
        });
    }
    async sendPayoutFailureNotification(tenantId, errorMessage) {
        try {
            this.logger.log(`Sending payout failure notification to tenant ${tenantId}`);
        }
        catch (error) {
            this.logger.error('Failed to send failure notification', error.stack);
        }
    }
    async findEligibleTenants() {
        const now = new Date();
        const tenants = await this.paymentModel.aggregate([
            {
                $match: {
                    status: 'completed',
                    'metadata.payoutStatus': { $ne: 'paid' }
                }
            },
            {
                $group: {
                    _id: '$businessId',
                    totalAmount: { $sum: '$totalAmount' },
                    count: { $sum: 1 }
                }
            },
            {
                $match: {
                    totalAmount: { $gte: 100 }
                }
            }
        ]);
        return tenants.map(t => ({
            tenantId: t._id.toString(),
            amount: t.totalAmount,
            payoutSchedule: 'weekly',
            lastPayoutDate: null
        }));
    }
    async calculateTenantPayout(tenantId) {
        const result = await this.paymentModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(tenantId),
                    status: 'completed',
                    'metadata.payoutStatus': { $ne: 'paid' }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalAmount' }
                }
            }
        ]);
        return result[0]?.total || 0;
    }
};
__decorate([
    (0, bull_1.Process)('process-payout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PayoutProcessor.prototype, "handlePayout", null);
__decorate([
    (0, bull_1.Process)('schedule-payouts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PayoutProcessor.prototype, "schedulePayouts", null);
PayoutProcessor = PayoutProcessor_1 = __decorate([
    (0, bull_1.Processor)('payouts'),
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __param(1, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        gateway_manager_service_1.GatewayManagerService,
        notification_service_1.NotificationService,
        commission_calculator_service_1.CommissionCalculatorService])
], PayoutProcessor);
exports.PayoutProcessor = PayoutProcessor;
//# sourceMappingURL=payout.processor.js.map