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
exports.PaystackService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let PaystackService = class PaystackService {
    constructor(configService) {
        this.configService = configService;
        this.baseUrl = 'https://api.paystack.co';
        this.secretKey = this.configService.get('PAYSTACK_SECRET_KEY');
    }
    async initialize(config) {
        this.secretKey = config.secretKey || this.secretKey;
    }
    async createPayment(amount, metadata) {
        const payload = {
            email: metadata.email,
            amount: Math.round(amount * 100),
            metadata,
            bearer: 'account',
        };
        if (metadata.reference) {
            payload.reference = metadata.reference;
            console.log('✅ Paystack: Using backend-generated reference:', metadata.reference);
        }
        if (metadata.subaccount) {
            payload.subaccount = metadata.subaccount;
            payload.transaction_charge = Math.round((metadata.platformFee || 0) * 100);
            console.log('✅ Paystack: Using subaccount split:', {
                subaccount: metadata.subaccount,
                platformFee: metadata.platformFee,
                businessReceives: amount - (metadata.platformFee || 0)
            });
        }
        const response = await axios_1.default.post(`${this.baseUrl}/transaction/initialize`, payload, {
            headers: {
                Authorization: `Bearer ${this.secretKey}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data.data;
    }
    async verifyPayment(reference) {
        const response = await axios_1.default.get(`${this.baseUrl}/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${this.secretKey}`,
            },
        });
        return response.data.data;
    }
    async refund(transactionId, amount) {
        const response = await axios_1.default.post(`${this.baseUrl}/refund`, {
            transaction: transactionId,
            amount: Math.round(amount * 100),
        }, {
            headers: {
                Authorization: `Bearer ${this.secretKey}`,
            },
        });
        return response.data.data;
    }
    async getBalance() {
        const response = await axios_1.default.get(`${this.baseUrl}/balance`, {
            headers: {
                Authorization: `Bearer ${this.secretKey}`,
            },
        });
        return response.data.data[0].balance / 100;
    }
    async createSubaccount(data) {
        const response = await axios_1.default.post(`${this.baseUrl}/subaccount`, {
            business_name: data.businessName,
            settlement_bank: data.settlementBank,
            account_number: data.accountNumber,
            percentage_charge: data.percentageCharge,
            description: data.description || `Subaccount for ${data.businessName}`,
            primary_contact_email: data.primaryContactEmail,
            primary_contact_name: data.primaryContactName,
            primary_contact_phone: data.primaryContactPhone,
            metadata: data.metadata,
        }, {
            headers: {
                Authorization: `Bearer ${this.secretKey}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data.data;
    }
    async updateSubaccount(subaccountCode, data) {
        const response = await axios_1.default.put(`${this.baseUrl}/subaccount/${subaccountCode}`, data, {
            headers: {
                Authorization: `Bearer ${this.secretKey}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data.data;
    }
    async getSubaccount(subaccountCode) {
        const response = await axios_1.default.get(`${this.baseUrl}/subaccount/${subaccountCode}`, {
            headers: {
                Authorization: `Bearer ${this.secretKey}`,
            },
        });
        return response.data.data;
    }
    async listSubaccounts(page = 1, perPage = 50) {
        const response = await axios_1.default.get(`${this.baseUrl}/subaccount?perPage=${perPage}&page=${page}`, {
            headers: {
                Authorization: `Bearer ${this.secretKey}`,
            },
        });
        return response.data.data;
    }
};
PaystackService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PaystackService);
exports.PaystackService = PaystackService;
//# sourceMappingURL=paystack.service.js.map