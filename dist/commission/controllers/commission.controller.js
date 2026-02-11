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
exports.CommissionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../../auth");
const commission_calculator_service_1 = require("../services/commission-calculator.service");
const source_tracking_service_1 = require("../services/source-tracking.service");
const create_tracking_code_dto_1 = require("../dto/create-tracking-code.dto");
const dispute_commission_dto_1 = require("../dto/dispute-commission.dto");
const get_commissions_dto_1 = require("../dto/get-commissions.dto");
let CommissionController = class CommissionController {
    constructor(commissionCalculatorService, sourceTrackingService) {
        this.commissionCalculatorService = commissionCalculatorService;
        this.sourceTrackingService = sourceTrackingService;
    }
    async createTrackingCode(createDto, businessId) {
        try {
            const code = await this.sourceTrackingService.generateTrackingCode(businessId, createDto.codeType, createDto.name, {
                description: createDto.description,
                expiresAt: createDto.expiresAt
            });
            const trackingUrl = `${process.env.APP_URL}/book/${businessId}?track=${code}`;
            const qrCodeUrl = createDto.codeType === 'qr_code'
                ? `${process.env.APP_URL}/api/qr/${code}`
                : null;
            return {
                success: true,
                data: {
                    code,
                    trackingUrl,
                    qrCodeUrl,
                    name: createDto.name,
                    codeType: createDto.codeType
                },
                message: 'Tracking code generated successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Failed to generate tracking code'
            };
        }
    }
    async getTrackingCodes(businessId) {
        try {
            const analytics = await this.sourceTrackingService.getTrackingAnalytics(businessId);
            return {
                success: true,
                data: analytics,
                message: 'Tracking codes retrieved successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Failed to retrieve tracking codes'
            };
        }
    }
    async validateTrackingCode(code) {
        try {
            const result = await this.sourceTrackingService.resolveTrackingCode(code);
            return {
                success: result.isValid,
                data: result,
                message: result.isValid
                    ? 'Tracking code is valid'
                    : 'Invalid or expired tracking code'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Failed to validate tracking code'
            };
        }
    }
    async getBookingCommission(bookingId, businessId) {
        try {
            const commission = await this.commissionCalculatorService
                .getCommissionByBooking(bookingId);
            if (!commission) {
                return {
                    success: false,
                    message: 'Commission record not found for this booking'
                };
            }
            if (commission.businessId.toString() !== businessId) {
                return {
                    success: false,
                    message: 'Unauthorized access to commission record'
                };
            }
            return {
                success: true,
                data: commission,
                message: 'Commission details retrieved successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Failed to retrieve commission details'
            };
        }
    }
    async getCommissionSummary(query, businessId) {
        try {
            const summary = await this.commissionCalculatorService
                .getBusinessCommissionSummary(businessId, query.startDate ? new Date(query.startDate) : undefined, query.endDate ? new Date(query.endDate) : undefined);
            return {
                success: true,
                data: summary,
                message: 'Commission summary retrieved successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Failed to retrieve commission summary'
            };
        }
    }
    async disputeCommission(commissionId, disputeDto, businessId) {
        try {
            const commission = await this.commissionCalculatorService
                .getCommissionByBooking(commissionId);
            if (commission && commission.businessId.toString() !== businessId) {
                return {
                    success: false,
                    message: 'Unauthorized access to commission record'
                };
            }
            await this.commissionCalculatorService.disputeCommission(commissionId, disputeDto.reason, disputeDto.disputedBy);
            return {
                success: true,
                message: 'Commission dispute submitted successfully. Our team will review it.'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Failed to submit commission dispute'
            };
        }
    }
    async getSourceBreakdown(startDate, endDate, businessId) {
        try {
            const breakdown = await this.commissionCalculatorService
                .getSourceBreakdown(businessId, new Date(startDate), new Date(endDate));
            return {
                success: true,
                data: breakdown,
                message: 'Source breakdown retrieved successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Failed to retrieve source breakdown'
            };
        }
    }
};
__decorate([
    (0, common_1.Post)('tracking-codes'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate tracking code for marketing channel' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tracking_code_dto_1.CreateTrackingCodeDto, String]),
    __metadata("design:returntype", Promise)
], CommissionController.prototype, "createTrackingCode", null);
__decorate([
    (0, common_1.Get)('tracking-codes'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tracking codes for business' }),
    __param(0, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommissionController.prototype, "getTrackingCodes", null);
__decorate([
    (0, common_1.Get)('tracking-codes/:code/validate'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate tracking code' }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommissionController.prototype, "validateTrackingCode", null);
__decorate([
    (0, common_1.Get)('bookings/:bookingId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get commission details for booking' }),
    __param(0, (0, common_1.Param)('bookingId')),
    __param(1, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CommissionController.prototype, "getBookingCommission", null);
__decorate([
    (0, common_1.Get)('business/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get commission summary for business' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_commissions_dto_1.GetCommissionsDto, String]),
    __metadata("design:returntype", Promise)
], CommissionController.prototype, "getCommissionSummary", null);
__decorate([
    (0, common_1.Post)(':commissionId/dispute'),
    (0, swagger_1.ApiOperation)({ summary: 'Dispute a commission charge' }),
    __param(0, (0, common_1.Param)('commissionId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dispute_commission_dto_1.DisputeCommissionDto, String]),
    __metadata("design:returntype", Promise)
], CommissionController.prototype, "disputeCommission", null);
__decorate([
    (0, common_1.Get)('analytics/source-breakdown'),
    (0, swagger_1.ApiOperation)({ summary: 'Get booking source breakdown with commission impact' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CommissionController.prototype, "getSourceBreakdown", null);
CommissionController = __decorate([
    (0, swagger_1.ApiTags)('Commission'),
    (0, common_1.Controller)('commission'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [commission_calculator_service_1.CommissionCalculatorService,
        source_tracking_service_1.SourceTrackingService])
], CommissionController);
exports.CommissionController = CommissionController;
//# sourceMappingURL=commission.controller.js.map