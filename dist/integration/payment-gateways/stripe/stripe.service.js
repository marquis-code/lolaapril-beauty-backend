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
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = require("stripe");
let StripeService = class StripeService {
    constructor(configService) {
        this.configService = configService;
        const secretKey = this.configService.get('STRIPE_SECRET_KEY');
        this.stripe = new stripe_1.default(secretKey, {
            apiVersion: '2025-12-15.clover',
        });
    }
    async initialize(config) {
        this.stripe = new stripe_1.default(config.secretKey, {
            apiVersion: '2025-12-15.clover',
        });
    }
    async createPayment(amount, metadata) {
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: metadata.currency || 'usd',
            metadata,
        });
        return {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        };
    }
    async verifyPayment(reference) {
        const paymentIntent = await this.stripe.paymentIntents.retrieve(reference);
        return {
            status: paymentIntent.status,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
        };
    }
    async refund(transactionId, amount) {
        const refund = await this.stripe.refunds.create({
            payment_intent: transactionId,
            amount: Math.round(amount * 100),
        });
        return refund;
    }
    async getBalance() {
        const balance = await this.stripe.balance.retrieve();
        return balance.available[0]?.amount ? balance.available[0].amount / 100 : 0;
    }
};
StripeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StripeService);
exports.StripeService = StripeService;
//# sourceMappingURL=stripe.service.js.map