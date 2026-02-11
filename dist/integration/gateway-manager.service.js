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
var GatewayManagerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayManagerService = void 0;
const common_1 = require("@nestjs/common");
const paystack_service_1 = require("./payment-gateways/paystack/paystack.service");
const stripe_service_1 = require("./payment-gateways/stripe/stripe.service");
const square_service_1 = require("./payment-gateways/square/square.service");
let GatewayManagerService = GatewayManagerService_1 = class GatewayManagerService {
    constructor(paystackService, stripeService, squareService) {
        this.paystackService = paystackService;
        this.stripeService = stripeService;
        this.squareService = squareService;
        this.logger = new common_1.Logger(GatewayManagerService_1.name);
        this.gateways = new Map();
        this.gateways.set('paystack', this.paystackService);
        this.gateways.set('stripe', this.stripeService);
        this.gateways.set('square', this.squareService);
    }
    async processPayment(gateway, amount, metadata) {
        try {
            const gatewayService = this.getGateway(gateway);
            this.logger.log(`Processing payment with ${gateway}: $${amount}`);
            const result = await gatewayService.createPayment(amount, metadata);
            this.logger.log(`Payment processed successfully with ${gateway}`);
            return {
                success: true,
                gateway,
                ...result
            };
        }
        catch (error) {
            this.logger.error(`Payment processing failed with ${gateway}: ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`Payment processing failed: ${error.message}`);
        }
    }
    async verifyPayment(gateway, reference) {
        try {
            const gatewayService = this.getGateway(gateway);
            this.logger.log(`Verifying payment with ${gateway}: ${reference}`);
            const result = await gatewayService.verifyPayment(reference);
            this.logger.log(`Payment verified successfully with ${gateway}`);
            return {
                success: true,
                gateway,
                ...result
            };
        }
        catch (error) {
            this.logger.error(`Payment verification failed with ${gateway}: ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`Payment verification failed: ${error.message}`);
        }
    }
    async processRefund(gateway, transactionId, amount) {
        try {
            const gatewayService = this.getGateway(gateway);
            this.logger.log(`Processing refund with ${gateway}: $${amount} for transaction ${transactionId}`);
            const result = await gatewayService.refund(transactionId, amount);
            this.logger.log(`Refund processed successfully with ${gateway}`);
            return {
                success: true,
                gateway,
                ...result
            };
        }
        catch (error) {
            this.logger.error(`Refund processing failed with ${gateway}: ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`Refund processing failed: ${error.message}`);
        }
    }
    async processTransfer(gateway, amount, transferData) {
        try {
            const gatewayService = this.getGateway(gateway);
            this.logger.log(`Processing transfer with ${gateway}: $${amount}`);
            if (gateway === 'paystack') {
                return await this.processPaystackTransfer(amount, transferData);
            }
            else if (gateway === 'stripe') {
                return await this.processStripeTransfer(amount, transferData);
            }
            throw new common_1.BadRequestException(`Transfer not supported for gateway: ${gateway}`);
        }
        catch (error) {
            this.logger.error(`Transfer processing failed with ${gateway}: ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`Transfer processing failed: ${error.message}`);
        }
    }
    async getBalance(gateway) {
        try {
            const gatewayService = this.getGateway(gateway);
            return await gatewayService.getBalance();
        }
        catch (error) {
            this.logger.error(`Failed to get balance for ${gateway}: ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`Failed to get balance: ${error.message}`);
        }
    }
    async initializeGateway(gateway, config) {
        try {
            const gatewayService = this.getGateway(gateway);
            await gatewayService.initialize(config);
            this.logger.log(`Gateway ${gateway} initialized with custom config`);
        }
        catch (error) {
            this.logger.error(`Failed to initialize ${gateway}: ${error.message}`, error.stack);
            throw error;
        }
    }
    getAvailableGateways() {
        return Array.from(this.gateways.keys());
    }
    isGatewayAvailable(gateway) {
        return this.gateways.has(gateway);
    }
    getGateway(gateway) {
        const gatewayService = this.gateways.get(gateway.toLowerCase());
        if (!gatewayService) {
            throw new common_1.BadRequestException(`Gateway '${gateway}' not supported. Available gateways: ${this.getAvailableGateways().join(', ')}`);
        }
        return gatewayService;
    }
    async processPaystackTransfer(amount, transferData) {
        const axios = require('axios');
        try {
            const bankCode = String(transferData.bankCode || '').trim();
            if (!bankCode || !/^\d{3}$/.test(bankCode)) {
                throw new Error(`Invalid bank code "${bankCode}". Bank code must be a 3-digit number. ` +
                    `Examples: "058" (GTB), "044" (Access), "011" (First Bank). ` +
                    `Get valid codes from: https://paystack.com/docs/identity-verification/supported-banks/`);
            }
            let recipientCode = transferData.recipientCode;
            if (!recipientCode) {
                this.logger.log('Creating Paystack transfer recipient...');
                this.logger.log(`  Account: ${transferData.accountNumber}`);
                this.logger.log(`  Bank Code: ${bankCode}`);
                this.logger.log(`  Account Name: ${transferData.accountName}`);
                const recipientResponse = await axios.post('https://api.paystack.co/transferrecipient', {
                    type: 'nuban',
                    name: transferData.accountName,
                    account_number: transferData.accountNumber || transferData.recipient,
                    bank_code: bankCode,
                    currency: 'NGN'
                }, {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });
                recipientCode = recipientResponse.data.data.recipient_code;
                this.logger.log(`✅ Recipient created: ${recipientCode}`);
            }
            this.logger.log(`Initiating transfer to ${recipientCode}...`);
            const response = await axios.post('https://api.paystack.co/transfer', {
                source: 'balance',
                amount: Math.round(amount * 100),
                recipient: recipientCode,
                reason: transferData.reason || 'Payout',
                reference: transferData.reference
            }, {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            this.logger.log('✅ Transfer initiated successfully');
            return {
                transactionId: response.data.data.transfer_code,
                status: response.data.data.status,
                reference: response.data.data.reference,
                recipientCode
            };
        }
        catch (error) {
            this.logger.error('Paystack transfer failed:', error.response?.data || error.message);
            throw error;
        }
    }
    async processStripeTransfer(amount, transferData) {
        try {
            const payout = await this.stripeService['stripe'].payouts.create({
                amount: Math.round(amount * 100),
                currency: transferData.currency || 'usd',
                description: transferData.reason || 'Payout',
                metadata: {
                    reference: transferData.reference
                }
            });
            return {
                transactionId: payout.id,
                status: payout.status,
                reference: transferData.reference
            };
        }
        catch (error) {
            this.logger.error('Stripe payout failed', error);
            throw error;
        }
    }
    async refundPayment(gatewayName, transactionId, amount) {
        const gateway = this.getGateway(gatewayName);
        return gateway.refund(transactionId, amount);
    }
};
GatewayManagerService = GatewayManagerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [paystack_service_1.PaystackService,
        stripe_service_1.StripeService,
        square_service_1.SquareService])
], GatewayManagerService);
exports.GatewayManagerService = GatewayManagerService;
//# sourceMappingURL=gateway-manager.service.js.map