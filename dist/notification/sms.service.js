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
exports.SMSService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let SMSService = class SMSService {
    constructor() {
        this.baseUrl = process.env.TWILIO_BASE_URL || 'https://api.twilio.com/2010-04-01';
        this.apiKey = process.env.TWILIO_API_KEY;
    }
    async sendSMS(to, message, from) {
        try {
            const formattedPhone = this.formatPhoneNumber(to);
            const response = await axios_1.default.post(`${this.baseUrl}/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
                To: formattedPhone,
                From: from || process.env.TWILIO_PHONE_NUMBER,
                Body: message,
            }, {
                auth: {
                    username: process.env.TWILIO_ACCOUNT_SID,
                    password: process.env.TWILIO_AUTH_TOKEN,
                },
            });
            return {
                messageId: response.data.sid,
                success: true,
            };
        }
        catch (error) {
            return {
                messageId: '',
                success: false,
                error: error.response?.data?.message || error.message,
            };
        }
    }
    async sendBulkSMS(recipients, message, from) {
        const results = await Promise.allSettled(recipients.map(phone => this.sendSMS(phone, message, from)));
        const sent = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
        const failed = results.length - sent;
        const errors = results
            .filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success))
            .map(r => r.status === 'rejected' ? r.reason : r.value.error);
        return { sent, failed, errors };
    }
    formatPhoneNumber(phone) {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.startsWith('0')) {
            return `+234${cleaned.substring(1)}`;
        }
        if (!cleaned.startsWith('+')) {
            return `+234${cleaned}`;
        }
        return cleaned;
    }
};
SMSService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SMSService);
exports.SMSService = SMSService;
//# sourceMappingURL=sms.service.js.map