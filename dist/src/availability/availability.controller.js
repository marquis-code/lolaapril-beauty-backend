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
const availability_service_1 = require("../availability/availability.service");
const create_staff_availability_dto_1 = require("../availability/dto/create-staff-availability.dto");
const check_availability_dto_1 = require("../availability/dto/check-availability.dto");
const get_available_slots_dto_1 = require("../availability/dto/get-available-slots.dto");
const block_staff_time_dto_1 = require("../availability/dto/block-staff-time.dto");
const tenant_guard_1 = require("../tenant/guards/tenant.guard");
let AvailabilityController = class AvailabilityController {
    constructor(availabilityService) {
        this.availabilityService = availabilityService;
    }
    async getAvailableSlots(dto) {
        return {
            success: true,
            data: await this.availabilityService.getAvailableSlots(dto)
        };
    }
    async checkSlotAvailability(dto) {
        return {
            success: true,
            data: {
                isAvailable: await this.availabilityService.checkSlotAvailability(dto)
            }
        };
    }
    async createStaffAvailability(dto) {
        return {
            success: true,
            data: await this.availabilityService.createStaffAvailability(dto),
            message: 'Staff availability created successfully'
        };
    }
    async blockStaffTime(dto) {
        await this.availabilityService.blockStaffTime(dto);
        return {
            success: true,
            message: 'Staff time blocked successfully'
        };
    }
};
__decorate([
    (0, common_1.Get)('slots'),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_available_slots_dto_1.GetAvailableSlotsDto]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "getAvailableSlots", null);
__decorate([
    (0, common_1.Get)('check'),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [check_availability_dto_1.CheckAvailabilityDto]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "checkSlotAvailability", null);
__decorate([
    (0, common_1.Post)('staff'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_staff_availability_dto_1.CreateStaffAvailabilityDto]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "createStaffAvailability", null);
__decorate([
    (0, common_1.Post)('staff/block'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [block_staff_time_dto_1.BlockStaffTimeDto]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "blockStaffTime", null);
AvailabilityController = __decorate([
    (0, common_1.Controller)('availability'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [availability_service_1.AvailabilityService])
], AvailabilityController);
exports.AvailabilityController = AvailabilityController;
//# sourceMappingURL=availability.controller.js.map