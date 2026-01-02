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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookProcessorService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const webhook_schema_1 = require("./schemas/webhook.schema");
const config_1 = require("@nestjs/config");
const crypto = require("crypto");
let WebhookProcessorService = class WebhookProcessorService {
    constructor(webhookModel, configService) {
        this.webhookModel = webhookModel;
        this.configService = configService;
    }
    async processWebhook(source, payload, signature) {
        const isValid = this.verifySignature(source, payload, signature);
        if (!isValid) {
            throw new common_1.BadRequestException('Invalid webhook signature');
        }
        const webhook = new this.webhookModel({
            event: payload.event || payload.type,
            source,
            payload,
            signature,
            status: 'pending',
        });
        await webhook.save();
        try {
            switch (source.toLowerCase()) {
                case 'paystack':
                    await this.processPaystackWebhook(webhook);
                    break;
                case 'stripe':
                    await this.processStripeWebhook(webhook);
                    break;
                case 'square':
                    await this.processSquareWebhook(webhook);
                    break;
                default:
                    throw new Error(`Unknown webhook source: ${source}`);
            }
            webhook.status = 'processed';
            webhook.processedAt = new Date();
            await webhook.save();
            return { success: true };
        }
        catch (error) {
            webhook.status = 'failed';
            webhook.errorMessage = error.message;
            webhook.retryCount += 1;
            await webhook.save();
            if (webhook.retryCount < 3) {
                console.log(`Scheduling retry for webhook ${webhook._id}`);
            }
            throw error;
        }
    }
    verifySignature(source, payload, signature) {
        let secret;
        switch (source.toLowerCase()) {
            case 'paystack':
                secret = this.configService.get('PAYSTACK_SECRET_KEY');
                break;
            case 'stripe':
                secret = this.configService.get('STRIPE_WEBHOOK_SECRET');
                break;
            default:
                return false;
        }
        const hash = crypto
            .createHmac('sha512', secret)
            .update(JSON.stringify(payload))
            .digest('hex');
        return hash === signature;
    }
    async processPaystackWebhook(webhook) {
        const { event, data } = webhook.payload;
        webhook.processingLog.push(`Processing Paystack event: ${event}`);
        switch (event) {
            case 'charge.success':
                console.log('Processing successful charge');
                break;
            case 'transfer.success':
                console.log('Processing successful transfer');
                break;
            default:
                console.log(`Unhandled Paystack event: ${event}`);
        }
        await webhook.save();
    }
    async processStripeWebhook(webhook) {
        const { type, data } = webhook.payload;
        webhook.processingLog.push(`Processing Stripe event: ${type}`);
        switch (type) {
            case 'payment_intent.succeeded':
                console.log('Processing payment intent succeeded');
                break;
            case 'payment_intent.failed':
                console.log('Processing payment intent failed');
                break;
            default:
                console.log(`Unhandled Stripe event: ${type}`);
        }
        await webhook.save();
    }
    async processSquareWebhook(webhook) {
        const { type, data } = webhook.payload;
        webhook.processingLog.push(`Processing Square event: ${type}`);
        await webhook.save();
    }
};
WebhookProcessorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(webhook_schema_1.Webhook.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService])
], WebhookProcessorService);
exports.WebhookProcessorService = WebhookProcessorService;
//# sourceMappingURL=webhook-processor.service.js.map