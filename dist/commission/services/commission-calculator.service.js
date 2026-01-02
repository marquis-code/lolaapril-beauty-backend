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
exports.CommissionCalculatorService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const booking_schema_1 = require("../../booking/schemas/booking.schema");
const commission_schema_1 = require("../schemas/commission.schema");
const tracking_code_schema_1 = require("../schemas/tracking-code.schema");
const source_tracking_service_1 = require("./source-tracking.service");
let CommissionCalculatorService = class CommissionCalculatorService {
    constructor(commissionModel, bookingModel, trackingCodeModel, sourceTrackingService) {
        this.commissionModel = commissionModel;
        this.bookingModel = bookingModel;
        this.trackingCodeModel = trackingCodeModel;
        this.sourceTrackingService = sourceTrackingService;
    }
    async calculateCommission(bookingId, bookingData) {
        const commissionDecision = await this.sourceTrackingService
            .shouldChargeCommission(bookingData.sourceTracking.sourceType, bookingData.clientId, bookingData.businessId, bookingData.sourceTracking.sourceIdentifier);
        if (!commissionDecision.shouldCharge) {
            return {
                isCommissionable: false,
                commissionRate: 0,
                commissionAmount: 0,
                platformFee: 0,
                businessPayout: bookingData.totalAmount,
                reason: commissionDecision.reason,
                isFirstTimeClient: commissionDecision.isFirstTime
            };
        }
        const commissionRate = await this.getCommissionRate(bookingData.businessId, bookingData.sourceTracking.sourceType);
        const commissionAmount = (bookingData.totalAmount * commissionRate) / 100;
        const platformFee = commissionAmount;
        const businessPayout = bookingData.totalAmount - platformFee;
        return {
            isCommissionable: true,
            commissionRate,
            commissionAmount,
            platformFee,
            businessPayout,
            reason: commissionDecision.reason,
            isFirstTimeClient: commissionDecision.isFirstTime
        };
    }
    async createCommissionRecord(bookingId, paymentId, bookingData, calculation) {
        const commission = await this.commissionModel.create({
            bookingId: new mongoose_2.Types.ObjectId(bookingId),
            businessId: new mongoose_2.Types.ObjectId(bookingData.businessId),
            clientId: new mongoose_2.Types.ObjectId(bookingData.clientId),
            paymentId: new mongoose_2.Types.ObjectId(paymentId),
            sourceTracking: bookingData.sourceTracking,
            bookingAmount: bookingData.totalAmount,
            isCommissionable: calculation.isCommissionable,
            commissionRate: calculation.commissionRate,
            commissionAmount: calculation.commissionAmount,
            platformFee: calculation.platformFee,
            businessPayout: calculation.businessPayout,
            commissionReason: calculation.reason,
            isFirstTimeClient: calculation.isFirstTimeClient,
            isMarketplaceAcquired: calculation.isCommissionable,
            status: 'calculated',
            calculatedAt: new Date()
        });
        return commission;
    }
    async getCommissionRate(businessId, sourceType) {
        const defaultRates = {
            marketplace: 20,
            direct_link: 0,
            qr_code: 0,
            business_website: 0,
            google_search: 0,
            social_media: 0,
            referral: 0,
            walk_in: 0,
            phone: 0
        };
        return defaultRates[sourceType] || 0;
    }
    async disputeCommission(commissionId, reason, disputedBy) {
        await this.commissionModel.updateOne({ _id: new mongoose_2.Types.ObjectId(commissionId) }, {
            $set: {
                status: 'disputed',
                wasDisputed: true,
                disputeReason: reason,
                updatedAt: new Date()
            }
        }).exec();
    }
    async waiveCommission(commissionId, reason, waivedBy) {
        await this.commissionModel.updateOne({ _id: new mongoose_2.Types.ObjectId(commissionId) }, {
            $set: {
                status: 'waived',
                commissionAmount: 0,
                platformFee: 0,
                notes: `Waived by ${waivedBy}: ${reason}`,
                updatedAt: new Date()
            }
        }).exec();
    }
    async getCommissionByBooking(bookingId) {
        return this.commissionModel
            .findOne({ bookingId: new mongoose_2.Types.ObjectId(bookingId) })
            .exec();
    }
    async getBusinessCommissionSummary(businessId, startDate, endDate) {
        const matchStage = {
            businessId: new mongoose_2.Types.ObjectId(businessId)
        };
        if (startDate && endDate) {
            matchStage.calculatedAt = {
                $gte: startDate,
                $lte: endDate
            };
        }
        const summary = await this.commissionModel.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalBookings: { $sum: 1 },
                    commissionableBookings: {
                        $sum: { $cond: ['$isCommissionable', 1, 0] }
                    },
                    totalRevenue: { $sum: '$bookingAmount' },
                    totalCommissions: { $sum: '$commissionAmount' },
                    totalBusinessPayout: { $sum: '$businessPayout' },
                    averageCommissionRate: { $avg: '$commissionRate' }
                }
            }
        ]).exec();
        const sourceBreakdown = await this.commissionModel.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$sourceTracking.sourceType',
                    count: { $sum: 1 },
                    totalCommissions: { $sum: '$commissionAmount' },
                    totalRevenue: { $sum: '$bookingAmount' }
                }
            }
        ]).exec();
        return {
            summary: summary[0] || {
                totalBookings: 0,
                commissionableBookings: 0,
                totalRevenue: 0,
                totalCommissions: 0,
                totalBusinessPayout: 0,
                averageCommissionRate: 0
            },
            sourceBreakdown,
            commissionSavings: summary[0]
                ? summary[0].totalRevenue - summary[0].totalCommissions
                : 0
        };
    }
    async getSourceBreakdown(businessId, startDate, endDate) {
        const matchStage = {
            businessId: new mongoose_2.Types.ObjectId(businessId),
            calculatedAt: {
                $gte: startDate,
                $lte: endDate
            }
        };
        const breakdown = await this.commissionModel.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$sourceTracking.sourceType',
                    totalBookings: { $sum: 1 },
                    commissionableBookings: {
                        $sum: { $cond: ['$isCommissionable', 1, 0] }
                    },
                    nonCommissionableBookings: {
                        $sum: { $cond: ['$isCommissionable', 0, 1] }
                    },
                    totalRevenue: { $sum: '$bookingAmount' },
                    totalCommissions: { $sum: '$commissionAmount' },
                    businessPayout: { $sum: '$businessPayout' },
                    commissionSavings: {
                        $sum: {
                            $cond: ['$isCommissionable', 0, '$bookingAmount']
                        }
                    }
                }
            },
            {
                $project: {
                    sourceType: '$_id',
                    totalBookings: 1,
                    commissionableBookings: 1,
                    nonCommissionableBookings: 1,
                    totalRevenue: 1,
                    totalCommissions: 1,
                    businessPayout: 1,
                    commissionSavings: 1,
                    commissionPercentage: {
                        $multiply: [
                            { $divide: ['$commissionableBookings', '$totalBookings'] },
                            100
                        ]
                    }
                }
            },
            { $sort: { totalRevenue: -1 } }
        ]).exec();
        return breakdown;
    }
};
CommissionCalculatorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(commission_schema_1.Commission.name)),
    __param(1, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __param(2, (0, mongoose_1.InjectModel)(tracking_code_schema_1.TrackingCode.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        source_tracking_service_1.SourceTrackingService])
], CommissionCalculatorService);
exports.CommissionCalculatorService = CommissionCalculatorService;
//# sourceMappingURL=commission-calculator.service.js.map