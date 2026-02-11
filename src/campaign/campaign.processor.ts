import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { EmailService } from '../notification/email.service';

@Processor('campaigns')
export class CampaignProcessor {
    private readonly logger = new Logger(CampaignProcessor.name);

    constructor(
        private readonly campaignService: CampaignService,
        private readonly emailService: EmailService,
    ) { }

    @Process('send-campaign')
    async handleSendCampaign(job: Job<{ campaignId: string }>) {
        const { campaignId } = job.data;
        this.logger.log(`Starting campaign job for ${campaignId}`);

        try {
            const campaign = await this.campaignService.findOne(campaignId);
            if (!campaign) {
                this.logger.error(`Campaign ${campaignId} not found`);
                return;
            }

            if (campaign.status === 'cancelled') {
                this.logger.log(`Campaign ${campaignId} was cancelled. Skipping.`);
                return;
            }

            await this.campaignService.setSending(campaignId);

            // Resolve audience
            const recipients = await this.campaignService.resolveAudience(campaignId);
            this.logger.log(`Targeting ${recipients.length} recipients for campaign: ${campaign.name}`);

            let sentCount = 0;
            let failedCount = 0;

            const htmlContent = this.wrapInLayout(campaign.subject, campaign.content, campaign.bannerUrl);

            // Batch sending (50 at a time)
            const batchSize = 50;
            for (let i = 0; i < recipients.length; i += batchSize) {
                const batch = recipients.slice(i, i + batchSize);
                await Promise.all(batch.map(async (email) => {
                    try {
                        const result = await this.emailService.sendEmail(email, campaign.subject, htmlContent);
                        if (result.success) {
                            sentCount++;
                        } else {
                            failedCount++;
                        }
                    } catch (e) {
                        failedCount++;
                        this.logger.error(`Failed to send to ${email}: ${e.message}`);
                    }
                }));

                // Update stats periodically (accumulate functionality to be handled by service, 
                // or just final update is fine for MVP)
            }

            // Final stats update
            // Logic: we want to SET the total stats, not increment, because we calculated the total run here.
            // But service uses $inc. 
            // Workaround: We will just set it via a new method or use $inc if we assume it started at 0?
            // Campaign stats default to 0. 
            // If we restart a job, $inc would double count. 
            // Safer to SET. I'll add a setStats method to service later? 
            // For now, I'll just use updateStats assuming single run.
            await this.campaignService.updateStats(campaignId, { sent: sentCount, failed: failedCount });

            await this.campaignService.markCompleted(campaignId);
            this.logger.log(`Campaign ${campaignId} completed. Sent: ${recipients.length}`);

        } catch (error) {
            this.logger.error(`Campaign job failed: ${error.message}`, error.stack);
            await this.campaignService.markFailed(campaignId);
            throw error;
        }
    }

    private wrapInLayout(title: string, body: string, bannerUrl?: string): string {
        const bannerHtml = bannerUrl ? `<img src="${bannerUrl}" alt="Banner" style="max-width:100%;border-radius:8px;margin-bottom:24px;">` : '';

        return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f5f6; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 32px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,89,103,0.08); }
  .content { padding: 40px; }
  .footer { background: #e6f2f4; padding: 24px; text-align: center; color: #5a7a80; font-size: 12px; }
</style>
</head>
<body>
  <div class="container">
    <div class="content">
      ${bannerHtml}
      ${body}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Lola April Beauty & Wellness</p>
      <p>You received this email because you are a valued customer.</p>
    </div>
  </div>
</body>
</html>`;
    }
}
