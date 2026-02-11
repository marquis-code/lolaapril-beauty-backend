import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Campaign, CampaignDocument } from './schemas/campaign.schema';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';
import { Client, ClientDocument } from '../client/schemas/client.schema';

@Injectable()
export class CampaignService {
    private readonly logger = new Logger(CampaignService.name);

    constructor(
        @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
        @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
        @InjectQueue('campaigns') private campaignQueue: Queue,
    ) { }

    async create(createCampaignDto: CreateCampaignDto, businessId: string, userId: string): Promise<Campaign> {
        const campaign = new this.campaignModel({
            ...createCampaignDto,
            businessId: new Types.ObjectId(businessId),
            createdBy: new Types.ObjectId(userId),
            status: createCampaignDto.schedule.type === 'now' ? 'scheduled' : 'draft',
        });

        const savedCampaign = await campaign.save();

        if (createCampaignDto.schedule.type === 'now') {
            await this.scheduleCampaign(savedCampaign._id.toString(), 0); // Schedule immediately
        } else if (createCampaignDto.schedule.type === 'scheduled' && createCampaignDto.schedule.scheduledAt) {
            const delay = new Date(createCampaignDto.schedule.scheduledAt).getTime() - Date.now();
            if (delay > 0) {
                await this.changeStatus(savedCampaign._id.toString(), 'scheduled');
                await this.scheduleCampaign(savedCampaign._id.toString(), delay);
            }
        }

        return savedCampaign;
    }

    async findAll(businessId: string): Promise<Campaign[]> {
        return this.campaignModel.find({ businessId: new Types.ObjectId(businessId) }).sort({ createdAt: -1 }).exec();
    }

    async findOne(id: string): Promise<Campaign> {
        const campaign = await this.campaignModel.findById(id).exec();
        if (!campaign) {
            throw new NotFoundException(`Campaign #${id} not found`);
        }
        return campaign;
    }

    async update(id: string, updateCampaignDto: UpdateCampaignDto): Promise<Campaign> {
        const campaign = await this.campaignModel.findById(id);

        if (!campaign) {
            throw new NotFoundException(`Campaign #${id} not found`);
        }

        if (campaign.status === 'sending' || campaign.status === 'completed') {
            throw new BadRequestException('Cannot update a campaign that is already sending or completed');
        }

        const updatedCampaign = await this.campaignModel
            .findByIdAndUpdate(id, updateCampaignDto, { new: true })
            .exec();

        // Handle rescheduling if needed
        if (updateCampaignDto.schedule) {
            // Remove existing job if any (requires job ID tracking, simplified here by just adding new)
            // For production, we should track jobId in campaign schema to remove old jobs
            if (updateCampaignDto.schedule.type === 'now') {
                await this.scheduleCampaign(id, 0);
            } else if (updateCampaignDto.schedule.type === 'scheduled' && updateCampaignDto.schedule.scheduledAt) {
                const delay = new Date(updateCampaignDto.schedule.scheduledAt).getTime() - Date.now();
                if (delay > 0) {
                    await this.scheduleCampaign(id, delay);
                }
            }
        }

        return updatedCampaign;
    }

    async delete(id: string): Promise<void> {
        const campaign = await this.campaignModel.findById(id);
        if (campaign && (campaign.status === 'sending')) {
            throw new BadRequestException('Cannot delete a running campaign');
        }
        await this.campaignModel.findByIdAndDelete(id).exec();
    }

    async changeStatus(id: string, status: string): Promise<Campaign> {
        return this.campaignModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    }

    private async scheduleCampaign(campaignId: string, delay: number) {
        await this.campaignQueue.add(
            'send-campaign',
            { campaignId },
            { delay, removeOnComplete: true } // Delay in ms
        );
        if (delay > 0) {
            await this.changeStatus(campaignId, 'scheduled');
        }
    }

    async resolveAudience(campaignId: string): Promise<string[]> {
        const campaign = await this.findOne(campaignId);
        const { type, query, specificEmails } = campaign.audience;

        let emails: string[] = [];

        if (type === 'specific_emails') {
            return specificEmails || [];
        }

        let clientQuery: any = { businessId: campaign.businessId };

        if (type === 'active_clients') {
            clientQuery.isActive = true;
        } else if (type === 'query' && query) {
            // Merge custom query securely
            clientQuery = { ...clientQuery, ...query };
        }

        const clients = await this.clientModel.find(clientQuery).select('profile.email settings.marketingNotifications').exec();

        // Filter clients who opted out of marketing
        emails = clients
            .filter(c => c.settings?.marketingNotifications?.clientAcceptsEmailMarketing !== false) // Default to true if undefined
            .map(c => c.profile.email)
            .filter(email => !!email); // Ensure no nulls

        return [...new Set(emails)]; // Deduplicate
    }

    async updateStats(id: string, stats: { sent?: number; failed?: number }) {
        await this.campaignModel.findByIdAndUpdate(id, {
            $inc: {
                'stats.sentCount': stats.sent || 0,
                'stats.failedCount': stats.failed || 0
            }
        });
    }

    async markCompleted(id: string) {
        await this.campaignModel.findByIdAndUpdate(id, { status: 'completed', lastRunAt: new Date() });
    }

    async markFailed(id: string) {
        await this.campaignModel.findByIdAndUpdate(id, { status: 'failed' });
    }

    async setSending(id: string) {
        await this.campaignModel.findByIdAndUpdate(id, { status: 'sending' });
    }
}
