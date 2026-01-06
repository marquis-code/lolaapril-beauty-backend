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
exports.BookingWidgetSchema = exports.BookingWidget = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let BookingWidget = class BookingWidget {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], BookingWidget.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], BookingWidget.prototype, "widgetId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Default Widget' }),
    __metadata("design:type", String)
], BookingWidget.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            displayType: { type: String, required: true },
            buttonText: { type: String, required: true },
            buttonColor: { type: String, required: true },
            showBranding: { type: Boolean, default: true },
            allowedOrigins: { type: [String], default: [] },
        },
        required: true
    }),
    __metadata("design:type", Object)
], BookingWidget.prototype, "configuration", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            theme: { type: String, required: true },
            primaryColor: { type: String, required: true },
            borderRadius: { type: String, required: true },
            fontSize: { type: String, required: true },
        },
        required: true
    }),
    __metadata("design:type", Object)
], BookingWidget.prototype, "styling", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String }),
    __metadata("design:type", String)
], BookingWidget.prototype, "embedCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], BookingWidget.prototype, "impressions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], BookingWidget.prototype, "conversions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], BookingWidget.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], BookingWidget.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], BookingWidget.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], BookingWidget.prototype, "updatedAt", void 0);
BookingWidget = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], BookingWidget);
exports.BookingWidget = BookingWidget;
exports.BookingWidgetSchema = mongoose_1.SchemaFactory.createForClass(BookingWidget);
exports.BookingWidgetSchema.index({ tenantId: 1 });
exports.BookingWidgetSchema.index({ widgetId: 1 }, { unique: true });
exports.BookingWidgetSchema.index({ tenantId: 1, isActive: 1 });
//# sourceMappingURL=booking-widget.schema.js.map