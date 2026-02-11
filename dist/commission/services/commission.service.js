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
var CommissionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const booking_schema_1 = require("../../booking/schemas/booking.schema");
const payment_schema_1 = require("../../payment/schemas/payment.schema");
let CommissionService = CommissionService_1 = class CommissionService {
    constructor(bookingModel, paymentModel) {
        this.bookingModel = bookingModel;
        this.paymentModel = paymentModel;
        this.logger = new common_1.Logger(CommissionService_1.name);
        this.DEFAULT_COMMISSION_RATE = 0.15;
        this.PROCESSING_FEE_RATE = 0.029;
        this.PROCESSING_FEE_FIXED = 0.30;
        this.MARKETPLACE_COMMISSION_RATE = 0.20;
    }
    async calculateBookingCommission(booking) {
        try {
            const amount = booking.estimatedTotal || 0;
            let commissionRate = this.DEFAULT_COMMISSION_RATE;
            if (booking.bookingSource?.sourceType === 'marketplace') {
                commissionRate = this.MARKETPLACE_COMMISSION_RATE;
            }
            else if (booking.bookingSource?.sourceType === 'direct_link' ||
                booking.bookingSource?.sourceType === 'qr_code') {
                commissionRate = 0.10;
            }
            const commissionAmount = amount * commissionRate;
            const processingFee = (amount * this.PROCESSING_FEE_RATE) + this.PROCESSING_FEE_FIXED;
            const platformFee = commissionAmount + processingFee;
            const netAmount = amount - platformFee;
            return {
                baseAmount: amount,
                commissionRate,
                commissionAmount,
                platformFee: commissionAmount,
                processingFee,
                totalPlatformFee: platformFee,
                netAmount,
                breakdown: {
                    commission: commissionAmount,
                    processing: processingFee,
                    platform: platformFee
                }
            };
        }
        catch (error) {
            this.logger.error('Failed to calculate booking commission', error.stack);
            throw error;
        }
    }
    async calculateFees(tenantId, amount, options) {
        try {
            let commissionRate = options?.customRate || this.DEFAULT_COMMISSION_RATE;
            if (options?.bookingSource === 'marketplace') {
                commissionRate = this.MARKETPLACE_COMMISSION_RATE;
            }
            const commissionAmount = amount * commissionRate;
            const processingFee = (amount * this.PROCESSING_FEE_RATE) + this.PROCESSING_FEE_FIXED;
            const totalPlatformFee = commissionAmount + processingFee;
            const netAmount = amount - totalPlatformFee;
            return {
                baseAmount: amount,
                commissionRate,
                commissionAmount,
                platformFee: commissionAmount,
                processingFee,
                totalPlatformFee,
                netAmount,
                breakdown: {
                    commission: commissionAmount,
                    processing: processingFee,
                    platform: totalPlatformFee
                }
            };
        }
        catch (error) {
            this.logger.error('Failed to calculate fees', error.stack);
            throw error;
        }
    }
    async updateBookingCommission(bookingId, commissionData) {
        try {
            await this.bookingModel.findByIdAndUpdate(bookingId, {
                $set: {
                    'commissionInfo.isCommissionable': true,
                    'commissionInfo.commissionRate': commissionData.commissionRate,
                    'commissionInfo.commissionAmount': commissionData.commissionAmount,
                    'commissionInfo.commissionReason': this.getCommissionReason(commissionData),
                    'commissionInfo.calculatedAt': new Date()
                }
            });
            this.logger.log(`Commission updated for booking ${bookingId}`);
        }
        catch (error) {
            this.logger.error('Failed to update booking commission', error.stack);
            throw error;
        }
    }
    async calculateTenantCommission(tenantId, startDate, endDate) {
        try {
            const result = await this.bookingModel.aggregate([
                {
                    $match: {
                        businessId: new mongoose_2.Types.ObjectId(tenantId),
                        status: { $in: ['confirmed', 'completed'] },
                        createdAt: { $gte: startDate, $lte: endDate },
                        'commissionInfo.isCommissionable': true
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$estimatedTotal' },
                        totalCommission: { $sum: '$commissionInfo.commissionAmount' },
                        bookingCount: { $sum: 1 }
                    }
                }
            ]);
            if (result.length === 0) {
                return {
                    totalRevenue: 0,
                    totalCommission: 0,
                    totalProcessingFees: 0,
                    netRevenue: 0,
                    bookingCount: 0
                };
            }
            const data = result[0];
            const totalProcessingFees = (data.totalRevenue * this.PROCESSING_FEE_RATE) +
                (this.PROCESSING_FEE_FIXED * data.bookingCount);
            return {
                totalRevenue: data.totalRevenue,
                totalCommission: data.totalCommission,
                totalProcessingFees,
                netRevenue: data.totalRevenue - data.totalCommission - totalProcessingFees,
                bookingCount: data.bookingCount
            };
        }
        catch (error) {
            this.logger.error('Failed to calculate tenant commission', error.stack);
            throw error;
        }
    }
    async getCommissionBreakdownBySource(tenantId, startDate, endDate) {
        try {
            return await this.bookingModel.aggregate([
                {
                    $match: {
                        businessId: new mongoose_2.Types.ObjectId(tenantId),
                        status: { $in: ['confirmed', 'completed'] },
                        createdAt: { $gte: startDate, $lte: endDate },
                        'commissionInfo.isCommissionable': true
                    }
                },
                {
                    $group: {
                        _id: '$bookingSource.sourceType',
                        totalRevenue: { $sum: '$estimatedTotal' },
                        totalCommission: { $sum: '$commissionInfo.commissionAmount' },
                        avgCommissionRate: { $avg: '$commissionInfo.commissionRate' },
                        bookingCount: { $sum: 1 }
                    }
                },
                {
                    $sort: { totalRevenue: -1 }
                }
            ]);
        }
        catch (error) {
            this.logger.error('Failed to get commission breakdown', error.stack);
            throw error;
        }
    }
    calculateCommissionPreview(amount, sourceType) {
        let rate = this.DEFAULT_COMMISSION_RATE;
        let reason = 'Standard booking commission';
        if (sourceType === 'marketplace') {
            rate = this.MARKETPLACE_COMMISSION_RATE;
            reason = 'Marketplace booking - higher commission';
        }
        else if (sourceType === 'direct_link' || sourceType === 'qr_code') {
            rate = 0.10;
            reason = 'Direct booking - reduced commission';
        }
        else if (sourceType === 'business_website') {
            rate = 0.05;
            reason = 'Business website booking - minimal commission';
        }
        return {
            rate,
            amount: amount * rate,
            reason
        };
    }
    async getTenantCommissionStats(tenantId) {
        try {
            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            const [currentMonth, lastMonth, allTime] = await Promise.all([
                this.calculateTenantCommission(tenantId, firstDayOfMonth, now),
                this.calculateTenantCommission(tenantId, firstDayOfLastMonth, lastDayOfLastMonth),
                this.calculateTenantCommission(tenantId, new Date(0), now)
            ]);
            const growth = lastMonth.totalRevenue > 0
                ? ((currentMonth.totalRevenue - lastMonth.totalRevenue) / lastMonth.totalRevenue) * 100
                : 0;
            return {
                currentMonth: {
                    ...currentMonth,
                    period: 'current_month'
                },
                lastMonth: {
                    ...lastMonth,
                    period: 'last_month'
                },
                allTime: {
                    ...allTime,
                    period: 'all_time'
                },
                growth: Math.round(growth * 100) / 100,
                avgCommissionRate: allTime.totalRevenue > 0
                    ? (allTime.totalCommission / allTime.totalRevenue) * 100
                    : 0
            };
        }
        catch (error) {
            this.logger.error('Failed to get commission stats', error.stack);
            throw error;
        }
    }
    validateCommission(amount, commissionRate, calculatedCommission) {
        const expectedCommission = amount * commissionRate;
        const tolerance = 0.01;
        return Math.abs(expectedCommission - calculatedCommission) <= tolerance;
    }
    getCommissionReason(commissionData) {
        if (commissionData.commissionRate === this.MARKETPLACE_COMMISSION_RATE) {
            return 'marketplace_booking';
        }
        else if (commissionData.commissionRate === 0.10) {
            return 'direct_booking';
        }
        else if (commissionData.commissionRate === 0.05) {
            return 'website_booking';
        }
        else if (commissionData.commissionRate === 0) {
            return 'no_commission';
        }
        return 'standard_booking';
    }
    getCommissionRateForSource(sourceType) {
        const rates = {
            marketplace: this.MARKETPLACE_COMMISSION_RATE,
            direct_link: 0.10,
            qr_code: 0.10,
            business_website: 0.05,
            google_search: this.DEFAULT_COMMISSION_RATE,
            social_media: this.DEFAULT_COMMISSION_RATE,
            referral: 0.12,
            walk_in: 0,
            phone: 0
        };
        return rates[sourceType] || this.DEFAULT_COMMISSION_RATE;
    }
};
CommissionService = CommissionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __param(1, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CommissionService);
exports.CommissionService = CommissionService;
//# sourceMappingURL=commission.service.js.map