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
var CampaignProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const campaign_service_1 = require("./campaign.service");
const email_service_1 = require("../notification/email.service");
let CampaignProcessor = CampaignProcessor_1 = class CampaignProcessor {
    constructor(campaignService, emailService) {
        this.campaignService = campaignService;
        this.emailService = emailService;
        this.logger = new common_1.Logger(CampaignProcessor_1.name);
    }
    async handleSendCampaign(job) {
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
            const recipients = await this.campaignService.resolveAudience(campaignId);
            this.logger.log(`Targeting ${recipients.length} recipients for campaign: ${campaign.name}`);
            let sentCount = 0;
            let failedCount = 0;
            const htmlContent = this.wrapInLayout(campaign.subject, campaign.content, campaign.bannerUrl);
            const batchSize = 50;
            for (let i = 0; i < recipients.length; i += batchSize) {
                const batch = recipients.slice(i, i + batchSize);
                await Promise.all(batch.map(async (email) => {
                    try {
                        const result = await this.emailService.sendEmail(email, campaign.subject, htmlContent);
                        if (result.success) {
                            sentCount++;
                        }
                        else {
                            failedCount++;
                        }
                    }
                    catch (e) {
                        failedCount++;
                        this.logger.error(`Failed to send to ${email}: ${e.message}`);
                    }
                }));
            }
            await this.campaignService.updateStats(campaignId, { sent: sentCount, failed: failedCount });
            await this.campaignService.markCompleted(campaignId);
            this.logger.log(`Campaign ${campaignId} completed. Sent: ${recipients.length}`);
        }
        catch (error) {
            this.logger.error(`Campaign job failed: ${error.message}`, error.stack);
            await this.campaignService.markFailed(campaignId);
            throw error;
        }
    }
    wrapInLayout(title, body, bannerUrl) {
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
};
__decorate([
    (0, bull_1.Process)('send-campaign'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CampaignProcessor.prototype, "handleSendCampaign", null);
CampaignProcessor = CampaignProcessor_1 = __decorate([
    (0, bull_1.Processor)('campaigns'),
    __metadata("design:paramtypes", [campaign_service_1.CampaignService,
        email_service_1.EmailService])
], CampaignProcessor);
exports.CampaignProcessor = CampaignProcessor;
//# sourceMappingURL=campaign.processor.js.map