import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Theme, ThemeDocument } from './schemas/theme.schema';
import { CustomDomain, CustomDomainDocument } from './schemas/custom-domain.schema';
import { EmailTemplate, EmailTemplateDocument } from './schemas/email-template.schema';
import { BookingWidget, BookingWidgetDocument } from './schemas/booking-widget.schema';
import { CreateThemeDto } from './dto/create-theme.dto';
import * as crypto from 'crypto';

@Injectable()
export class BrandingService {
  constructor(
    @InjectModel(Theme.name) private themeModel: Model<ThemeDocument>,
    @InjectModel(CustomDomain.name) private customDomainModel: Model<CustomDomainDocument>,
    @InjectModel(EmailTemplate.name) private emailTemplateModel: Model<EmailTemplateDocument>,
    @InjectModel(BookingWidget.name) private bookingWidgetModel: Model<BookingWidgetDocument>,
  ) {}

  // ========== THEME MANAGEMENT ==========
  async createOrUpdateTheme(tenantId: string, themeDto: CreateThemeDto) {
    const existingTheme = await this.themeModel.findOne({ tenantId: new Types.ObjectId(tenantId) });

    if (existingTheme) {
      Object.assign(existingTheme, themeDto);
      return existingTheme.save();
    }

    const theme = new this.themeModel({
      tenantId: new Types.ObjectId(tenantId),
      ...themeDto,
    });

    return theme.save();
  }

  async getTheme(tenantId: string) {
    const theme = await this.themeModel.findOne({ tenantId: new Types.ObjectId(tenantId) });
    
    if (!theme) {
      // Return default theme
      return this.getDefaultTheme();
    }

    return theme;
  }

  private getDefaultTheme() {
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

  // ========== CUSTOM DOMAIN MANAGEMENT ==========
  async requestCustomDomain(tenantId: string, domain: string) {
    // Generate subdomain from domain
    const subdomain = domain.split('.')[0].toLowerCase().replace(/[^a-z0-9]/g, '');

    // Check if domain already exists
    const existing = await this.customDomainModel.findOne({ domain });
    if (existing) {
      throw new BadRequestException('Domain already in use');
    }

    // Generate DNS records for verification
    const verificationToken = crypto.randomBytes(16).toString('hex');
    
    const customDomain = new this.customDomainModel({
      tenantId: new Types.ObjectId(tenantId),
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

  async verifyCustomDomain(domainId: string) {
    const domain = await this.customDomainModel.findById(domainId);
    
    if (!domain) {
      throw new NotFoundException('Domain not found');
    }

    // In production, you'd actually check DNS records here
    // For now, we'll simulate verification
    domain.verificationStatus = 'verified';
    domain.verifiedAt = new Date();
    domain.dnsRecords.forEach(record => record.verified = true);

    return domain.save();
  }

  async getCustomDomains(tenantId: string) {
    return this.customDomainModel.find({ tenantId: new Types.ObjectId(tenantId) }).exec();
  }

  // ========== EMAIL TEMPLATE MANAGEMENT ==========
  async createEmailTemplate(
    tenantId: string,
    templateType: string,
    subject: string,
    htmlContent: string,
    textContent?: string,
  ) {
    const template = new this.emailTemplateModel({
      tenantId: new Types.ObjectId(tenantId),
      templateType,
      subject,
      htmlContent,
      textContent: textContent || this.stripHtml(htmlContent),
      isCustom: true,
      variables: this.extractVariables(htmlContent),
    });

    return template.save();
  }

  async getEmailTemplate(tenantId: string, templateType: string) {
    const customTemplate = await this.emailTemplateModel.findOne({
      tenantId: new Types.ObjectId(tenantId),
      templateType,
      isActive: true,
    });

    if (customTemplate) {
      return customTemplate;
    }

    // Return system default template
    return this.getDefaultEmailTemplate(templateType);
  }

  private getDefaultEmailTemplate(templateType: string) {
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
      // Add more default templates
    };

    return templates[templateType] || null;
  }

  private extractVariables(content: string): string[] {
    const regex = /\{\{(\w+)\}\}/g;
    const matches = content.match(regex) || [];
    return [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '')))];
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }

  // ========== BOOKING WIDGET MANAGEMENT ==========
  async createBookingWidget(tenantId: string, configuration: any, styling: any) {
    const widgetId = crypto.randomBytes(8).toString('hex');
    
    const embedCode = this.generateEmbedCode(widgetId, configuration);

    const widget = new this.bookingWidgetModel({
      tenantId: new Types.ObjectId(tenantId),
      widgetId,
      configuration,
      styling,
      embedCode,
    });

    return widget.save();
  }

  async getBookingWidget(tenantId: string, widgetId: string) {
    return this.bookingWidgetModel.findOne({
      tenantId: new Types.ObjectId(tenantId),
      widgetId,
    });
  }

  async trackWidgetImpression(widgetId: string) {
    await this.bookingWidgetModel.updateOne(
      { widgetId },
      { $inc: { impressions: 1 } },
    );
  }

  async trackWidgetConversion(widgetId: string) {
    await this.bookingWidgetModel.updateOne(
      { widgetId },
      { $inc: { conversions: 1 } },
    );
  }

  private generateEmbedCode(widgetId: string, config: any): string {
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
}