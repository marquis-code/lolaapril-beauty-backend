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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationPreferenceSchema = exports.NotificationLogSchema = exports.NotificationTemplateSchema = exports.NotificationPreference = exports.NotificationLog = exports.NotificationTemplate = exports.TemplateVariable = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let TemplateVariable = class TemplateVariable {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TemplateVariable.prototype, "key", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TemplateVariable.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TemplateVariable.prototype, "example", void 0);
TemplateVariable = __decorate([
    (0, mongoose_1.Schema)()
], TemplateVariable);
exports.TemplateVariable = TemplateVariable;
let NotificationTemplate = class NotificationTemplate {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], NotificationTemplate.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], NotificationTemplate.prototype, "templateName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: [
            'booking_confirmation',
            'booking_rejection',
            'appointment_reminder',
            'appointment_cancelled',
            'appointment_completed',
            'payment_confirmation',
            'payment_failed',
            'staff_assignment',
            'custom'
        ]
    }),
    __metadata("design:type", String)
], NotificationTemplate.prototype, "templateType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['email', 'sms', 'both']
    }),
    __metadata("design:type", String)
], NotificationTemplate.prototype, "channel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], NotificationTemplate.prototype, "subject", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], NotificationTemplate.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [TemplateVariable], default: [] }),
    __metadata("design:type", Array)
], NotificationTemplate.prototype, "availableVariables", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], NotificationTemplate.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], NotificationTemplate.prototype, "isDefault", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], NotificationTemplate.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], NotificationTemplate.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], NotificationTemplate.prototype, "updatedAt", void 0);
NotificationTemplate = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], NotificationTemplate);
exports.NotificationTemplate = NotificationTemplate;
let NotificationLog = class NotificationLog {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], NotificationLog.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], NotificationLog.prototype, "recipientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], NotificationLog.prototype, "recipientType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], NotificationLog.prototype, "channel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], NotificationLog.prototype, "recipient", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], NotificationLog.prototype, "subject", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], NotificationLog.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['pending', 'sent', 'delivered', 'failed', 'bounced']
    }),
    __metadata("design:type", String)
], NotificationLog.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], NotificationLog.prototype, "providerMessageId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], NotificationLog.prototype, "errorMessage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], NotificationLog.prototype, "sentAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], NotificationLog.prototype, "deliveredAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], NotificationLog.prototype, "relatedEntityId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], NotificationLog.prototype, "relatedEntityType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'NotificationTemplate' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], NotificationLog.prototype, "templateId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], NotificationLog.prototype, "isRead", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], NotificationLog.prototype, "readAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], NotificationLog.prototype, "createdAt", void 0);
NotificationLog = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], NotificationLog);
exports.NotificationLog = NotificationLog;
let NotificationPreference = class NotificationPreference {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], NotificationPreference.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], NotificationPreference.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            booking_confirmation: { email: Boolean, sms: Boolean },
            booking_rejection: { email: Boolean, sms: Boolean },
            appointment_reminder: { email: Boolean, sms: Boolean },
            appointment_cancelled: { email: Boolean, sms: Boolean },
            appointment_completed: { email: Boolean, sms: Boolean },
            payment_confirmation: { email: Boolean, sms: Boolean },
            payment_failed: { email: Boolean, sms: Boolean },
            promotional: { email: Boolean, sms: Boolean },
        },
        default: {
            booking_confirmation: { email: true, sms: true },
            booking_rejection: { email: true, sms: true },
            appointment_reminder: { email: true, sms: true },
            appointment_cancelled: { email: true, sms: true },
            appointment_completed: { email: true, sms: false },
            payment_confirmation: { email: true, sms: false },
            payment_failed: { email: true, sms: true },
            promotional: { email: false, sms: false },
        }
    }),
    __metadata("design:type", Object)
], NotificationPreference.prototype, "preferences", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], NotificationPreference.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], NotificationPreference.prototype, "updatedAt", void 0);
NotificationPreference = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], NotificationPreference);
exports.NotificationPreference = NotificationPreference;
exports.NotificationTemplateSchema = mongoose_1.SchemaFactory.createForClass(NotificationTemplate);
exports.NotificationLogSchema = mongoose_1.SchemaFactory.createForClass(NotificationLog);
exports.NotificationPreferenceSchema = mongoose_1.SchemaFactory.createForClass(NotificationPreference);
exports.NotificationTemplateSchema.index({ businessId: 1, templateType: 1 });
exports.NotificationLogSchema.index({ businessId: 1, recipientId: 1 });
exports.NotificationLogSchema.index({ status: 1 });
exports.NotificationLogSchema.index({ createdAt: -1 });
exports.NotificationPreferenceSchema.index({ userId: 1, businessId: 1 });
//# sourceMappingURL=notification.schema.js.map