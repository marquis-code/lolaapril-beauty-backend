import { Job } from 'bull';
import { CampaignService } from './campaign.service';
import { EmailService } from '../notification/email.service';
export declare class CampaignProcessor {
    private readonly campaignService;
    private readonly emailService;
    private readonly logger;
    constructor(campaignService: CampaignService, emailService: EmailService);
    handleSendCampaign(job: Job<{
        campaignId: string;
    }>): Promise<void>;
    private wrapInLayout;
}
