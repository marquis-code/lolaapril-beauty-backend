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
var BusinessReminderCronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessReminderCronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const appointment_schema_1 = require("../appointment/schemas/appointment.schema");
const email_service_1 = require("../notification/email.service");
const email_templates_service_1 = require("../notification/templates/email-templates.service");
let BusinessReminderCronService = BusinessReminderCronService_1 = class BusinessReminderCronService {
    constructor(appointmentModel, emailService, emailTemplatesService) {
        this.appointmentModel = appointmentModel;
        this.emailService = emailService;
        this.emailTemplatesService = emailTemplatesService;
        this.logger = new common_1.Logger(BusinessReminderCronService_1.name);
    }
    async remindBusinessesToCompleteAppointments() {
        this.logger.log('📋 Checking for uncompleted past appointments...');
        try {
            const now = new Date();
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);
            const uncompletedAppointments = await this.appointmentModel.find({
                status: { $in: ['confirmed', 'in_progress'] },
                selectedDate: { $lt: now },
            }).lean();
            if (uncompletedAppointments.length === 0) {
                this.logger.log('📋 No uncompleted appointments found.');
                return;
            }
            const businessGroups = {};
            for (const apt of uncompletedAppointments) {
                const bizId = apt.businessInfo?.businessId || 'unknown';
                if (!businessGroups[bizId]) {
                    businessGroups[bizId] = [];
                }
                businessGroups[bizId].push(apt);
            }
            for (const [businessId, appointments] of Object.entries(businessGroups)) {
                const businessName = appointments[0]?.businessInfo?.businessName || 'Business';
                const pendingList = appointments.map(apt => ({
                    clientName: apt.clientId?.toString() || 'Customer',
                    serviceName: apt.serviceDetails?.serviceName || 'Service',
                    date: apt.selectedDate
                        ? new Date(apt.selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : 'N/A',
                    time: apt.selectedTime || 'N/A',
                    appointmentId: apt._id?.toString(),
                }));
                const emailData = this.emailTemplatesService.businessCompleteReminder({
                    businessName,
                    pendingAppointments: pendingList,
                });
                const businessEmail = process.env.STAFF_NOTIFICATION_EMAIL || 'admin@lolaapril.com';
                await this.emailService.sendEmail(businessEmail, emailData.subject, emailData.html);
                this.logger.log(`✅ Sent completion reminder to ${businessName} for ${appointments.length} appointment(s)`);
            }
        }
        catch (error) {
            this.logger.error(`❌ Business reminder cron failed: ${error.message}`);
        }
    }
};
__decorate([
    (0, schedule_1.Cron)('0 0 8,10,12,14,16,18 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BusinessReminderCronService.prototype, "remindBusinessesToCompleteAppointments", null);
BusinessReminderCronService = BusinessReminderCronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(appointment_schema_1.Appointment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        email_service_1.EmailService,
        email_templates_service_1.EmailTemplatesService])
], BusinessReminderCronService);
exports.BusinessReminderCronService = BusinessReminderCronService;
//# sourceMappingURL=business-reminder-cron.service.js.map