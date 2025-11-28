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
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notification_service_1 = require("./notification.service");
const notification_schema_1 = require("./schemas/notification.schema");
let NotificationController = class NotificationController {
    constructor(notificationService, notificationTemplateModel, notificationLogModel, notificationPreferenceModel) {
        this.notificationService = notificationService;
        this.notificationTemplateModel = notificationTemplateModel;
        this.notificationLogModel = notificationLogModel;
        this.notificationPreferenceModel = notificationPreferenceModel;
    }
    async getTemplates(businessId) {
        return await this.notificationTemplateModel.find({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            isActive: true,
        });
    }
    async getNotificationLogs(businessId, limit = 50, offset = 0) {
        return await this.notificationLogModel
            .find({ businessId: new mongoose_2.Types.ObjectId(businessId) })
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(Number(offset))
            .populate('templateId');
    }
    async updateNotificationPreferences(updateDto) {
        return await this.notificationPreferenceModel.findOneAndUpdate({
            userId: new mongoose_2.Types.ObjectId(updateDto.userId),
            businessId: new mongoose_2.Types.ObjectId(updateDto.businessId),
        }, { preferences: updateDto.preferences }, { upsert: true, new: true });
    }
    async getNotificationPreferences(userId, businessId) {
        const preferences = await this.notificationPreferenceModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            businessId: new mongoose_2.Types.ObjectId(businessId),
        });
        return preferences || {
            preferences: {
                booking_confirmation: { email: true, sms: true },
                booking_rejection: { email: true, sms: true },
                appointment_reminder: { email: true, sms: true },
                appointment_cancelled: { email: true, sms: true },
                payment_confirmation: { email: true, sms: false },
                payment_failed: { email: true, sms: true },
                promotional: { email: false, sms: false },
            }
        };
    }
    async sendCustomNotification(customDto) {
        try {
            return { success: true, message: 'Custom notification sent successfully' };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async createTemplate(templateDto) {
        const template = new this.notificationTemplateModel({
            businessId: new mongoose_2.Types.ObjectId(templateDto.businessId),
            templateName: templateDto.templateName,
            templateType: templateDto.templateType,
            channel: templateDto.channel,
            subject: templateDto.subject,
            content: templateDto.content,
            availableVariables: templateDto.availableVariables || [],
            createdBy: new mongoose_2.Types.ObjectId(templateDto.createdBy),
        });
        return await template.save();
    }
    async updateTemplate(templateId, updateDto) {
        return await this.notificationTemplateModel.findByIdAndUpdate(templateId, Object.assign(Object.assign({}, updateDto), { updatedAt: new Date() }), { new: true });
    }
    async seedTemplates() {
        const templates = [
            {
                templateType: 'new_booking',
                name: 'New Booking Notification (Staff)',
                subject: 'New Booking Received - {{bookingNumber}}',
                content: '<h2>New Booking</h2><p>Client: {{clientName}}</p><p>Service: {{serviceName}}</p>',
                channel: 'email',
                isDefault: true,
                isActive: true,
            },
        ];
        for (const template of templates) {
            await this.notificationTemplateModel.findOneAndUpdate({ templateType: template.templateType, isDefault: true }, template, { upsert: true, new: true });
        }
        return { success: true, message: 'Templates seeded successfully' };
    }
};
__decorate([
    (0, common_1.Get)('templates/:businessId'),
    __param(0, (0, common_1.Param)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getTemplates", null);
__decorate([
    (0, common_1.Get)('logs/:businessId'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getNotificationLogs", null);
__decorate([
    (0, common_1.Post)('preferences'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "updateNotificationPreferences", null);
__decorate([
    (0, common_1.Get)('preferences/:userId/:businessId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getNotificationPreferences", null);
__decorate([
    (0, common_1.Post)('send-custom'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "sendCustomNotification", null);
__decorate([
    (0, common_1.Post)('templates'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Post)('templates/:templateId'),
    __param(0, (0, common_1.Param)('templateId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "updateTemplate", null);
__decorate([
    (0, common_1.Post)('seed-templates'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "seedTemplates", null);
NotificationController = __decorate([
    (0, common_1.Controller)('notifications'),
    __param(1, (0, mongoose_1.InjectModel)(notification_schema_1.NotificationTemplate.name)),
    __param(2, (0, mongoose_1.InjectModel)(notification_schema_1.NotificationLog.name)),
    __param(3, (0, mongoose_1.InjectModel)(notification_schema_1.NotificationPreference.name)),
    __metadata("design:paramtypes", [notification_service_1.NotificationService,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], NotificationController);
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map