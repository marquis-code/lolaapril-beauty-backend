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
var SourceTrackingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceTrackingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let SourceTrackingService = SourceTrackingService_1 = class SourceTrackingService {
    constructor(bookingModel, trackingCodeModel) {
        this.bookingModel = bookingModel;
        this.trackingCodeModel = trackingCodeModel;
        this.logger = new common_1.Logger(SourceTrackingService_1.name);
    }
    async generateTrackingCode(businessId, codeType, name, options) {
        const code = this.createUniqueCode(businessId, codeType);
        await this.trackingCodeModel.create({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            code,
            codeType,
            name,
            description: options?.description,
            targetUrl: `${process.env.APP_URL}/book/${businessId}?track=${code}`,
            expiresAt: options?.expiresAt,
            metadata: options?.metadata,
            isActive: true
        });
        this.logger.log(`Generated tracking code: ${code} for ${name}`);
        return code;
    }
    async resolveTrackingCode(code) {
        const trackingCode = await this.trackingCodeModel
            .findOne({ code, isActive: true })
            .exec();
        if (!trackingCode) {
            return { isValid: false };
        }
        if (trackingCode.expiresAt && new Date() > trackingCode.expiresAt) {
            return { isValid: false };
        }
        await this.trackingCodeModel.updateOne({ code }, { $inc: { clickCount: 1 } }).exec();
        return {
            isValid: true,
            businessId: trackingCode.businessId.toString(),
            codeType: trackingCode.codeType,
            trackingData: trackingCode.metadata
        };
    }
    async recordConversion(code) {
        await this.trackingCodeModel.updateOne({ code }, {
            $inc: { bookingCount: 1 }
        }).exec();
        const trackingCode = await this.trackingCodeModel.findOne({ code }).exec();
        if (trackingCode) {
            trackingCode.conversionRate = trackingCode.clickCount > 0
                ? (trackingCode.bookingCount / trackingCode.clickCount) * 100
                : 0;
            await trackingCode.save();
        }
    }
    async isClientAcquiredByBusiness(clientId, businessId, currentSourceType) {
        const firstBooking = await this.bookingModel
            .findOne({
            clientId: new mongoose_2.Types.ObjectId(clientId),
            businessId: new mongoose_2.Types.ObjectId(businessId)
        })
            .sort({ createdAt: 1 })
            .exec();
        if (!firstBooking) {
            const businessOwnedSources = [
                'direct_link',
                'qr_code',
                'business_website',
                'google_search',
                'social_media',
                'referral',
                'walk_in',
                'phone'
            ];
            return businessOwnedSources.includes(currentSourceType);
        }
        return true;
    }
    async shouldChargeCommission(sourceType, clientId, businessId, sourceIdentifier) {
        if (sourceType !== 'marketplace') {
            return {
                shouldCharge: false,
                reason: 'Non-marketplace booking - business owns this channel',
                isFirstTime: false
            };
        }
        const isBusinessClient = await this.isClientAcquiredByBusiness(clientId, businessId, sourceType);
        if (isBusinessClient) {
            return {
                shouldCharge: false,
                reason: 'Client was acquired by business through their own marketing',
                isFirstTime: false
            };
        }
        return {
            shouldCharge: true,
            reason: 'Genuine marketplace booking - new client acquisition',
            isFirstTime: true
        };
    }
    async getTrackingAnalytics(businessId, startDate, endDate) {
        const matchStage = {
            businessId: new mongoose_2.Types.ObjectId(businessId)
        };
        if (startDate && endDate) {
            matchStage.createdAt = { $gte: startDate, $lte: endDate };
        }
        const trackingCodes = await this.trackingCodeModel
            .find(matchStage)
            .exec();
        const summary = {};
        for (const code of trackingCodes) {
            const type = code.codeType;
            if (!summary[type]) {
                summary[type] = {
                    totalCodes: 0,
                    totalClicks: 0,
                    totalBookings: 0,
                    avgConversionRate: 0
                };
            }
            summary[type].totalCodes++;
            summary[type].totalClicks += code.clickCount || 0;
            summary[type].totalBookings += code.bookingCount || 0;
            summary[type].avgConversionRate += code.conversionRate || 0;
        }
        for (const type in summary) {
            if (summary[type].totalCodes > 0) {
                summary[type].avgConversionRate = summary[type].avgConversionRate / summary[type].totalCodes;
            }
        }
        let totalClicks = 0;
        let totalBookings = 0;
        for (const code of trackingCodes) {
            totalClicks += code.clickCount || 0;
            totalBookings += code.bookingCount || 0;
        }
        const plainTrackingCodes = [];
        for (const code of trackingCodes) {
            plainTrackingCodes.push({
                _id: code._id,
                businessId: code.businessId,
                code: code.code,
                codeType: code.codeType,
                name: code.name,
                description: code.description,
                targetUrl: code.targetUrl,
                clickCount: code.clickCount,
                bookingCount: code.bookingCount,
                conversionRate: code.conversionRate,
                isActive: code.isActive,
                expiresAt: code.expiresAt,
                metadata: code.metadata,
            });
        }
        return {
            trackingCodes: plainTrackingCodes,
            summary,
            totalClicks,
            totalBookings
        };
    }
    createUniqueCode(businessId, type) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        const businessPrefix = businessId.substring(0, 6);
        const typePrefix = type.substring(0, 2).toUpperCase();
        return `${typePrefix}-${businessPrefix}-${timestamp}-${random}`.toUpperCase();
    }
    validateSourceData(sourceData) {
        const errors = [];
        if (!sourceData.sourceType) {
            errors.push('Source type is required');
        }
        if (['qr_code', 'direct_link'].includes(sourceData.sourceType)) {
            if (!sourceData.sourceIdentifier && !sourceData.trackingCode) {
                errors.push('Tracking identifier required for QR codes and direct links');
            }
        }
        if (sourceData.sourceType === 'referral' && !sourceData.referralCode) {
            errors.push('Referral code required for referral bookings');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
};
SourceTrackingService = SourceTrackingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Booking')),
    __param(1, (0, mongoose_1.InjectModel)('TrackingCode')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], SourceTrackingService);
exports.SourceTrackingService = SourceTrackingService;
//# sourceMappingURL=source-tracking.service.js.map