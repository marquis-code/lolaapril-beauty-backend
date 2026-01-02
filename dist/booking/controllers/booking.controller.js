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
const booking_orchestrator_service_1 = require("../services/booking-orchestrator.service");
const booking_service_1 = require("../services/booking.service");
const create_booking_dto_1 = require("../dto/create-booking.dto");
const process_payment_dto_1 = require("../dto/process-payment.dto");
const update_booking_dto_1 = require("../dto/update-booking.dto");
const get_bookings_dto_1 = require("../dto/get-bookings.dto");
const tenant_guard_1 = require("../../tenant/guards/tenant.guard");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const create_booking_with_source_dto_1 = require("../dto/create-booking-with-source.dto");
let BookingController = class BookingController {
    constructor(bookingOrchestrator, bookingService) {
        this.bookingOrchestrator = bookingOrchestrator;
        this.bookingService = bookingService;
    }
    async createAutomatedBooking(createBookingDto, req) {
        try {
            const businessId = req.tenant.businessId;
            const bookingData = {
                ...createBookingDto,
                businessId
            };
            if (!bookingData.bookingSource) {
                bookingData.bookingSource = {
                    sourceType: create_booking_with_source_dto_1.BookingSourceType.DIRECT_LINK
                };
            }
            const result = await this.bookingOrchestrator.createBookingWithValidation(bookingData);
            return {
                success: true,
                data: result,
                message: result.message || 'Booking created successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                code: 'BOOKING_CREATION_FAILED',
                message: 'Failed to create booking'
            };
        }
    }
    async processPaymentAndCreateAppointment(processPaymentDto) {
        try {
            const result = await this.bookingOrchestrator.handlePaymentAndComplete(processPaymentDto.bookingId, processPaymentDto.transactionReference, {
                amount: processPaymentDto.amount,
                method: processPaymentDto.paymentMethod,
                gateway: processPaymentDto.gateway,
                clientId: processPaymentDto.clientId,
                businessId: processPaymentDto.businessId
            });
            return {
                success: true,
                data: result,
                message: 'Payment successful! Your appointment has been confirmed automatically.'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                code: 'PAYMENT_PROCESSING_FAILED',
                message: 'Payment processing failed'
            };
        }
    }
    async confirmBookingManually(bookingId, staffId, req) {
        try {
            const confirmedBy = req.user.id;
            const result = await this.bookingOrchestrator.confirmBookingAndCreateAppointment(bookingId, confirmedBy);
            return {
                success: true,
                data: result,
                message: 'Booking confirmed and appointment created successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                code: 'BOOKING_CONFIRMATION_FAILED',
                message: 'Failed to confirm booking'
            };
        }
    }
    async getBookings(getBookingsDto, req) {
        try {
            const businessId = req.tenant.businessId;
            const bookings = await this.bookingService.getBookings({
                ...getBookingsDto,
                businessId
            });
            return {
                success: true,
                data: bookings,
                message: 'Bookings retrieved successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                code: 'BOOKINGS_RETRIEVAL_FAILED',
                message: 'Failed to retrieve bookings'
            };
        }
    }
    async getBookingById(bookingId) {
        try {
            const booking = await this.bookingService.getBookingById(bookingId);
            return {
                success: true,
                data: booking,
                message: 'Booking retrieved successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                code: 'BOOKING_NOT_FOUND',
                message: 'Booking not found'
            };
        }
    }
    async updateBookingStatus(bookingId, updateStatusDto) {
        try {
            const booking = await this.bookingService.updateBookingStatus(bookingId, updateStatusDto.status, updateStatusDto.updatedBy, updateStatusDto.reason);
            return {
                success: true,
                data: booking,
                message: 'Booking status updated successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                code: 'STATUS_UPDATE_FAILED',
                message: 'Failed to update booking status'
            };
        }
    }
    async cancelBooking(bookingId, reason, req) {
        try {
            const userId = req.user.id;
            await this.bookingService.cancelBooking(bookingId, reason, userId);
            return {
                success: true,
                message: 'Booking cancelled successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                code: 'BOOKING_CANCELLATION_FAILED',
                message: 'Failed to cancel booking'
            };
        }
    }
    async getClientBookings(clientId, status) {
        try {
            const bookings = await this.bookingService.getClientBookings(clientId, status);
            return {
                success: true,
                data: bookings,
                message: 'Client bookings retrieved successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                code: 'CLIENT_BOOKINGS_RETRIEVAL_FAILED',
                message: 'Failed to retrieve client bookings'
            };
        }
    }
    async getTodayBookings(req) {
        try {
            const businessId = req.tenant.businessId;
            const bookings = await this.bookingService.getTodayBookings(businessId);
            return {
                success: true,
                data: bookings,
                message: 'Today\'s bookings retrieved successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                code: 'TODAY_BOOKINGS_RETRIEVAL_FAILED',
                message: 'Failed to retrieve today\'s bookings'
            };
        }
    }
    async rejectBooking(bookingId, reason, req) {
        try {
            const rejectedBy = req.user.id;
            await this.bookingService.rejectBooking(bookingId, reason, rejectedBy);
            return {
                success: true,
                message: 'Booking rejected successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                code: 'BOOKING_REJECTION_FAILED',
                message: 'Failed to reject booking'
            };
        }
    }
};
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_booking_dto_1.CreateBookingDto, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "createAutomatedBooking", null);
__decorate([
    (0, common_1.Post)('process-payment'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [process_payment_dto_1.ProcessPaymentDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "processPaymentAndCreateAppointment", null);
__decorate([
    (0, common_1.Post)(':bookingId/confirm'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('bookingId')),
    __param(1, (0, common_1.Body)('staffId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "confirmBookingManually", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_bookings_dto_1.GetBookingsDto, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getBookings", null);
__decorate([
    (0, common_1.Get)(':bookingId'),
    __param(0, (0, common_1.Param)('bookingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getBookingById", null);
__decorate([
    (0, common_1.Put)(':bookingId/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('bookingId')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_booking_dto_1.UpdateBookingStatusDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "updateBookingStatus", null);
__decorate([
    (0, common_1.Post)(':bookingId/cancel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('bookingId')),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "cancelBooking", null);
__decorate([
    (0, common_1.Get)('client/:clientId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getClientBookings", null);
__decorate([
    (0, common_1.Get)('business/today'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getTodayBookings", null);
__decorate([
    (0, common_1.Post)(':bookingId/reject'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('bookingId')),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "rejectBooking", null);
BookingController = __decorate([
    (0, common_1.Controller)('bookings'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [booking_orchestrator_service_1.BookingOrchestrator,
        booking_service_1.BookingService])
], BookingController);
exports.BookingController = BookingController;
//# sourceMappingURL=booking.controller.js.map