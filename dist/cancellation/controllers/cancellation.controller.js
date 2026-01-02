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
exports.CancellationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const tenant_guard_1 = require("../../tenant/guards/tenant.guard");
const cancellation_policy_service_1 = require("../services/cancellation-policy.service");
const no_show_management_service_1 = require("../services/no-show-management.service");
const appointment_service_1 = require("../../appointment/appointment.service");
const cancel_appointment_dto_1 = require("../dto/cancel-appointment.dto");
const record_no_show_dto_1 = require("../dto/record-no-show.dto");
const create_cancellation_policy_dto_1 = require("../dto/create-cancellation-policy.dto");
let CancellationController = class CancellationController {
    constructor(cancellationPolicyService, noShowManagementService, appointmentService) {
        this.cancellationPolicyService = cancellationPolicyService;
        this.noShowManagementService = noShowManagementService;
        this.appointmentService = appointmentService;
    }
    async getPolicy(req) {
        try {
            const businessId = req.tenant.businessId;
            const policy = await this.cancellationPolicyService.getBusinessPolicy(businessId);
            return {
                success: true,
                data: policy,
                message: 'Cancellation policy retrieved successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Failed to retrieve cancellation policy'
            };
        }
    }
    async createOrUpdatePolicy(createDto, req) {
        try {
            const businessId = req.tenant.businessId;
            const policy = await this.cancellationPolicyService.createOrUpdatePolicy(businessId, createDto);
            return {
                success: true,
                data: policy,
                message: 'Cancellation policy created/updated successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Failed to create/update cancellation policy'
            };
        }
    }
    async cancelAppointment(appointmentId, cancelDto, req) {
        try {
            const businessId = req.tenant.businessId;
            const userId = req.user.id;
            const appointment = await this.appointmentService.findOne(appointmentId);
            const refundCalculation = await this.cancellationPolicyService.calculateRefund(businessId, appointment.selectedDate, appointment.paymentDetails.total.amount, appointment.paymentDetails.paymentStatus?.payNow?.amount || 0);
            if (!refundCalculation.canCancel) {
                return {
                    success: false,
                    message: refundCalculation.reason,
                    data: refundCalculation
                };
            }
            await this.appointmentService.updateStatus(appointmentId, 'cancelled', cancelDto.reason);
            if (refundCalculation.hoursNotice < 24) {
                await this.noShowManagementService.recordLateCancellation({
                    clientId: appointment.clientId.toString(),
                    businessId,
                    appointmentId,
                    bookingId: appointmentId,
                    appointmentDate: appointment.selectedDate,
                    scheduledTime: appointment.selectedTime,
                    bookedAmount: appointment.paymentDetails.total.amount,
                    penaltyCharged: refundCalculation.penaltyAmount,
                    hoursNotice: refundCalculation.hoursNotice
                });
            }
            return {
                success: true,
                data: {
                    appointment,
                    refund: refundCalculation
                },
                message: 'Appointment cancelled successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Failed to cancel appointment'
            };
        }
    }
    async recordNoShow(appointmentId, noShowDto, req) {
        try {
            const businessId = req.tenant.businessId;
            const appointment = await this.appointmentService.findOne(appointmentId);
            await this.noShowManagementService.recordNoShow({
                clientId: appointment.clientId.toString(),
                businessId,
                appointmentId,
                bookingId: appointmentId,
                appointmentDate: appointment.selectedDate,
                scheduledTime: appointment.selectedTime,
                bookedAmount: appointment.paymentDetails.total.amount,
                depositAmount: appointment.paymentDetails.paymentStatus?.payNow?.amount || 0,
                wasDeposited: (appointment.paymentDetails.paymentStatus?.payNow?.amount || 0) > 0
            });
            await this.appointmentService.updateStatus(appointmentId, 'no_show');
            return {
                success: true,
                message: 'No-show recorded successfully. Deposit has been forfeited.'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Failed to record no-show'
            };
        }
    }
    async getClientReliability(clientId, req) {
        try {
            const businessId = req.tenant.businessId;
            const reliability = await this.noShowManagementService.getClientReliability(clientId, businessId);
            const depositRequirement = await this.noShowManagementService
                .shouldRequireDeposit(clientId, businessId);
            return {
                success: true,
                data: {
                    ...reliability,
                    depositRequirement
                },
                message: 'Client reliability retrieved successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Failed to retrieve client reliability'
            };
        }
    }
    async getNoShowAnalytics(startDate, endDate, req) {
        try {
            const businessId = req.tenant.businessId;
            const stats = await this.noShowManagementService.getNoShowStats(businessId, new Date(startDate), new Date(endDate));
            return {
                success: true,
                data: stats,
                message: 'No-show analytics retrieved successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Failed to retrieve no-show analytics'
            };
        }
    }
    async calculateRefund(body, req) {
        try {
            const businessId = req.tenant.businessId;
            const calculation = await this.cancellationPolicyService.calculateRefund(businessId, new Date(body.appointmentDate), body.paidAmount, body.depositAmount || 0);
            return {
                success: true,
                data: calculation,
                message: 'Refund calculated successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Failed to calculate refund'
            };
        }
    }
};
__decorate([
    (0, common_1.Get)('policy'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get business cancellation policy' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CancellationController.prototype, "getPolicy", null);
__decorate([
    (0, common_1.Post)('policy'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create or update cancellation policy' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cancellation_policy_dto_1.CreateCancellationPolicyDto, Object]),
    __metadata("design:returntype", Promise)
], CancellationController.prototype, "createOrUpdatePolicy", null);
__decorate([
    (0, common_1.Post)('appointments/:appointmentId/cancel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel appointment with refund calculation' }),
    __param(0, (0, common_1.Param)('appointmentId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, cancel_appointment_dto_1.CancelAppointmentDto, Object]),
    __metadata("design:returntype", Promise)
], CancellationController.prototype, "cancelAppointment", null);
__decorate([
    (0, common_1.Post)('appointments/:appointmentId/no-show'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Record no-show incident' }),
    __param(0, (0, common_1.Param)('appointmentId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, record_no_show_dto_1.RecordNoShowDto, Object]),
    __metadata("design:returntype", Promise)
], CancellationController.prototype, "recordNoShow", null);
__decorate([
    (0, common_1.Get)('clients/:clientId/reliability'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get client reliability score' }),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CancellationController.prototype, "getClientReliability", null);
__decorate([
    (0, common_1.Get)('analytics/no-shows'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get no-show analytics for business' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CancellationController.prototype, "getNoShowAnalytics", null);
__decorate([
    (0, common_1.Post)('calculate-refund'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate potential refund for cancellation' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CancellationController.prototype, "calculateRefund", null);
CancellationController = __decorate([
    (0, swagger_1.ApiTags)('Cancellation'),
    (0, common_1.Controller)('cancellation'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [cancellation_policy_service_1.CancellationPolicyService,
        no_show_management_service_1.NoShowManagementService,
        appointment_service_1.AppointmentService])
], CancellationController);
exports.CancellationController = CancellationController;
//# sourceMappingURL=cancellation.controller.js.map