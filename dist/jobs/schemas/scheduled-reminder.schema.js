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
exports.ScheduledReminderSchema = exports.ScheduledReminder = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ScheduledReminder = class ScheduledReminder {
};
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['rebook_2weeks', 'rebook_after_completion', 'thank_you'],
    }),
    __metadata("design:type", String)
], ScheduledReminder.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ScheduledReminder.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ScheduledReminder.prototype, "userEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ScheduledReminder.prototype, "userName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ScheduledReminder.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ScheduledReminder.prototype, "businessName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Appointment' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ScheduledReminder.prototype, "appointmentId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ScheduledReminder.prototype, "serviceName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], ScheduledReminder.prototype, "scheduledFor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ScheduledReminder.prototype, "sent", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ScheduledReminder.prototype, "sentAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ScheduledReminder.prototype, "retries", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ScheduledReminder.prototype, "error", void 0);
ScheduledReminder = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ScheduledReminder);
exports.ScheduledReminder = ScheduledReminder;
exports.ScheduledReminderSchema = mongoose_1.SchemaFactory.createForClass(ScheduledReminder);
exports.ScheduledReminderSchema.index({ scheduledFor: 1, sent: 1 });
exports.ScheduledReminderSchema.index({ userId: 1 });
exports.ScheduledReminderSchema.index({ businessId: 1 });
exports.ScheduledReminderSchema.index({ type: 1 });
//# sourceMappingURL=scheduled-reminder.schema.js.map