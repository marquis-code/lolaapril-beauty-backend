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
const business_auth_guard_1 = require("../../auth/guards/business-auth.guard");
const business_context_decorator_1 = require("../../auth/decorators/business-context.decorator");
const user_schema_1 = require("../../auth/schemas/user.schema");
const cancellation_policy_service_1 = require("../services/cancellation-policy.service");
const no_show_management_service_1 = require("../services/no-show-management.service");
const appointment_service_1 = require("../../appointment/appointment.service");
const cancel_appointment_dto_1 = require("../dto/cancel-appointment.dto");
const record_no_show_dto_1 = require("../dto/record-no-show.dto");
const create_cancellation_policy_dto_1 = require("../dto/create-cancellation-policy.dto");
const calculate_refund_dto_1 = require("../dto/calculate-refund.dto");
let CancellationController = class CancellationController {
    constructor(cancellationPolicyService, noShowManagementService, appointmentService) {
        this.cancellationPolicyService = cancellationPolicyService;
        this.noShowManagementService = noShowManagementService;
        this.appointmentService = appointmentService;
    }
    async getPolicy(businessId) {
        const policy = await this.cancellationPolicyService.getBusinessPolicy(businessId);
        return {
            success: true,
            data: policy,
            message: 'Cancellation policy retrieved successfully'
        };
    }
    async getPolicyForService(businessId, serviceId) {
        const policy = await this.cancellationPolicyService.getBusinessPolicy(businessId, serviceId);
        return {
            success: true,
            data: policy,
            message: 'Service cancellation policy retrieved successfully'
        };
    }
    async createOrUpdatePolicy(context, createDto) {
        const policy = await this.cancellationPolicyService.createOrUpdatePolicy(context.businessId, createDto);
        return {
            success: true,
            data: policy,
            message: 'Cancellation policy saved successfully'
        };
    }
    async updatePolicy(businessId, updateDto) {
        const policy = await this.cancellationPolicyService.updatePolicy(businessId, updateDto);
        return {
            success: true,
            data: policy,
            message: 'Cancellation policy updated successfully'
        };
    }
    async cancelAppointment(context, appointmentId, cancelDto) {
        const appointment = await this.appointmentService.findOne(appointmentId);
        if (!appointment) {
            throw new common_1.BadRequestException('Appointment not found');
        }
        if (appointment.businessInfo?.businessId !== context.businessId) {
            throw new common_1.BadRequestException('Appointment does not belong to this business');
        }
        const refundCalculation = await this.cancellationPolicyService.calculateRefund(context.businessId, appointment.selectedDate, appointment.paymentDetails?.total?.amount || 0, appointment.paymentDetails?.paymentStatus?.payNow?.amount || 0);
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
                clientId: appointment.clientId?.toString() || '',
                businessId: context.businessId,
                appointmentId,
                bookingId: appointmentId,
                appointmentDate: appointment.selectedDate,
                scheduledTime: appointment.selectedTime,
                bookedAmount: appointment.paymentDetails?.total?.amount || 0,
                penaltyCharged: refundCalculation.penaltyAmount,
                hoursNotice: refundCalculation.hoursNotice
            });
        }
        return {
            success: true,
            data: {
                appointment: {
                    id: appointmentId,
                    status: 'cancelled',
                    cancelledAt: new Date(),
                    cancelReason: cancelDto.reason
                },
                refund: refundCalculation
            },
            message: 'Appointment cancelled successfully'
        };
    }
    async calculateRefund(businessId, body) {
        const calculation = await this.cancellationPolicyService.calculateRefund(businessId, new Date(body.appointmentDate), body.paidAmount, body.depositAmount || 0);
        return {
            success: true,
            data: calculation,
            message: 'Refund calculated successfully'
        };
    }
    async recordNoShow(context, appointmentId, noShowDto) {
        const appointment = await this.appointmentService.findOne(appointmentId);
        if (!appointment) {
            throw new common_1.BadRequestException('Appointment not found');
        }
        if (appointment.businessInfo?.businessId !== context.businessId) {
            throw new common_1.BadRequestException('Appointment does not belong to this business');
        }
        await this.noShowManagementService.recordNoShow({
            clientId: appointment.clientId?.toString() || '',
            businessId: context.businessId,
            appointmentId,
            bookingId: appointmentId,
            appointmentDate: appointment.selectedDate,
            scheduledTime: appointment.selectedTime,
            bookedAmount: appointment.paymentDetails?.total?.amount || 0,
            depositAmount: appointment.paymentDetails?.paymentStatus?.payNow?.amount || 0,
            wasDeposited: (appointment.paymentDetails?.paymentStatus?.payNow?.amount || 0) > 0
        });
        await this.appointmentService.updateStatus(appointmentId, 'no_show', noShowDto.notes);
        return {
            success: true,
            message: 'No-show recorded successfully. Deposit has been forfeited.',
            data: {
                appointmentId,
                status: 'no_show',
                depositForfeited: (appointment.paymentDetails?.paymentStatus?.payNow?.amount || 0) > 0,
                recordedAt: new Date()
            }
        };
    }
    async getClientReliability(businessId, clientId) {
        const reliability = await this.noShowManagementService.getClientReliability(clientId, businessId);
        const depositRequirement = await this.noShowManagementService
            .shouldRequireDeposit(clientId, businessId);
        return {
            success: true,
            data: {
                ...reliability?.toObject?.() || reliability,
                depositRequirement
            },
            message: 'Client reliability retrieved successfully'
        };
    }
    async getClientHistory(businessId, clientId, limit = '20') {
        const history = await this.noShowManagementService.getClientHistory(clientId, businessId, parseInt(limit));
        return {
            success: true,
            data: history,
            message: 'Client history retrieved successfully'
        };
    }
    async checkDepositRequirement(businessId, clientId) {
        const result = await this.noShowManagementService.shouldRequireDeposit(clientId, businessId);
        return {
            success: true,
            data: result,
            message: result.requiresDeposit
                ? 'Deposit required for this client'
                : 'No deposit required'
        };
    }
    async getNoShowAnalytics(businessId, startDate, endDate) {
        const stats = await this.noShowManagementService.getNoShowStats(businessId, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
        return {
            success: true,
            data: stats,
            message: 'No-show analytics retrieved successfully'
        };
    }
    async getAnalyticsSummary(businessId, period = '30d') {
        const periodMap = {
            '7d': 7,
            '30d': 30,
            '90d': 90,
            '1y': 365
        };
        const days = periodMap[period] || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const [stats, policy, reliabilityMetrics] = await Promise.all([
            this.noShowManagementService.getNoShowStats(businessId, startDate, new Date()),
            this.cancellationPolicyService.getBusinessPolicy(businessId),
            this.noShowManagementService.getReliabilityMetrics(businessId)
        ]);
        return {
            success: true,
            data: {
                period: {
                    days,
                    startDate,
                    endDate: new Date()
                },
                stats,
                policy: {
                    name: policy.policyName,
                    requiresDeposit: policy.requiresDeposit,
                    depositPercentage: policy.depositPercentage
                },
                reliability: reliabilityMetrics
            },
            message: 'Analytics summary retrieved successfully'
        };
    }
    async getCancellationTrends(businessId, startDate, endDate, groupBy = 'day') {
        if (!startDate || !endDate) {
            throw new common_1.BadRequestException('Start date and end date are required');
        }
        const trends = await this.noShowManagementService.getCancellationTrends(businessId, new Date(startDate), new Date(endDate), groupBy);
        return {
            success: true,
            data: trends,
            message: 'Cancellation trends retrieved successfully'
        };
    }
    async calculateDeposit(businessId, body) {
        const policyDeposit = await this.cancellationPolicyService.calculateDepositAmount(businessId, body.totalAmount, body.serviceIds);
        let clientDeposit = null;
        if (body.clientId) {
            clientDeposit = await this.noShowManagementService.shouldRequireDeposit(body.clientId, businessId);
        }
        const requiresDeposit = policyDeposit.requiresDeposit || clientDeposit?.requiresDeposit || false;
        const reason = clientDeposit?.requiresDeposit
            ? clientDeposit.reason
            : policyDeposit.reason;
        return {
            success: true,
            data: {
                requiresDeposit,
                depositAmount: policyDeposit.depositAmount,
                depositPercentage: policyDeposit.depositPercentage,
                reason,
                policyBased: policyDeposit.requiresDeposit,
                clientHistoryBased: clientDeposit?.requiresDeposit || false,
                clientScore: clientDeposit?.score
            },
            message: 'Deposit calculated successfully'
        };
    }
};
__decorate([
    (0, common_1.Get)('policy'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get business cancellation policy',
        description: 'Retrieves the active cancellation policy for the business'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policy retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Policy not found' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CancellationController.prototype, "getPolicy", null);
__decorate([
    (0, common_1.Get)('policy/service/:serviceId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get cancellation policy for specific service',
        description: 'Retrieves the cancellation policy applicable to a specific service'
    }),
    (0, swagger_1.ApiParam)({ name: 'serviceId', description: 'Service ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service policy retrieved successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('serviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CancellationController.prototype, "getPolicyForService", null);
__decorate([
    (0, common_1.Post)('policy'),
    (0, common_1.UseGuards)(business_auth_guard_1.BusinessRolesGuard),
    (0, business_auth_guard_1.RequireBusinessRoles)(user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.BUSINESS_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Create or update cancellation policy',
        description: 'Only business owners and admins can modify cancellation policies'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policy created/updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, business_context_decorator_1.BusinessContext)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_cancellation_policy_dto_1.CreateCancellationPolicyDto]),
    __metadata("design:returntype", Promise)
], CancellationController.prototype, "createOrUpdatePolicy", null);
__decorate([
    (0, common_1.Patch)('policy'),
    (0, common_1.UseGuards)(business_auth_guard_1.BusinessRolesGuard),
    (0, business_auth_guard_1.RequireBusinessRoles)(user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.BUSINESS_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Partially update cancellation policy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policy updated successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_cancellation_policy_dto_1.UpdateCancellationPolicyDto]),
    __metadata("design:returntype", Promise)
], CancellationController.prototype, "updatePolicy", null);
__decorate([
    (0, common_1.Post)('appointments/:appointmentId/cancel'),
    (0, swagger_1.ApiOperation)({
        summary: 'Cancel appointment with refund calculation',
        description: 'Cancels an appointment and calculates refund based on cancellation policy'
    }),
    (0, swagger_1.ApiParam)({ name: 'appointmentId', description: 'Appointment ID to cancel' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment cancelled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cancellation not allowed or failed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Appointment not found' }),
    __param(0, (0, business_context_decorator_1.BusinessContext)()),
    __param(1, (0, common_1.Param)('appointmentId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, cancel_appointment_dto_1.CancelAppointmentDto]),
    __metadata("design:returntype", Promise)
], CancellationController.prototype, "cancelAppointment", null);
__decorate([
    (0, common_1.Post)('calculate-refund'),
    (0, swagger_1.ApiOperation)({
        summary: 'Calculate potential refund for cancellation',
        description: 'Calculates refund amount without actually cancelling the appointment'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Refund calculated successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, calculate_refund_dto_1.CalculateRefundDto]),
    __metadata("design:returntype", Promise)
], CancellationController.prototype, "calculateRefund", null);
__decorate([
    (0, common_1.Post)('appointments/:appointmentId/no-show'),
    (0, common_1.UseGuards)(business_auth_guard_1.BusinessRolesGuard),
    (0, business_auth_guard_1.RequireBusinessRoles)(user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({
        summary: 'Record no-show incident',
        description: 'Records when a client fails to show up for their appointment'
    }),
    (0, swagger_1.ApiParam)({ name: 'appointmentId', description: 'Appointment ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'No-show recorded successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Appointment not found' }),
    __param(0, (0, business_context_decorator_1.BusinessContext)()),
    __param(1, (0, common_1.Param)('appointmentId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, record_no_show_dto_1.RecordNoShowDto]),
    __metadata("design:returntype", Promise)
], CancellationController.prototype, "recordNoShow", null);
__decorate([
    (0, common_1.Get)('clients/:clientId/reliability'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get client reliability score and history',
        description: 'Retrieves reliability metrics for a specific client'
    }),
    (0, swagger_1.ApiParam)({ name: 'clientId', description: 'Client/User ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Client reliability retrieved successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CancellationController.prototype, "getClientReliability", null);
__decorate([
    (0, common_1.Get)('clients/:clientId/history'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get client cancellation and no-show history',
        description: 'Retrieves detailed history of cancellations and no-shows for a client'
    }),
    (0, swagger_1.ApiParam)({ name: 'clientId', description: 'Client/User ID' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Number of records to return' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('clientId')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CancellationController.prototype, "getClientHistory", null);
__decorate([
    (0, common_1.Post)('clients/:clientId/deposit-check'),
    (0, swagger_1.ApiOperation)({
        summary: 'Check if client requires deposit',
        description: 'Determines if a client should be required to pay a deposit based on their history'
    }),
    (0, swagger_1.ApiParam)({ name: 'clientId', description: 'Client/User ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deposit requirement checked successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CancellationController.prototype, "checkDepositRequirement", null);
__decorate([
    (0, common_1.Get)('analytics/no-shows'),
    (0, common_1.UseGuards)(business_auth_guard_1.BusinessRolesGuard),
    (0, business_auth_guard_1.RequireBusinessRoles)(user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.BUSINESS_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get no-show analytics for business',
        description: 'Provides statistical analysis of no-shows and cancellations'
    }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, description: 'Start date (ISO format)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, description: 'End date (ISO format)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Analytics retrieved successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CancellationController.prototype, "getNoShowAnalytics", null);
__decorate([
    (0, common_1.Get)('analytics/summary'),
    (0, common_1.UseGuards)(business_auth_guard_1.BusinessRolesGuard),
    (0, business_auth_guard_1.RequireBusinessRoles)(user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.BUSINESS_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get cancellation analytics summary',
        description: 'Comprehensive overview of cancellations, no-shows, and revenue impact'
    }),
    (0, swagger_1.ApiQuery)({ name: 'period', required: false, enum: ['7d', '30d', '90d', '1y'], description: 'Time period' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Summary retrieved successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CancellationController.prototype, "getAnalyticsSummary", null);
__decorate([
    (0, common_1.Get)('analytics/trends'),
    (0, common_1.UseGuards)(business_auth_guard_1.BusinessRolesGuard),
    (0, business_auth_guard_1.RequireBusinessRoles)(user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.BUSINESS_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get cancellation trends over time',
        description: 'Shows trends in cancellations and no-shows over specified period'
    }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true, description: 'Start date (ISO format)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true, description: 'End date (ISO format)' }),
    (0, swagger_1.ApiQuery)({ name: 'groupBy', required: false, enum: ['day', 'week', 'month'], description: 'Grouping period' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trends retrieved successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('groupBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], CancellationController.prototype, "getCancellationTrends", null);
__decorate([
    (0, common_1.Post)('calculate-deposit'),
    (0, swagger_1.ApiOperation)({
        summary: 'Calculate deposit amount for booking',
        description: 'Calculates required deposit based on policy and client history'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deposit calculated successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CancellationController.prototype, "calculateDeposit", null);
CancellationController = __decorate([
    (0, swagger_1.ApiTags)('Cancellation & No-Show Management'),
    (0, common_1.Controller)('cancellation'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, business_auth_guard_1.BusinessAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [cancellation_policy_service_1.CancellationPolicyService,
        no_show_management_service_1.NoShowManagementService,
        appointment_service_1.AppointmentService])
], CancellationController);
exports.CancellationController = CancellationController;
//# sourceMappingURL=cancellation.controller.js.map