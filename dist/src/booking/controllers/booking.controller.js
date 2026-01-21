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
const booking_service_1 = require("../services/booking.service");
const booking_orchestrator_service_1 = require("../services/booking-orchestrator.service");
const create_booking_with_source_dto_1 = require("../dto/create-booking-with-source.dto");
const get_bookings_dto_1 = require("../dto/get-bookings.dto");
const confirm_booking_dto_1 = require("../dto/confirm-booking.dto");
const process_payment_dto_1 = require("../dto/process-payment.dto");
const update_booking_dto_1 = require("../dto/update-booking.dto");
const reschedule_booking_dto_1 = require("../dto/reschedule-booking.dto");
const auth_1 = require("../../auth");
let BookingController = class BookingController {
    constructor(bookingService, bookingOrchestrator) {
        this.bookingService = bookingService;
        this.bookingOrchestrator = bookingOrchestrator;
    }
    async createBooking(createBookingDto) {
        return this.bookingOrchestrator.createBookingWithValidation(createBookingDto);
    }
    async getBookings(businessId, query) {
        return this.bookingService.getBookings({
            ...query,
            businessId
        });
    }
    async getBookingById(id, user) {
        const booking = await this.bookingService.getBookingById(id);
        if (user.role === 'client') {
            if (booking.clientId.toString() !== user.sub) {
                return { success: false, message: 'Access denied' };
            }
        }
        else if (user.businessId) {
            if (booking.businessId.toString() !== user.businessId) {
                return { success: false, message: 'Access denied' };
            }
        }
        return { success: true, data: booking };
    }
    async getMyBookings(user, status) {
        console.log('🔍 [GET MY BOOKINGS] User ID from token:', user.sub);
        console.log('🔍 [GET MY BOOKINGS] Full user object:', JSON.stringify(user, null, 2));
        return this.bookingService.getClientBookings(user.sub, status);
    }
    async getTodayBookings(businessId) {
        return this.bookingService.getTodayBookings(businessId);
    }
    async getPendingBookings(businessId) {
        return this.bookingService.getPendingBookings(businessId);
    }
    async getUpcomingBookings(businessId, days) {
        return this.bookingService.getUpcomingBookings(businessId, days ? parseInt(days.toString()) : 7);
    }
    async confirmBooking(bookingId, context, confirmDto) {
        const booking = await this.bookingService.getBookingById(bookingId);
        if (booking.businessId.toString() !== context.businessId) {
            throw new Error('Access denied');
        }
        return this.bookingOrchestrator.confirmBookingAndCreateAppointment(bookingId, confirmDto.staffId, confirmDto.staffAssignments);
    }
    async processPayment(bookingId, paymentDto) {
        return this.bookingOrchestrator.handlePaymentAndComplete(bookingId, paymentDto.transactionReference, {
            amount: paymentDto.amount,
            method: paymentDto.paymentMethod,
            gateway: paymentDto.gateway,
            clientId: paymentDto.clientId,
            businessId: paymentDto.businessId,
            paymentType: paymentDto.paymentType
        });
    }
    async updateBookingStatus(bookingId, context, statusDto) {
        const booking = await this.bookingService.getBookingById(bookingId);
        if (booking.businessId.toString() !== context.businessId) {
            return { success: false, message: 'Access denied' };
        }
        return this.bookingService.updateBookingStatus(bookingId, statusDto.status, context.userId, statusDto.reason);
    }
    async rejectBooking(bookingId, context, body) {
        const booking = await this.bookingService.getBookingById(bookingId);
        if (booking.businessId.toString() !== context.businessId) {
            return { success: false, message: 'Access denied' };
        }
        await this.bookingService.rejectBooking(bookingId, body.reason, context.userId);
        return { success: true, message: 'Booking rejected successfully' };
    }
    async cancelBooking(bookingId, user, body) {
        const booking = await this.bookingService.getBookingById(bookingId);
        if (user.role === 'client') {
            if (booking.clientId.toString() !== user.sub) {
                return { success: false, message: 'Access denied' };
            }
        }
        else if (user.businessId) {
            if (booking.businessId.toString() !== user.businessId) {
                return { success: false, message: 'Access denied' };
            }
        }
        await this.bookingService.cancelBooking(bookingId, body.reason, user.sub);
        return { success: true, message: 'Booking cancelled successfully' };
    }
    async rescheduleBooking(bookingId, user, rescheduleDto) {
        const booking = await this.bookingService.getBookingById(bookingId);
        if (user.role === 'client') {
            if (booking.clientId.toString() !== user.sub) {
                return { success: false, message: 'Access denied' };
            }
        }
        else if (user.businessId) {
            if (booking.businessId.toString() !== user.businessId) {
                return { success: false, message: 'Access denied' };
            }
        }
        const newPreferredDate = new Date(rescheduleDto.newPreferredDate);
        const rescheduledBooking = await this.bookingService.rescheduleBooking(bookingId, newPreferredDate, rescheduleDto.newPreferredStartTime, rescheduleDto.reason, user.sub);
        return {
            success: true,
            message: 'Booking rescheduled successfully',
            data: rescheduledBooking
        };
    }
    async extendBooking(bookingId, context, body) {
        const booking = await this.bookingService.getBookingById(bookingId);
        if (booking.businessId.toString() !== context.businessId) {
            return { success: false, message: 'Access denied' };
        }
        return this.bookingService.extendBookingExpiry(bookingId, body.additionalMinutes || 30);
    }
    async getBookingStats(businessId, startDate, endDate) {
        return this.bookingService.getBookingStats(businessId, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
    }
    async resetBookingForRetry(bookingId, context) {
        const booking = await this.bookingService.getBookingById(bookingId);
        if (booking.businessId.toString() !== context.businessId) {
            return { success: false, message: 'Access denied' };
        }
        await this.bookingOrchestrator.resetBookingForPaymentRetry(bookingId);
        return { success: true, message: 'Booking reset for payment retry' };
    }
};
__decorate([
    (0, auth_1.Public)(),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new booking (Public)',
        description: 'Creates a booking for any business. businessId must be provided in the request body.'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Booking created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid booking data' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_booking_with_source_dto_1.CreateBookingWithSourceDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "createBooking", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all bookings for authenticated business',
        description: 'Returns bookings filtered by the business in the JWT token'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bookings retrieved successfully' }),
    __param(0, (0, auth_1.BusinessId)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, get_bookings_dto_1.GetBookingsDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getBookings", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get booking by ID',
        description: 'Returns booking details. Clients can only view their own bookings.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getBookingById", null);
__decorate([
    (0, common_1.Get)('my/bookings'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get my bookings as a client',
        description: 'Returns all bookings for the authenticated client'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Client bookings retrieved successfully' }),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getMyBookings", null);
__decorate([
    (0, common_1.Get)('today/bookings'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: "Get today's bookings for authenticated business"
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Today's bookings retrieved successfully" }),
    __param(0, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getTodayBookings", null);
__decorate([
    (0, common_1.Get)('pending/bookings'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get pending bookings for authenticated business'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending bookings retrieved successfully' }),
    __param(0, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getPendingBookings", null);
__decorate([
    (0, common_1.Get)('upcoming/bookings'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get upcoming bookings for authenticated business'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Upcoming bookings retrieved successfully' }),
    __param(0, (0, auth_1.BusinessId)()),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getUpcomingBookings", null);
__decorate([
    (0, auth_1.ValidateBusiness)(),
    (0, common_1.Post)(':id/confirm'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Confirm booking and create appointment',
        description: 'Confirms a pending booking and creates an appointment with staff assignment'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking confirmed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_1.BusinessContext)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, confirm_booking_dto_1.ConfirmBookingDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "confirmBooking", null);
__decorate([
    (0, auth_1.Public)(),
    (0, common_1.Post)(':id/payment'),
    (0, swagger_1.ApiOperation)({
        summary: 'Process payment for booking',
        description: 'Processes payment and completes the booking flow'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment processed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Payment processing failed' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, process_payment_dto_1.ProcessPaymentDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "processPayment", null);
__decorate([
    (0, auth_1.ValidateBusiness)(),
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update booking status',
        description: 'Updates the status of a booking (confirm, reject, cancel)'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_1.BusinessContext)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_booking_dto_1.UpdateBookingStatusDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "updateBookingStatus", null);
__decorate([
    (0, auth_1.ValidateBusiness)(),
    (0, common_1.Post)(':id/reject'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Reject booking',
        description: 'Rejects a pending booking with reason'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking rejected successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_1.BusinessContext)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "rejectBooking", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Cancel booking',
        description: 'Cancels a booking. Clients can cancel their own bookings, business users can cancel any booking in their business.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking cancelled successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "cancelBooking", null);
__decorate([
    (0, common_1.Post)(':id/reschedule'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Reschedule booking',
        description: 'Reschedules a booking to a new date/time. Clients can reschedule their own bookings, business users can reschedule any booking in their business.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking rescheduled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot reschedule this booking' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, reschedule_booking_dto_1.RescheduleBookingDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "rescheduleBooking", null);
__decorate([
    (0, auth_1.ValidateBusiness)(),
    (0, common_1.Post)(':id/extend'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Extend booking expiry time',
        description: 'Extends the expiry time for pending bookings'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking expiry extended' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_1.BusinessContext)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "extendBooking", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get booking statistics',
        description: 'Returns booking statistics for the authenticated business'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    __param(0, (0, auth_1.BusinessId)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getBookingStats", null);
__decorate([
    (0, auth_1.ValidateBusiness)(),
    (0, common_1.Post)(':id/reset-for-retry'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Reset failed booking for payment retry',
        description: 'Resets a payment_failed booking to pending status'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking reset successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_1.BusinessContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "resetBookingForRetry", null);
BookingController = __decorate([
    (0, swagger_1.ApiTags)('Bookings'),
    (0, common_1.Controller)('bookings'),
    __metadata("design:paramtypes", [booking_service_1.BookingService,
        booking_orchestrator_service_1.BookingOrchestrator])
], BookingController);
exports.BookingController = BookingController;
//# sourceMappingURL=booking.controller.js.map