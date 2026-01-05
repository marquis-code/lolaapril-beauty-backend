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
exports.ThemeSchema = exports.Theme = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Theme = class Theme {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Theme.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            primary: { type: String, required: true },
            secondary: { type: String, required: true },
            accent: { type: String, required: true },
            background: { type: String, required: true },
            text: { type: String, required: true },
            error: { type: String, required: true },
            success: { type: String, required: true },
        },
        required: true
    }),
    __metadata("design:type", Object)
], Theme.prototype, "colors", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            fontFamily: { type: String, required: true },
            headingFont: { type: String, required: true },
            bodyFont: { type: String, required: true },
        },
        required: true
    }),
    __metadata("design:type", Object)
], Theme.prototype, "typography", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            url: String,
            width: Number,
            height: Number,
            alt: String,
        }
    }),
    __metadata("design:type", Object)
], Theme.prototype, "logo", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            url: String,
        }
    }),
    __metadata("design:type", Object)
], Theme.prototype, "favicon", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            enabled: { type: Boolean, default: false },
            cssCode: { type: String, default: '' },
        },
        default: { enabled: false, cssCode: '' }
    }),
    __metadata("design:type", Object)
], Theme.prototype, "customCss", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Theme.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Theme.prototype, "updatedAt", void 0);
Theme = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Theme);
exports.Theme = Theme;
exports.ThemeSchema = mongoose_1.SchemaFactory.createForClass(Theme);
exports.ThemeSchema.index({ tenantId: 1 }, { unique: true });
//# sourceMappingURL=theme.schema.js.map