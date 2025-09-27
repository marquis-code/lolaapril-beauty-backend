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
const nodemailer = require("nodemailer");
let EmailService = class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    async sendEmail(to, subject, html, from) {
        try {
            const info = await this.transporter.sendMail({
                from: from || process.env.FROM_EMAIL || 'noreply@salon.com',
                to,
                subject,
                html,
            });
            return {
                messageId: info.messageId,
                success: true,
            };
        }
        catch (error) {
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