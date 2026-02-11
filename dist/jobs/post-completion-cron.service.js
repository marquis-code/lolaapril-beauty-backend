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
var PostCompletionCronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostCompletionCronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const scheduled_reminder_schema_1 = require("./schemas/scheduled-reminder.schema");
const email_service_1 = require("../notification/email.service");
const email_templates_service_1 = require("../notification/templates/email-templates.service");
let PostCompletionCronService = PostCompletionCronService_1 = class PostCompletionCronService {
    constructor(scheduledReminderModel, emailService, emailTemplatesService) {
        this.scheduledReminderModel = scheduledReminderModel;
        this.emailService = emailService;
        this.emailTemplatesService = emailTemplatesService;
        this.logger = new common_1.Logger(PostCompletionCronService_1.name);
    }
    async processScheduledReminders() {
        this.logger.log('📩 Processing scheduled reminders...');
        try {
            const now = new Date();
            const pendingReminders = await this.scheduledReminderModel.find({
                scheduledFor: { $lte: now },
                sent: false,
                retries: { $lt: 3 },
            }).limit(100).lean();
            let sentCount = 0;
            let failCount = 0;
            for (const reminder of pendingReminders) {
                try {
                    let emailData = null;
                    switch (reminder.type) {
                        case 'rebook_2weeks':
                        case 'rebook_after_completion':
                            emailData = this.emailTemplatesService.rebookReminder({
                                clientName: reminder.userName,
                                serviceName: reminder.serviceName || 'your last service',
                                businessName: reminder.businessName || 'Lola April',
                                businessId: reminder.businessId.toString(),
                            });
                            break;
                        default:
                            this.logger.warn(`Unknown reminder type: ${reminder.type}`);
                            continue;
                    }
                    if (emailData) {
                        await this.emailService.sendEmail(reminder.userEmail, emailData.subject, emailData.html);
                        await this.scheduledReminderModel.findByIdAndUpdate(reminder._id, {
                            sent: true,
                            sentAt: new Date(),
                        });
                        sentCount++;
                        this.logger.log(`✅ Sent ${reminder.type} reminder to ${reminder.userEmail}`);
                    }
                }
                catch (err) {
                    failCount++;
                    await this.scheduledReminderModel.findByIdAndUpdate(reminder._id, {
                        $inc: { retries: 1 },
                        $set: { error: err.message },
                    });
                    this.logger.error(`❌ Failed to send reminder ${reminder._id}: ${err.message}`);
                }
            }
            this.logger.log(`📩 Scheduled reminders: ${sentCount} sent, ${failCount} failed.`);
        }
        catch (error) {
            this.logger.error(`❌ Scheduled reminder cron failed: ${error.message}`);
        }
    }
};
__decorate([
    (0, schedule_1.Cron)('0 0 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostCompletionCronService.prototype, "processScheduledReminders", null);
PostCompletionCronService = PostCompletionCronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(scheduled_reminder_schema_1.ScheduledReminder.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        email_service_1.EmailService,
        email_templates_service_1.EmailTemplatesService])
], PostCompletionCronService);
exports.PostCompletionCronService = PostCompletionCronService;
//# sourceMappingURL=post-completion-cron.service.js.map