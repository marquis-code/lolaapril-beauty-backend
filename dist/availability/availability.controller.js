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
exports.AvailabilityController = void 0;
const common_1 = require("@nestjs/common");
const availability_service_1 = require("./availability.service");
const create_staff_availability_dto_1 = require("./dto/create-staff-availability.dto");
const check_availability_dto_1 = require("./dto/check-availability.dto");
const get_available_slots_dto_1 = require("./dto/get-available-slots.dto");
const block_staff_time_dto_1 = require("./dto/block-staff-time.dto");
const tenant_guard_1 = require("../tenant/guards/tenant.guard");
const get_all_slots_dto_1 = require("./dto/get-all-slots.dto");
let AvailabilityController = class AvailabilityController {
    constructor(availabilityService) {
        this.availabilityService = availabilityService;
    }
    async getAvailableSlots(dto, req) {
        var _a;
        dto.businessId = dto.businessId || ((_a = req.tenant) === null || _a === void 0 ? void 0 : _a.businessId);
        if (!dto.businessId) {
            throw new common_1.BadRequestException('Business ID is required');
        }
        return {
            success: true,
            data: await this.availabilityService.getAvailableSlots(dto)
        };
    }
    async checkSlotAvailability(dto, req) {
        var _a;
        dto.businessId = dto.businessId || ((_a = req.tenant) === null || _a === void 0 ? void 0 : _a.businessId);
        if (!dto.businessId) {
            throw new common_1.BadRequestException('Business ID is required');
        }
        return {
            success: true,
            data: {
                isAvailable: await this.availabilityService.checkSlotAvailability(dto)
            }
        };
    }
    async createStaffAvailability(dto, req) {
        var _a;
        dto.businessId = dto.businessId || ((_a = req.tenant) === null || _a === void 0 ? void 0 : _a.businessId);
        if (!dto.businessId) {
            throw new common_1.BadRequestException('Business ID is required');
        }
        return {
            success: true,
            data: await this.availabilityService.createStaffAvailability(dto),
            message: 'Staff availability created successfully'
        };
    }
    async blockStaffTime(dto, req) {
        var _a;
        dto.businessId = dto.businessId || ((_a = req.tenant) === null || _a === void 0 ? void 0 : _a.businessId);
        if (!dto.businessId) {
            throw new common_1.BadRequestException('Business ID is required. Please provide businessId in the request body or ensure tenant context is set.');
        }
        await this.availabilityService.blockStaffTime(dto);
        return {
            success: true,
            message: 'Staff time blocked successfully'
        };
    }
    async getAllSlots(dto, req) {
        var _a;
        dto.businessId = dto.businessId || ((_a = req.tenant) === null || _a === void 0 ? void 0 : _a.businessId);
        if (!dto.businessId) {
            throw new common_1.BadRequestException('Business ID is required');
        }
        return {
            success: true,
            data: await this.availabilityService.getAllSlots(dto)
        };
    }
    async createBusinessHours(businessId) {
        return this.availabilityService.createBusinessHours(businessId);
    }
    async setupAvailability(dto) {
        await this.availabilityService.setupAvailabilityForBusiness(dto.businessId, dto.staffIds, dto.startDate, dto.endDate, dto.createdBy);
        return { message: 'Availability setup completed' };
    }
    async createBusinessHours24x7(businessId) {
        return this.availabilityService.createBusinessHours24x7(businessId);
    }
    async checkFullyBooked(dto) {
        return this.availabilityService.isFullyBooked(dto);
    }
};
__decorate([
    (0, common_1.Get)('slots'),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_available_slots_dto_1.GetAvailableSlotsDto, Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "getAvailableSlots", null);
__decorate([
    (0, common_1.Get)('check'),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [check_availability_dto_1.CheckAvailabilityDto, Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "checkSlotAvailability", null);
__decorate([
    (0, common_1.Post)('staff'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_staff_availability_dto_1.CreateStaffAvailabilityDto, Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "createStaffAvailability", null);
__decorate([
    (0, common_1.Post)('staff/block'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [block_staff_time_dto_1.BlockStaffTimeDto, Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "blockStaffTime", null);
__decorate([
    (0, common_1.Get)('all-slots'),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_slots_dto_1.GetAllSlotsDto, Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "getAllSlots", null);
__decorate([
    (0, common_1.Post)('business-hours'),
    __param(0, (0, common_1.Body)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "createBusinessHours", null);
__decorate([
    (0, common_1.Post)('setup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "setupAvailability", null);
__decorate([
    (0, common_1.Post)('business-hours/24x7'),
    __param(0, (0, common_1.Body)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "createBusinessHours24x7", null);
__decorate([
    (0, common_1.Post)('check-fully-booked'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "checkFullyBooked", null);
AvailabilityController = __decorate([
    (0, common_1.Controller)('availability'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [availability_service_1.AvailabilityService])
], AvailabilityController);
exports.AvailabilityController = AvailabilityController;
//# sourceMappingURL=availability.controller.js.map