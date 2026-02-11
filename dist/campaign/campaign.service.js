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
var CampaignService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bull_1 = require("@nestjs/bull");
const campaign_schema_1 = require("./schemas/campaign.schema");
const client_schema_1 = require("../client/schemas/client.schema");
let CampaignService = CampaignService_1 = class CampaignService {
    constructor(campaignModel, clientModel, campaignQueue) {
        this.campaignModel = campaignModel;
        this.clientModel = clientModel;
        this.campaignQueue = campaignQueue;
        this.logger = new common_1.Logger(CampaignService_1.name);
    }
    async create(createCampaignDto, businessId, userId) {
        const campaign = new this.campaignModel({
            ...createCampaignDto,
            businessId: new mongoose_2.Types.ObjectId(businessId),
            createdBy: new mongoose_2.Types.ObjectId(userId),
            status: createCampaignDto.schedule.type === 'now' ? 'scheduled' : 'draft',
        });
        const savedCampaign = await campaign.save();
        if (createCampaignDto.schedule.type === 'now') {
            await this.scheduleCampaign(savedCampaign._id.toString(), 0);
        }
        else if (createCampaignDto.schedule.type === 'scheduled' && createCampaignDto.schedule.scheduledAt) {
            const delay = new Date(createCampaignDto.schedule.scheduledAt).getTime() - Date.now();
            if (delay > 0) {
                await this.changeStatus(savedCampaign._id.toString(), 'scheduled');
                await this.scheduleCampaign(savedCampaign._id.toString(), delay);
            }
        }
        return savedCampaign;
    }
    async findAll(businessId) {
        return this.campaignModel.find({ businessId: new mongoose_2.Types.ObjectId(businessId) }).sort({ createdAt: -1 }).exec();
    }
    async findOne(id) {
        const campaign = await this.campaignModel.findById(id).exec();
        if (!campaign) {
            throw new common_1.NotFoundException(`Campaign #${id} not found`);
        }
        return campaign;
    }
    async update(id, updateCampaignDto) {
        const campaign = await this.campaignModel.findById(id);
        if (!campaign) {
            throw new common_1.NotFoundException(`Campaign #${id} not found`);
        }
        if (campaign.status === 'sending' || campaign.status === 'completed') {
            throw new common_1.BadRequestException('Cannot update a campaign that is already sending or completed');
        }
        const updatedCampaign = await this.campaignModel
            .findByIdAndUpdate(id, updateCampaignDto, { new: true })
            .exec();
        if (updateCampaignDto.schedule) {
            if (updateCampaignDto.schedule.type === 'now') {
                await this.scheduleCampaign(id, 0);
            }
            else if (updateCampaignDto.schedule.type === 'scheduled' && updateCampaignDto.schedule.scheduledAt) {
                const delay = new Date(updateCampaignDto.schedule.scheduledAt).getTime() - Date.now();
                if (delay > 0) {
                    await this.scheduleCampaign(id, delay);
                }
            }
        }
        return updatedCampaign;
    }
    async delete(id) {
        const campaign = await this.campaignModel.findById(id);
        if (campaign && (campaign.status === 'sending')) {
            throw new common_1.BadRequestException('Cannot delete a running campaign');
        }
        await this.campaignModel.findByIdAndDelete(id).exec();
    }
    async changeStatus(id, status) {
        return this.campaignModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    }
    async scheduleCampaign(campaignId, delay) {
        await this.campaignQueue.add('send-campaign', { campaignId }, { delay, removeOnComplete: true });
        if (delay > 0) {
            await this.changeStatus(campaignId, 'scheduled');
        }
    }
    async resolveAudience(campaignId) {
        const campaign = await this.findOne(campaignId);
        const { type, query, specificEmails } = campaign.audience;
        let emails = [];
        if (type === 'specific_emails') {
            return specificEmails || [];
        }
        let clientQuery = { businessId: campaign.businessId };
        if (type === 'active_clients') {
            clientQuery.isActive = true;
        }
        else if (type === 'query' && query) {
            clientQuery = { ...clientQuery, ...query };
        }
        const clients = await this.clientModel.find(clientQuery).select('profile.email settings.marketingNotifications').exec();
        emails = clients
            .filter(c => c.settings?.marketingNotifications?.clientAcceptsEmailMarketing !== false)
            .map(c => c.profile.email)
            .filter(email => !!email);
        return [...new Set(emails)];
    }
    async updateStats(id, stats) {
        await this.campaignModel.findByIdAndUpdate(id, {
            $inc: {
                'stats.sentCount': stats.sent || 0,
                'stats.failedCount': stats.failed || 0
            }
        });
    }
    async markCompleted(id) {
        await this.campaignModel.findByIdAndUpdate(id, { status: 'completed', lastRunAt: new Date() });
    }
    async markFailed(id) {
        await this.campaignModel.findByIdAndUpdate(id, { status: 'failed' });
    }
    async setSending(id) {
        await this.campaignModel.findByIdAndUpdate(id, { status: 'sending' });
    }
};
CampaignService = CampaignService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(campaign_schema_1.Campaign.name)),
    __param(1, (0, mongoose_1.InjectModel)(client_schema_1.Client.name)),
    __param(2, (0, bull_1.InjectQueue)('campaigns')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model, Object])
], CampaignService);
exports.CampaignService = CampaignService;
//# sourceMappingURL=campaign.service.js.map