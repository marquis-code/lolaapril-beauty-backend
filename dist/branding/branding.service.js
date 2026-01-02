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
exports.BrandingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const theme_schema_1 = require("./schemas/theme.schema");
const custom_domain_schema_1 = require("./schemas/custom-domain.schema");
const email_template_schema_1 = require("./schemas/email-template.schema");
const booking_widget_schema_1 = require("./schemas/booking-widget.schema");
const crypto = require("crypto");
let BrandingService = class BrandingService {
    constructor(themeModel, customDomainModel, emailTemplateModel, bookingWidgetModel) {
        this.themeModel = themeModel;
        this.customDomainModel = customDomainModel;
        this.emailTemplateModel = emailTemplateModel;
        this.bookingWidgetModel = bookingWidgetModel;
    }
    async createOrUpdateTheme(tenantId, themeDto) {
        const existingTheme = await this.themeModel.findOne({ tenantId: new mongoose_2.Types.ObjectId(tenantId) });
        if (existingTheme) {
            Object.assign(existingTheme, themeDto);
            return existingTheme.save();
        }
        const theme = new this.themeModel({
            tenantId: new mongoose_2.Types.ObjectId(tenantId),
            ...themeDto,
        });
        return theme.save();
    }
    async getTheme(tenantId) {
        const theme = await this.themeModel.findOne({ tenantId: new mongoose_2.Types.ObjectId(tenantId) });
        if (!theme) {
            return this.getDefaultTheme();
        }
        return theme;
    }
    getDefaultTheme() {
        return {
            colors: {
                primary: '#3B82F6',
                secondary: '#10B981',
                accent: '#F59E0B',
                background: '#FFFFFF',
                text: '#1F2937',
                error: '#EF4444',
                success: '#10B981',
            },
            typography: {
                fontFamily: 'Inter, sans-serif',
                headingFont: 'Inter, sans-serif',
                bodyFont: 'Inter, sans-serif',
            },
            logo: null,
            favicon: null,
            customCss: {
                enabled: false,
                cssCode: '',
            },
        };
    }
    async requestCustomDomain(tenantId, domain) {
        const subdomain = domain.split('.')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        const existing = await this.customDomainModel.findOne({ domain });
        if (existing) {
            throw new common_1.BadRequestException('Domain already in use');
        }
        const verificationToken = crypto.randomBytes(16).toString('hex');
        const customDomain = new this.customDomainModel({
            tenantId: new mongoose_2.Types.ObjectId(tenantId),
            domain,
            subdomain,
            verificationStatus: 'pending',
            sslStatus: 'pending',
            dnsRecords: [
                {
                    type: 'CNAME',
                    name: domain,
                    value: `${subdomain}.yourbookingapp.com`,
                    verified: false,
                },
                {
                    type: 'TXT',
                    name: `_verification.${domain}`,
                    value: verificationToken,
                    verified: false,
                },
            ],
        });
        return customDomain.save();
    }
    async verifyCustomDomain(domainId) {
        const domain = await this.customDomainModel.findById(domainId);
        if (!domain) {
            throw new common_1.NotFoundException('Domain not found');
        }
        domain.verificationStatus = 'verified';
        domain.verifiedAt = new Date();
        domain.dnsRecords.forEach(record => record.verified = true);
        return domain.save();
    }
    async getCustomDomains(tenantId) {
        return this.customDomainModel.find({ tenantId: new mongoose_2.Types.ObjectId(tenantId) }).exec();
    }
    async createEmailTemplate(tenantId, templateType, subject, htmlContent, textContent) {
        const template = new this.emailTemplateModel({
            tenantId: new mongoose_2.Types.ObjectId(tenantId),
            templateType,
            subject,
            htmlContent,
            textContent: textContent || this.stripHtml(htmlContent),
            isCustom: true,
            variables: this.extractVariables(htmlContent),
        });
        return template.save();
    }
    async getEmailTemplate(tenantId, templateType) {
        const customTemplate = await this.emailTemplateModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(tenantId),
            templateType,
            isActive: true,
        });
        if (customTemplate) {
            return customTemplate;
        }
        return this.getDefaultEmailTemplate(templateType);
    }
    getDefaultEmailTemplate(templateType) {
        const templates = {
            booking_confirmation: {
                subject: 'Booking Confirmed - {{businessName}}',
                htmlContent: `
          <h1>Booking Confirmed!</h1>
          <p>Hello {{clientName}},</p>
          <p>Your booking for {{serviceName}} has been confirmed.</p>
          <p><strong>Date:</strong> {{bookingDate}}</p>
          <p><strong>Time:</strong> {{bookingTime}}</p>
        `,
            },
        };
        return templates[templateType] || null;
    }
    extractVariables(content) {
        const regex = /\{\{(\w+)\}\}/g;
        const matches = content.match(regex) || [];
        return [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '')))];
    }
    stripHtml(html) {
        return html.replace(/<[^>]*>/g, '');
    }
    async createBookingWidget(tenantId, configuration, styling) {
        const widgetId = crypto.randomBytes(8).toString('hex');
        const embedCode = this.generateEmbedCode(widgetId, configuration);
        const widget = new this.bookingWidgetModel({
            tenantId: new mongoose_2.Types.ObjectId(tenantId),
            widgetId,
            configuration,
            styling,
            embedCode,
        });
        return widget.save();
    }
    async getBookingWidget(tenantId, widgetId) {
        return this.bookingWidgetModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(tenantId),
            widgetId,
        });
    }
    async trackWidgetImpression(widgetId) {
        await this.bookingWidgetModel.updateOne({ widgetId }, { $inc: { impressions: 1 } });
    }
    async trackWidgetConversion(widgetId) {
        await this.bookingWidgetModel.updateOne({ widgetId }, { $inc: { conversions: 1 } });
    }
    generateEmbedCode(widgetId, config) {
        return `
<!-- Booking Widget -->
<div id="booking-widget-${widgetId}"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.yourbookingapp.com/widget.js';
    script.async = true;
    script.onload = function() {
      BookingWidget.init({
        widgetId: '${widgetId}',
        displayType: '${config.displayType || 'modal'}',
        buttonText: '${config.buttonText || 'Book Now'}',
        buttonColor: '${config.buttonColor || '#3B82F6'}',
      });
    };
    document.body.appendChild(script);
  })();
</script>
    `.trim();
    }
};
BrandingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(theme_schema_1.Theme.name)),
    __param(1, (0, mongoose_1.InjectModel)(custom_domain_schema_1.CustomDomain.name)),
    __param(2, (0, mongoose_1.InjectModel)(email_template_schema_1.EmailTemplate.name)),
    __param(3, (0, mongoose_1.InjectModel)(booking_widget_schema_1.BookingWidget.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], BrandingService);
exports.BrandingService = BrandingService;
//# sourceMappingURL=branding.service.js.map