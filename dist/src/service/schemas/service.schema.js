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
exports.ServiceSchema = exports.Service = exports.ServiceVariant = exports.ServiceSettings = exports.OnlineBooking = exports.PricingAndDuration = exports.ExtraTimeOptions = exports.ServiceDuration = exports.Price = exports.Resources = exports.TeamMembers = exports.TeamMember = exports.BasicDetails = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let BasicDetails = class BasicDetails {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BasicDetails.prototype, "serviceName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BasicDetails.prototype, "serviceType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BasicDetails.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BasicDetails.prototype, "description", void 0);
BasicDetails = __decorate([
    (0, mongoose_1.Schema)()
], BasicDetails);
exports.BasicDetails = BasicDetails;
let TeamMember = class TeamMember {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TeamMember.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TeamMember.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TeamMember.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], TeamMember.prototype, "selected", void 0);
TeamMember = __decorate([
    (0, mongoose_1.Schema)()
], TeamMember);
exports.TeamMember = TeamMember;
let TeamMembers = class TeamMembers {
};
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], TeamMembers.prototype, "allTeamMembers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [TeamMember], default: [] }),
    __metadata("design:type", Array)
], TeamMembers.prototype, "selectedMembers", void 0);
TeamMembers = __decorate([
    (0, mongoose_1.Schema)()
], TeamMembers);
exports.TeamMembers = TeamMembers;
let Resources = class Resources {
};
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Resources.prototype, "required", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Resources.prototype, "resourceList", void 0);
Resources = __decorate([
    (0, mongoose_1.Schema)()
], Resources);
exports.Resources = Resources;
let Price = class Price {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Price.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Price.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Price.prototype, "minimumAmount", void 0);
Price = __decorate([
    (0, mongoose_1.Schema)()
], Price);
exports.Price = Price;
let ServiceDuration = class ServiceDuration {
};
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            value: { type: Number, required: true },
            unit: { type: String, required: true, enum: ["min", "h"] },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], ServiceDuration.prototype, "servicingTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            value: { type: Number, required: true },
            unit: { type: String, required: true, enum: ["min", "h"] },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], ServiceDuration.prototype, "processingTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ServiceDuration.prototype, "totalDuration", void 0);
ServiceDuration = __decorate([
    (0, mongoose_1.Schema)()
], ServiceDuration);
exports.ServiceDuration = ServiceDuration;
let ExtraTimeOptions = class ExtraTimeOptions {
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ExtraTimeOptions.prototype, "processingTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ExtraTimeOptions.prototype, "blockedTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ExtraTimeOptions.prototype, "extraServicingTime", void 0);
ExtraTimeOptions = __decorate([
    (0, mongoose_1.Schema)()
], ExtraTimeOptions);
exports.ExtraTimeOptions = ExtraTimeOptions;
let PricingAndDuration = class PricingAndDuration {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ["Fixed", "Free", "From"] }),
    __metadata("design:type", String)
], PricingAndDuration.prototype, "priceType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Price, required: true }),
    __metadata("design:type", Price)
], PricingAndDuration.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: ServiceDuration, required: true }),
    __metadata("design:type", ServiceDuration)
], PricingAndDuration.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: ExtraTimeOptions }),
    __metadata("design:type", ExtraTimeOptions)
], PricingAndDuration.prototype, "extraTimeOptions", void 0);
PricingAndDuration = __decorate([
    (0, mongoose_1.Schema)()
], PricingAndDuration);
exports.PricingAndDuration = PricingAndDuration;
let OnlineBooking = class OnlineBooking {
};
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], OnlineBooking.prototype, "enabled", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: "All clients" }),
    __metadata("design:type", String)
], OnlineBooking.prototype, "availableFor", void 0);
OnlineBooking = __decorate([
    (0, mongoose_1.Schema)()
], OnlineBooking);
exports.OnlineBooking = OnlineBooking;
let ServiceSettings = class ServiceSettings {
};
__decorate([
    (0, mongoose_1.Prop)({ type: OnlineBooking, default: {} }),
    __metadata("design:type", OnlineBooking)
], ServiceSettings.prototype, "onlineBooking", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], ServiceSettings.prototype, "forms", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], ServiceSettings.prototype, "commissions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], ServiceSettings.prototype, "generalSettings", void 0);
ServiceSettings = __decorate([
    (0, mongoose_1.Schema)()
], ServiceSettings);
exports.ServiceSettings = ServiceSettings;
let ServiceVariant = class ServiceVariant {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ServiceVariant.prototype, "variantName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ServiceVariant.prototype, "variantDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            priceType: { type: String, required: true },
            price: { type: Price, required: true },
            duration: {
                type: {
                    value: { type: Number, required: true },
                    unit: { type: String, required: true },
                },
                required: true,
            },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], ServiceVariant.prototype, "pricing", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            sku: { type: String },
        },
        default: {},
    }),
    __metadata("design:type", Object)
], ServiceVariant.prototype, "settings", void 0);
ServiceVariant = __decorate([
    (0, mongoose_1.Schema)()
], ServiceVariant);
exports.ServiceVariant = ServiceVariant;
let Service = class Service {
};
__decorate([
    (0, mongoose_1.Prop)({ type: BasicDetails, required: true }),
    __metadata("design:type", BasicDetails)
], Service.prototype, "basicDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: TeamMembers, required: true }),
    __metadata("design:type", TeamMembers)
], Service.prototype, "teamMembers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Resources, default: {} }),
    __metadata("design:type", Resources)
], Service.prototype, "resources", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PricingAndDuration, required: true }),
    __metadata("design:type", PricingAndDuration)
], Service.prototype, "pricingAndDuration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Service.prototype, "serviceAddOns", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: ServiceSettings, default: {} }),
    __metadata("design:type", ServiceSettings)
], Service.prototype, "settings", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ServiceVariant], default: [] }),
    __metadata("design:type", Array)
], Service.prototype, "variants", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Service.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Service.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Service.prototype, "updatedAt", void 0);
Service = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Service);
exports.Service = Service;
exports.ServiceSchema = mongoose_1.SchemaFactory.createForClass(Service);
exports.ServiceSchema.index({ "basicDetails.serviceName": 1 });
exports.ServiceSchema.index({ "basicDetails.category": 1 });
exports.ServiceSchema.index({ "basicDetails.serviceType": 1 });
exports.ServiceSchema.index({ isActive: 1 });
exports.ServiceSchema.index({ createdAt: -1 });
//# sourceMappingURL=service.schema.js.map