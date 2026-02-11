import { Model } from 'mongoose';
import { Queue } from 'bull';
import { Campaign, CampaignDocument } from './schemas/campaign.schema';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';
import { ClientDocument } from '../client/schemas/client.schema';
export declare class CampaignService {
    private campaignModel;
    private clientModel;
    private campaignQueue;
    private readonly logger;
    constructor(campaignModel: Model<CampaignDocument>, clientModel: Model<ClientDocument>, campaignQueue: Queue);
    create(createCampaignDto: CreateCampaignDto, businessId: string, userId: string): Promise<Campaign>;
    findAll(businessId: string): Promise<Campaign[]>;
    findOne(id: string): Promise<Campaign>;
    update(id: string, updateCampaignDto: UpdateCampaignDto): Promise<Campaign>;
    delete(id: string): Promise<void>;
    changeStatus(id: string, status: string): Promise<Campaign>;
    private scheduleCampaign;
    resolveAudience(campaignId: string): Promise<string[]>;
    updateStats(id: string, stats: {
        sent?: number;
        failed?: number;
    }): Promise<void>;
    markCompleted(id: string): Promise<void>;
    markFailed(id: string): Promise<void>;
    setSending(id: string): Promise<void>;
}
