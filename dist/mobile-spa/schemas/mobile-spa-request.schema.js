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
exports.MobileSpaRequestSchema = exports.MobileSpaRequest = exports.MobileSpaLocation = exports.MobileSpaService = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let MobileSpaService = class MobileSpaService {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Service', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], MobileSpaService.prototype, "serviceId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MobileSpaService.prototype, "serviceName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], MobileSpaService.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1, min: 1 }),
    __metadata("design:type", Number)
], MobileSpaService.prototype, "quantity", void 0);
MobileSpaService = __decorate([
    (0, mongoose_1.Schema)()
], MobileSpaService);
exports.MobileSpaService = MobileSpaService;
let MobileSpaLocation = class MobileSpaLocation {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MobileSpaLocation.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], MobileSpaLocation.prototype, "lat", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], MobileSpaLocation.prototype, "lng", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MobileSpaLocation.prototype, "placeId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MobileSpaLocation.prototype, "additionalDirections", void 0);
MobileSpaLocation = __decorate([
    (0, mongoose_1.Schema)()
], MobileSpaLocation);
exports.MobileSpaLocation = MobileSpaLocation;
let MobileSpaRequest = class MobileSpaRequest {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], MobileSpaRequest.prototype, "clientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MobileSpaRequest.prototype, "clientName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MobileSpaRequest.prototype, "clientEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MobileSpaRequest.prototype, "clientPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], MobileSpaRequest.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MobileSpaRequest.prototype, "businessName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MobileSpaRequest.prototype, "businessEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [MobileSpaService], required: true }),
    __metadata("design:type", Array)
], MobileSpaRequest.prototype, "services", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1 }),
    __metadata("design:type", Number)
], MobileSpaRequest.prototype, "numberOfPeople", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: MobileSpaLocation, required: true }),
    __metadata("design:type", MobileSpaLocation)
], MobileSpaRequest.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], MobileSpaRequest.prototype, "requestedDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MobileSpaRequest.prototype, "requestedTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['pending', 'accepted', 'rejected', 'time_suggested', 'paid', 'completed', 'cancelled'],
        default: 'pending',
    }),
    __metadata("design:type", String)
], MobileSpaRequest.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], MobileSpaRequest.prototype, "suggestedDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MobileSpaRequest.prototype, "suggestedTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MobileSpaRequest.prototype, "businessNotes", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MobileSpaRequest.prototype, "clientNotes", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MobileSpaRequest.prototype, "paymentLink", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
    }),
    __metadata("design:type", String)
], MobileSpaRequest.prototype, "paymentStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], MobileSpaRequest.prototype, "totalAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], MobileSpaRequest.prototype, "requestNumber", void 0);
MobileSpaRequest = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], MobileSpaRequest);
exports.MobileSpaRequest = MobileSpaRequest;
exports.MobileSpaRequestSchema = mongoose_1.SchemaFactory.createForClass(MobileSpaRequest);
exports.MobileSpaRequestSchema.index({ clientId: 1 });
exports.MobileSpaRequestSchema.index({ businessId: 1 });
exports.MobileSpaRequestSchema.index({ status: 1 });
exports.MobileSpaRequestSchema.index({ requestedDate: 1 });
exports.MobileSpaRequestSchema.index({ createdAt: -1 });
exports.MobileSpaRequestSchema.index({ requestNumber: 1 });
//# sourceMappingURL=mobile-spa-request.schema.js.map