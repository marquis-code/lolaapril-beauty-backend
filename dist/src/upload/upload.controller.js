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
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const upload_service_1 = require("./upload.service");
const business_context_decorator_1 = require("../auth/decorators/business-context.decorator");
let UploadController = class UploadController {
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    async uploadImage(businessId, file) {
        return this.uploadService.uploadImage(businessId, file);
    }
    async uploadImages(businessId, files) {
        return this.uploadService.uploadMultipleImages(businessId, files);
    }
    async uploadDocument(businessId, file) {
        return this.uploadService.uploadDocument(businessId, file);
    }
    async deleteImage(businessId, publicId) {
        await this.uploadService.deleteImage(businessId, publicId);
        return { message: 'Image deleted successfully' };
    }
    async uploadKYCDocument(file, businessId, documentType, user) {
        if (!businessId) {
            throw new common_1.BadRequestException('businessId is required');
        }
        if (!documentType) {
            throw new common_1.BadRequestException('documentType is required');
        }
        const allowedTypes = ['businessRegistration', 'taxIdentification', 'governmentId', 'bankStatement', 'proofOfAddress'];
        if (!allowedTypes.includes(documentType)) {
            throw new common_1.BadRequestException(`Invalid documentType. Must be one of: ${allowedTypes.join(', ')}`);
        }
        const result = await this.uploadService.uploadKYCDocument(file, businessId, documentType);
        return {
            success: true,
            data: {
                ...result,
                uploadedAt: new Date(),
            },
            message: 'KYC document uploaded successfully'
        };
    }
};
__decorate([
    (0, common_1.Post)('image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload single image' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Image uploaded successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Post)('images'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10)),
    (0, swagger_1.ApiOperation)({ summary: 'Upload multiple images' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Images uploaded successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadImages", null);
__decorate([
    (0, common_1.Post)('document'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload document' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Document uploaded successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Delete)('image/:publicId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete image' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image deleted successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('publicId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "deleteImage", null);
__decorate([
    (0, common_1.Post)('kyc-document'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload KYC document (business registration, tax cert, ID, bank statement, etc.)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'KYC document file (PDF, JPEG, PNG, WEBP - max 5MB)'
                },
                businessId: {
                    type: 'string',
                    description: 'Business ID'
                },
                documentType: {
                    type: 'string',
                    enum: ['businessRegistration', 'taxIdentification', 'governmentId', 'bankStatement', 'proofOfAddress'],
                    description: 'Type of KYC document'
                }
            },
            required: ['file', 'businessId', 'documentType']
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'KYC document uploaded successfully',
        schema: {
            example: {
                success: true,
                data: {
                    url: 'https://res.cloudinary.com/your-cloud/image/upload/v123456/lolaapril/kyc/businessId/businessRegistration_123456.pdf',
                    publicId: 'lolaapril/kyc/businessId/businessRegistration_123456',
                    documentType: 'businessRegistration',
                    uploadedAt: '2026-01-21T10:30:00.000Z'
                },
                message: 'KYC document uploaded successfully'
            }
        }
    }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('businessId')),
    __param(2, (0, common_1.Body)('documentType')),
    __param(3, (0, business_context_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadKYCDocument", null);
UploadController = __decorate([
    (0, swagger_1.ApiTags)("File Upload"),
    (0, common_1.Controller)("upload"),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [upload_service_1.UploadService])
], UploadController);
exports.UploadController = UploadController;
//# sourceMappingURL=upload.controller.js.map