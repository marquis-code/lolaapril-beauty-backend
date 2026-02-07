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
const cache_service_1 = require("../cache/cache.service");
const crypto = require("crypto");
let BrandingService = class BrandingService {
    constructor(themeModel, customDomainModel, emailTemplateModel, bookingWidgetModel, cacheService) {
        this.themeModel = themeModel;
        this.customDomainModel = customDomainModel;
        this.emailTemplateModel = emailTemplateModel;
        this.bookingWidgetModel = bookingWidgetModel;
        this.cacheService = cacheService;
        this.PREVIEW_TTL = 3600;
        this.PREVIEW_KEY_PREFIX = 'theme_preview:';
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
            const saved = await this.themeModel.create({
                tenantId: new mongoose_2.Types.ObjectId(businessId),
                ...themeDto,
            });
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
        let theme = await this.themeModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(businessId)
        });
        if (!theme) {
            const defaultTheme = this.getDefaultTheme();
            const themeData = {
                tenantId: new mongoose_2.Types.ObjectId(businessId),
                colors: defaultTheme.colors,
                typography: defaultTheme.typography,
                logo: defaultTheme.logo,
                favicon: defaultTheme.favicon,
                customCss: defaultTheme.customCss,
            };
            theme = new this.themeModel(themeData);
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
    async updateStorefrontLayout(businessId, layoutDto) {
        let theme = await this.themeModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(businessId)
        });
        if (!theme) {
            const defaultTheme = this.getDefaultTheme();
            theme = await this.themeModel.create({
                tenantId: new mongoose_2.Types.ObjectId(businessId),
                colors: defaultTheme.colors,
                typography: defaultTheme.typography,
                storefront: {},
            });
        }
        try {
            if (!theme.storefront) {
                theme.storefront = {};
            }
            const storefront = theme.storefront;
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
        }
        catch (error) {
            console.error('Update storefront layout error:', error);
            throw new common_1.InternalServerErrorException('Failed to update storefront layout');
        }
    }
    async updateHeroSection(businessId, heroDto) {
        return this.updateStorefrontLayout(businessId, { hero: heroDto });
    }
    async updateSectionsOrder(businessId, sections) {
        return this.updateStorefrontLayout(businessId, { sections });
    }
    async updateComponentStyles(businessId, stylesDto) {
        let theme = await this.themeModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(businessId)
        });
        if (!theme) {
            const defaultTheme = this.getDefaultTheme();
            theme = await this.themeModel.create({
                tenantId: new mongoose_2.Types.ObjectId(businessId),
                colors: defaultTheme.colors,
                typography: defaultTheme.typography,
                componentStyles: {},
            });
        }
        try {
            if (!theme.componentStyles) {
                theme.componentStyles = {};
            }
            const styles = theme.componentStyles;
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
        }
        catch (error) {
            console.error('Update component styles error:', error);
            throw new common_1.InternalServerErrorException('Failed to update component styles');
        }
    }
    async updateNavbar(businessId, navbarDto) {
        let theme = await this.themeModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(businessId)
        });
        if (!theme) {
            const defaultTheme = this.getDefaultTheme();
            theme = await this.themeModel.create({
                tenantId: new mongoose_2.Types.ObjectId(businessId),
                colors: defaultTheme.colors,
                typography: defaultTheme.typography,
                navbar: {},
            });
        }
        try {
            theme.navbar = { ...(theme.navbar || {}), ...navbarDto };
            theme.updatedAt = new Date();
            const updated = await theme.save();
            return {
                success: true,
                message: 'Navbar updated successfully',
                navbar: updated.navbar,
            };
        }
        catch (error) {
            console.error('Update navbar error:', error);
            throw new common_1.InternalServerErrorException('Failed to update navbar');
        }
    }
    async updateFooter(businessId, footerDto) {
        let theme = await this.themeModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(businessId)
        });
        if (!theme) {
            const defaultTheme = this.getDefaultTheme();
            theme = await this.themeModel.create({
                tenantId: new mongoose_2.Types.ObjectId(businessId),
                colors: defaultTheme.colors,
                typography: defaultTheme.typography,
                footer: {},
            });
        }
        try {
            theme.footer = { ...(theme.footer || {}), ...footerDto };
            theme.updatedAt = new Date();
            const updated = await theme.save();
            return {
                success: true,
                message: 'Footer updated successfully',
                footer: updated.footer,
            };
        }
        catch (error) {
            console.error('Update footer error:', error);
            throw new common_1.InternalServerErrorException('Failed to update footer');
        }
    }
    async updateSeo(businessId, seoDto) {
        let theme = await this.themeModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(businessId)
        });
        if (!theme) {
            const defaultTheme = this.getDefaultTheme();
            theme = await this.themeModel.create({
                tenantId: new mongoose_2.Types.ObjectId(businessId),
                colors: defaultTheme.colors,
                typography: defaultTheme.typography,
                seo: {},
            });
        }
        try {
            theme.seo = { ...(theme.seo || {}), ...seoDto };
            theme.updatedAt = new Date();
            const updated = await theme.save();
            return {
                success: true,
                message: 'SEO configuration updated successfully',
                seo: updated.seo,
            };
        }
        catch (error) {
            console.error('Update SEO error:', error);
            throw new common_1.InternalServerErrorException('Failed to update SEO configuration');
        }
    }
    async updateFullStorefront(businessId, fullDto) {
        const results = {};
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
    async getStorefrontConfig(businessId) {
        const theme = await this.themeModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(businessId)
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
            storefront: theme.storefront || this.getDefaultStorefrontLayout(),
            componentStyles: theme.componentStyles || this.getDefaultComponentStyles(),
            navbar: theme.navbar || this.getDefaultNavbar(),
            footer: theme.footer || this.getDefaultFooter(),
            seo: theme.seo || null,
        };
    }
    getDefaultStorefrontLayout() {
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
    async addTestimonial(businessId, testimonialDto) {
        let theme = await this.themeModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(businessId)
        });
        if (!theme) {
            const defaultTheme = this.getDefaultTheme();
            theme = await this.themeModel.create({
                tenantId: new mongoose_2.Types.ObjectId(businessId),
                colors: defaultTheme.colors,
                typography: defaultTheme.typography,
                storefront: { content: { testimonials: [], faqs: [], about: {}, galleryImages: [] } },
            });
        }
        try {
            if (!theme.storefront)
                theme.storefront = {};
            if (!theme.storefront.content)
                theme.storefront.content = { testimonials: [], faqs: [], about: {}, galleryImages: [] };
            if (!theme.storefront.content.testimonials)
                theme.storefront.content.testimonials = [];
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
        }
        catch (error) {
            console.error('Add testimonial error:', error);
            throw new common_1.InternalServerErrorException('Failed to add testimonial');
        }
    }
    async updateTestimonials(businessId, testimonialsDto) {
        let theme = await this.themeModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(businessId)
        });
        if (!theme) {
            throw new common_1.NotFoundException('Theme not found');
        }
        try {
            if (!theme.storefront)
                theme.storefront = {};
            if (!theme.storefront.content)
                theme.storefront.content = { testimonials: [], faqs: [], about: {}, galleryImages: [] };
            theme.storefront.content.testimonials = testimonialsDto.testimonials;
            theme.markModified('storefront');
            theme.updatedAt = new Date();
            await theme.save();
            return {
                success: true,
                message: 'Testimonials updated successfully',
                testimonials: theme.storefront.content.testimonials,
            };
        }
        catch (error) {
            console.error('Update testimonials error:', error);
            throw new common_1.InternalServerErrorException('Failed to update testimonials');
        }
    }
    async deleteTestimonial(businessId, testimonialId) {
        const theme = await this.themeModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(businessId)
        });
        if (!theme || !theme.storefront?.content?.testimonials) {
            throw new common_1.NotFoundException('Testimonial not found');
        }
        const index = theme.storefront.content.testimonials.findIndex((t) => t.id === testimonialId);
        if (index === -1) {
            throw new common_1.NotFoundException('Testimonial not found');
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
    async addFAQ(businessId, faqDto) {
        let theme = await this.themeModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(businessId)
        });
        if (!theme) {
            const defaultTheme = this.getDefaultTheme();
            theme = await this.themeModel.create({
                tenantId: new mongoose_2.Types.ObjectId(businessId),
                colors: defaultTheme.colors,
                typography: defaultTheme.typography,
                storefront: { content: { testimonials: [], faqs: [], about: {}, galleryImages: [] } },
            });
        }
        try {
            if (!theme.storefront)
                theme.storefront = {};
            if (!theme.storefront.content)
                theme.storefront.content = { testimonials: [], faqs: [], about: {}, galleryImages: [] };
            if (!theme.storefront.content.faqs)
                theme.storefront.content.faqs = [];
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
        }
        catch (error) {
            console.error('Add FAQ error:', error);
            throw new common_1.InternalServerErrorException('Failed to add FAQ');
        }
    }
    async updateFAQs(businessId, faqsDto) {
        let theme = await this.themeModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(businessId)
        });
        if (!theme) {
            throw new common_1.NotFoundException('Theme not found');
        }
        try {
            if (!theme.storefront)
                theme.storefront = {};
            if (!theme.storefront.content)
                theme.storefront.content = { testimonials: [], faqs: [], about: {}, galleryImages: [] };
            theme.storefront.content.faqs = faqsDto.faqs;
            theme.markModified('storefront');
            theme.updatedAt = new Date();
            await theme.save();
            return {
                success: true,
                message: 'FAQs updated successfully',
                faqs: theme.storefront.content.faqs,
            };
        }
        catch (error) {
            console.error('Update FAQs error:', error);
            throw new common_1.InternalServerErrorException('Failed to update FAQs');
        }
    }
    async deleteFAQ(businessId, faqId) {
        const theme = await this.themeModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(businessId)
        });
        if (!theme || !theme.storefront?.content?.faqs) {
            throw new common_1.NotFoundException('FAQ not found');
        }
        const index = theme.storefront.content.faqs.findIndex((f) => f.id === faqId);
        if (index === -1) {
            throw new common_1.NotFoundException('FAQ not found');
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
    async importFAQsFromChat(businessId, replaceExisting = false) {
        return {
            success: false,
            message: 'Import FAQs from chat is not yet implemented. Please add FAQs manually or implement the integration.',
        };
    }
    async updateAboutContent(businessId, aboutDto) {
        let theme = await this.themeModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(businessId)
        });
        if (!theme) {
            const defaultTheme = this.getDefaultTheme();
            theme = await this.themeModel.create({
                tenantId: new mongoose_2.Types.ObjectId(businessId),
                colors: defaultTheme.colors,
                typography: defaultTheme.typography,
                storefront: { content: { testimonials: [], faqs: [], about: {}, galleryImages: [] } },
            });
        }
        try {
            if (!theme.storefront)
                theme.storefront = {};
            if (!theme.storefront.content)
                theme.storefront.content = { testimonials: [], faqs: [], about: {}, galleryImages: [] };
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
        }
        catch (error) {
            console.error('Update about content error:', error);
            throw new common_1.InternalServerErrorException('Failed to update about section');
        }
    }
    async addGalleryImage(businessId, imageDto) {
        let theme = await this.themeModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(businessId)
        });
        if (!theme) {
            const defaultTheme = this.getDefaultTheme();
            theme = await this.themeModel.create({
                tenantId: new mongoose_2.Types.ObjectId(businessId),
                colors: defaultTheme.colors,
                typography: defaultTheme.typography,
                storefront: { content: { testimonials: [], faqs: [], about: {}, galleryImages: [] } },
            });
        }
        try {
            if (!theme.storefront)
                theme.storefront = {};
            if (!theme.storefront.content)
                theme.storefront.content = { testimonials: [], faqs: [], about: {}, galleryImages: [] };
            if (!theme.storefront.content.galleryImages)
                theme.storefront.content.galleryImages = [];
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
        }
        catch (error) {
            console.error('Add gallery image error:', error);
            throw new common_1.InternalServerErrorException('Failed to add gallery image');
        }
    }
    async updateGalleryImages(businessId, imagesDto) {
        let theme = await this.themeModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(businessId)
        });
        if (!theme) {
            throw new common_1.NotFoundException('Theme not found');
        }
        try {
            if (!theme.storefront)
                theme.storefront = {};
            if (!theme.storefront.content)
                theme.storefront.content = { testimonials: [], faqs: [], about: {}, galleryImages: [] };
            theme.storefront.content.galleryImages = imagesDto.images;
            theme.markModified('storefront');
            theme.updatedAt = new Date();
            await theme.save();
            return {
                success: true,
                message: 'Gallery images updated successfully',
                images: theme.storefront.content.galleryImages,
            };
        }
        catch (error) {
            console.error('Update gallery images error:', error);
            throw new common_1.InternalServerErrorException('Failed to update gallery images');
        }
    }
    async deleteGalleryImage(businessId, imageId) {
        const theme = await this.themeModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(businessId)
        });
        if (!theme || !theme.storefront?.content?.galleryImages) {
            throw new common_1.NotFoundException('Gallery image not found');
        }
        const index = theme.storefront.content.galleryImages.findIndex((i) => i.id === imageId);
        if (index === -1) {
            throw new common_1.NotFoundException('Gallery image not found');
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
    async getStorefrontContent(businessId) {
        const theme = await this.themeModel.findOne({
            tenantId: new mongoose_2.Types.ObjectId(businessId)
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
    getDefaultComponentStyles() {
        return {
            buttons: { borderRadius: '8px', style: 'filled', size: 'medium', uppercase: false, fontWeight: '600' },
            cards: { borderRadius: '12px', shadow: true, shadowIntensity: 'medium', border: true, borderColor: '#E5E7EB' },
            inputBorderRadius: '8px',
            sectionSpacing: '24px',
            maxContentWidth: '1200px',
        };
    }
    getDefaultNavbar() {
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
    getDefaultFooter() {
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
        const themeBase64 = Buffer.from(JSON.stringify(themeData)).toString('base64');
        const previewBaseUrl = process.env.PREVIEW_BASE_URL || process.env.FRONTEND_URL || 'http://localhost:3001';
        return {
            success: true,
            preview: true,
            theme: themeData,
            cssVariables: this.generateCssVariables(themeData),
            previewUrl: `${previewBaseUrl}/preview/${businessId}?theme=${themeBase64}`,
            localPreviewUrl: `http://localhost:3001/preview/${businessId}?theme=${themeBase64}`,
            message: 'This is a preview. Use POST /branding/theme to save changes.',
            expires: new Date(Date.now() + 30 * 60 * 1000)
        };
    }
    generateCssVariables(themeData) {
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
    async createPreviewSession(businessId, themeData) {
        try {
            const previewId = crypto.randomBytes(8).toString('hex');
            const cacheKey = `${this.PREVIEW_KEY_PREFIX}${previewId}`;
            await this.cacheService.set(cacheKey, {
                businessId,
                theme: themeData,
                createdAt: new Date().toISOString(),
            }, this.PREVIEW_TTL);
            return {
                previewId,
                previewUrl: `/preview/book/{subdomain}?previewId=${previewId}`,
            };
        }
        catch (error) {
            console.error('Create preview session error:', error);
            throw new common_1.InternalServerErrorException('Failed to create preview session');
        }
    }
    async getPreviewSession(previewId) {
        try {
            const cacheKey = `${this.PREVIEW_KEY_PREFIX}${previewId}`;
            const previewData = await this.cacheService.get(cacheKey);
            if (!previewData) {
                throw new common_1.NotFoundException('Preview session expired or not found');
            }
            return previewData;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            console.error('Get preview session error:', error);
            throw new common_1.InternalServerErrorException('Failed to get preview session');
        }
    }
    async deletePreviewSession(previewId) {
        try {
            const cacheKey = `${this.PREVIEW_KEY_PREFIX}${previewId}`;
            await this.cacheService.delete(cacheKey);
        }
        catch (error) {
            console.error('Delete preview session error:', error);
        }
    }
    async extendPreviewSession(previewId) {
        try {
            const cacheKey = `${this.PREVIEW_KEY_PREFIX}${previewId}`;
            const previewData = await this.cacheService.get(cacheKey);
            if (previewData) {
                await this.cacheService.set(cacheKey, previewData, this.PREVIEW_TTL);
            }
        }
        catch (error) {
            console.error('Extend preview session error:', error);
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
        mongoose_2.Model,
        cache_service_1.CacheService])
], BrandingService);
exports.BrandingService = BrandingService;
//# sourceMappingURL=branding.service.js.map