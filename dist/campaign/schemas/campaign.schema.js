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
exports.CampaignSchema = exports.Campaign = exports.CampaignStats = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let CampaignStats = class CampaignStats {
};
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], CampaignStats.prototype, "sentCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], CampaignStats.prototype, "failedCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], CampaignStats.prototype, "openedCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], CampaignStats.prototype, "clickedCount", void 0);
CampaignStats = __decorate([
    (0, mongoose_1.Schema)()
], CampaignStats);
exports.CampaignStats = CampaignStats;
let Campaign = class Campaign {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Campaign.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Campaign.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Campaign.prototype, "subject", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Campaign.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Campaign.prototype, "previewText", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            type: { type: String, enum: ['all', 'active_clients', 'specific_emails', 'query'], required: true },
            query: { type: Object },
            specificEmails: [{ type: String }],
        },
        required: true,
    }),
    __metadata("design:type", Object)
], Campaign.prototype, "audience", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            type: { type: String, enum: ['now', 'scheduled', 'recurring'], required: true },
            scheduledAt: { type: Date },
            cronExpression: { type: String },
            timezone: { type: String },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], Campaign.prototype, "schedule", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['draft', 'scheduled', 'sending', 'completed', 'failed', 'cancelled'],
        default: 'draft',
        index: true,
    }),
    __metadata("design:type", String)
], Campaign.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: CampaignStats, default: {} }),
    __metadata("design:type", CampaignStats)
], Campaign.prototype, "stats", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Campaign.prototype, "bannerUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Campaign.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Campaign.prototype, "lastRunAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Campaign.prototype, "nextRunAt", void 0);
Campaign = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Campaign);
exports.Campaign = Campaign;
exports.CampaignSchema = mongoose_1.SchemaFactory.createForClass(Campaign);
exports.CampaignSchema.index({ businessId: 1, status: 1 });
exports.CampaignSchema.index({ 'schedule.scheduledAt': 1 });
//# sourceMappingURL=campaign.schema.js.map