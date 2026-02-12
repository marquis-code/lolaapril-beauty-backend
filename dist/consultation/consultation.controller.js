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
exports.ConsultationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const consultation_service_1 = require("./consultation.service");
const business_service_1 = require("../business/business.service");
const consultation_dto_1 = require("./dto/consultation.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const business_context_decorator_1 = require("../auth/decorators/business-context.decorator");
let ConsultationController = class ConsultationController {
    constructor(consultationService, businessService) {
        this.consultationService = consultationService;
        this.businessService = businessService;
    }
    async createPackage(businessId, dto) {
        return this.consultationService.createPackage(businessId, dto);
    }
    async getAllPackages(businessId) {
        return this.consultationService.getPackages(businessId, false);
    }
    async updatePackage(businessId, id, dto) {
        return this.consultationService.updatePackage(businessId, id, dto);
    }
    async updateAvailability(businessId, dto) {
        return this.consultationService.updateAvailability(businessId, dto);
    }
    async getAvailability(businessId) {
        return this.consultationService.getAvailability(businessId);
    }
    async getBookings(businessId) {
        return this.consultationService.getBookings(businessId);
    }
    async confirmBooking(businessId, id) {
        return this.consultationService.confirmBooking(id);
    }
    async completeBooking(businessId, id) {
        return this.consultationService.completeBooking(businessId, id);
    }
    async getActivePackages(subdomain) {
        const business = await this.businessService.getBySubdomain(subdomain);
        return this.consultationService.getPackages(business._id.toString(), true);
    }
    async getSlots(subdomain, date, packageId) {
        const business = await this.businessService.getBySubdomain(subdomain);
        return this.consultationService.getAvailableSlots(business._id.toString(), date, packageId);
    }
    async book(user, subdomain, dto) {
        const business = await this.businessService.getBySubdomain(subdomain);
        return this.consultationService.bookConsultation(user.sub, business._id.toString(), dto);
    }
    async getMyBookings(user) {
        return this.consultationService.getClientBookings(user.sub);
    }
    async verifyPayment(reference) {
        return this.consultationService.verifyBookingPayment(reference);
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('packages'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a consultation package (Business)' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, consultation_dto_1.CreateConsultationPackageDto]),
    __metadata("design:returntype", Promise)
], ConsultationController.prototype, "createPackage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('packages/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all consultation packages including inactive (Business)' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConsultationController.prototype, "getAllPackages", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)('packages/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a consultation package (Business)' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, consultation_dto_1.UpdateConsultationPackageDto]),
    __metadata("design:returntype", Promise)
], ConsultationController.prototype, "updatePackage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Put)('availability'),
    (0, swagger_1.ApiOperation)({ summary: 'Update consultation availability (Business)' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, consultation_dto_1.UpdateConsultationAvailabilityDto]),
    __metadata("design:returntype", Promise)
], ConsultationController.prototype, "updateAvailability", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('availability'),
    (0, swagger_1.ApiOperation)({ summary: 'Get consultation availability (Business)' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConsultationController.prototype, "getAvailability", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('bookings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all consultation bookings (Business)' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConsultationController.prototype, "getBookings", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('bookings/:id/confirm'),
    (0, swagger_1.ApiOperation)({ summary: 'Manually confirm a consultation booking (Business)' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ConsultationController.prototype, "confirmBooking", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('bookings/:id/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Manually mark a consultation as completed (Business)' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ConsultationController.prototype, "completeBooking", null);
__decorate([
    (0, common_1.Get)('subdomain/:subdomain/packages'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active consultation packages for a business (Client)' }),
    __param(0, (0, common_1.Param)('subdomain')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConsultationController.prototype, "getActivePackages", null);
__decorate([
    (0, common_1.Get)('subdomain/:subdomain/slots'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available slots for a package on a date (Client)' }),
    __param(0, (0, common_1.Param)('subdomain')),
    __param(1, (0, common_1.Query)('date')),
    __param(2, (0, common_1.Query)('packageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ConsultationController.prototype, "getSlots", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('book/subdomain/:subdomain'),
    (0, swagger_1.ApiOperation)({ summary: 'Book a consultation (Client)' }),
    __param(0, (0, business_context_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('subdomain')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, consultation_dto_1.BookConsultationDto]),
    __metadata("design:returntype", Promise)
], ConsultationController.prototype, "book", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('my-bookings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user\'s consultation bookings (Client)' }),
    __param(0, (0, business_context_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConsultationController.prototype, "getMyBookings", null);
__decorate([
    (0, common_1.Get)('verify-payment/:reference'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify Paystack payment for a consultation (Client)' }),
    __param(0, (0, common_1.Param)('reference')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConsultationController.prototype, "verifyPayment", null);
ConsultationController = __decorate([
    (0, swagger_1.ApiTags)('Consultation'),
    (0, common_1.Controller)('consultations'),
    __metadata("design:paramtypes", [consultation_service_1.ConsultationService,
        business_service_1.BusinessService])
], ConsultationController);
exports.ConsultationController = ConsultationController;
//# sourceMappingURL=consultation.controller.js.map