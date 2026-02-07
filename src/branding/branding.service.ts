
// ==================== branding.service.ts ====================
import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  ConflictException,
  InternalServerErrorException 
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Theme, ThemeDocument } from './schemas/theme.schema';
import { CustomDomain, CustomDomainDocument } from './schemas/custom-domain.schema';
import { EmailTemplate, EmailTemplateDocument } from './schemas/email-template.schema';
import { BookingWidget, BookingWidgetDocument } from './schemas/booking-widget.schema';
import { 
  CreateThemeDto, 
  UpdateThemeDto 
} from './dto/create-theme.dto';
import { 
  CreateEmailTemplateDto, 
  UpdateEmailTemplateDto 
} from './dto/email-template.dto';
import { 
  CreateWidgetDto, 
  UpdateWidgetDto 
} from './dto/widget.dto';
import { RequestCustomDomainDto } from './dto/custom-domain.dto';
import { CacheService } from '../cache/cache.service';
import * as crypto from 'crypto';

@Injectable()
export class BrandingService {
  private readonly PREVIEW_TTL = 3600; // 1 hour TTL for preview data
  private readonly PREVIEW_KEY_PREFIX = 'theme_preview:';

  constructor(
    @InjectModel(Theme.name) private themeModel: Model<ThemeDocument>,
    @InjectModel(CustomDomain.name) private customDomainModel: Model<CustomDomainDocument>,
    @InjectModel(EmailTemplate.name) private emailTemplateModel: Model<EmailTemplateDocument>,
    @InjectModel(BookingWidget.name) private bookingWidgetModel: Model<BookingWidgetDocument>,
    private readonly cacheService: CacheService,
  ) {}

  // ==================== THEME MANAGEMENT ====================

  /**
   * Create or update business theme
   */
  async createOrUpdateTheme(businessId: string, themeDto: CreateThemeDto) {
    try {
      const existingTheme = await this.themeModel.findOne({ 
        tenantId: new Types.ObjectId(businessId) 
      });

      if (existingTheme) {
        // Update existing theme
        Object.assign(existingTheme, themeDto);
        existingTheme.updatedAt = new Date();
        const updated = await existingTheme.save();
        
        return {
          success: true,
          message: 'Theme updated successfully',
          theme: updated
        };
      }

      // Create new theme
      const saved = await this.themeModel.create({
        tenantId: new Types.ObjectId(businessId),
        ...themeDto,
      });

      return {
        success: true,
        message: 'Theme created successfully',
        theme: saved
      };
    } catch (error) {
      console.error('Create/Update theme error:', error);
      throw new InternalServerErrorException('Failed to save theme');
    }
  }

  /**
   * Partially update theme (creates with defaults if doesn't exist)
   */
  async updateTheme(businessId: string, themeDto: UpdateThemeDto) {
    let theme = await this.themeModel.findOne({ 
      tenantId: new Types.ObjectId(businessId) 
    });

    // If theme doesn't exist, create one with defaults first
    if (!theme) {
      const defaultTheme = this.getDefaultTheme();
      const themeData = {
        tenantId: new Types.ObjectId(businessId),
        colors: defaultTheme.colors,
        typography: defaultTheme.typography,
        logo: defaultTheme.logo,
        favicon: defaultTheme.favicon,
        customCss: defaultTheme.customCss,
      };
      theme = new (this.themeModel as any)(themeData);
    }

    try {
      // Deep merge for nested objects
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
    } catch (error) {
      console.error('Update theme error:', error);
      throw new InternalServerErrorException('Failed to update theme');
    }
  }

  /**
   * Get business theme or return default
   */
  async getTheme(businessId: string) {
    const theme = await this.themeModel.findOne({ 
      tenantId: new Types.ObjectId(businessId) 
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

  /**
   * Delete theme (reset to default)
   */
  async deleteTheme(businessId: string) {
    const result = await this.themeModel.deleteOne({ 
      tenantId: new Types.ObjectId(businessId) 
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Theme not found');
    }

    return {
      success: true,
      message: 'Theme deleted successfully. Default theme will be used.'
    };
  }

  /**
   * Get default theme configuration
   */
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

  // ==================== STOREFRONT LAYOUT MANAGEMENT ====================

  /**
   * Update storefront layout configuration
   * Allows businesses to customize their booking page layout
   */
  async updateStorefrontLayout(businessId: string, layoutDto: any) {
    let theme: any = await this.themeModel.findOne({ 
      tenantId: new Types.ObjectId(businessId) 
    });

    // If theme doesn't exist, create one with defaults first
    if (!theme) {
      const defaultTheme = this.getDefaultTheme();
      theme = await this.themeModel.create({
        tenantId: new Types.ObjectId(businessId),
        colors: defaultTheme.colors,
        typography: defaultTheme.typography,
        storefront: {},
      });
    }

    try {
      // Initialize storefront if it doesn't exist
      if (!theme.storefront) {
        (theme as any).storefront = {};
      }

      const storefront = (theme as any).storefront;

      // Deep merge each section
      if (layoutDto.hero) {
        storefront.hero = { ...(storefront.hero || {}), ...layoutDto.hero };
      }
      if (layoutDto.sections) {
        storefront.sections = layoutDto.sections;
      }
      if (layoutDto.serviceDisplay) {
        storefront.serviceDisplay = { ...(storefront.serviceDisplay || {}), ...layoutDto.serviceDisplay };
      }
      if (layoutDto.staffDisplay) {
        storefront.staffDisplay = { ...(storefront.staffDisplay || {}), ...layoutDto.staffDisplay };
      }
      if (layoutDto.gallery) {
        storefront.gallery = { ...(storefront.gallery || {}), ...layoutDto.gallery };
      }
      if (layoutDto.testimonials) {
        storefront.testimonials = { ...(storefront.testimonials || {}), ...layoutDto.testimonials };
      }
      if (layoutDto.contact) {
        storefront.contact = { ...(storefront.contact || {}), ...layoutDto.contact };
      }
      if (layoutDto.bookingFlow) {
        storefront.bookingFlow = { ...(storefront.bookingFlow || {}), ...layoutDto.bookingFlow };
      }
      if (layoutDto.socialProof) {
        storefront.socialProof = { ...(storefront.socialProof || {}), ...layoutDto.socialProof };
      }

      theme.updatedAt = new Date();
      const updated = await theme.save();

      return {
        success: true,
        message: 'Storefront layout updated successfully',
        storefront: updated.storefront,
      };
    } catch (error) {
      console.error('Update storefront layout error:', error);
      throw new InternalServerErrorException('Failed to update storefront layout');
    }
  }

  /**
   * Update hero section only
   */
  async updateHeroSection(businessId: string, heroDto: any) {
    return this.updateStorefrontLayout(businessId, { hero: heroDto });
  }

  /**
   * Update sections order (for drag-and-drop)
   */
  async updateSectionsOrder(businessId: string, sections: any[]) {
    return this.updateStorefrontLayout(businessId, { sections });
  }

  /**
   * Update component styles
   */
  async updateComponentStyles(businessId: string, stylesDto: any) {
    let theme: any = await this.themeModel.findOne({ 
      tenantId: new Types.ObjectId(businessId) 
    });

    if (!theme) {
      const defaultTheme = this.getDefaultTheme();
      theme = await this.themeModel.create({
        tenantId: new Types.ObjectId(businessId),
        colors: defaultTheme.colors,
        typography: defaultTheme.typography,
        componentStyles: {},
      });
    }

    try {
      if (!theme.componentStyles) {
        (theme as any).componentStyles = {};
      }

      const styles = (theme as any).componentStyles;

      if (stylesDto.buttons) {
        styles.buttons = { ...(styles.buttons || {}), ...stylesDto.buttons };
      }
      if (stylesDto.cards) {
        styles.cards = { ...(styles.cards || {}), ...stylesDto.cards };
      }
      if (stylesDto.inputBorderRadius !== undefined) {
        styles.inputBorderRadius = stylesDto.inputBorderRadius;
      }
      if (stylesDto.sectionSpacing !== undefined) {
        styles.sectionSpacing = stylesDto.sectionSpacing;
      }
      if (stylesDto.maxContentWidth !== undefined) {
        styles.maxContentWidth = stylesDto.maxContentWidth;
      }

      theme.updatedAt = new Date();
      const updated = await theme.save();

      return {
        success: true,
        message: 'Component styles updated successfully',
        componentStyles: updated.componentStyles,
      };
    } catch (error) {
      console.error('Update component styles error:', error);
      throw new InternalServerErrorException('Failed to update component styles');
    }
  }

  /**
   * Update navbar configuration
   */
  async updateNavbar(businessId: string, navbarDto: any) {
    let theme: any = await this.themeModel.findOne({ 
      tenantId: new Types.ObjectId(businessId) 
    });

    if (!theme) {
      const defaultTheme = this.getDefaultTheme();
      theme = await this.themeModel.create({
        tenantId: new Types.ObjectId(businessId),
        colors: defaultTheme.colors,
        typography: defaultTheme.typography,
        navbar: {},
      });
    }

    try {
      (theme as any).navbar = { ...((theme as any).navbar || {}), ...navbarDto };
      theme.updatedAt = new Date();
      const updated = await theme.save();

      return {
        success: true,
        message: 'Navbar updated successfully',
        navbar: updated.navbar,
      };
    } catch (error) {
      console.error('Update navbar error:', error);
      throw new InternalServerErrorException('Failed to update navbar');
    }
  }

  /**
   * Update footer configuration
   */
  async updateFooter(businessId: string, footerDto: any) {
    let theme: any = await this.themeModel.findOne({ 
      tenantId: new Types.ObjectId(businessId) 
    });

    if (!theme) {
      const defaultTheme = this.getDefaultTheme();
      theme = await this.themeModel.create({
        tenantId: new Types.ObjectId(businessId),
        colors: defaultTheme.colors,
        typography: defaultTheme.typography,
        footer: {},
      });
    }

    try {
      (theme as any).footer = { ...((theme as any).footer || {}), ...footerDto };
      theme.updatedAt = new Date();
      const updated = await theme.save();

      return {
        success: true,
        message: 'Footer updated successfully',
        footer: updated.footer,
      };
    } catch (error) {
      console.error('Update footer error:', error);
      throw new InternalServerErrorException('Failed to update footer');
    }
  }

  /**
   * Update SEO configuration
   */
  async updateSeo(businessId: string, seoDto: any) {
    let theme: any = await this.themeModel.findOne({ 
      tenantId: new Types.ObjectId(businessId) 
    });

    if (!theme) {
      const defaultTheme = this.getDefaultTheme();
      theme = await this.themeModel.create({
        tenantId: new Types.ObjectId(businessId),
        colors: defaultTheme.colors,
        typography: defaultTheme.typography,
        seo: {},
      });
    }

    try {
      (theme as any).seo = { ...((theme as any).seo || {}), ...seoDto };
      theme.updatedAt = new Date();
      const updated = await theme.save();

      return {
        success: true,
        message: 'SEO configuration updated successfully',
        seo: updated.seo,
      };
    } catch (error) {
      console.error('Update SEO error:', error);
      throw new InternalServerErrorException('Failed to update SEO configuration');
    }
  }

  /**
   * Update entire storefront configuration at once
   */
  async updateFullStorefront(businessId: string, fullDto: any) {
    const results: any = {};

    if (fullDto.storefront) {
      const layoutResult = await this.updateStorefrontLayout(businessId, fullDto.storefront);
      results.storefront = layoutResult.storefront;
    }

    if (fullDto.componentStyles) {
      const stylesResult = await this.updateComponentStyles(businessId, fullDto.componentStyles);
      results.componentStyles = stylesResult.componentStyles;
    }

    if (fullDto.navbar) {
      const navbarResult = await this.updateNavbar(businessId, fullDto.navbar);
      results.navbar = navbarResult.navbar;
    }

    if (fullDto.footer) {
      const footerResult = await this.updateFooter(businessId, fullDto.footer);
      results.footer = footerResult.footer;
    }

    if (fullDto.seo) {
      const seoResult = await this.updateSeo(businessId, fullDto.seo);
      results.seo = seoResult.seo;
    }

    return {
      success: true,
      message: 'Storefront configuration updated successfully',
      ...results,
    };
  }

  /**
   * Get current storefront configuration
   */
  async getStorefrontConfig(businessId: string) {
    const theme = await this.themeModel.findOne({ 
      tenantId: new Types.ObjectId(businessId) 
    });

    if (!theme) {
      return {
        success: true,
        isDefault: true,
        storefront: this.getDefaultStorefrontLayout(),
        componentStyles: this.getDefaultComponentStyles(),
        navbar: this.getDefaultNavbar(),
        footer: this.getDefaultFooter(),
        seo: null,
      };
    }

    return {
      success: true,
      isDefault: false,
      storefront: (theme as any).storefront || this.getDefaultStorefrontLayout(),
      componentStyles: (theme as any).componentStyles || this.getDefaultComponentStyles(),
      navbar: (theme as any).navbar || this.getDefaultNavbar(),
      footer: (theme as any).footer || this.getDefaultFooter(),
      seo: (theme as any).seo || null,
    };
  }

  private getDefaultStorefrontLayout() {
    return {
      hero: {
        enabled: true,
        type: 'gradient',
        gradient: { from: '#3B82F6', to: '#8B5CF6', direction: 'to-right' },
        headline: 'Welcome to Our Salon',
        subheadline: 'Book your appointment today',
        textAlignment: 'center',
        overlayStyle: 'dark',
        overlayOpacity: 0.4,
        height: '500px',
        showBookButton: true,
        bookButtonText: 'Book Now',
      },
      sections: [
        { id: 'services', type: 'services', title: 'Our Services', enabled: true, order: 1 },
        { id: 'staff', type: 'staff', title: 'Meet Our Team', enabled: true, order: 2 },
        { id: 'gallery', type: 'gallery', title: 'Our Work', enabled: false, order: 3 },
        { id: 'testimonials', type: 'testimonials', title: 'What Our Clients Say', enabled: true, order: 4 },
        { id: 'about', type: 'about', title: 'About Us', enabled: true, order: 5 },
        { id: 'contact', type: 'contact', title: 'Contact Us', enabled: true, order: 6 },
      ],
      serviceDisplay: { layout: 'grid', columns: 3, showPrices: true, showDuration: true, showDescription: true, showImages: true, groupByCategory: true, showFilters: false },
      staffDisplay: { layout: 'grid', columns: 4, showBio: true, showSpecialties: true, showRatings: true, showBookButton: false },
      gallery: { enabled: false, images: [], layout: 'grid', columns: 3 },
      testimonials: { enabled: true, showRating: true, layout: 'carousel', maxToShow: 6 },
      contact: { showMap: true, showAddress: true, showPhone: true, showEmail: true, showSocialLinks: true, showBusinessHours: true },
      bookingFlow: {
        flow: 'service-first',
        allowGuestBooking: true,
        showStaffSelection: true,
        requireStaffSelection: false,
        showServiceImages: true,
        allowMultipleServices: true,
        datePickerStyle: 'calendar',
        showAvailableSlots: true,
        slotDuration: 30,
        advanceBookingDays: 30,
        minAdvanceHours: 2,
      },
      socialProof: { showReviewCount: true, showAverageRating: true, showTotalBookings: false, showTrustBadges: false, badges: [] },
      content: { testimonials: [], faqs: [], about: {}, galleryImages: [] },
    };
  }

  // ==================== SECTION CONTENT MANAGEMENT ====================

  /**
   * Add a testimonial to storefront
   */
  async addTestimonial(businessId: string, testimonialDto: any) {
    let theme: any = await this.themeModel.findOne({ 
      tenantId: new Types.ObjectId(businessId) 
    });

    if (!theme) {
      const defaultTheme = this.getDefaultTheme();
      theme = await this.themeModel.create({
        tenantId: new Types.ObjectId(businessId),
        colors: defaultTheme.colors,
        typography: defaultTheme.typography,
        storefront: { content: { testimonials: [], faqs: [], about: {}, galleryImages: [] } },
      });
    }

    try {
      if (!theme.storefront) theme.storefront = {};
      if (!theme.storefront.content) theme.storefront.content = { testimonials: [], faqs: [], about: {}, galleryImages: [] };
      if (!theme.storefront.content.testimonials) theme.storefront.content.testimonials = [];

      const newTestimonial = {
        id: `testimonial-${Date.now()}`,
        clientName: testimonialDto.clientName,
        clientPhoto: testimonialDto.clientPhoto || null,
        clientTitle: testimonialDto.clientTitle || null,
        content: testimonialDto.content,
        rating: testimonialDto.rating || 5,
        date: testimonialDto.date || new Date().toISOString().split('T')[0],
        serviceName: testimonialDto.serviceName || null,
        isVisible: true,
        order: theme.storefront.content.testimonials.length,
      };

      theme.storefront.content.testimonials.push(newTestimonial);
      theme.markModified('storefront');
      theme.updatedAt = new Date();
      await theme.save();

      return {
        success: true,
        message: 'Testimonial added successfully',
        testimonial: newTestimonial,
        totalTestimonials: theme.storefront.content.testimonials.length,
      };
    } catch (error) {
      console.error('Add testimonial error:', error);
      throw new InternalServerErrorException('Failed to add testimonial');
    }
  }

  /**
   * Update all testimonials
   */
  async updateTestimonials(businessId: string, testimonialsDto: any) {
    let theme: any = await this.themeModel.findOne({ 
      tenantId: new Types.ObjectId(businessId) 
    });

    if (!theme) {
      throw new NotFoundException('Theme not found');
    }

    try {
      if (!theme.storefront) theme.storefront = {};
      if (!theme.storefront.content) theme.storefront.content = { testimonials: [], faqs: [], about: {}, galleryImages: [] };
      
      theme.storefront.content.testimonials = testimonialsDto.testimonials;
      theme.markModified('storefront');
      theme.updatedAt = new Date();
      await theme.save();

      return {
        success: true,
        message: 'Testimonials updated successfully',
        testimonials: theme.storefront.content.testimonials,
      };
    } catch (error) {
      console.error('Update testimonials error:', error);
      throw new InternalServerErrorException('Failed to update testimonials');
    }
  }

  /**
   * Delete a testimonial
   */
  async deleteTestimonial(businessId: string, testimonialId: string) {
    const theme: any = await this.themeModel.findOne({ 
      tenantId: new Types.ObjectId(businessId) 
    });

    if (!theme || !theme.storefront?.content?.testimonials) {
      throw new NotFoundException('Testimonial not found');
    }

    const index = theme.storefront.content.testimonials.findIndex((t: any) => t.id === testimonialId);
    if (index === -1) {
      throw new NotFoundException('Testimonial not found');
    }

    theme.storefront.content.testimonials.splice(index, 1);
    theme.markModified('storefront');
    theme.updatedAt = new Date();
    await theme.save();

    return {
      success: true,
      message: 'Testimonial deleted successfully',
    };
  }

  /**
   * Add a FAQ to storefront
   */
  async addFAQ(businessId: string, faqDto: any) {
    let theme: any = await this.themeModel.findOne({ 
      tenantId: new Types.ObjectId(businessId) 
    });

    if (!theme) {
      const defaultTheme = this.getDefaultTheme();
      theme = await this.themeModel.create({
        tenantId: new Types.ObjectId(businessId),
        colors: defaultTheme.colors,
        typography: defaultTheme.typography,
        storefront: { content: { testimonials: [], faqs: [], about: {}, galleryImages: [] } },
      });
    }

    try {
      if (!theme.storefront) theme.storefront = {};
      if (!theme.storefront.content) theme.storefront.content = { testimonials: [], faqs: [], about: {}, galleryImages: [] };
      if (!theme.storefront.content.faqs) theme.storefront.content.faqs = [];

      const newFAQ = {
        id: `faq-${Date.now()}`,
        question: faqDto.question,
        answer: faqDto.answer,
        category: faqDto.category || 'general',
        isVisible: true,
        order: theme.storefront.content.faqs.length,
      };

      theme.storefront.content.faqs.push(newFAQ);
      theme.markModified('storefront');
      theme.updatedAt = new Date();
      await theme.save();

      return {
        success: true,
        message: 'FAQ added successfully',
        faq: newFAQ,
        totalFAQs: theme.storefront.content.faqs.length,
      };
    } catch (error) {
      console.error('Add FAQ error:', error);
      throw new InternalServerErrorException('Failed to add FAQ');
    }
  }

  /**
   * Update all FAQs
   */
  async updateFAQs(businessId: string, faqsDto: any) {
    let theme: any = await this.themeModel.findOne({ 
      tenantId: new Types.ObjectId(businessId) 
    });

    if (!theme) {
      throw new NotFoundException('Theme not found');
    }

    try {
      if (!theme.storefront) theme.storefront = {};
      if (!theme.storefront.content) theme.storefront.content = { testimonials: [], faqs: [], about: {}, galleryImages: [] };
      
      theme.storefront.content.faqs = faqsDto.faqs;
      theme.markModified('storefront');
      theme.updatedAt = new Date();
      await theme.save();

      return {
        success: true,
        message: 'FAQs updated successfully',
        faqs: theme.storefront.content.faqs,
      };
    } catch (error) {
      console.error('Update FAQs error:', error);
      throw new InternalServerErrorException('Failed to update FAQs');
    }
  }

  /**
   * Delete a FAQ
   */
  async deleteFAQ(businessId: string, faqId: string) {
    const theme: any = await this.themeModel.findOne({ 
      tenantId: new Types.ObjectId(businessId) 
    });

    if (!theme || !theme.storefront?.content?.faqs) {
      throw new NotFoundException('FAQ not found');
    }

    const index = theme.storefront.content.faqs.findIndex((f: any) => f.id === faqId);
    if (index === -1) {
      throw new NotFoundException('FAQ not found');
    }

    theme.storefront.content.faqs.splice(index, 1);
    theme.markModified('storefront');
    theme.updatedAt = new Date();
    await theme.save();

    return {
      success: true,
      message: 'FAQ deleted successfully',
    };
  }

  /**
   * Import FAQs from chat FAQs
   */
  async importFAQsFromChat(businessId: string, replaceExisting: boolean = false) {
    // This would need to inject the FAQ model from notification module
    // For now, return a placeholder that frontend can implement
    return {
      success: false,
      message: 'Import FAQs from chat is not yet implemented. Please add FAQs manually or implement the integration.',
    };
  }

  /**
   * Update about section content
   */
  async updateAboutContent(businessId: string, aboutDto: any) {
    let theme: any = await this.themeModel.findOne({ 
      tenantId: new Types.ObjectId(businessId) 
    });

    if (!theme) {
      const defaultTheme = this.getDefaultTheme();
      theme = await this.themeModel.create({
        tenantId: new Types.ObjectId(businessId),
        colors: defaultTheme.colors,
        typography: defaultTheme.typography,
        storefront: { content: { testimonials: [], faqs: [], about: {}, galleryImages: [] } },
      });
    }

    try {
      if (!theme.storefront) theme.storefront = {};
      if (!theme.storefront.content) theme.storefront.content = { testimonials: [], faqs: [], about: {}, galleryImages: [] };
      
      theme.storefront.content.about = {
        ...(theme.storefront.content.about || {}),
        ...aboutDto,
      };
      theme.markModified('storefront');
      theme.updatedAt = new Date();
      await theme.save();

      return {
        success: true,
        message: 'About section updated successfully',
        about: theme.storefront.content.about,
      };
    } catch (error) {
      console.error('Update about content error:', error);
      throw new InternalServerErrorException('Failed to update about section');
    }
  }

  /**
   * Add gallery image
   */
  async addGalleryImage(businessId: string, imageDto: any) {
    let theme: any = await this.themeModel.findOne({ 
      tenantId: new Types.ObjectId(businessId) 
    });

    if (!theme) {
      const defaultTheme = this.getDefaultTheme();
      theme = await this.themeModel.create({
        tenantId: new Types.ObjectId(businessId),
        colors: defaultTheme.colors,
        typography: defaultTheme.typography,
        storefront: { content: { testimonials: [], faqs: [], about: {}, galleryImages: [] } },
      });
    }

    try {
      if (!theme.storefront) theme.storefront = {};
      if (!theme.storefront.content) theme.storefront.content = { testimonials: [], faqs: [], about: {}, galleryImages: [] };
      if (!theme.storefront.content.galleryImages) theme.storefront.content.galleryImages = [];

      const newImage = {
        id: `gallery-${Date.now()}`,
        url: imageDto.url,
        thumbnail: imageDto.thumbnail || imageDto.url,
        caption: imageDto.caption || null,
        category: imageDto.category || null,
        serviceName: imageDto.serviceName || null,
        isVisible: true,
        order: theme.storefront.content.galleryImages.length,
      };

      theme.storefront.content.galleryImages.push(newImage);
      theme.markModified('storefront');
      theme.updatedAt = new Date();
      await theme.save();

      return {
        success: true,
        message: 'Gallery image added successfully',
        image: newImage,
        totalImages: theme.storefront.content.galleryImages.length,
      };
    } catch (error) {
      console.error('Add gallery image error:', error);
      throw new InternalServerErrorException('Failed to add gallery image');
    }
  }

  /**
   * Update all gallery images
   */
  async updateGalleryImages(businessId: string, imagesDto: any) {
    let theme: any = await this.themeModel.findOne({ 
      tenantId: new Types.ObjectId(businessId) 
    });

    if (!theme) {
      throw new NotFoundException('Theme not found');
    }

    try {
      if (!theme.storefront) theme.storefront = {};
      if (!theme.storefront.content) theme.storefront.content = { testimonials: [], faqs: [], about: {}, galleryImages: [] };
      
      theme.storefront.content.galleryImages = imagesDto.images;
      theme.markModified('storefront');
      theme.updatedAt = new Date();
      await theme.save();

      return {
        success: true,
        message: 'Gallery images updated successfully',
        images: theme.storefront.content.galleryImages,
      };
    } catch (error) {
      console.error('Update gallery images error:', error);
      throw new InternalServerErrorException('Failed to update gallery images');
    }
  }

  /**
   * Delete a gallery image
   */
  async deleteGalleryImage(businessId: string, imageId: string) {
    const theme: any = await this.themeModel.findOne({ 
      tenantId: new Types.ObjectId(businessId) 
    });

    if (!theme || !theme.storefront?.content?.galleryImages) {
      throw new NotFoundException('Gallery image not found');
    }

    const index = theme.storefront.content.galleryImages.findIndex((i: any) => i.id === imageId);
    if (index === -1) {
      throw new NotFoundException('Gallery image not found');
    }

    theme.storefront.content.galleryImages.splice(index, 1);
    theme.markModified('storefront');
    theme.updatedAt = new Date();
    await theme.save();

    return {
      success: true,
      message: 'Gallery image deleted successfully',
    };
  }

  /**
   * Get all storefront content
   */
  async getStorefrontContent(businessId: string) {
    const theme: any = await this.themeModel.findOne({ 
      tenantId: new Types.ObjectId(businessId) 
    });

    const defaultContent = { testimonials: [], faqs: [], about: {}, galleryImages: [] };
    
    if (!theme || !theme.storefront?.content) {
      return {
        success: true,
        content: defaultContent,
      };
    }

    return {
      success: true,
      content: theme.storefront.content,
    };
  }

  private getDefaultComponentStyles() {
    return {
      buttons: { borderRadius: '8px', style: 'filled', size: 'medium', uppercase: false, fontWeight: '600' },
      cards: { borderRadius: '12px', shadow: true, shadowIntensity: 'medium', border: true, borderColor: '#E5E7EB' },
      inputBorderRadius: '8px',
      sectionSpacing: '24px',
      maxContentWidth: '1200px',
    };
  }

  private getDefaultNavbar() {
    return {
      style: 'default',
      showLogo: true,
      showBusinessName: true,
      showBookButton: true,
      bookButtonText: 'Book Now',
      menuItems: [
        { label: 'Services', sectionId: 'services' },
        { label: 'Team', sectionId: 'staff' },
        { label: 'Contact', sectionId: 'contact' },
      ],
    };
  }

  private getDefaultFooter() {
    return {
      enabled: true,
      showSocialLinks: true,
      showQuickLinks: true,
      showContactInfo: true,
      showNewsletter: false,
      copyrightText: '© 2026 All rights reserved.',
      customLinks: [],
    };
  }

  // ==================== CUSTOM DOMAIN MANAGEMENT ====================

  /**
   * Request custom domain setup
   */
  async requestCustomDomain(businessId: string, domain: string, userId: string) {
    // Validate domain format
    if (!this.isValidDomain(domain)) {
      throw new BadRequestException('Invalid domain format');
    }

    // Generate subdomain from domain
    const subdomain = domain.split('.')[0].toLowerCase().replace(/[^a-z0-9]/g, '');

    if (subdomain.length < 3) {
      throw new BadRequestException('Domain subdomain must be at least 3 characters');
    }

    // Check if domain already exists
    const existing = await this.customDomainModel.findOne({ domain });
    if (existing) {
      throw new ConflictException('Domain already in use');
    }

    // Check if business already has a verified domain
    // const businessDomains = await this.customDomainModel.find({
    //   tenantId: new Types.ObjectId(businessId),
    //   verificationStatus: 'verified'
    // });

    const businessDomains = await this.customDomainModel
  .find({
    tenantId: new Types.ObjectId(businessId),
    verificationStatus: 'verified'
  })
  .lean<any>();

    if (businessDomains.length >= 3) {
      throw new BadRequestException('Maximum of 3 custom domains allowed per business');
    }

    try {
      // Generate verification token
      const verificationToken = crypto.randomBytes(16).toString('hex');
      
      const customDomain = new this.customDomainModel({
        tenantId: new Types.ObjectId(businessId),
        domain,
        subdomain,
        verificationStatus: 'pending',
        sslStatus: 'pending',
        requestedBy: new Types.ObjectId(userId),
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
    } catch (error) {
      console.error('Request custom domain error:', error);
      throw new InternalServerErrorException('Failed to create domain request');
    }
  }

  /**
   * Verify custom domain DNS records
   */
  async verifyCustomDomain(businessId: string, domainId: string) {
    const domain = await this.customDomainModel.findOne({
      _id: domainId,
      tenantId: new Types.ObjectId(businessId)
    });
    
    if (!domain) {
      throw new NotFoundException('Domain not found');
    }

    if (domain.verificationStatus === 'verified') {
      return {
        success: true,
        message: 'Domain is already verified',
        domain
      };
    }

    try {
      // In production, you would:
      // 1. Query DNS records using dns.resolve()
      // 2. Verify CNAME points to correct value
      // 3. Verify TXT record contains verification token
      // 4. Request SSL certificate from Let's Encrypt
      
      // For now, simulate verification
      const dnsVerified = await this.verifyDNSRecords(domain.domain, domain.dnsRecords);

      if (!dnsVerified) {
        throw new BadRequestException('DNS records not properly configured');
      }

      domain.verificationStatus = 'verified';
      domain.verifiedAt = new Date();
      domain.dnsRecords.forEach(record => record.verified = true);
      domain.sslStatus = 'active'; // In production, this would be after SSL cert is issued

      const verified = await domain.save();

      return {
        success: true,
        message: 'Domain verified successfully',
        domain: verified
      };
    } catch (error) {
      console.error('Verify domain error:', error);
      
      // Update status to failed
      domain.verificationStatus = 'failed';
      await domain.save();

      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to verify domain');
    }
  }

  /**
   * Get all custom domains for business
   */
  // async getCustomDomains(businessId: string) {
  //   const domains = await this.customDomainModel
  //     .find({ tenantId: new Types.ObjectId(businessId) })
  //     .sort({ createdAt: -1 })
  //     .exec();

  //   return {
  //     count: domains.length,
  //     domains: domains.map(d => ({
  //       id: d._id,
  //       domain: d.domain,
  //       subdomain: d.subdomain,
  //       verificationStatus: d.verificationStatus,
  //       sslStatus: d.sslStatus,
  //       isActive: d.isActive,
  //       verifiedAt: d.verifiedAt,
  //       createdAt: d.createdAt
  //     }))
  //   };
  // }

async getCustomDomains(businessId: string) {
  const domains = await this.customDomainModel
    .find({ tenantId: new Types.ObjectId(businessId) })
    .sort({ createdAt: -1 })
    .lean<any>()  // ✅ Add this
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
  /**
   * Get specific domain details
   */
  async getDomain(businessId: string, domainId: string) {
    const domain = await this.customDomainModel.findOne({
      _id: domainId,
      tenantId: new Types.ObjectId(businessId)
    });

    if (!domain) {
      throw new NotFoundException('Domain not found');
    }

    return domain;
  }

  /**
   * Delete custom domain
   */
  async deleteCustomDomain(businessId: string, domainId: string) {
    const domain = await this.customDomainModel.findOne({
      _id: domainId,
      tenantId: new Types.ObjectId(businessId)
    });

    if (!domain) {
      throw new NotFoundException('Domain not found');
    }

    // In production, you would:
    // 1. Revoke SSL certificate
    // 2. Remove domain from CDN/load balancer
    // 3. Clean up DNS records

    await domain.deleteOne();

    return {
      success: true,
      message: 'Custom domain deleted successfully'
    };
  }

  /**
   * Validate domain format
   */
  private isValidDomain(domain: string): boolean {
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
    return domainRegex.test(domain);
  }

  /**
   * Verify DNS records (placeholder for production implementation)
   */
  private async verifyDNSRecords(domain: string, records: any[]): Promise<boolean> {
    // In production, use dns.promises.resolve() to verify records
    // For now, simulate verification
    return true;
  }

  // ==================== EMAIL TEMPLATE MANAGEMENT ====================

  /**
   * Create custom email template
   */
  async createEmailTemplate(
    businessId: string,
    templateDto: CreateEmailTemplateDto,
    userId: string
  ) {
    // Check if template type already exists
    const existing = await this.emailTemplateModel.findOne({
      tenantId: new Types.ObjectId(businessId),
      templateType: templateDto.templateType
    });

    if (existing) {
      throw new ConflictException(
        `Template of type '${templateDto.templateType}' already exists. Use update instead.`
      );
    }

    try {
      const template = new this.emailTemplateModel({
        tenantId: new Types.ObjectId(businessId),
        templateType: templateDto.templateType,
        subject: templateDto.subject,
        htmlContent: templateDto.htmlContent,
        textContent: templateDto.textContent || this.stripHtml(templateDto.htmlContent),
        isCustom: true,
        variables: this.extractVariables(templateDto.htmlContent),
        createdBy: new Types.ObjectId(userId),
      });

      const saved = await template.save();

      return {
        success: true,
        message: 'Email template created successfully',
        template: saved
      };
    } catch (error) {
      console.error('Create email template error:', error);
      throw new InternalServerErrorException('Failed to create email template');
    }
  }

  /**
   * Get email template by type
   */
  async getEmailTemplate(businessId: string, templateType: string) {
    const customTemplate = await this.emailTemplateModel.findOne({
      tenantId: new Types.ObjectId(businessId),
      templateType,
      isActive: true,
    });

    if (customTemplate) {
      return {
        isCustom: true,
        template: customTemplate
      };
    }

    // Return system default template
    const defaultTemplate = this.getDefaultEmailTemplate(templateType);
    
    if (!defaultTemplate) {
      throw new NotFoundException(`Template type '${templateType}' not found`);
    }

    return {
      isCustom: false,
      template: defaultTemplate
    };
  }

  /**
   * Get all email templates for business
   */
  // async getAllEmailTemplates(businessId: string) {
  //   const templates = await this.emailTemplateModel
  //     .find({
  //       tenantId: new Types.ObjectId(businessId),
  //       isActive: true
  //     })
  //     .sort({ createdAt: -1 })
  //     .exec();

  //   // Get available default template types
  //   const defaultTypes = this.getAvailableTemplateTypes();
  //   const customTypes = templates.map(t => t.templateType);
  //   const missingTypes = defaultTypes.filter(type => !customTypes.includes(type));

  //   return {
  //     count: templates.length,
  //     templates: templates.map(t => ({
  //       id: t._id,
  //       type: t.templateType,
  //       subject: t.subject,
  //       isCustom: t.isCustom,
  //       variables: t.variables,
  //       createdAt: t.createdAt
  //     })),
  //     availableDefaults: missingTypes.map(type => ({
  //       type,
  //       subject: this.getDefaultEmailTemplate(type)?.subject
  //     }))
  //   };
  // }

  async getAllEmailTemplates(businessId: string) {
  const templates = await this.emailTemplateModel
    .find({
      tenantId: new Types.ObjectId(businessId),
      isActive: true
    })
    .sort({ createdAt: -1 })
    .lean<any>()  // ✅ Add this
    .exec();

  // Get available default template types
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

  /**
   * Update email template
   */
  async updateEmailTemplate(
    businessId: string,
    templateId: string,
    templateDto: UpdateEmailTemplateDto
  ) {
    const template = await this.emailTemplateModel.findOne({
      _id: templateId,
      tenantId: new Types.ObjectId(businessId)
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    try {
      if (templateDto.subject) template.subject = templateDto.subject;
      if (templateDto.htmlContent) {
        template.htmlContent = templateDto.htmlContent;
        template.variables = this.extractVariables(templateDto.htmlContent);
      }
      if (templateDto.textContent) {
        template.textContent = templateDto.textContent;
      } else if (templateDto.htmlContent) {
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
    } catch (error) {
      console.error('Update email template error:', error);
      throw new InternalServerErrorException('Failed to update email template');
    }
  }

  /**
   * Delete email template
   */
  async deleteEmailTemplate(businessId: string, templateId: string) {
    const template = await this.emailTemplateModel.findOne({
      _id: templateId,
      tenantId: new Types.ObjectId(businessId)
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    await template.deleteOne();

    return {
      success: true,
      message: 'Email template deleted successfully. Default template will be used.'
    };
  }

  /**
   * Get default email template
   */
  private getDefaultEmailTemplate(templateType: string) {
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

  /**
   * Get available template types
   */
  private getAvailableTemplateTypes(): string[] {
    return [
      'booking_confirmation',
      'booking_reminder',
      'booking_cancellation',
      'welcome'
    ];
  }

  /**
   * Extract template variables from HTML content
   */
  private extractVariables(content: string): string[] {
    const regex = /\{\{(\w+)\}\}/g;
    const matches = content.match(regex) || [];
    return [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '')))];
  }

  /**
   * Strip HTML tags from content
   */
  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // ==================== BOOKING WIDGET MANAGEMENT ====================

  /**
   * Create booking widget
   */
  async createBookingWidget(
    businessId: string,
    widgetDto: CreateWidgetDto,
    userId: string
  ) {
    try {
      const widgetId = crypto.randomBytes(8).toString('hex');
      const embedCode = this.generateEmbedCode(widgetId, widgetDto.configuration);

      const widget = new this.bookingWidgetModel({
        tenantId: new Types.ObjectId(businessId),
        widgetId,
        name: widgetDto.name || 'Default Widget',
        configuration: widgetDto.configuration,
        styling: widgetDto.styling,
        embedCode,
        createdBy: new Types.ObjectId(userId),
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
    } catch (error) {
      console.error('Create booking widget error:', error);
      throw new InternalServerErrorException('Failed to create booking widget');
    }
  }

  /**
   * Get booking widget by ID
   */
  async getBookingWidget(businessId: string, widgetId: string) {
    const widget = await this.bookingWidgetModel.findOne({
      tenantId: new Types.ObjectId(businessId),
      widgetId,
    });

    if (!widget) {
      throw new NotFoundException('Widget not found');
    }

    return widget;
  }

  /**
   * Get all widgets for business
   */
  // async getAllWidgets(businessId: string) {
  //   const widgets = await this.bookingWidgetModel
  //     .find({
  //       tenantId: new Types.ObjectId(businessId),
  //       isActive: true
  //     })
  //     .sort({ createdAt: -1 })
  //     .exec();

  //   return {
  //     count: widgets.length,
  //     widgets: widgets.map(w => ({
  //       id: w._id,
  //       widgetId: w.widgetId,
  //       name: w.name,
  //       impressions: w.impressions,
  //       conversions: w.conversions,
  //       conversionRate: w.impressions > 0 
  //         ? ((w.conversions / w.impressions) * 100).toFixed(2) + '%'
  //         : '0%',
  //       isActive: w.isActive,
  //       createdAt: w.createdAt
  //     }))
  //   };
  // }

  async getAllWidgets(businessId: string) {
  const widgets = await this.bookingWidgetModel
    .find({
      tenantId: new Types.ObjectId(businessId),
      isActive: true
    })
    .sort({ createdAt: -1 })
    .lean<any>()  // ✅ Add this
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

  /**
   * Update widget configuration
   */
  async updateWidget(
    businessId: string,
    widgetId: string,
    widgetDto: UpdateWidgetDto
  ) {
    const widget = await this.bookingWidgetModel.findOne({
      tenantId: new Types.ObjectId(businessId),
      widgetId
    });

    if (!widget) {
      throw new NotFoundException('Widget not found');
    }

    try {
      if (widgetDto.name) widget.name = widgetDto.name;
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
    } catch (error) {
      console.error('Update widget error:', error);
      throw new InternalServerErrorException('Failed to update widget');
    }
  }

  /**
   * Delete widget
   */
  async deleteWidget(businessId: string, widgetId: string) {
    const widget = await this.bookingWidgetModel.findOne({
      tenantId: new Types.ObjectId(businessId),
      widgetId
    });

    if (!widget) {
      throw new NotFoundException('Widget not found');
    }

    await widget.deleteOne();

    return {
      success: true,
      message: 'Widget deleted successfully'
    };
  }

  /**
   * Track widget impression
   */
  async trackWidgetImpression(widgetId: string) {
    try {
      await this.bookingWidgetModel.updateOne(
        { widgetId },
        { $inc: { impressions: 1 } }
      );
    } catch (error) {
      console.error('Track impression error:', error);
      // Don't throw error for tracking failures
    }
  }

  /**
   * Track widget conversion
   */
  async trackWidgetConversion(widgetId: string) {
    try {
      await this.bookingWidgetModel.updateOne(
        { widgetId },
        { $inc: { conversions: 1 } }
      );
    } catch (error) {
      console.error('Track conversion error:', error);
      // Don't throw error for tracking failures
    }
  }

  /**
   * Get widget analytics
   */
  async getWidgetAnalytics(
    businessId: string,
    widgetId: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const widget = await this.bookingWidgetModel.findOne({
      tenantId: new Types.ObjectId(businessId),
      widgetId
    });

    if (!widget) {
      throw new NotFoundException('Widget not found');
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

  /**
   * Generate embed code for widget
   */
  private generateEmbedCode(widgetId: string, config: any): string {
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

  /**
   * Get days since widget creation
   */
  private getDaysSinceCreation(createdAt: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1; // Return at least 1 to avoid division by zero
  }

  // ==================== BRANDING OVERVIEW ====================

  /**
   * Get complete branding overview
   */
  // async getBrandingOverview(businessId: string) {
  //   const [themeResult, domainsResult, templatesResult, widgetsResult] = await Promise.all([
  //     this.getTheme(businessId),
  //     this.getCustomDomains(businessId),
  //     this.getAllEmailTemplates(businessId),
  //     this.getAllWidgets(businessId)
  //   ]);

  //   return {
  //     theme: {
  //       isCustomized: !themeResult.isDefault,
  //       colors: themeResult.theme.colors,
  //       hasLogo: !!themeResult.theme.logo,
  //       hasFavicon: !!themeResult.theme.favicon,
  //       customCssEnabled: themeResult.theme.customCss?.enabled || false
  //     },
  //     customDomains: {
  //       total: domainsResult.count,
  //       verified: domainsResult.domains.filter(d => d.verificationStatus === 'verified').length,
  //       pending: domainsResult.domains.filter(d => d.verificationStatus === 'pending').length,
  //       domains: domainsResult.domains
  //     },
  //     emailTemplates: {
  //       total: templatesResult.count,
  //       custom: templatesResult.templates.filter(t => t.isCustom).length,
  //       templates: templatesResult.templates
  //     },
  //     widgets: {
  //       total: widgetsResult.count,
  //       totalImpressions: widgetsResult.widgets.reduce((sum, w) => sum + (w.impressions || 0), 0),
  //       totalConversions: widgetsResult.widgets.reduce((sum, w) => sum + (w.conversions || 0), 0),
  //       widgets: widgetsResult.widgets
  //     },
  //     summary: {
  //       brandingComplete: !themeResult.isDefault && domainsResult.count > 0,
  //       setupProgress: this.calculateSetupProgress(themeResult, domainsResult, templatesResult, widgetsResult)
  //     }
  //   };
  // }

  async getBrandingOverview(businessId: string) {
  // ☢️ NUCLEAR FIX: Execute sequentially instead of Promise.all to avoid type complexity
  const themeResult: any = await this.getTheme(businessId);
  const domainsResult: any = await this.getCustomDomains(businessId);
  const templatesResult: any = await this.getAllEmailTemplates(businessId);
  const widgetsResult: any = await this.getAllWidgets(businessId);

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
      verified: domainsResult.domains.filter((d: any) => d.verificationStatus === 'verified').length,
      pending: domainsResult.domains.filter((d: any) => d.verificationStatus === 'pending').length,
      domains: domainsResult.domains
    },
    emailTemplates: {
      total: templatesResult.count,
      custom: templatesResult.templates.filter((t: any) => t.isCustom).length,
      templates: templatesResult.templates
    },
    widgets: {
      total: widgetsResult.count,
      totalImpressions: widgetsResult.widgets.reduce((sum: number, w: any) => sum + (w.impressions || 0), 0),
      totalConversions: widgetsResult.widgets.reduce((sum: number, w: any) => sum + (w.conversions || 0), 0),
      widgets: widgetsResult.widgets
    },
    summary: {
      brandingComplete: !themeResult.isDefault && domainsResult.count > 0,
      setupProgress: this.calculateSetupProgress(themeResult, domainsResult, templatesResult, widgetsResult)
    }
  };
}

  /**
   * Calculate branding setup progress
   */
  private calculateSetupProgress(theme: any, domains: any, templates: any, widgets: any): number {
    let progress = 0;
    
    // Theme setup (30%)
    if (!theme.isDefault) progress += 30;
    
    // Custom domain (25%)
    if (domains.count > 0 && domains.domains.some(d => d.verificationStatus === 'verified')) {
      progress += 25;
    }
    
    // Email templates (25%)
    if (templates.count > 0) {
      progress += 25;
    }
    
    // Booking widget (20%)
    if (widgets.count > 0) {
      progress += 20;
    }
    
    return progress;
  }

  // ==================== PREVIEW FUNCTIONALITY ====================

  /**
   * Generate theme preview
   */
  async generateThemePreview(businessId: string, themeData: CreateThemeDto) {
    // Validate theme data
    if (!themeData.colors || !themeData.typography) {
      throw new BadRequestException('Theme must include colors and typography');
    }

    // Generate base64 encoded theme for URL (if needed)
    const themeBase64 = Buffer.from(JSON.stringify(themeData)).toString('base64');
    
    // Use configurable preview URL from environment or default
    const previewBaseUrl = process.env.PREVIEW_BASE_URL || process.env.FRONTEND_URL || 'http://localhost:3001';

    return {
      success: true,
      preview: true,
      theme: themeData,
      // CSS variables generated from theme for direct application
      cssVariables: this.generateCssVariables(themeData),
      // Preview URLs for different environments
      previewUrl: `${previewBaseUrl}/preview/${businessId}?theme=${themeBase64}`,
      localPreviewUrl: `http://localhost:3001/preview/${businessId}?theme=${themeBase64}`,
      message: 'This is a preview. Use POST /branding/theme to save changes.',
      expires: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
    };
  }

  /**
   * Generate CSS variables from theme for direct application
   */
  private generateCssVariables(themeData: CreateThemeDto): string {
    const { colors, typography } = themeData;
    
    return `:root {
  /* Colors */
  --color-primary: ${colors.primary};
  --color-secondary: ${colors.secondary};
  --color-accent: ${colors.accent};
  --color-background: ${colors.background};
  --color-text: ${colors.text};
  --color-error: ${colors.error};
  --color-success: ${colors.success};
  
  /* Typography */
  --font-family: ${typography.fontFamily};
  --font-heading: ${typography.headingFont};
  --font-body: ${typography.bodyFont};
}`;
  }

  // ==================== EXPORT FUNCTIONALITY ====================

  /**
   * Export all branding configurations
   */
  async exportBrandingConfig(businessId: string) {
    const overview = await this.getBrandingOverview(businessId);
    // const [theme, domains, templates, widgets] = await Promise.all([
    //   this.themeModel.findOne({ tenantId: new Types.ObjectId(businessId) }),
    //   this.customDomainModel.find({ tenantId: new Types.ObjectId(businessId) }),
    //   this.emailTemplateModel.find({ tenantId: new Types.ObjectId(businessId) }),
    //   this.bookingWidgetModel.find({ tenantId: new Types.ObjectId(businessId) })
    // ]);

    const [theme, domains, templates, widgets] = await Promise.all([
        this.themeModel.findOne({ tenantId: new Types.ObjectId(businessId) }).lean<any>(),
        this.customDomainModel.find({ tenantId: new Types.ObjectId(businessId) }).lean<any>(),
        this.emailTemplateModel.find({ tenantId: new Types.ObjectId(businessId) }).lean<any>(),
        this.bookingWidgetModel.find({ tenantId: new Types.ObjectId(businessId) }).lean<any>()
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

  /**
   * Import branding configuration
   */
  async importBrandingConfig(businessId: string, config: any, userId: string) {
    try {
      const results = {
        theme: null,
        domains: [],
        templates: [],
        widgets: []
      };

      // Import theme
      if (config.theme) {
        results.theme = await this.createOrUpdateTheme(businessId, config.theme);
      }

      // Import templates
      if (config.templates && Array.isArray(config.templates)) {
        for (const template of config.templates) {
          try {
            const imported = await this.createEmailTemplate(businessId, template, userId);
            results.templates.push(imported);
          } catch (error) {
            console.error('Failed to import template:', error);
          }
        }
      }

      // Import widgets
      if (config.widgets && Array.isArray(config.widgets)) {
        for (const widget of config.widgets) {
          try {
            const imported = await this.createBookingWidget(businessId, widget, userId);
            results.widgets.push(imported);
          } catch (error) {
            console.error('Failed to import widget:', error);
          }
        }
      }

      return {
        success: true,
        message: 'Branding configuration imported successfully',
        results
      };
    } catch (error) {
      console.error('Import branding config error:', error);
      throw new InternalServerErrorException('Failed to import branding configuration');
    }
  }

  // ==================== THEME PREVIEW MANAGEMENT ====================

  /**
   * Create a temporary preview session and return a short preview ID
   * This allows sharing clean URLs like /preview/book/subdomain?previewId=abc123
   */
  async createPreviewSession(businessId: string, themeData: CreateThemeDto): Promise<{ previewId: string; previewUrl: string }> {
    try {
      // Generate a short, unique preview ID
      const previewId = crypto.randomBytes(8).toString('hex');
      const cacheKey = `${this.PREVIEW_KEY_PREFIX}${previewId}`;

      // Store the preview data with TTL
      await this.cacheService.set(cacheKey, {
        businessId,
        theme: themeData,
        createdAt: new Date().toISOString(),
      }, this.PREVIEW_TTL);

      return {
        previewId,
        previewUrl: `/preview/book/{subdomain}?previewId=${previewId}`,
      };
    } catch (error) {
      console.error('Create preview session error:', error);
      throw new InternalServerErrorException('Failed to create preview session');
    }
  }

  /**
   * Get preview data by preview ID
   * Used by the frontend to fetch unsaved theme for preview
   */
  async getPreviewSession(previewId: string): Promise<any> {
    try {
      const cacheKey = `${this.PREVIEW_KEY_PREFIX}${previewId}`;
      const previewData = await this.cacheService.get(cacheKey);

      if (!previewData) {
        throw new NotFoundException('Preview session expired or not found');
      }

      return previewData;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Get preview session error:', error);
      throw new InternalServerErrorException('Failed to get preview session');
    }
  }

  /**
   * Delete a preview session
   */
  async deletePreviewSession(previewId: string): Promise<void> {
    try {
      const cacheKey = `${this.PREVIEW_KEY_PREFIX}${previewId}`;
      await this.cacheService.delete(cacheKey);
    } catch (error) {
      console.error('Delete preview session error:', error);
      // Don't throw - it's okay if deletion fails
    }
  }

  /**
   * Extend preview session TTL
   */
  async extendPreviewSession(previewId: string): Promise<void> {
    try {
      const cacheKey = `${this.PREVIEW_KEY_PREFIX}${previewId}`;
      const previewData = await this.cacheService.get(cacheKey);

      if (previewData) {
        await this.cacheService.set(cacheKey, previewData, this.PREVIEW_TTL);
      }
    } catch (error) {
      console.error('Extend preview session error:', error);
    }
  }
}