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
const swagger_1 = require("@nestjs/swagger");
const availability_service_1 = require("./availability.service");
const check_availability_dto_1 = require("./dto/check-availability.dto");
const get_available_slots_dto_1 = require("./dto/get-available-slots.dto");
const get_all_slots_dto_1 = require("./dto/get-all-slots.dto");
const business_context_decorator_1 = require("../auth/decorators/business-context.decorator");
const business_auth_guard_1 = require("../auth/guards/business-auth.guard");
const user_schema_1 = require("../auth/schemas/user.schema");
const auth_1 = require("../auth");
let AvailabilityController = class AvailabilityController {
    constructor(availabilityService) {
        this.availabilityService = availabilityService;
    }
    async getAvailableSlots(dto, businessId) {
        return {
            success: true,
            data: await this.availabilityService.getAvailableSlots(dto, businessId)
        };
    }
    async checkSlotAvailability(dto) {
        if (!dto.businessId) {
            throw new common_1.BadRequestException('businessId is required in query parameters');
        }
        return {
            success: true,
            data: {
                isAvailable: await this.availabilityService.checkSlotAvailability(dto)
            }
        };
    }
    async getAllSlots(dto, businessId) {
        return {
            success: true,
            data: await this.availabilityService.getAllSlots(dto, businessId)
        };
    }
    async createMyAvailability(context, dto) {
        const fullDto = {
            ...dto,
            businessId: context.businessId,
            staffId: context.userId,
            createdBy: context.userId
        };
        return {
            success: true,
            data: await this.availabilityService.createStaffAvailability(fullDto),
            message: 'Your availability has been updated successfully'
        };
    }
    async blockMyTime(context, dto) {
        const fullDto = {
            ...dto,
            businessId: context.businessId,
            staffId: context.userId
        };
        await this.availabilityService.blockStaffTime(fullDto);
        return {
            success: true,
            message: 'Time slot blocked successfully'
        };
    }
    async createStaffAvailability(context, dto) {
        const fullDto = {
            ...dto,
            businessId: context.businessId,
            createdBy: context.userId
        };
        return {
            success: true,
            data: await this.availabilityService.createStaffAvailability(fullDto),
            message: 'Staff availability created successfully'
        };
    }
    async blockStaffTime(context, dto) {
        const fullDto = {
            ...dto,
            businessId: context.businessId
        };
        await this.availabilityService.blockStaffTime(fullDto);
        return {
            success: true,
            message: 'Staff time blocked successfully'
        };
    }
    async createSimpleBusinessHours(context, dto) {
        if (dto.operates24x7) {
            return {
                success: true,
                data: await this.availabilityService.createBusinessHours24x7(context.businessId),
                message: '24/7 operations enabled successfully'
            };
        }
        else {
            return {
                success: true,
                data: await this.availabilityService.createCustomBusinessHours(context.businessId, dto.weeklySchedule || this.getDefaultWeeklySchedule()),
                message: 'Business hours created successfully'
            };
        }
    }
    async createBusinessHours(businessId) {
        return {
            success: true,
            data: await this.availabilityService.createBusinessHours(businessId),
            message: 'Business hours created successfully'
        };
    }
    async createBusinessHours24x7(businessId) {
        return {
            success: true,
            data: await this.availabilityService.createBusinessHours24x7(businessId),
            message: '24/7 operations enabled successfully'
        };
    }
    async extendStaffAvailability(context, dto) {
        if (dto.staffId) {
            await this.availabilityService.ensureStaffAvailabilityExtended(context.businessId, dto.staffId, dto.daysAhead || 90);
        }
        else {
            await this.availabilityService.ensureAllStaffAvailability(context.businessId, dto.daysAhead || 90);
        }
        return {
            success: true,
            message: 'Staff availability extended successfully'
        };
    }
    async initializeBusiness(context, dto) {
        await this.availabilityService.createBusinessHours24x7(context.businessId);
        for (const staffId of dto.staffIds) {
            await this.availabilityService.setupStaffAvailability24x7(context.businessId, staffId, new Date(), new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), context.userId);
        }
        return {
            success: true,
            message: 'Business initialized with continuous 24/7 availability'
        };
    }
    getDefaultWeeklySchedule() {
        return [
            { dayOfWeek: 0, isOpen: false, timeSlots: [] },
            { dayOfWeek: 1, isOpen: true, timeSlots: [{ startTime: '09:00', endTime: '17:00' }] },
            { dayOfWeek: 2, isOpen: true, timeSlots: [{ startTime: '09:00', endTime: '17:00' }] },
            { dayOfWeek: 3, isOpen: true, timeSlots: [{ startTime: '09:00', endTime: '17:00' }] },
            { dayOfWeek: 4, isOpen: true, timeSlots: [{ startTime: '09:00', endTime: '17:00' }] },
            { dayOfWeek: 5, isOpen: true, timeSlots: [{ startTime: '09:00', endTime: '17:00' }] },
            { dayOfWeek: 6, isOpen: false, timeSlots: [] },
        ];
    }
    async setupAvailability(user, dto) {
        await this.availabilityService.setupAvailabilityForBusiness(dto.businessId, dto.staffIds, dto.startDate, dto.endDate, user.sub);
        return {
            success: true,
            message: 'Availability setup completed'
        };
    }
    async checkFullyBooked(dto) {
        return {
            success: true,
            data: await this.availabilityService.isFullyBooked(dto)
        };
    }
    async getDetailedSlots(user, dto) {
        const businessId = user?.businessId || dto.businessId;
        if (!businessId) {
            throw new common_1.BadRequestException('businessId is required (either in JWT or query params)');
        }
        const slotsDto = { ...dto, businessId };
        return {
            success: true,
            data: await this.availabilityService.getAvailableSlots(slotsDto),
            userContext: user ? {
                isAuthenticated: true,
                role: user.role,
                businessId: user.businessId
            } : {
                isAuthenticated: false
            }
        };
    }
};
__decorate([
    (0, common_1.Get)('slots'),
    (0, auth_1.Public)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get available time slots (Public with subdomain or authenticated)',
        description: 'Used by clients to view available appointment slots. Provide either subdomain in query params or use authentication.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Available slots retrieved successfully' }),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __param(1, (0, auth_1.OptionalBusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_available_slots_dto_1.GetAvailableSlotsDto, String]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "getAvailableSlots", null);
__decorate([
    (0, common_1.Get)('check'),
    (0, swagger_1.ApiOperation)({
        summary: 'Check if a time slot is available (Public - for booking)',
        description: 'Used by clients to check if a specific time slot is available'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Availability checked successfully' }),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [check_availability_dto_1.CheckAvailabilityDto]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "checkSlotAvailability", null);
__decorate([
    (0, common_1.Get)('all-slots'),
    (0, auth_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all slots summary (Public - for calendar view)',
        description: 'Returns a summary of available slots for date range. Provide either subdomain or businessId in query params, or use authentication.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Slots summary retrieved successfully',
        schema: {
            example: {
                success: true,
                data: {
                    dateRange: {
                        start: '2026-01-20',
                        end: '2026-04-20'
                    },
                    slots: [
                        {
                            date: '2026-01-20',
                            hasSlots: true,
                            availableSlotCount: 24,
                            totalSlots: 32,
                            staffAvailable: 3
                        }
                    ],
                    summary: {
                        totalDates: 90,
                        datesWithAvailability: 75,
                        datesFullyBooked: 5
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Missing businessId/subdomain'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Business not found'
    }),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __param(1, (0, auth_1.OptionalBusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_slots_dto_1.GetAllSlotsDto, String]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "getAllSlots", null);
__decorate([
    (0, common_1.Post)('staff/my-availability'),
    (0, business_auth_guard_1.RequireBusinessRoles)(user_schema_1.UserRole.STAFF, user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.BUSINESS_OWNER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create/Update my availability (Staff)',
        description: 'Staff members can set their own availability. BusinessId comes from JWT.'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Staff availability created successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessContext)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "createMyAvailability", null);
__decorate([
    (0, common_1.Post)('staff/block-time'),
    (0, business_auth_guard_1.RequireBusinessRoles)(user_schema_1.UserRole.STAFF, user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.BUSINESS_OWNER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Block time slot (Staff)',
        description: 'Staff can block their own time slots'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Time blocked successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessContext)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "blockMyTime", null);
__decorate([
    (0, common_1.Post)('staff/availability'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create staff availability (Admin/Owner)',
        description: 'Business admins/owners can set availability for any staff member'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Staff availability created successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessContext)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "createStaffAvailability", null);
__decorate([
    (0, common_1.Post)('staff/block'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Block staff time (Admin/Owner)',
        description: 'Business admins/owners can block time for any staff member'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff time blocked successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessContext)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "blockStaffTime", null);
__decorate([
    (0, common_1.Post)('business-hours/simple'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create simple business hours (Owner)',
        description: 'Set up basic business operating hours without staff dependency'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Business hours created successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessContext)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "createSimpleBusinessHours", null);
__decorate([
    (0, common_1.Post)('business-hours'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create business hours (Admin/Owner)',
        description: 'Set up business operating hours'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Business hours created successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "createBusinessHours", null);
__decorate([
    (0, common_1.Post)('business-hours/24x7'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Enable 24/7 operations (Owner only)',
        description: 'Set business to operate 24/7'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: '24/7 mode enabled successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "createBusinessHours24x7", null);
__decorate([
    (0, common_1.Post)('extend-availability'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Extend staff availability (Admin/Owner)',
        description: 'Extend availability for staff members into the future'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Availability extended successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessContext)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "extendStaffAvailability", null);
__decorate([
    (0, common_1.Post)('initialize-business'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Initialize business availability (Owner only)',
        description: 'Set up 24/7 availability for all staff members'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Business initialized successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessContext)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "initializeBusiness", null);
__decorate([
    (0, common_1.Post)('admin/setup'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Setup availability for any business (Platform Admin)',
        description: 'Platform admins can set up availability for any business'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Availability setup completed' }),
    __param(0, (0, business_context_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "setupAvailability", null);
__decorate([
    (0, common_1.Post)('admin/check-fully-booked'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Check if time slot is fully booked (Platform Admin)',
        description: 'Platform admins can check availability for any business'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking status checked' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "checkFullyBooked", null);
__decorate([
    (0, common_1.Get)('slots/detailed'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get detailed slot information (Authenticated or Public)',
        description: 'Returns detailed availability. If authenticated, uses JWT businessId. Otherwise requires businessId in query.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Detailed slots retrieved' }),
    __param(0, (0, business_context_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_available_slots_dto_1.GetAvailableSlotsDto]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "getDetailedSlots", null);
AvailabilityController = __decorate([
    (0, swagger_1.ApiTags)('Availability'),
    (0, common_1.Controller)('availability'),
    __metadata("design:paramtypes", [availability_service_1.AvailabilityService])
], AvailabilityController);
exports.AvailabilityController = AvailabilityController;
//# sourceMappingURL=availability.controller.js.map