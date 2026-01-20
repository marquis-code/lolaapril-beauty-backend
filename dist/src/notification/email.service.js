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
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const resend_1 = require("resend");
let EmailService = class EmailService {
    constructor() {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            console.warn('⚠️  RESEND_API_KEY not found in environment variables');
        }
        this.resend = new resend_1.Resend(apiKey || 'demo_key');
    }
    async sendEmail(to, subject, html, from) {
        try {
            const fromEmail = from || process.env.FROM_EMAIL || 'onboarding@resend.dev';
            const { data, error } = await this.resend.emails.send({
                from: fromEmail,
                to: [to],
                subject,
                html,
            });
            if (error) {
                console.error('❌ Resend email error:', error);
                return {
                    messageId: '',
                    success: false,
                    error: error.message || JSON.stringify(error),
                };
            }
            return {
                messageId: data?.id || '',
                success: true,
            };
        }
        catch (error) {
            console.error('❌ Email sending failed:', error);
            return {
                messageId: '',
                success: false,
                error: error.message,
            };
        }
    }
    async sendBulkEmail(recipients, subject, html, from) {
        const results = await Promise.allSettled(recipients.map(email => this.sendEmail(email, subject, html, from)));
        const sent = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
        const failed = results.length - sent;
        const errors = results
            .filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success))
            .map(r => r.status === 'rejected' ? r.reason : r.value.error);
        return { sent, failed, errors };
    }
};
EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
exports.EmailService = EmailService;
//# sourceMappingURL=email.service.js.map