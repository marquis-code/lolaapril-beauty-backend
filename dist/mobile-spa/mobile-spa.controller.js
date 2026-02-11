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
exports.MobileSpaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const mobile_spa_service_1 = require("./mobile-spa.service");
const mobile_spa_dto_1 = require("./dto/mobile-spa.dto");
const auth_1 = require("../auth");
let MobileSpaController = class MobileSpaController {
    constructor(mobileSpaService) {
        this.mobileSpaService = mobileSpaService;
    }
    async createRequest(user, dto) {
        const request = await this.mobileSpaService.createRequest(user?.sub || user?._id || user?.id, user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Customer', user?.email || '', user?.phone || '', dto);
        return {
            success: true,
            data: request,
            message: 'Mobile SPA request submitted! The business will review and respond shortly.',
        };
    }
    async getBusinessRequests(businessId, status, page, limit) {
        const result = await this.mobileSpaService.getRequestsByBusiness(businessId, status, page || 1, limit || 20);
        return {
            success: true,
            data: result,
        };
    }
    async getMyRequests(user) {
        const requests = await this.mobileSpaService.getRequestsByClient(user?.sub || user?._id || user?.id);
        return {
            success: true,
            data: requests,
        };
    }
    async getRequest(id) {
        const request = await this.mobileSpaService.getRequestById(id);
        return {
            success: true,
            data: request,
        };
    }
    async acceptRequest(id, dto) {
        const request = await this.mobileSpaService.acceptRequest(id, dto);
        return {
            success: true,
            data: request,
            message: 'Request accepted. Payment link sent to customer.',
        };
    }
    async suggestTime(id, dto) {
        const request = await this.mobileSpaService.suggestNewTime(id, dto);
        return {
            success: true,
            data: request,
            message: 'Alternative time suggested to customer.',
        };
    }
    async rejectRequest(id, dto) {
        const request = await this.mobileSpaService.rejectRequest(id, dto);
        return {
            success: true,
            data: request,
            message: 'Request declined.',
        };
    }
    async markPaid(id) {
        const request = await this.mobileSpaService.markAsPaid(id);
        return {
            success: true,
            data: request,
            message: 'Payment confirmed.',
        };
    }
    async markCompleted(id) {
        const request = await this.mobileSpaService.markAsCompleted(id);
        return {
            success: true,
            data: request,
            message: 'Mobile SPA service completed.',
        };
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a mobile SPA request' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Mobile SPA request created' }),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, mobile_spa_dto_1.CreateMobileSpaDto]),
    __metadata("design:returntype", Promise)
], MobileSpaController.prototype, "createRequest", null);
__decorate([
    (0, common_1.Get)('business'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all mobile SPA requests for a business' }),
    __param(0, (0, auth_1.BusinessId)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], MobileSpaController.prototype, "getBusinessRequests", null);
__decorate([
    (0, common_1.Get)('my-requests'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my mobile SPA requests' }),
    __param(0, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MobileSpaController.prototype, "getMyRequests", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a mobile SPA request by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MobileSpaController.prototype, "getRequest", null);
__decorate([
    (0, common_1.Patch)(':id/accept'),
    (0, swagger_1.ApiOperation)({ summary: 'Business accepts a mobile SPA request' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, mobile_spa_dto_1.AcceptMobileSpaDto]),
    __metadata("design:returntype", Promise)
], MobileSpaController.prototype, "acceptRequest", null);
__decorate([
    (0, common_1.Patch)(':id/suggest-time'),
    (0, swagger_1.ApiOperation)({ summary: 'Business suggests alternative time' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, mobile_spa_dto_1.SuggestTimeMobileSpaDto]),
    __metadata("design:returntype", Promise)
], MobileSpaController.prototype, "suggestTime", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Business rejects a mobile SPA request' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, mobile_spa_dto_1.RejectMobileSpaDto]),
    __metadata("design:returntype", Promise)
], MobileSpaController.prototype, "rejectRequest", null);
__decorate([
    (0, common_1.Patch)(':id/mark-paid'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark a mobile SPA request as paid' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MobileSpaController.prototype, "markPaid", null);
__decorate([
    (0, common_1.Patch)(':id/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark a mobile SPA request as completed' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MobileSpaController.prototype, "markCompleted", null);
MobileSpaController = __decorate([
    (0, swagger_1.ApiTags)('Mobile SPA'),
    (0, common_1.Controller)('mobile-spa'),
    __metadata("design:paramtypes", [mobile_spa_service_1.MobileSpaService])
], MobileSpaController);
exports.MobileSpaController = MobileSpaController;
//# sourceMappingURL=mobile-spa.controller.js.map