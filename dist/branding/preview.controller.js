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
exports.PublicPreviewController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const branding_service_1 = require("./branding.service");
const auth_1 = require("../auth");
let PublicPreviewController = class PublicPreviewController {
    constructor(brandingService) {
        this.brandingService = brandingService;
    }
    async getPreviewTheme(previewId) {
        const previewData = await this.brandingService.getPreviewSession(previewId);
        return {
            success: true,
            data: previewData,
            message: 'Preview theme retrieved successfully'
        };
    }
};
__decorate([
    (0, auth_1.Public)(),
    (0, common_1.Get)('theme/:previewId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get preview theme data by preview ID (Public)',
        description: 'Fetches the temporary preview theme data. No authentication required. Preview sessions expire after 1 hour.'
    }),
    (0, swagger_1.ApiParam)({ name: 'previewId', description: 'The preview session ID (e.g., a1b2c3d4e5f6)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Preview data retrieved successfully',
        schema: {
            example: {
                success: true,
                data: {
                    businessId: '6974aeec5dfb28e3ab6101d1',
                    theme: {
                        colors: {
                            primary: '#3B82F6',
                            secondary: '#10B981',
                            accent: '#F59E0B',
                            background: '#FFFFFF',
                            text: '#1F2937',
                            error: '#EF4444',
                            success: '#10B981'
                        },
                        typography: {
                            fontFamily: 'Inter, sans-serif',
                            headingFont: 'Inter, sans-serif',
                            bodyFont: 'Inter, sans-serif'
                        },
                        logo: {
                            url: 'https://example.com/logo.png',
                            width: 200,
                            height: 80,
                            alt: 'Logo'
                        },
                        favicon: {
                            url: 'https://example.com/favicon.png'
                        }
                    },
                    createdAt: '2026-02-06T21:00:00.000Z'
                },
                message: 'Preview theme retrieved successfully'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Preview session expired or not found' }),
    __param(0, (0, common_1.Param)('previewId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicPreviewController.prototype, "getPreviewTheme", null);
PublicPreviewController = __decorate([
    (0, swagger_1.ApiTags)('Public Preview'),
    (0, common_1.Controller)('preview'),
    __metadata("design:paramtypes", [branding_service_1.BrandingService])
], PublicPreviewController);
exports.PublicPreviewController = PublicPreviewController;
//# sourceMappingURL=preview.controller.js.map