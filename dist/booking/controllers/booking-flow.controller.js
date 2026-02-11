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
exports.BookingFlowController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const booking_orchestrator_service_1 = require("../services/booking-orchestrator.service");
const confirm_booking_dto_1 = require("../dto/confirm-booking.dto");
const create_booking_with_source_dto_1 = require("../dto/create-booking-with-source.dto");
const auth_1 = require("../../auth");
let BookingFlowController = class BookingFlowController {
    constructor(bookingOrchestrator) {
        this.bookingOrchestrator = bookingOrchestrator;
    }
    async createBooking(createBookingDto) {
        try {
            if (!createBookingDto.businessId) {
                throw new common_1.BadRequestException('Business ID is required');
            }
            if (!createBookingDto.bookingSource) {
                createBookingDto.bookingSource = {
                    sourceType: create_booking_with_source_dto_1.BookingSourceType.DIRECT_LINK
                };
            }
            const result = await this.bookingOrchestrator.createBookingWithValidation(createBookingDto);
            return {
                success: true,
                data: result,
                message: result.message || 'Booking created successfully'
            };
        }
        catch (error) {
            console.error('❌ Booking creation failed:', error.message);
            return {
                success: false,
                error: error.message,
                code: 'BOOKING_CREATION_FAILED',
                message: 'Failed to create booking'
            };
        }
    }
    async confirmBooking(bookingId, confirmDto) {
        try {
            console.log('🎯 CONTROLLER: CONFIRM BOOKING');
            console.log('BookingId:', bookingId);
            console.log('DTO Received:', JSON.stringify(confirmDto, null, 2));
            if (!this.isValidObjectId(bookingId)) {
                throw new common_1.BadRequestException('Invalid booking ID format');
            }
            if (!confirmDto.staffId && (!confirmDto.staffAssignments || confirmDto.staffAssignments.length === 0)) {
                throw new common_1.BadRequestException('Either staffId or staffAssignments must be provided');
            }
            if (confirmDto.staffAssignments && confirmDto.staffAssignments.length > 0) {
                for (const assignment of confirmDto.staffAssignments) {
                    if (!assignment.staffId) {
                        throw new common_1.BadRequestException('staffId is required in staffAssignments');
                    }
                    if (!this.isValidObjectId(assignment.staffId)) {
                        throw new common_1.BadRequestException(`Invalid staffId format: ${assignment.staffId}`);
                    }
                    if (!assignment.serviceId) {
                        throw new common_1.BadRequestException('serviceId is required in staffAssignments');
                    }
                    if (!this.isValidObjectId(assignment.serviceId)) {
                        throw new common_1.BadRequestException(`Invalid serviceId format: ${assignment.serviceId}`);
                    }
                }
                console.log(`✅ Validated ${confirmDto.staffAssignments.length} staff assignments`);
            }
            const result = await this.bookingOrchestrator.confirmBookingAndCreateAppointment(bookingId, confirmDto.staffId, confirmDto.staffAssignments);
            console.log('✅ Booking confirmed successfully');
            return {
                success: true,
                data: result,
                message: result.message || 'Booking confirmed and appointment created successfully'
            };
        }
        catch (error) {
            console.error('❌ CONTROLLER ERROR:', error.message);
            console.error('Error stack:', error.stack);
            return {
                success: false,
                error: error.message,
                code: 'BOOKING_CONFIRMATION_FAILED',
                message: 'Failed to confirm booking'
            };
        }
    }
    async handlePayment(bookingId, paymentDto) {
        try {
            console.log('💳 CONTROLLER: HANDLE PAYMENT');
            console.log('BookingId:', bookingId);
            console.log('Payment amount:', paymentDto.amount);
            console.log('Payment type:', paymentDto.paymentType || 'full');
            if (!this.isValidObjectId(bookingId)) {
                throw new common_1.BadRequestException('Invalid booking ID format');
            }
            if (!paymentDto.amount || paymentDto.amount <= 0) {
                throw new common_1.BadRequestException('Invalid payment amount');
            }
            if (!paymentDto.transactionReference) {
                throw new common_1.BadRequestException('Transaction reference is required');
            }
            const result = await this.bookingOrchestrator.handlePaymentAndComplete(bookingId, paymentDto.transactionReference, {
                amount: paymentDto.amount,
                method: paymentDto.method,
                gateway: paymentDto.gateway,
                clientId: paymentDto.clientId,
                businessId: paymentDto.businessId,
                paymentType: paymentDto.paymentType
            });
            console.log('✅ Payment processed successfully');
            return {
                success: true,
                data: result,
                message: result.message || 'Payment processed and appointment created successfully'
            };
        }
        catch (error) {
            console.error('❌ Payment processing failed:', error.message);
            return {
                success: false,
                error: error.message,
                code: 'PAYMENT_PROCESSING_FAILED',
                message: 'Payment processing failed'
            };
        }
    }
    isValidObjectId(id) {
        return typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
    }
};
__decorate([
    (0, auth_1.Public)(),
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new booking (Public)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Booking created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingFlowController.prototype, "createBooking", null);
__decorate([
    (0, common_1.Post)('confirm/:bookingId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm booking and create appointment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking confirmed successfully' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true
    })),
    __param(0, (0, common_1.Param)('bookingId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, confirm_booking_dto_1.ConfirmBookingDto]),
    __metadata("design:returntype", Promise)
], BookingFlowController.prototype, "confirmBooking", null);
__decorate([
    (0, auth_1.Public)(),
    (0, common_1.Post)('payment/:bookingId'),
    (0, swagger_1.ApiOperation)({ summary: 'Process payment for booking (Public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment processed successfully' }),
    __param(0, (0, common_1.Param)('bookingId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingFlowController.prototype, "handlePayment", null);
BookingFlowController = __decorate([
    (0, swagger_1.ApiTags)('Booking Flow'),
    (0, common_1.Controller)('booking-flow'),
    __metadata("design:paramtypes", [booking_orchestrator_service_1.BookingOrchestrator])
], BookingFlowController);
exports.BookingFlowController = BookingFlowController;
//# sourceMappingURL=booking-flow.controller.js.map