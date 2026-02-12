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
var ConsultationCronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultationCronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const consultation_service_1 = require("./consultation.service");
let ConsultationCronService = ConsultationCronService_1 = class ConsultationCronService {
    constructor(consultationService) {
        this.consultationService = consultationService;
        this.logger = new common_1.Logger(ConsultationCronService_1.name);
    }
    async handleReminders() {
        this.logger.log('Running consultation reminders cron...');
        await this.consultationService.sendReminders();
    }
    async handleThankYouEmails() {
        this.logger.log('Running daily task: Consultation Thank You Emails');
        await this.consultationService.sendThankYouEmails();
    }
    async handleMarketingFollowUps() {
        this.logger.log('Running weekly task: Marketing Follow-up Emails');
        await this.consultationService.sendMarketingFollowUps();
    }
    async handleExpiredBookings() {
        this.logger.log('Running expired consultation bookings cleanup...');
        await this.consultationService.cleanupExpiredBookings();
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConsultationCronService.prototype, "handleReminders", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConsultationCronService.prototype, "handleThankYouEmails", null);
__decorate([
    (0, schedule_1.Cron)('0 10 * * 0'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConsultationCronService.prototype, "handleMarketingFollowUps", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConsultationCronService.prototype, "handleExpiredBookings", null);
ConsultationCronService = ConsultationCronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [consultation_service_1.ConsultationService])
], ConsultationCronService);
exports.ConsultationCronService = ConsultationCronService;
//# sourceMappingURL=consultation-cron.service.js.map