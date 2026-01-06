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
    async createOrUpdateTheme(businessId, themeDto) {
        try {
            const existingTheme = await this.themeModel.findOne({
                tenantId: new mongoose_2.Types.ObjectId(businessId)
            });
            if (existingTheme) {
                Object.assign(existingTheme, themeDto);
                existingTheme.updatedAt = new Date();
                const updated = await existingTheme.save();
                return {
                    success: true,
                    message: 'Theme updated successfully',
                    theme: updated
                };
            }
            const theme = new this.themeModel({
                tenantId: new mongoose_2.Types.ObjectId(businessId),
                ...themeDto,
            });
            const saved = await theme.save();
            return {
                success: true,
                message: 'Theme created successfully',
                theme: saved
            };
        }
        catch (error) {
            console.error('Create/Update theme error:', error);
            throw new common_1.InternalServerErrorException('Failed to save theme');
        }
    }
    async updateTheme(businessId, themeDto) {
        const theme = await this.themeModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(businessId)
        });
        if (!theme) {
            throw new common_1.NotFoundException('Theme not found for this business');
        }
        try {
            if (themeDto.colors) {
                theme.colors = { ...theme.colors, ...themeDto.colors };
            }
            if (themeDto.typography) {
                theme.typography = { ...theme.typography, ...themeDto.typography };
            }
            if (themeDto.logo) {
                theme.logo = themeDto.logo;
            }
            if (themeDto.favicon) {
                theme.favicon = themeDto.favicon;
            }
            if (themeDto.customCss) {
                theme.customCss = { ...theme.customCss, ...themeDto.customCss };
            }
            theme.updatedAt = new Date();
            const updated = await theme.save();
            return {
                success: true,
                message: 'Theme updated successfully',
                theme: updated
            };
        }
        catch (error) {
            console.error('Update theme error:', error);
            throw new common_1.InternalServerErrorException('Failed to update theme');
        }
    }
    async getTheme(businessId) {
        const theme = await this.themeModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(businessId)
        });
        if (!theme) {
            return {
                isDefault: true,
                theme: this.getDefaultTheme()
            };
        }
        return {
            isDefault: false,
            theme
        };
    }
    async deleteTheme(businessId) {
        const result = await this.themeModel.deleteOne({
            tenantId: new mongoose_2.Types.ObjectId(businessId)
        });
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException('Theme not found');
        }
        return {
            success: true,
            message: 'Theme deleted successfully. Default theme will be used.'
        };
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
    async requestCustomDomain(businessId, domain, userId) {
        if (!this.isValidDomain(domain)) {
            throw new common_1.BadRequestException('Invalid domain format');
        }
        const subdomain = domain.split('.')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        if (subdomain.length < 3) {
            throw new common_1.BadRequestException('Domain subdomain must be at least 3 characters');
        }
        const existing = await this.customDomainModel.findOne({ domain });
        if (existing) {
            throw new common_1.ConflictException('Domain already in use');
        }
        const businessDomains = await this.customDomainModel
            .find({
            tenantId: new mongoose_2.Types.ObjectId(businessId),
            verificationStatus: 'verified'
        })
            .lean();
        if (businessDomains.length >= 3) {
            throw new common_1.BadRequestException('Maximum of 3 custom domains allowed per business');
        }
        try {
            const verificationToken = crypto.randomBytes(16).toString('hex');
            const customDomain = new this.customDomainModel({
                tenantId: new mongoose_2.Types.ObjectId(businessId),
                domain,
                subdomain,
                verificationStatus: 'pending',
                sslStatus: 'pending',
                requestedBy: new mongoose_2.Types.ObjectId(userId),
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
            const saved = await customDomain.save();
            return {
                success: true,
                message: 'Custom domain request created. Please configure DNS records.',
                domain: saved,
                instructions: {
                    step1: 'Add the CNAME record to your DNS provider',
                    step2: 'Add the TXT record for verification',
                    step3: 'Wait for DNS propagation (up to 48 hours)',
                    step4: 'Click verify to complete setup'
                }
            };
        }
        catch (error) {
            console.error('Request custom domain error:', error);
            throw new common_1.InternalServerErrorException('Failed to create domain request');
        }
    }
    async verifyCustomDomain(businessId, domainId) {
        const domain = await this.customDomainModel.findOne({
            _id: domainId,
            tenantId: new mongoose_2.Types.ObjectId(businessId)
        });
        if (!domain) {
            throw new common_1.NotFoundException('Domain not found');
        }
        if (domain.verificationStatus === 'verified') {
            return {
                success: true,
                message: 'Domain is already verified',
                domain
            };
        }
        try {
            const dnsVerified = await this.verifyDNSRecords(domain.domain, domain.dnsRecords);
            if (!dnsVerified) {
                throw new common_1.BadRequestException('DNS records not properly configured');
            }
            domain.verificationStatus = 'verified';
            domain.verifiedAt = new Date();
            domain.dnsRecords.forEach(record => record.verified = true);
            domain.sslStatus = 'active';
            const verified = await domain.save();
            return {
                success: true,
                message: 'Domain verified successfully',
                domain: verified
            };
        }
        catch (error) {
            console.error('Verify domain error:', error);
            domain.verificationStatus = 'failed';
            await domain.save();
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to verify domain');
        }
    }
    async getCustomDomains(businessId) {
        const domains = await this.customDomainModel
            .find({ tenantId: new mongoose_2.Types.ObjectId(businessId) })
            .sort({ createdAt: -1 })
            .lean()
            .exec();
        return {
            count: domains.length,
            domains: domains.map(d => ({
                id: d._id,
                domain: d.domain,
                subdomain: d.subdomain,
                verificationStatus: d.verificationStatus,
                sslStatus: d.sslStatus,
                isActive: d.isActive,
                verifiedAt: d.verifiedAt,
                createdAt: d.createdAt
            }))
        };
    }
    async getDomain(businessId, domainId) {
        const domain = await this.customDomainModel.findOne({
            _id: domainId,
            tenantId: new mongoose_2.Types.ObjectId(businessId)
        });
        if (!domain) {
            throw new common_1.NotFoundException('Domain not found');
        }
        return domain;
    }
    async deleteCustomDomain(businessId, domainId) {
        const domain = await this.customDomainModel.findOne({
            _id: domainId,
            tenantId: new mongoose_2.Types.ObjectId(businessId)
        });
        if (!domain) {
            throw new common_1.NotFoundException('Domain not found');
        }
        await domain.deleteOne();
        return {
            success: true,
            message: 'Custom domain deleted successfully'
        };
    }
    isValidDomain(domain) {
        const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
        return domainRegex.test(domain);
    }
    async verifyDNSRecords(domain, records) {
        return true;
    }
    async createEmailTemplate(businessId, templateDto, userId) {
        const existing = await this.emailTemplateModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(businessId),
            templateType: templateDto.templateType
        });
        if (existing) {
            throw new common_1.ConflictException(`Template of type '${templateDto.templateType}' already exists. Use update instead.`);
        }
        try {
            const template = new this.emailTemplateModel({
                tenantId: new mongoose_2.Types.ObjectId(businessId),
                templateType: templateDto.templateType,
                subject: templateDto.subject,
                htmlContent: templateDto.htmlContent,
                textContent: templateDto.textContent || this.stripHtml(templateDto.htmlContent),
                isCustom: true,
                variables: this.extractVariables(templateDto.htmlContent),
                createdBy: new mongoose_2.Types.ObjectId(userId),
            });
            const saved = await template.save();
            return {
                success: true,
                message: 'Email template created successfully',
                template: saved
            };
        }
        catch (error) {
            console.error('Create email template error:', error);
            throw new common_1.InternalServerErrorException('Failed to create email template');
        }
    }
    async getEmailTemplate(businessId, templateType) {
        const customTemplate = await this.emailTemplateModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(businessId),
            templateType,
            isActive: true,
        });
        if (customTemplate) {
            return {
                isCustom: true,
                template: customTemplate
            };
        }
        const defaultTemplate = this.getDefaultEmailTemplate(templateType);
        if (!defaultTemplate) {
            throw new common_1.NotFoundException(`Template type '${templateType}' not found`);
        }
        return {
            isCustom: false,
            template: defaultTemplate
        };
    }
    async getAllEmailTemplates(businessId) {
        const templates = await this.emailTemplateModel
            .find({
            tenantId: new mongoose_2.Types.ObjectId(businessId),
            isActive: true
        })
            .sort({ createdAt: -1 })
            .lean()
            .exec();
        const defaultTypes = this.getAvailableTemplateTypes();
        const customTypes = templates.map(t => t.templateType);
        const missingTypes = defaultTypes.filter(type => !customTypes.includes(type));
        return {
            count: templates.length,
            templates: templates.map(t => ({
                id: t._id,
                type: t.templateType,
                subject: t.subject,
                isCustom: t.isCustom,
                variables: t.variables,
                createdAt: t.createdAt
            })),
            availableDefaults: missingTypes.map(type => ({
                type,
                subject: this.getDefaultEmailTemplate(type)?.subject
            }))
        };
    }
    async updateEmailTemplate(businessId, templateId, templateDto) {
        const template = await this.emailTemplateModel.findOne({
            _id: templateId,
            tenantId: new mongoose_2.Types.ObjectId(businessId)
        });
        if (!template) {
            throw new common_1.NotFoundException('Template not found');
        }
        try {
            if (templateDto.subject)
                template.subject = templateDto.subject;
            if (templateDto.htmlContent) {
                template.htmlContent = templateDto.htmlContent;
                template.variables = this.extractVariables(templateDto.htmlContent);
            }
            if (templateDto.textContent) {
                template.textContent = templateDto.textContent;
            }
            else if (templateDto.htmlContent) {
                template.textContent = this.stripHtml(templateDto.htmlContent);
            }
            if (typeof templateDto.isActive !== 'undefined') {
                template.isActive = templateDto.isActive;
            }
            template.updatedAt = new Date();
            const updated = await template.save();
            return {
                success: true,
                message: 'Email template updated successfully',
                template: updated
            };
        }
        catch (error) {
            console.error('Update email template error:', error);
            throw new common_1.InternalServerErrorException('Failed to update email template');
        }
    }
    async deleteEmailTemplate(businessId, templateId) {
        const template = await this.emailTemplateModel.findOne({
            _id: templateId,
            tenantId: new mongoose_2.Types.ObjectId(businessId)
        });
        if (!template) {
            throw new common_1.NotFoundException('Template not found');
        }
        await template.deleteOne();
        return {
            success: true,
            message: 'Email template deleted successfully. Default template will be used.'
        };
    }
    getDefaultEmailTemplate(templateType) {
        const templates = {
            booking_confirmation: {
                templateType: 'booking_confirmation',
                subject: 'Booking Confirmed - {{businessName}}',
                htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #3B82F6;">Booking Confirmed!</h1>
            <p>Hello {{clientName}},</p>
            <p>Your booking for <strong>{{serviceName}}</strong> has been confirmed.</p>
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Date:</strong> {{bookingDate}}</p>
              <p><strong>Time:</strong> {{bookingTime}}</p>
              <p><strong>Staff:</strong> {{staffName}}</p>
              <p><strong>Location:</strong> {{businessAddress}}</p>
            </div>
            <p>If you need to reschedule or cancel, please contact us.</p>
            <p>Thank you,<br>{{businessName}}</p>
          </div>
        `,
                textContent: 'Booking confirmed for {{serviceName}} on {{bookingDate}} at {{bookingTime}}',
                variables: ['businessName', 'clientName', 'serviceName', 'bookingDate', 'bookingTime', 'staffName', 'businessAddress']
            },
            booking_reminder: {
                templateType: 'booking_reminder',
                subject: 'Reminder: Upcoming Appointment - {{businessName}}',
                htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #F59E0B;">Appointment Reminder</h1>
            <p>Hello {{clientName}},</p>
            <p>This is a reminder about your upcoming appointment:</p>
            <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Service:</strong> {{serviceName}}</p>
              <p><strong>Date:</strong> {{bookingDate}}</p>
              <p><strong>Time:</strong> {{bookingTime}}</p>
              <p><strong>Staff:</strong> {{staffName}}</p>
            </div>
            <p>We look forward to seeing you!</p>
            <p>Best regards,<br>{{businessName}}</p>
          </div>
        `,
                textContent: 'Reminder: Your appointment for {{serviceName}} is on {{bookingDate}} at {{bookingTime}}',
                variables: ['businessName', 'clientName', 'serviceName', 'bookingDate', 'bookingTime', 'staffName']
            },
            booking_cancellation: {
                templateType: 'booking_cancellation',
                subject: 'Booking Cancelled - {{businessName}}',
                htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #EF4444;">Booking Cancelled</h1>
            <p>Hello {{clientName}},</p>
            <p>Your booking has been cancelled:</p>
            <div style="background: #FEE2E2; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Service:</strong> {{serviceName}}</p>
              <p><strong>Date:</strong> {{bookingDate}}</p>
              <p><strong>Time:</strong> {{bookingTime}}</p>
            </div>
            <p>If you'd like to book again, we're here to help.</p>
            <p>Best regards,<br>{{businessName}}</p>
          </div>
        `,
                textContent: 'Your booking for {{serviceName}} on {{bookingDate}} has been cancelled',
                variables: ['businessName', 'clientName', 'serviceName', 'bookingDate', 'bookingTime']
            },
            welcome: {
                templateType: 'welcome',
                subject: 'Welcome to {{businessName}}!',
                htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #10B981;">Welcome!</h1>
            <p>Hello {{clientName}},</p>
            <p>Thank you for choosing {{businessName}}. We're excited to serve you!</p>
            <p>You can now:</p>
            <ul>
              <li>Book appointments online</li>
              <li>View your booking history</li>
              <li>Manage your profile</li>
            </ul>
            <p>If you have any questions, feel free to reach out.</p>
            <p>Best regards,<br>{{businessName}}</p>
          </div>
        `,
                textContent: 'Welcome to {{businessName}}! We look forward to serving you.',
                variables: ['businessName', 'clientName']
            }
        };
        return templates[templateType] || null;
    }
    getAvailableTemplateTypes() {
        return [
            'booking_confirmation',
            'booking_reminder',
            'booking_cancellation',
            'welcome'
        ];
    }
    extractVariables(content) {
        const regex = /\{\{(\w+)\}\}/g;
        const matches = content.match(regex) || [];
        return [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '')))];
    }
    stripHtml(html) {
        return html
            .replace(/<[^>]*>/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }
    async createBookingWidget(businessId, widgetDto, userId) {
        try {
            const widgetId = crypto.randomBytes(8).toString('hex');
            const embedCode = this.generateEmbedCode(widgetId, widgetDto.configuration);
            const widget = new this.bookingWidgetModel({
                tenantId: new mongoose_2.Types.ObjectId(businessId),
                widgetId,
                name: widgetDto.name || 'Default Widget',
                configuration: widgetDto.configuration,
                styling: widgetDto.styling,
                embedCode,
                createdBy: new mongoose_2.Types.ObjectId(userId),
            });
            const saved = await widget.save();
            return {
                success: true,
                message: 'Booking widget created successfully',
                widget: {
                    id: saved._id,
                    widgetId: saved.widgetId,
                    name: saved.name,
                    embedCode: saved.embedCode,
                    configuration: saved.configuration,
                    styling: saved.styling
                }
            };
        }
        catch (error) {
            console.error('Create booking widget error:', error);
            throw new common_1.InternalServerErrorException('Failed to create booking widget');
        }
    }
    async getBookingWidget(businessId, widgetId) {
        const widget = await this.bookingWidgetModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(businessId),
            widgetId,
        });
        if (!widget) {
            throw new common_1.NotFoundException('Widget not found');
        }
        return widget;
    }
    async getAllWidgets(businessId) {
        const widgets = await this.bookingWidgetModel
            .find({
            tenantId: new mongoose_2.Types.ObjectId(businessId),
            isActive: true
        })
            .sort({ createdAt: -1 })
            .lean()
            .exec();
        return {
            count: widgets.length,
            widgets: widgets.map(w => ({
                id: w._id,
                widgetId: w.widgetId,
                name: w.name,
                impressions: w.impressions,
                conversions: w.conversions,
                conversionRate: w.impressions > 0
                    ? ((w.conversions / w.impressions) * 100).toFixed(2) + '%'
                    : '0%',
                isActive: w.isActive,
                createdAt: w.createdAt
            }))
        };
    }
    async updateWidget(businessId, widgetId, widgetDto) {
        const widget = await this.bookingWidgetModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(businessId),
            widgetId
        });
        if (!widget) {
            throw new common_1.NotFoundException('Widget not found');
        }
        try {
            if (widgetDto.name)
                widget.name = widgetDto.name;
            if (widgetDto.configuration) {
                widget.configuration = { ...widget.configuration, ...widgetDto.configuration };
                widget.embedCode = this.generateEmbedCode(widgetId, widget.configuration);
            }
            if (widgetDto.styling) {
                widget.styling = { ...widget.styling, ...widgetDto.styling };
            }
            if (typeof widgetDto.isActive !== 'undefined') {
                widget.isActive = widgetDto.isActive;
            }
            widget.updatedAt = new Date();
            const updated = await widget.save();
            return {
                success: true,
                message: 'Widget updated successfully',
                widget: updated
            };
        }
        catch (error) {
            console.error('Update widget error:', error);
            throw new common_1.InternalServerErrorException('Failed to update widget');
        }
    }
    async deleteWidget(businessId, widgetId) {
        const widget = await this.bookingWidgetModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(businessId),
            widgetId
        });
        if (!widget) {
            throw new common_1.NotFoundException('Widget not found');
        }
        await widget.deleteOne();
        return {
            success: true,
            message: 'Widget deleted successfully'
        };
    }
    async trackWidgetImpression(widgetId) {
        try {
            await this.bookingWidgetModel.updateOne({ widgetId }, { $inc: { impressions: 1 } });
        }
        catch (error) {
            console.error('Track impression error:', error);
        }
    }
    async trackWidgetConversion(widgetId) {
        try {
            await this.bookingWidgetModel.updateOne({ widgetId }, { $inc: { conversions: 1 } });
        }
        catch (error) {
            console.error('Track conversion error:', error);
        }
    }
    async getWidgetAnalytics(businessId, widgetId, startDate, endDate) {
        const widget = await this.bookingWidgetModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(businessId),
            widgetId
        });
        if (!widget) {
            throw new common_1.NotFoundException('Widget not found');
        }
        const conversionRate = widget.impressions > 0
            ? ((widget.conversions / widget.impressions) * 100).toFixed(2)
            : '0';
        return {
            widgetId: widget.widgetId,
            name: widget.name,
            analytics: {
                totalImpressions: widget.impressions,
                totalConversions: widget.conversions,
                conversionRate: `${conversionRate}%`,
                period: {
                    start: startDate || widget.createdAt,
                    end: endDate || new Date()
                }
            },
            performance: {
                averageImpressions: widget.impressions / this.getDaysSinceCreation(widget.createdAt),
                averageConversions: widget.conversions / this.getDaysSinceCreation(widget.createdAt)
            }
        };
    }
    generateEmbedCode(widgetId, config) {
        const displayType = config?.displayType || 'modal';
        const buttonText = config?.buttonText || 'Book Now';
        const buttonColor = config?.buttonColor || '#3B82F6';
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
        displayType: '${displayType}',
        buttonText: '${buttonText}',
        buttonColor: '${buttonColor}',
      });
    };
    document.body.appendChild(script);
  })();
</script>
    `.trim();
    }
    getDaysSinceCreation(createdAt) {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - createdAt.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays || 1;
    }
    async getBrandingOverview(businessId) {
        const themeResult = await this.getTheme(businessId);
        const domainsResult = await this.getCustomDomains(businessId);
        const templatesResult = await this.getAllEmailTemplates(businessId);
        const widgetsResult = await this.getAllWidgets(businessId);
        return {
            theme: {
                isCustomized: !themeResult.isDefault,
                colors: themeResult.theme.colors,
                hasLogo: !!themeResult.theme.logo,
                hasFavicon: !!themeResult.theme.favicon,
                customCssEnabled: themeResult.theme.customCss?.enabled || false
            },
            customDomains: {
                total: domainsResult.count,
                verified: domainsResult.domains.filter((d) => d.verificationStatus === 'verified').length,
                pending: domainsResult.domains.filter((d) => d.verificationStatus === 'pending').length,
                domains: domainsResult.domains
            },
            emailTemplates: {
                total: templatesResult.count,
                custom: templatesResult.templates.filter((t) => t.isCustom).length,
                templates: templatesResult.templates
            },
            widgets: {
                total: widgetsResult.count,
                totalImpressions: widgetsResult.widgets.reduce((sum, w) => sum + (w.impressions || 0), 0),
                totalConversions: widgetsResult.widgets.reduce((sum, w) => sum + (w.conversions || 0), 0),
                widgets: widgetsResult.widgets
            },
            summary: {
                brandingComplete: !themeResult.isDefault && domainsResult.count > 0,
                setupProgress: this.calculateSetupProgress(themeResult, domainsResult, templatesResult, widgetsResult)
            }
        };
    }
    calculateSetupProgress(theme, domains, templates, widgets) {
        let progress = 0;
        if (!theme.isDefault)
            progress += 30;
        if (domains.count > 0 && domains.domains.some(d => d.verificationStatus === 'verified')) {
            progress += 25;
        }
        if (templates.count > 0) {
            progress += 25;
        }
        if (widgets.count > 0) {
            progress += 20;
        }
        return progress;
    }
    async generateThemePreview(businessId, themeData) {
        if (!themeData.colors || !themeData.typography) {
            throw new common_1.BadRequestException('Theme must include colors and typography');
        }
        return {
            preview: true,
            theme: themeData,
            previewUrl: `https://preview.yourbookingapp.com/${businessId}?theme=${Buffer.from(JSON.stringify(themeData)).toString('base64')}`,
            message: 'This is a preview. Use POST /branding/theme to save changes.',
            expires: new Date(Date.now() + 30 * 60 * 1000)
        };
    }
    async exportBrandingConfig(businessId) {
        const overview = await this.getBrandingOverview(businessId);
        const [theme, domains, templates, widgets] = await Promise.all([
            this.themeModel.findOne({ tenantId: new mongoose_2.Types.ObjectId(businessId) }).lean(),
            this.customDomainModel.find({ tenantId: new mongoose_2.Types.ObjectId(businessId) }).lean(),
            this.emailTemplateModel.find({ tenantId: new mongoose_2.Types.ObjectId(businessId) }).lean(),
            this.bookingWidgetModel.find({ tenantId: new mongoose_2.Types.ObjectId(businessId) }).lean()
        ]);
        return {
            exportedAt: new Date(),
            businessId,
            configuration: {
                theme,
                domains,
                templates,
                widgets
            },
            summary: overview.summary
        };
    }
    async importBrandingConfig(businessId, config, userId) {
        try {
            const results = {
                theme: null,
                domains: [],
                templates: [],
                widgets: []
            };
            if (config.theme) {
                results.theme = await this.createOrUpdateTheme(businessId, config.theme);
            }
            if (config.templates && Array.isArray(config.templates)) {
                for (const template of config.templates) {
                    try {
                        const imported = await this.createEmailTemplate(businessId, template, userId);
                        results.templates.push(imported);
                    }
                    catch (error) {
                        console.error('Failed to import template:', error);
                    }
                }
            }
            if (config.widgets && Array.isArray(config.widgets)) {
                for (const widget of config.widgets) {
                    try {
                        const imported = await this.createBookingWidget(businessId, widget, userId);
                        results.widgets.push(imported);
                    }
                    catch (error) {
                        console.error('Failed to import widget:', error);
                    }
                }
            }
            return {
                success: true,
                message: 'Branding configuration imported successfully',
                results
            };
        }
        catch (error) {
            console.error('Import branding config error:', error);
            throw new common_1.InternalServerErrorException('Failed to import branding configuration');
        }
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