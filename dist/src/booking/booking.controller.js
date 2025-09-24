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
exports.BookingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const booking_service_1 = require("./booking.service");
const create_booking_dto_1 = require("./dto/create-booking.dto");
const update_booking_dto_1 = require("./dto/update-booking.dto");
const booking_query_dto_1 = require("./dto/booking-query.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_schema_1 = require("../auth/schemas/user.schema");
const audit_interceptor_1 = require("../audit/interceptors/audit.interceptor");
const audit_decorator_1 = require("../audit/decorators/audit.decorator");
const audit_log_schema_1 = require("../audit/schemas/audit-log.schema");
let BookingController = class BookingController {
    constructor(bookingService) {
        this.bookingService = bookingService;
    }
    create(createBookingDto) {
        return this.bookingService.create(createBookingDto);
    }
    findAll(query) {
        return this.bookingService.findAll(query);
    }
    getStats() {
        return this.bookingService.getBookingStats();
    }
    getByDate(date) {
        const bookingDate = new Date(date);
        return this.bookingService.getBookingsByDate(bookingDate);
    }
    findOne(id) {
        return this.bookingService.findOne(id);
    }
    update(id, updateBookingDto) {
        return this.bookingService.update(id, updateBookingDto);
    }
    updateStatus(id, body) {
        return this.bookingService.updateStatus(id, body.status, body.cancellationReason);
    }
    remove(id) {
        return this.bookingService.remove(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF, user_schema_1.UserRole.CLIENT),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.CREATE, entity: audit_log_schema_1.AuditEntity.BOOKING }),
    (0, swagger_1.ApiOperation)({ summary: "Create a new booking" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Booking created successfully" }),
    (0, swagger_1.ApiResponse)({ status: 409, description: "Time slot conflict" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_booking_dto_1.CreateBookingDto]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF, user_schema_1.UserRole.CLIENT),
    (0, swagger_1.ApiOperation)({ summary: "Get all bookings" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Bookings retrieved successfully" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [booking_query_dto_1.BookingQueryDto]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF, user_schema_1.UserRole.CLIENT),
    (0, swagger_1.ApiOperation)({ summary: "Get booking statistics" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Statistics retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('by-date/:date'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF, user_schema_1.UserRole.CLIENT),
    (0, swagger_1.ApiOperation)({ summary: 'Get bookings by date' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bookings retrieved successfully' }),
    __param(0, (0, common_1.Param)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "getByDate", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF, user_schema_1.UserRole.CLIENT, user_schema_1.UserRole.CLIENT),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.VIEW, entity: audit_log_schema_1.AuditEntity.BOOKING }),
    (0, swagger_1.ApiOperation)({ summary: 'Get booking by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF, user_schema_1.UserRole.CLIENT),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.UPDATE, entity: audit_log_schema_1.AuditEntity.BOOKING }),
    (0, swagger_1.ApiOperation)({ summary: "Update booking" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Booking updated successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Booking not found" }),
    (0, swagger_1.ApiResponse)({ status: 409, description: "Time slot conflict" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_booking_dto_1.UpdateBookingDto]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(":id/status"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF, user_schema_1.UserRole.CLIENT),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.UPDATE, entity: audit_log_schema_1.AuditEntity.BOOKING }),
    (0, swagger_1.ApiOperation)({ summary: "Update booking status" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Status updated successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Booking not found" }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.CLIENT),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.DELETE, entity: audit_log_schema_1.AuditEntity.BOOKING }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete booking' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "remove", null);
BookingController = __decorate([
    (0, swagger_1.ApiTags)("Bookings"),
    (0, common_1.Controller)("bookings"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.UseInterceptors)(audit_interceptor_1.AuditInterceptor),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [booking_service_1.BookingService])
], BookingController);
exports.BookingController = BookingController;
//# sourceMappingURL=booking.controller.js.map