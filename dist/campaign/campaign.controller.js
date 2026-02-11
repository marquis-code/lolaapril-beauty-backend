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
exports.CampaignController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const campaign_service_1 = require("./campaign.service");
const campaign_dto_1 = require("./dto/campaign.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const promises_1 = require("fs/promises");
const path_1 = require("path");
let CampaignController = class CampaignController {
    constructor(campaignService) {
        this.campaignService = campaignService;
    }
    async create(createCampaignDto, req) {
        return this.campaignService.create(createCampaignDto, req.user.businessId, req.user.userId);
    }
    async findAll(req) {
        return this.campaignService.findAll(req.user.businessId);
    }
    async listEmailAssets() {
        try {
            const assetsPath = (0, path_1.join)(process.cwd(), 'src/assets/emails');
            const files = await (0, promises_1.readdir)(assetsPath);
            const images = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
            return images.map(filename => ({
                filename,
                path: `src/assets/emails/${filename}`
            }));
        }
        catch (error) {
            return [];
        }
    }
    async findOne(id) {
        return this.campaignService.findOne(id);
    }
    async update(id, updateCampaignDto) {
        return this.campaignService.update(id, updateCampaignDto);
    }
    async remove(id) {
        return this.campaignService.delete(id);
    }
    async duplicate(id, req) {
        const campaign = await this.campaignService.findOne(id);
        if (!campaign)
            throw new common_1.BadRequestException('Campaign not found');
        const campaignObj = campaign.toObject();
        const { _id, createdAt, updatedAt, status, stats, ...data } = campaignObj;
        const duplicateDto = {
            name: `${data.name} (Copy)`,
            subject: data.subject,
            content: data.content,
            previewText: data.previewText,
            audience: data.audience,
            schedule: { type: 'now' },
            bannerUrl: data.bannerUrl
        };
        return this.campaignService.create(duplicateDto, req.user.businessId, req.user.userId);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new campaign' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [campaign_dto_1.CreateCampaignDto, Object]),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all campaigns for the business' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('assets/emails'),
    (0, swagger_1.ApiOperation)({ summary: 'List available email asset images' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "listEmailAssets", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get campaign details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a campaign' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, campaign_dto_1.UpdateCampaignDto]),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete (cancel) a campaign' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/duplicate'),
    (0, swagger_1.ApiOperation)({ summary: 'Duplicate a campaign' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "duplicate", null);
CampaignController = __decorate([
    (0, swagger_1.ApiTags)('Business Campaigns'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('business/campaigns'),
    __metadata("design:paramtypes", [campaign_service_1.CampaignService])
], CampaignController);
exports.CampaignController = CampaignController;
//# sourceMappingURL=campaign.controller.js.map