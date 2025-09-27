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
exports.TenantConfigSchema = exports.TenantConfig = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let TenantConfig = class TenantConfig {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true, unique: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], TenantConfig.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            primary: String,
            secondary: String,
            accent: String,
            background: String,
            text: String
        },
        default: {
            primary: '#007bff',
            secondary: '#6c757d',
            accent: '#28a745',
            background: '#ffffff',
            text: '#333333'
        }
    }),
    __metadata("design:type", Object)
], TenantConfig.prototype, "brandColors", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            fontFamily: String,
            fontSize: String,
            headerFont: String
        },
        default: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            headerFont: 'Inter, sans-serif'
        }
    }),
    __metadata("design:type", Object)
], TenantConfig.prototype, "typography", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            showBusinessLogo: { type: Boolean, default: true },
            showPoweredBy: { type: Boolean, default: true },
            customCSS: String,
            favicon: String
        },
        default: {}
    }),
    __metadata("design:type", Object)
], TenantConfig.prototype, "customization", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            emailProvider: {
                type: String,
                enum: ['sendgrid', 'mailgun', 'ses', 'smtp'],
                default: 'smtp'
            },
            emailConfig: {
                apiKey: String,
                host: String,
                port: Number,
                username: String,
                password: String,
                fromEmail: String,
                fromName: String
            },
            smsProvider: {
                type: String,
                enum: ['twilio', 'nexmo', 'africas_talking', 'custom'],
                default: 'twilio'
            },
            smsConfig: {
                apiKey: String,
                apiSecret: String,
                senderId: String
            },
            paymentProvider: {
                type: String,
                enum: ['paystack', 'flutterwave', 'stripe', 'razorpay'],
                default: 'paystack'
            },
            paymentConfig: {
                publicKey: String,
                secretKey: String,
                webhookSecret: String
            }
        },
        default: {}
    }),
    __metadata("design:type", Object)
], TenantConfig.prototype, "integrations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], TenantConfig.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], TenantConfig.prototype, "updatedAt", void 0);
TenantConfig = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], TenantConfig);
exports.TenantConfig = TenantConfig;
exports.TenantConfigSchema = mongoose_1.SchemaFactory.createForClass(TenantConfig);
exports.TenantConfigSchema.index({ businessId: 1 });
//# sourceMappingURL=tenant-config.schema.js.map