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
exports.ClientSchema = exports.Client = exports.ClientSettingsSchema = exports.ClientSettings = exports.ClientAddressSchema = exports.ClientAddress = exports.AdditionalInfoSchema = exports.AdditionalInfo = exports.ClientProfileSchema = exports.ClientProfile = exports.EmergencyContactSchema = exports.EmergencyContact = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let EmergencyContact = class EmergencyContact {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EmergencyContact.prototype, "fullName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EmergencyContact.prototype, "relationship", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], EmergencyContact.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            countryCode: { type: String, required: true },
            number: { type: String, required: true },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], EmergencyContact.prototype, "phone", void 0);
EmergencyContact = __decorate([
    (0, mongoose_1.Schema)()
], EmergencyContact);
exports.EmergencyContact = EmergencyContact;
exports.EmergencyContactSchema = mongoose_1.SchemaFactory.createForClass(EmergencyContact);
let ClientProfile = class ClientProfile {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ClientProfile.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ClientProfile.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ClientProfile.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            countryCode: { type: String, required: true },
            number: { type: String, required: true },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], ClientProfile.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            dayAndMonth: { type: String },
            year: { type: String },
        },
    }),
    __metadata("design:type", Object)
], ClientProfile.prototype, "birthday", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ClientProfile.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ClientProfile.prototype, "pronouns", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ClientProfile.prototype, "additionalEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            countryCode: { type: String },
            number: { type: String },
        },
    }),
    __metadata("design:type", Object)
], ClientProfile.prototype, "additionalPhone", void 0);
ClientProfile = __decorate([
    (0, mongoose_1.Schema)()
], ClientProfile);
exports.ClientProfile = ClientProfile;
exports.ClientProfileSchema = mongoose_1.SchemaFactory.createForClass(ClientProfile);
let AdditionalInfo = class AdditionalInfo {
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AdditionalInfo.prototype, "clientSource", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            clientId: { type: String },
            clientName: { type: String },
        },
    }),
    __metadata("design:type", Object)
], AdditionalInfo.prototype, "referredBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AdditionalInfo.prototype, "preferredLanguage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AdditionalInfo.prototype, "occupation", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AdditionalInfo.prototype, "country", void 0);
AdditionalInfo = __decorate([
    (0, mongoose_1.Schema)()
], AdditionalInfo);
exports.AdditionalInfo = AdditionalInfo;
exports.AdditionalInfoSchema = mongoose_1.SchemaFactory.createForClass(AdditionalInfo);
let ClientAddress = class ClientAddress {
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ClientAddress.prototype, "addressName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ClientAddress.prototype, "addressType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ClientAddress.prototype, "street", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ClientAddress.prototype, "aptSuite", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ClientAddress.prototype, "district", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ClientAddress.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ClientAddress.prototype, "region", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ClientAddress.prototype, "postcode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ClientAddress.prototype, "country", void 0);
ClientAddress = __decorate([
    (0, mongoose_1.Schema)()
], ClientAddress);
exports.ClientAddress = ClientAddress;
exports.ClientAddressSchema = mongoose_1.SchemaFactory.createForClass(ClientAddress);
let ClientSettings = class ClientSettings {
};
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            emailNotifications: { type: Boolean, default: true },
        },
        default: {},
    }),
    __metadata("design:type", Object)
], ClientSettings.prototype, "appointmentNotifications", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            clientAcceptsEmailMarketing: { type: Boolean, default: false },
        },
        default: {},
    }),
    __metadata("design:type", Object)
], ClientSettings.prototype, "marketingNotifications", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], ClientSettings.prototype, "grokCodeFast1Enabled", void 0);
ClientSettings = __decorate([
    (0, mongoose_1.Schema)()
], ClientSettings);
exports.ClientSettings = ClientSettings;
exports.ClientSettingsSchema = mongoose_1.SchemaFactory.createForClass(ClientSettings);
let Client = class Client {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Business", required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Client.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: exports.ClientProfileSchema, required: true }),
    __metadata("design:type", ClientProfile)
], Client.prototype, "profile", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: exports.AdditionalInfoSchema }),
    __metadata("design:type", AdditionalInfo)
], Client.prototype, "additionalInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            primary: { type: exports.EmergencyContactSchema },
            secondary: { type: exports.EmergencyContactSchema },
        },
    }),
    __metadata("design:type", Object)
], Client.prototype, "emergencyContacts", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: exports.ClientAddressSchema }),
    __metadata("design:type", ClientAddress)
], Client.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: exports.ClientSettingsSchema, default: {} }),
    __metadata("design:type", ClientSettings)
], Client.prototype, "settings", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Client.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Client.prototype, "totalVisits", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Client.prototype, "totalSpent", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Client.prototype, "lastVisit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Client.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Client.prototype, "updatedAt", void 0);
Client = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Client);
exports.Client = Client;
exports.ClientSchema = mongoose_1.SchemaFactory.createForClass(Client);
exports.ClientSchema.index({ businessId: 1 });
exports.ClientSchema.index({ businessId: 1, "profile.email": 1 }, { unique: true });
exports.ClientSchema.index({ businessId: 1, "profile.firstName": 1, "profile.lastName": 1 });
exports.ClientSchema.index({ businessId: 1, "profile.phone.number": 1 });
exports.ClientSchema.index({ businessId: 1, createdAt: -1 });
exports.ClientSchema.index({ businessId: 1, isActive: 1 });
//# sourceMappingURL=client.schema.js.map