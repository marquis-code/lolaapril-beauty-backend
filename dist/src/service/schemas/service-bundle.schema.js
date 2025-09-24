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
exports.ServiceBundleSchema = exports.ServiceBundle = exports.BundleOnlineBooking = exports.BundlePricing = exports.BundleService = exports.BasicInfo = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let BasicInfo = class BasicInfo {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BasicInfo.prototype, "bundleName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'ServiceCategory', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], BasicInfo.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BasicInfo.prototype, "description", void 0);
BasicInfo = __decorate([
    (0, mongoose_1.Schema)()
], BasicInfo);
exports.BasicInfo = BasicInfo;
let BundleService = class BundleService {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Service', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], BundleService.prototype, "serviceId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BundleService.prototype, "serviceName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], BundleService.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], BundleService.prototype, "sequence", void 0);
BundleService = __decorate([
    (0, mongoose_1.Schema)()
], BundleService);
exports.BundleService = BundleService;
let BundlePricing = class BundlePricing {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BundlePricing.prototype, "priceType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            currency: { type: String, required: true },
            amount: { type: Number, required: true },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], BundlePricing.prototype, "retailPrice", void 0);
BundlePricing = __decorate([
    (0, mongoose_1.Schema)()
], BundlePricing);
exports.BundlePricing = BundlePricing;
let BundleOnlineBooking = class BundleOnlineBooking {
};
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], BundleOnlineBooking.prototype, "enabled", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: "All clients" }),
    __metadata("design:type", String)
], BundleOnlineBooking.prototype, "availableFor", void 0);
BundleOnlineBooking = __decorate([
    (0, mongoose_1.Schema)()
], BundleOnlineBooking);
exports.BundleOnlineBooking = BundleOnlineBooking;
let ServiceBundle = class ServiceBundle {
};
__decorate([
    (0, mongoose_1.Prop)({ type: BasicInfo, required: true }),
    __metadata("design:type", BasicInfo)
], ServiceBundle.prototype, "basicInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [BundleService], required: true }),
    __metadata("design:type", Array)
], ServiceBundle.prototype, "services", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ServiceBundle.prototype, "scheduleType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: BundlePricing, required: true }),
    __metadata("design:type", BundlePricing)
], ServiceBundle.prototype, "pricing", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: BundleOnlineBooking, default: {} }),
    __metadata("design:type", BundleOnlineBooking)
], ServiceBundle.prototype, "onlineBooking", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ServiceBundle.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], ServiceBundle.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], ServiceBundle.prototype, "updatedAt", void 0);
ServiceBundle = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ServiceBundle);
exports.ServiceBundle = ServiceBundle;
exports.ServiceBundleSchema = mongoose_1.SchemaFactory.createForClass(ServiceBundle);
exports.ServiceBundleSchema.index({ "basicInfo.bundleName": 1 });
exports.ServiceBundleSchema.index({ "basicInfo.category": 1 });
exports.ServiceBundleSchema.index({ isActive: 1 });
exports.ServiceBundleSchema.index({ createdAt: -1 });
//# sourceMappingURL=service-bundle.schema.js.map