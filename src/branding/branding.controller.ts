// ==================== branding.controller.ts ====================
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Patch,
  Body, 
  Param, 
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiBody
} from '@nestjs/swagger';
import { UploadService } from '../upload/upload.service';
import { BrandingService } from './branding.service';
import { CreateThemeDto, UpdateThemeDto } from './dto/create-theme.dto';
import { CreateEmailTemplateDto, UpdateEmailTemplateDto } from './dto/email-template.dto';
import { CreateWidgetDto, UpdateWidgetDto } from './dto/widget.dto';
import { RequestCustomDomainDto } from './dto/custom-domain.dto';

// Import auth-related decorators and guards
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BusinessAuthGuard, BusinessRolesGuard, RequireBusinessRoles } from '../auth/guards/business-auth.guard';
import { BusinessContext, BusinessId, CurrentUser } from '../auth/decorators/business-context.decorator';
import type { BusinessContext as BusinessCtx } from '../auth/decorators/business-context.decorator';
import { UserRole } from '../auth/schemas/user.schema';
import type { RequestWithUser } from '../auth/types/request-with-user.interface';

@ApiTags('Branding & Customization')
@Controller('branding')
@UseGuards(JwtAuthGuard, BusinessAuthGuard) // All routes require business authentication
@ApiBearerAuth()
export class BrandingController {
  constructor(
    private readonly brandingService: BrandingService,
    private readonly uploadService: UploadService
  ) {}

  // ==================== THEME MANAGEMENT ====================

  @Post('theme')
  
  
  @ApiOperation({ 
    summary: 'Create or update business theme',
    description: 'Requires business owner or admin role'
  })
  @ApiResponse({ status: 200, description: 'Theme created/updated successfully' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @HttpCode(HttpStatus.OK)
  async createOrUpdateTheme(
    @BusinessId() businessId: string,
    @Body() themeDto: CreateThemeDto
  ) {
    return this.brandingService.createOrUpdateTheme(businessId, themeDto);
  }

  @Get('theme')
  @ApiOperation({ summary: 'Get business theme configuration' })
  @ApiResponse({ status: 200, description: 'Theme retrieved successfully' })
  async getTheme(@BusinessId() businessId: string) {
    return this.brandingService.getTheme(businessId);
  }

  @Patch('theme')
  
  
  @ApiOperation({ summary: 'Partially update theme' })
  @ApiResponse({ status: 200, description: 'Theme updated successfully' })
  async updateTheme(
    @BusinessId() businessId: string,
    @Body() themeDto: UpdateThemeDto
  ) {
    return this.brandingService.updateTheme(businessId, themeDto);
  }

  // ==================== BRANDING ASSET UPLOADS ====================
  // Upload images first, then use returned URLs in theme creation (optimized payload)

  @Post('upload/logo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ 
    summary: 'Upload logo image for branding',
    description: 'Upload logo first, then use the returned URL when creating/updating theme. Max 2MB, supports JPEG, PNG, WEBP, GIF.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Logo image file (max 2MB)'
        }
      },
      required: ['file']
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Logo uploaded successfully',
    schema: {
      example: {
        success: true,
        data: {
          url: 'https://res.cloudinary.com/xxx/image/upload/v123/branding/businessId/logo_123.png',
          publicId: 'branding/businessId/logo_123',
          width: 200,
          height: 80
        },
        message: 'Logo uploaded successfully. Use the URL in your theme configuration.'
      }
    }
  })
  async uploadLogo(
    @BusinessId() businessId: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file size (2MB max for logos)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('Logo file too large. Maximum 2MB allowed.');
    }

    const result = await this.uploadService.uploadImage(businessId, file, 'branding/logos');
    
    return {
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
        width: 200, // Default suggested dimensions
        height: 80
      },
      message: 'Logo uploaded successfully. Use the URL in your theme configuration.'
    };
  }

  @Post('upload/favicon')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ 
    summary: 'Upload favicon for branding',
    description: 'Upload favicon first, then use the returned URL when creating/updating theme. Max 500KB, supports ICO, PNG, SVG.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Favicon file (max 500KB)'
        }
      },
      required: ['file']
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Favicon uploaded successfully',
    schema: {
      example: {
        success: true,
        data: {
          url: 'https://res.cloudinary.com/xxx/image/upload/v123/branding/businessId/favicon_123.png',
          publicId: 'branding/businessId/favicon_123'
        },
        message: 'Favicon uploaded successfully. Use the URL in your theme configuration.'
      }
    }
  })
  async uploadFavicon(
    @BusinessId() businessId: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file size (500KB max for favicons)
    const maxSize = 500 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('Favicon file too large. Maximum 500KB allowed.');
    }

    const result = await this.uploadService.uploadImage(businessId, file, 'branding/favicons');
    
    return {
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId
      },
      message: 'Favicon uploaded successfully. Use the URL in your theme configuration.'
    };
  }

  @Post('upload/email-header')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ 
    summary: 'Upload email header image for email templates',
    description: 'Upload email header first, then use the returned URL in email templates. Max 1MB.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Email header image (max 1MB, recommended 600px width)'
        }
      },
      required: ['file']
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Email header uploaded successfully',
    schema: {
      example: {
        success: true,
        data: {
          url: 'https://res.cloudinary.com/xxx/image/upload/v123/branding/businessId/email-header_123.png',
          publicId: 'branding/businessId/email-header_123'
        },
        message: 'Email header uploaded successfully. Use the URL in your email template.'
      }
    }
  })
  async uploadEmailHeader(
    @BusinessId() businessId: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file size (1MB max for email headers)
    const maxSize = 1 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('Email header file too large. Maximum 1MB allowed.');
    }

    const result = await this.uploadService.uploadImage(businessId, file, 'branding/email-headers');
    
    return {
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId
      },
      message: 'Email header uploaded successfully. Use the URL in your email template.'
    };
  }

  // ==================== STOREFRONT LAYOUT MANAGEMENT ====================

  @Get('storefront')
  @ApiOperation({ 
    summary: 'Get storefront configuration',
    description: 'Retrieve the complete storefront layout configuration including hero, sections, display settings, etc.'
  })
  @ApiResponse({ status: 200, description: 'Storefront configuration retrieved successfully' })
  async getStorefrontConfig(@BusinessId() businessId: string) {
    return this.brandingService.getStorefrontConfig(businessId);
  }

  @Put('storefront')
  @ApiOperation({ 
    summary: 'Update complete storefront configuration',
    description: 'Update all storefront settings at once: layout, component styles, navbar, footer, and SEO'
  })
  @ApiResponse({ status: 200, description: 'Storefront configuration updated successfully' })
  @HttpCode(HttpStatus.OK)
  async updateFullStorefront(
    @BusinessId() businessId: string,
    @Body() storefrontDto: any
  ) {
    return this.brandingService.updateFullStorefront(businessId, storefrontDto);
  }

  @Patch('storefront/layout')
  @ApiOperation({ 
    summary: 'Update storefront layout',
    description: 'Partially update storefront layout including hero section, sections order, display settings, gallery, testimonials, contact, booking flow, and social proof'
  })
  @ApiResponse({ status: 200, description: 'Storefront layout updated successfully' })
  async updateStorefrontLayout(
    @BusinessId() businessId: string,
    @Body() layoutDto: any
  ) {
    return this.brandingService.updateStorefrontLayout(businessId, layoutDto);
  }

  @Patch('storefront/hero')
  @ApiOperation({ 
    summary: 'Update hero section',
    description: 'Update the hero/banner section including cover image, headline, background type (image/video/gradient), and book button'
  })
  @ApiResponse({ status: 200, description: 'Hero section updated successfully' })
  async updateHeroSection(
    @BusinessId() businessId: string,
    @Body() heroDto: any
  ) {
    return this.brandingService.updateHeroSection(businessId, heroDto);
  }

  @Patch('storefront/sections')
  @ApiOperation({ 
    summary: 'Update sections order',
    description: 'Reorder storefront sections (for drag-and-drop functionality). Pass the complete sections array with updated order values.'
  })
  @ApiResponse({ status: 200, description: 'Sections order updated successfully' })
  async updateSectionsOrder(
    @BusinessId() businessId: string,
    @Body() sectionsDto: { sections: any[] }
  ) {
    return this.brandingService.updateSectionsOrder(businessId, sectionsDto.sections);
  }

  @Patch('storefront/styles')
  @ApiOperation({ 
    summary: 'Update component styles',
    description: 'Update visual styling for buttons, cards, inputs, and spacing'
  })
  @ApiResponse({ status: 200, description: 'Component styles updated successfully' })
  async updateComponentStyles(
    @BusinessId() businessId: string,
    @Body() stylesDto: any
  ) {
    return this.brandingService.updateComponentStyles(businessId, stylesDto);
  }

  @Patch('storefront/navbar')
  @ApiOperation({ 
    summary: 'Update navbar configuration',
    description: 'Update navbar style, visibility options, book button, and menu items'
  })
  @ApiResponse({ status: 200, description: 'Navbar updated successfully' })
  async updateNavbar(
    @BusinessId() businessId: string,
    @Body() navbarDto: any
  ) {
    return this.brandingService.updateNavbar(businessId, navbarDto);
  }

  @Patch('storefront/footer')
  @ApiOperation({ 
    summary: 'Update footer configuration',
    description: 'Update footer visibility, social links, contact info, newsletter, and custom links'
  })
  @ApiResponse({ status: 200, description: 'Footer updated successfully' })
  async updateFooter(
    @BusinessId() businessId: string,
    @Body() footerDto: any
  ) {
    return this.brandingService.updateFooter(businessId, footerDto);
  }

  @Patch('storefront/seo')
  @ApiOperation({ 
    summary: 'Update SEO configuration',
    description: 'Update meta title, description, keywords, and Open Graph image for the booking page'
  })
  @ApiResponse({ status: 200, description: 'SEO configuration updated successfully' })
  async updateSeo(
    @BusinessId() businessId: string,
    @Body() seoDto: any
  ) {
    return this.brandingService.updateSeo(businessId, seoDto);
  }

  @Post('upload/hero-image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ 
    summary: 'Upload hero/cover image for storefront',
    description: 'Upload a cover image for the hero section. Max 5MB, recommended 1920x1080.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Hero image file (max 5MB, recommended 1920x1080)'
        }
      },
      required: ['file']
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Hero image uploaded successfully',
    schema: {
      example: {
        success: true,
        data: {
          url: 'https://res.cloudinary.com/xxx/image/upload/v123/branding/businessId/hero_123.jpg',
          publicId: 'branding/businessId/hero_123'
        },
        message: 'Hero image uploaded successfully. Use the URL in your hero configuration.'
      }
    }
  })
  async uploadHeroImage(
    @BusinessId() businessId: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file size (5MB max for hero images)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('Hero image file too large. Maximum 5MB allowed.');
    }

    const result = await this.uploadService.uploadImage(businessId, file, 'branding/hero');
    
    return {
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId
      },
      message: 'Hero image uploaded successfully. Use the URL in your hero configuration.'
    };
  }

  @Post('upload/gallery')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ 
    summary: 'Upload gallery image for storefront',
    description: 'Upload an image for the gallery section. Max 3MB.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Gallery image file (max 3MB)'
        }
      },
      required: ['file']
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Gallery image uploaded successfully'
  })
  async uploadGalleryImage(
    @BusinessId() businessId: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file size (3MB max for gallery images)
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('Gallery image file too large. Maximum 3MB allowed.');
    }

    const result = await this.uploadService.uploadImage(businessId, file, 'branding/gallery');
    
    return {
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId
      },
      message: 'Gallery image uploaded successfully. Add the URL to your gallery images array.'
    };
  }

  // ==================== SECTION CONTENT MANAGEMENT ====================

  @Get('content')
  @ApiOperation({ 
    summary: 'Get all storefront content',
    description: 'Get testimonials, FAQs, about content, and gallery images'
  })
  @ApiResponse({ status: 200, description: 'Content retrieved successfully' })
  async getStorefrontContent(@BusinessId() businessId: string) {
    return this.brandingService.getStorefrontContent(businessId);
  }

  // --- Testimonials ---

  @Post('content/testimonials')
  @ApiOperation({ 
    summary: 'Add a testimonial',
    description: 'Manually add a customer testimonial to display on storefront'
  })
  @ApiResponse({ status: 201, description: 'Testimonial added successfully' })
  async addTestimonial(
    @BusinessId() businessId: string,
    @Body() testimonialDto: any
  ) {
    return this.brandingService.addTestimonial(businessId, testimonialDto);
  }

  @Put('content/testimonials')
  @ApiOperation({ 
    summary: 'Update all testimonials',
    description: 'Replace all testimonials with new array (for reordering, bulk edit)'
  })
  @ApiResponse({ status: 200, description: 'Testimonials updated successfully' })
  async updateTestimonials(
    @BusinessId() businessId: string,
    @Body() testimonialsDto: { testimonials: any[] }
  ) {
    return this.brandingService.updateTestimonials(businessId, testimonialsDto);
  }

  @Patch('content/testimonials/:testimonialId')
  @ApiOperation({ 
    summary: 'Delete a testimonial',
    description: 'Remove a specific testimonial by ID'
  })
  @ApiParam({ name: 'testimonialId', description: 'Testimonial ID' })
  @ApiResponse({ status: 200, description: 'Testimonial deleted successfully' })
  async deleteTestimonial(
    @BusinessId() businessId: string,
    @Param('testimonialId') testimonialId: string
  ) {
    return this.brandingService.deleteTestimonial(businessId, testimonialId);
  }

  // --- FAQs ---

  @Post('content/faqs')
  @ApiOperation({ 
    summary: 'Add a FAQ',
    description: 'Add a frequently asked question to display on storefront'
  })
  @ApiResponse({ status: 201, description: 'FAQ added successfully' })
  async addFAQ(
    @BusinessId() businessId: string,
    @Body() faqDto: any
  ) {
    return this.brandingService.addFAQ(businessId, faqDto);
  }

  @Put('content/faqs')
  @ApiOperation({ 
    summary: 'Update all FAQs',
    description: 'Replace all FAQs with new array (for reordering, bulk edit)'
  })
  @ApiResponse({ status: 200, description: 'FAQs updated successfully' })
  async updateFAQs(
    @BusinessId() businessId: string,
    @Body() faqsDto: { faqs: any[] }
  ) {
    return this.brandingService.updateFAQs(businessId, faqsDto);
  }

  @Patch('content/faqs/:faqId')
  @ApiOperation({ 
    summary: 'Delete a FAQ',
    description: 'Remove a specific FAQ by ID'
  })
  @ApiParam({ name: 'faqId', description: 'FAQ ID' })
  @ApiResponse({ status: 200, description: 'FAQ deleted successfully' })
  async deleteFAQ(
    @BusinessId() businessId: string,
    @Param('faqId') faqId: string
  ) {
    return this.brandingService.deleteFAQ(businessId, faqId);
  }

  @Post('content/faqs/import')
  @ApiOperation({ 
    summary: 'Import FAQs from chat',
    description: 'Import FAQs from the chat/support system into storefront'
  })
  @ApiResponse({ status: 200, description: 'FAQs imported successfully' })
  async importFAQsFromChat(
    @BusinessId() businessId: string,
    @Body() importDto: { replaceExisting?: boolean }
  ) {
    return this.brandingService.importFAQsFromChat(businessId, importDto?.replaceExisting);
  }

  // --- About Section ---

  @Put('content/about')
  @ApiOperation({ 
    summary: 'Update about section content',
    description: 'Update the about section including description, founder info, highlights'
  })
  @ApiResponse({ status: 200, description: 'About section updated successfully' })
  async updateAboutContent(
    @BusinessId() businessId: string,
    @Body() aboutDto: any
  ) {
    return this.brandingService.updateAboutContent(businessId, aboutDto);
  }

  // --- Gallery ---

  @Post('content/gallery')
  @ApiOperation({ 
    summary: 'Add a gallery image',
    description: 'Add an image to the gallery section with optional caption and category'
  })
  @ApiResponse({ status: 201, description: 'Gallery image added successfully' })
  async addGalleryImageToContent(
    @BusinessId() businessId: string,
    @Body() imageDto: any
  ) {
    return this.brandingService.addGalleryImage(businessId, imageDto);
  }

  @Put('content/gallery')
  @ApiOperation({ 
    summary: 'Update all gallery images',
    description: 'Replace all gallery images with new array (for reordering, bulk edit)'
  })
  @ApiResponse({ status: 200, description: 'Gallery images updated successfully' })
  async updateGalleryImages(
    @BusinessId() businessId: string,
    @Body() imagesDto: { images: any[] }
  ) {
    return this.brandingService.updateGalleryImages(businessId, imagesDto);
  }

  @Patch('content/gallery/:imageId')
  @ApiOperation({ 
    summary: 'Delete a gallery image',
    description: 'Remove a specific gallery image by ID'
  })
  @ApiParam({ name: 'imageId', description: 'Gallery image ID' })
  @ApiResponse({ status: 200, description: 'Gallery image deleted successfully' })
  async deleteGalleryImage(
    @BusinessId() businessId: string,
    @Param('imageId') imageId: string
  ) {
    return this.brandingService.deleteGalleryImage(businessId, imageId);
  }

  // ==================== CUSTOM DOMAIN MANAGEMENT ====================

  @Post('domain')
  
  
  @ApiOperation({ 
    summary: 'Request custom domain setup',
    description: 'Only business owners can request custom domains'
  })
  @ApiResponse({ status: 201, description: 'Domain request created successfully' })
  @ApiResponse({ status: 400, description: 'Domain already exists or invalid' })
  @HttpCode(HttpStatus.CREATED)
  async requestCustomDomain(
    @BusinessContext() context: BusinessCtx,
    @Body() domainDto: RequestCustomDomainDto
  ) {
    return this.brandingService.requestCustomDomain(
      context.businessId, 
      domainDto.domain,
      context.userId
    );
  }

  @Post('domain/:domainId/verify')
  
  
  @ApiOperation({ summary: 'Verify custom domain DNS records' })
  @ApiParam({ name: 'domainId', description: 'Domain record ID' })
  @ApiResponse({ status: 200, description: 'Domain verification initiated' })
  @ApiResponse({ status: 404, description: 'Domain not found' })
  async verifyDomain(
    @BusinessId() businessId: string,
    @Param('domainId') domainId: string
  ) {
    return this.brandingService.verifyCustomDomain(businessId, domainId);
  }

  @Get('domains')
  @ApiOperation({ summary: 'Get all custom domains for business' })
  @ApiResponse({ status: 200, description: 'Domains retrieved successfully' })
  async getCustomDomains(@BusinessId() businessId: string) {
    return this.brandingService.getCustomDomains(businessId);
  }

  @Get('domain/:domainId')
  @ApiOperation({ summary: 'Get specific domain details' })
  @ApiParam({ name: 'domainId', description: 'Domain record ID' })
  async getDomain(
    @BusinessId() businessId: string,
    @Param('domainId') domainId: string
  ) {
    return this.brandingService.getDomain(businessId, domainId);
  }

  // ==================== EMAIL TEMPLATE MANAGEMENT ====================

  @Post('email-template')
  
  
  @ApiOperation({ summary: 'Create custom email template' })
  @ApiResponse({ status: 201, description: 'Template created successfully' })
  @HttpCode(HttpStatus.CREATED)
  async createEmailTemplate(
    @BusinessContext() context: BusinessCtx,
    @Body() templateDto: CreateEmailTemplateDto
  ) {
    return this.brandingService.createEmailTemplate(
      context.businessId,
      templateDto,
      context.userId
    );
  }

  @Get('email-template/:templateType')
  @ApiOperation({ summary: 'Get email template by type' })
  @ApiParam({ 
    name: 'templateType', 
    description: 'Template type',
    enum: ['booking_confirmation', 'reminder', 'cancellation', 'welcome']
  })
  async getEmailTemplate(
    @BusinessId() businessId: string,
    @Param('templateType') templateType: string
  ) {
    return this.brandingService.getEmailTemplate(businessId, templateType);
  }

  @Get('email-templates')
  @ApiOperation({ summary: 'Get all email templates for business' })
  async getAllEmailTemplates(@BusinessId() businessId: string) {
    return this.brandingService.getAllEmailTemplates(businessId);
  }

  @Patch('email-template/:templateId')
  
  
  @ApiOperation({ summary: 'Update email template' })
  async updateEmailTemplate(
    @BusinessId() businessId: string,
    @Param('templateId') templateId: string,
    @Body() templateDto: UpdateEmailTemplateDto
  ) {
    return this.brandingService.updateEmailTemplate(
      businessId, 
      templateId, 
      templateDto
    );
  }

  // ==================== BOOKING WIDGET MANAGEMENT ====================

  @Post('widget')
  
  
  @ApiOperation({ summary: 'Create booking widget' })
  @ApiResponse({ status: 201, description: 'Widget created successfully' })
  @HttpCode(HttpStatus.CREATED)
  async createWidget(
    @BusinessContext() context: BusinessCtx,
    @Body() widgetDto: CreateWidgetDto
  ) {
    return this.brandingService.createBookingWidget(
      context.businessId,
      widgetDto,
      context.userId
    );
  }

  @Get('widget/:widgetId')
  @ApiOperation({ summary: 'Get widget by ID' })
  @ApiParam({ name: 'widgetId', description: 'Widget ID' })
  async getWidget(
    @BusinessId() businessId: string,
    @Param('widgetId') widgetId: string
  ) {
    return this.brandingService.getBookingWidget(businessId, widgetId);
  }

  @Get('widgets')
  @ApiOperation({ summary: 'Get all widgets for business' })
  async getAllWidgets(@BusinessId() businessId: string) {
    return this.brandingService.getAllWidgets(businessId);
  }

  @Patch('widget/:widgetId')
  
  
  @ApiOperation({ summary: 'Update widget configuration' })
  async updateWidget(
    @BusinessId() businessId: string,
    @Param('widgetId') widgetId: string,
    @Body() widgetDto: UpdateWidgetDto
  ) {
    return this.brandingService.updateWidget(businessId, widgetId, widgetDto);
  }

  // ==================== WIDGET ANALYTICS ====================

  @Post('widget/:widgetId/impression')
  @ApiOperation({ 
    summary: 'Track widget impression (public endpoint)',
    description: 'This endpoint does not require authentication'
  })
  @ApiParam({ name: 'widgetId', description: 'Widget ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async trackImpression(@Param('widgetId') widgetId: string) {
    await this.brandingService.trackWidgetImpression(widgetId);
  }

  @Post('widget/:widgetId/conversion')
  @ApiOperation({ 
    summary: 'Track widget conversion (public endpoint)',
    description: 'This endpoint does not require authentication'
  })
  @ApiParam({ name: 'widgetId', description: 'Widget ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async trackConversion(@Param('widgetId') widgetId: string) {
    await this.brandingService.trackWidgetConversion(widgetId);
  }

  @Get('widget/:widgetId/analytics')
  @ApiOperation({ summary: 'Get widget analytics' })
  @ApiParam({ name: 'widgetId', description: 'Widget ID' })
  async getWidgetAnalytics(
    @BusinessId() businessId: string,
    @Param('widgetId') widgetId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.brandingService.getWidgetAnalytics(
      businessId,
      widgetId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
  }

  // ==================== BRANDING OVERVIEW ====================

  @Get('overview')
  @ApiOperation({ 
    summary: 'Get complete branding overview',
    description: 'Returns theme, domains, templates, and widgets in one call'
  })
  @ApiResponse({ status: 200, description: 'Branding overview retrieved' })
  async getBrandingOverview(@BusinessContext() context: BusinessCtx) {
    return this.brandingService.getBrandingOverview(context.businessId);
  }

  // ==================== PREVIEW ENDPOINTS ====================

  @Post('preview/session')
  @ApiOperation({ 
    summary: 'Create a preview session with short URL',
    description: 'Creates a temporary preview session and returns a short preview ID. Use this instead of encoding theme in URL.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Preview session created successfully',
    schema: {
      example: {
        success: true,
        previewId: 'a1b2c3d4e5f6',
        previewUrl: '/preview/book/{subdomain}?previewId=a1b2c3d4e5f6',
        expiresIn: '1 hour',
        message: 'Preview session created. Use the previewId in the URL.'
      }
    }
  })
  @HttpCode(HttpStatus.OK)
  async createPreviewSession(
    @BusinessId() businessId: string,
    @Body() previewData: CreateThemeDto
  ) {
    const result = await this.brandingService.createPreviewSession(businessId, previewData);
    return {
      success: true,
      ...result,
      expiresIn: '1 hour',
      message: 'Preview session created. Use the previewId in the URL.'
    };
  }
}
