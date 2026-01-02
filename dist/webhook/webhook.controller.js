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
exports.WebhookController = void 0;
const common_1 = require("@nestjs/common");
const webhook_processor_service_1 = require("./webhook-processor.service");
let WebhookController = class WebhookController {
    constructor(webhookProcessor) {
        this.webhookProcessor = webhookProcessor;
    }
    async handlePaystackWebhook(payload, signature) {
        return this.webhookProcessor.processWebhook('paystack', payload, signature);
    }
    async handleStripeWebhook(payload, signature) {
        return this.webhookProcessor.processWebhook('stripe', payload, signature);
    }
    async handleSquareWebhook(payload, signature) {
        return this.webhookProcessor.processWebhook('square', payload, signature);
    }
};
__decorate([
    (0, common_1.Post)('paystack'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-paystack-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "handlePaystackWebhook", null);
__decorate([
    (0, common_1.Post)('stripe'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "handleStripeWebhook", null);
__decorate([
    (0, common_1.Post)('square'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('square-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "handleSquareWebhook", null);
WebhookController = __decorate([
    (0, common_1.Controller)('webhooks'),
    __metadata("design:paramtypes", [webhook_processor_service_1.WebhookProcessorService])
], WebhookController);
exports.WebhookController = WebhookController;
//# sourceMappingURL=webhook.controller.js.map