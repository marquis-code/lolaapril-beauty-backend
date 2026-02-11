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
exports.SquareService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const { SquareClient, SquareEnvironment } = require('square');
let SquareService = class SquareService {
    constructor(configService) {
        this.configService = configService;
        this.client = new SquareClient({
            accessToken: this.configService.get('SQUARE_ACCESS_TOKEN'),
            environment: SquareEnvironment.Production,
        });
    }
    async initialize(config) {
        this.client = new SquareClient({
            accessToken: config.accessToken,
            environment: config.environment || SquareEnvironment.Production,
        });
    }
    async createPayment(amount, metadata) {
        try {
            const response = await this.client.payments.create({
                sourceId: metadata.sourceId,
                idempotencyKey: metadata.idempotencyKey,
                amountMoney: {
                    amount: BigInt(Math.round(amount * 100)),
                    currency: metadata.currency || 'USD',
                },
                note: metadata.note,
            });
            return response.result?.payment || response;
        }
        catch (error) {
            console.error('Square payment creation error:', error);
            throw error;
        }
    }
    async verifyPayment(reference) {
        try {
            const response = await this.client.payments.get(reference);
            return response.result?.payment || response;
        }
        catch (error) {
            console.error('Square payment verification error:', error);
            throw error;
        }
    }
    async refund(transactionId, amount) {
        try {
            const response = await this.client.refunds.create({
                paymentId: transactionId,
                idempotencyKey: `refund-${Date.now()}`,
                amountMoney: {
                    amount: BigInt(Math.round(amount * 100)),
                    currency: 'USD',
                },
            });
            return response.result?.refund || response;
        }
        catch (error) {
            console.error('Square refund error:', error);
            throw error;
        }
    }
    async getBalance() {
        return 0;
    }
};
SquareService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SquareService);
exports.SquareService = SquareService;
//# sourceMappingURL=square.service.js.map