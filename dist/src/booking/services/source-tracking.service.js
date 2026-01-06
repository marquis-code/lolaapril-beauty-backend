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
const booking_schema_1 = require("../schemas/booking.schema");
let SourceTrackingService = SourceTrackingService_1 = class SourceTrackingService {
    constructor(bookingModel) {
        this.bookingModel = bookingModel;
        this.logger = new common_1.Logger(SourceTrackingService_1.name);
    }
    async calculateCommission(bookingSource, businessId, clientId, totalAmount) {
        const isMarketplaceBooking = bookingSource.sourceType === 'marketplace';
        const isOwnClient = await this.isClientAcquiredByBusiness(clientId, businessId, bookingSource);
        if (!isMarketplaceBooking || isOwnClient) {
            return {
                isCommissionable: false,
                commissionRate: 0,
                commissionAmount: 0,
                reason: 'Non-marketplace booking or business-acquired client'
            };
        }
        const commissionRate = 20;
        const commissionAmount = (totalAmount * commissionRate) / 100;
        return {
            isCommissionable: true,
            commissionRate,
            commissionAmount,
            reason: 'Marketplace booking - new client acquisition'
        };
    }
    async isClientAcquiredByBusiness(clientId, businessId, currentSource) {
        const query = {
            clientId: new mongoose_2.Types.ObjectId(clientId),
            businessId: new mongoose_2.Types.ObjectId(businessId),
            createdAt: { $lt: new Date() }
        };
        const previousBooking = await this.bookingModel
            .findOne(query)
            .sort({ createdAt: 1 })
            .lean()
            .exec();
        if (!previousBooking) {
            const businessOwnedSources = [
                'direct_link',
                'qr_code',
                'business_website',
                'google_search',
                'social_media',
                'referral'
            ];
            return businessOwnedSources.includes(currentSource.sourceType);
        }
        return true;
    }
    generateTrackingId(businessId, channel) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        return `${businessId}-${channel}-${timestamp}-${random}`;
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
    __param(0, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SourceTrackingService);
exports.SourceTrackingService = SourceTrackingService;
//# sourceMappingURL=source-tracking.service.js.map