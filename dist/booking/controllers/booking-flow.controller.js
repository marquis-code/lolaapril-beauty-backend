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
const booking_orchestrator_service_1 = require("../services/booking-orchestrator.service");
const create_booking_dto_1 = require("../dto/create-booking.dto");
const confirm_booking_dto_1 = require("../dto/confirm-booking.dto");
let BookingFlowController = class BookingFlowController {
    constructor(bookingOrchestrator) {
        this.bookingOrchestrator = bookingOrchestrator;
    }
    async createBooking(createBookingDto, req) {
        var _a;
        try {
            const businessId = createBookingDto.businessId || ((_a = req.tenant) === null || _a === void 0 ? void 0 : _a.businessId);
            if (!businessId) {
                throw new common_1.BadRequestException('Business ID is required');
            }
            const result = await this.bookingOrchestrator.createBookingWithValidation(Object.assign(Object.assign({}, createBookingDto), { businessId }));
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
    async confirmBooking(bookingId, confirmDto, req) {
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
            return {
                success: true,
                data: result,
                message: 'Booking confirmed and appointment created successfully'
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
            if (!this.isValidObjectId(bookingId)) {
                throw new common_1.BadRequestException('Invalid booking ID format');
            }
            const result = await this.bookingOrchestrator.handlePaymentAndComplete(bookingId, paymentDto.transactionReference, {
                amount: paymentDto.amount,
                method: paymentDto.method,
                gateway: paymentDto.gateway,
                clientId: paymentDto.clientId,
                businessId: paymentDto.businessId
            });
            return {
                success: true,
                data: result,
                message: 'Payment processed and appointment created successfully'
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
    isValidObjectId(id) {
        return typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
    }
};
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_booking_dto_1.CreateBookingDto, Object]),
    __metadata("design:returntype", Promise)
], BookingFlowController.prototype, "createBooking", null);
__decorate([
    (0, common_1.Post)('confirm/:bookingId'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true
    })),
    __param(0, (0, common_1.Param)('bookingId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, confirm_booking_dto_1.ConfirmBookingDto, Object]),
    __metadata("design:returntype", Promise)
], BookingFlowController.prototype, "confirmBooking", null);
__decorate([
    (0, common_1.Post)('payment/:bookingId'),
    __param(0, (0, common_1.Param)('bookingId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingFlowController.prototype, "handlePayment", null);
BookingFlowController = __decorate([
    (0, common_1.Controller)('booking-flow'),
    __metadata("design:paramtypes", [booking_orchestrator_service_1.BookingOrchestrator])
], BookingFlowController);
exports.BookingFlowController = BookingFlowController;
//# sourceMappingURL=booking-flow.controller.js.map