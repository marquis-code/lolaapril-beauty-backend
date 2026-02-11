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
var BusinessService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const business_schema_1 = require("./schemas/business.schema");
const subscription_service_1 = require("../subscription/subscription.service");
const user_schema_1 = require("../auth/schemas/user.schema");
const paystack_service_1 = require("../integration/payment-gateways/paystack/paystack.service");
const branding_service_1 = require("../branding/branding.service");
const service_service_1 = require("../service/service.service");
const staff_service_1 = require("../staff/staff.service");
const bcrypt = require("bcryptjs");
let BusinessService = BusinessService_1 = class BusinessService {
    constructor(businessModel, userModel, subscriptionService, paystackService, brandingService, serviceService, staffService) {
        this.businessModel = businessModel;
        this.userModel = userModel;
        this.subscriptionService = subscriptionService;
        this.paystackService = paystackService;
        this.brandingService = brandingService;
        this.serviceService = serviceService;
        this.staffService = staffService;
        this.logger = new common_1.Logger(BusinessService_1.name);
    }
    async getBusinessWorkingHours(businessId) {
        const business = await this.businessModel.findById(businessId).select('businessHours').exec();
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        return business.businessHours || [];
    }
    async createBusinessWorkingHours(businessId, workingHours) {
        const business = await this.businessModel.findById(businessId).exec();
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        business.businessHours = workingHours;
        await business.save();
        return business.businessHours;
    }
    async updateBusinessWorkingHours(businessId, workingHours) {
        const business = await this.businessModel.findByIdAndUpdate(businessId, { businessHours: workingHours, updatedAt: new Date() }, { new: true, runValidators: true }).select('businessHours').exec();
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        return business.businessHours || [];
    }
    async isSubdomainAvailable(subdomain) {
        const model = this.businessModel;
        const existing = await model.findOne({ subdomain }).lean().exec();
        return !existing;
    }
    async getBySubdomain(subdomain) {
        const model = this.businessModel;
        const business = await model
            .findOne({ subdomain })
            .populate('ownerId', 'firstName lastName email')
            .lean()
            .exec();
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        return business;
    }
    async getById(businessId) {
        if (!mongoose_2.Types.ObjectId.isValid(businessId)) {
            throw new common_1.BadRequestException('Invalid business ID format');
        }
        const model = this.businessModel;
        const business = await model
            .findById(businessId)
            .populate('ownerId', 'firstName lastName email')
            .populate('adminIds', 'firstName lastName email role')
            .populate('staffIds', 'firstName lastName email role')
            .lean()
            .exec();
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        return business;
    }
    async getBusinessesByUser(userId) {
        const model = this.businessModel;
        const businesses = await model
            .find({
            $or: [
                { ownerId: new mongoose_2.Types.ObjectId(userId) },
                { adminIds: new mongoose_2.Types.ObjectId(userId) },
                { staffIds: new mongoose_2.Types.ObjectId(userId) }
            ]
        })
            .sort({ createdAt: -1 })
            .lean()
            .exec();
        return businesses;
    }
    async update(businessId, updateData) {
        const model = this.businessModel;
        const business = await model
            .findByIdAndUpdate(businessId, { ...updateData, updatedAt: new Date() }, { new: true, runValidators: true })
            .lean()
            .exec();
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        return business;
    }
    async addStaff(businessId, staffData) {
        const model = this.businessModel;
        const business = await model.findById(businessId).exec();
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        const userModel = this.userModel;
        const existingUser = await userModel.findOne({ email: staffData.email }).exec();
        let userId;
        if (!existingUser) {
            const tempPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(tempPassword, 12);
            const newUser = await userModel.create({
                email: staffData.email,
                firstName: staffData.firstName,
                lastName: staffData.lastName,
                phone: staffData.phone,
                password: hashedPassword,
                role: user_schema_1.UserRole.STAFF,
                status: 'active',
                staffBusinessId: business._id,
                authProvider: 'local'
            });
            userId = newUser._id;
        }
        else {
            await userModel.findByIdAndUpdate(existingUser._id, {
                role: user_schema_1.UserRole.STAFF,
                staffBusinessId: business._id
            }).exec();
            userId = existingUser._id;
        }
        await model.findByIdAndUpdate(businessId, {
            $addToSet: { staffIds: userId }
        }).exec();
        const finalUser = await userModel.findById(userId).lean().exec();
        return {
            id: finalUser._id,
            firstName: finalUser.firstName,
            lastName: finalUser.lastName,
            email: finalUser.email,
            role: finalUser.role
        };
    }
    async removeStaff(businessId, staffId) {
        const businessModel = this.businessModel;
        const userModel = this.userModel;
        await businessModel.findByIdAndUpdate(businessId, {
            $pull: { staffIds: new mongoose_2.Types.ObjectId(staffId) }
        }).exec();
        await userModel.findByIdAndUpdate(staffId, {
            staffBusinessId: null,
            role: user_schema_1.UserRole.CLIENT
        }).exec();
    }
    async addAdmin(businessId, adminId) {
        const businessModel = this.businessModel;
        const userModel = this.userModel;
        await businessModel.findByIdAndUpdate(businessId, {
            $addToSet: { adminIds: new mongoose_2.Types.ObjectId(adminId) }
        }).exec();
        await userModel.findByIdAndUpdate(adminId, {
            role: user_schema_1.UserRole.BUSINESS_ADMIN,
            $addToSet: { adminBusinesses: new mongoose_2.Types.ObjectId(businessId) }
        }).exec();
    }
    async removeAdmin(businessId, adminId) {
        const businessModel = this.businessModel;
        const userModel = this.userModel;
        await businessModel.findByIdAndUpdate(businessId, {
            $pull: { adminIds: new mongoose_2.Types.ObjectId(adminId) }
        }).exec();
        await userModel.findByIdAndUpdate(adminId, {
            $pull: { adminBusinesses: new mongoose_2.Types.ObjectId(adminId) }
        }).exec();
    }
    async getSettings(businessId) {
        const model = this.businessModel;
        const business = await model
            .findById(businessId)
            .select('settings')
            .lean()
            .exec();
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        return business.settings;
    }
    async updateSettings(businessId, settings) {
        const model = this.businessModel;
        const business = await model
            .findByIdAndUpdate(businessId, { settings, updatedAt: new Date() }, { new: true, runValidators: true })
            .select('settings')
            .lean()
            .exec();
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        return business.settings;
    }
    async checkSubscriptionLimits(businessId, context) {
        return this.subscriptionService.checkLimits(businessId, context);
    }
    async createPaystackSubaccount(businessId) {
        try {
            const business = await this.getById(businessId);
            if (business.businessDocuments?.kycStatus !== 'verified') {
                throw new common_1.BadRequestException('Business KYC must be verified before creating subaccount');
            }
            if (business.paymentSettings?.paystackSubaccountCode) {
                this.logger.warn(`Business ${businessId} already has a subaccount`);
                return {
                    subaccountCode: business.paymentSettings.paystackSubaccountCode,
                    alreadyExists: true,
                };
            }
            const bankAccount = business.businessDocuments?.bankAccount;
            if (!bankAccount?.accountNumber || !bankAccount?.bankCode) {
                throw new common_1.BadRequestException('Complete bank account details required to create subaccount');
            }
            this.logger.log(`Creating Paystack subaccount for business: ${business.businessName}`);
            const platformFeePercentage = 2.5;
            const businessPercentage = 100 - platformFeePercentage;
            const subaccountData = await this.paystackService.createSubaccount({
                businessName: business.businessName,
                settlementBank: bankAccount.bankCode,
                accountNumber: bankAccount.accountNumber,
                percentageCharge: businessPercentage,
                description: `${business.businessName} - Lola April Marketplace`,
                primaryContactEmail: business.email,
                primaryContactName: business.businessName,
                primaryContactPhone: business.phone,
                metadata: {
                    businessId: businessId,
                    subdomain: business.subdomain,
                    platformFee: platformFeePercentage,
                },
            });
            await this.businessModel.findByIdAndUpdate(businessId, {
                $set: {
                    'paymentSettings.paystackSubaccountCode': subaccountData.subaccount_code,
                    'paymentSettings.percentageCharge': businessPercentage,
                    'paymentSettings.subaccountCreatedAt': new Date(),
                },
            });
            this.logger.log(`✅ Subaccount created: ${subaccountData.subaccount_code}`);
            return {
                subaccountCode: subaccountData.subaccount_code,
                businessPercentage,
                platformFeePercentage,
                message: 'Subaccount created successfully',
            };
        }
        catch (error) {
            this.logger.error(`Failed to create subaccount for business ${businessId}:`, error.message);
            throw error;
        }
    }
    async verifyBusinessKYC(businessId, adminId) {
        try {
            const business = await this.getById(businessId);
            const docs = business.businessDocuments;
            const missingDocs = [];
            if (!docs?.businessRegistration?.documentUrl) {
                missingDocs.push('Business Registration Certificate');
            }
            if (!docs?.taxIdentification?.documentUrl) {
                missingDocs.push('Tax Identification Certificate');
            }
            if (!docs?.governmentId?.documentUrl) {
                missingDocs.push('Government ID');
            }
            if (!docs?.bankAccount?.bankStatementUrl) {
                missingDocs.push('Bank Statement');
            }
            if (missingDocs.length > 0) {
                throw new common_1.BadRequestException(`Missing required documents: ${missingDocs.join(', ')}. Please upload all required documents before KYC verification.`);
            }
            const updateData = {
                'businessDocuments.kycStatus': 'verified',
                'businessDocuments.kycVerifiedAt': new Date(),
            };
            if (adminId) {
                updateData['businessDocuments.kycVerifiedBy'] = adminId;
            }
            await this.businessModel.findByIdAndUpdate(businessId, { $set: updateData });
            this.logger.log(`✅ KYC verified for business: ${business.businessName}`);
            const subaccountResult = await this.createPaystackSubaccount(businessId);
            return {
                kycVerified: true,
                subaccount: subaccountResult,
                message: 'Business verified and subaccount created successfully',
            };
        }
        catch (error) {
            this.logger.error(`Failed to verify KYC for business ${businessId}:`, error.message);
            throw error;
        }
    }
    async rejectBusinessKYC(businessId, reason, adminId) {
        try {
            const business = await this.getById(businessId);
            const updateData = {
                'businessDocuments.kycStatus': 'rejected',
                'businessDocuments.rejectionReason': reason,
            };
            if (adminId) {
                updateData['businessDocuments.kycVerifiedBy'] = adminId;
            }
            await this.businessModel.findByIdAndUpdate(businessId, { $set: updateData });
            this.logger.log(`❌ KYC rejected for business: ${business.businessName}`);
            return {
                kycRejected: true,
                reason,
                message: 'KYC verification rejected. Business owner will be notified.',
            };
        }
        catch (error) {
            this.logger.error(`Failed to reject KYC for business ${businessId}:`, error.message);
            throw error;
        }
    }
    async getSubaccountDetails(businessId) {
        const business = await this.getById(businessId);
        if (!business.paymentSettings?.paystackSubaccountCode) {
            throw new common_1.NotFoundException('Business does not have a Paystack subaccount');
        }
        const subaccountData = await this.paystackService.getSubaccount(business.paymentSettings.paystackSubaccountCode);
        return {
            subaccountCode: subaccountData.subaccount_code,
            businessName: subaccountData.business_name,
            accountNumber: subaccountData.account_number,
            settlementBank: subaccountData.settlement_bank,
            percentageCharge: subaccountData.percentage_charge,
            isActive: subaccountData.is_verified,
            currency: subaccountData.currency,
        };
    }
    async getPublicStorefront(subdomain) {
        try {
            this.logger.log(`📦 Fetching storefront data for subdomain: ${subdomain}`);
            const business = await this.getBySubdomain(subdomain);
            if (!business) {
                throw new common_1.NotFoundException(`Business with subdomain '${subdomain}' not found`);
            }
            const businessId = business._id.toString();
            let themeResult = { isDefault: true, theme: this.getDefaultTheme() };
            let categoriesResult = { success: false, data: [] };
            let servicesResult = { success: false, data: [] };
            let staffResult = [];
            try {
                themeResult = await this.brandingService.getTheme(businessId);
            }
            catch (err) {
                this.logger.warn(`Theme fetch failed: ${err.message}`);
            }
            try {
                categoriesResult = await this.serviceService.findAllCategories(undefined, businessId);
            }
            catch (err) {
                this.logger.warn(`Categories fetch failed: ${err.message}`);
            }
            try {
                servicesResult = await this.serviceService.findAllServices({}, businessId);
            }
            catch (err) {
                this.logger.warn(`Services fetch failed: ${err.message}`);
            }
            try {
                staffResult = await this.staffService.getStaffByBusiness(businessId, 'active');
            }
            catch (err) {
                this.logger.warn(`Staff fetch failed: ${err.message}`);
            }
            const businessInfo = {
                id: business._id,
                businessName: business.businessName,
                subdomain: business.subdomain,
                businessDescription: business.businessDescription,
                businessType: business.businessType,
                logo: business.logo,
                images: business.images || [],
                address: {
                    street: business.address?.street,
                    city: business.address?.city,
                    state: business.address?.state,
                    country: business.address?.country,
                    postalCode: business.address?.postalCode,
                    latitude: business.address?.latitude,
                    longitude: business.address?.longitude,
                },
                contact: {
                    primaryPhone: business.contact?.primaryPhone,
                    secondaryPhone: business.contact?.secondaryPhone,
                    email: business.contact?.email,
                    website: business.contact?.website,
                    socialMedia: business.contact?.socialMedia,
                },
                settings: {
                    timezone: business.settings?.timezone || 'Africa/Lagos',
                    currency: business.settings?.currency || 'NGN',
                    language: business.settings?.language || 'en',
                    defaultAppointmentDuration: business.settings?.defaultAppointmentDuration || 30,
                    bufferTimeBetweenAppointments: business.settings?.bufferTimeBetweenAppointments || 15,
                    cancellationPolicyHours: business.settings?.cancellationPolicyHours || 24,
                    advanceBookingDays: business.settings?.advanceBookingDays || 7,
                    allowOnlineBooking: business.settings?.allowOnlineBooking ?? true,
                    taxRate: business.settings?.taxRate || 0,
                    serviceCharge: business.settings?.serviceCharge || 0,
                },
                businessHours: business.businessHours || [],
                stats: {
                    totalReviews: business.totalReviews || 0,
                    averageRating: business.averageRating || 0,
                    totalClients: business.totalClients || 0,
                },
            };
            const categories = (categoriesResult?.data || []).map((cat) => ({
                id: cat._id,
                categoryName: cat.categoryName,
                description: cat.description,
                icon: cat.icon,
                image: cat.image,
                displayOrder: cat.displayOrder || 0,
                appointmentColor: cat.appointmentColor,
                isActive: cat.isActive,
            }));
            const services = (servicesResult?.data || [])
                .filter((svc) => svc.isActive)
                .map((svc) => {
                const basicDetails = svc.basicDetails || {};
                const pricingAndDuration = svc.pricingAndDuration || {};
                const teamMembers = svc.teamMembers || {};
                const settings = svc.settings || {};
                return {
                    id: svc._id,
                    serviceName: basicDetails.serviceName || svc.serviceName,
                    serviceType: basicDetails.serviceType || svc.serviceType,
                    categoryId: basicDetails.category || svc.categoryId,
                    description: basicDetails.description || svc.description,
                    priceType: pricingAndDuration.priceType || 'Fixed',
                    price: pricingAndDuration.price || svc.price || { currency: 'NGN', amount: 0 },
                    duration: pricingAndDuration.duration || svc.duration || {
                        servicingTime: { value: 30, unit: 'min' },
                        processingTime: { value: 0, unit: 'min' },
                        totalDuration: '30 min',
                    },
                    extraTimeOptions: pricingAndDuration.extraTimeOptions,
                    images: svc.images || [],
                    allTeamMembers: teamMembers.allTeamMembers || false,
                    assignedStaffIds: (teamMembers.selectedMembers || [])
                        .filter((m) => m.selected)
                        .map((m) => m.id?.toString()),
                    onlineBooking: {
                        enabled: settings.onlineBooking?.enabled ?? true,
                        availableFor: settings.onlineBooking?.availableFor || 'All clients',
                    },
                    variants: (svc.variants || []).map((v) => ({
                        variantName: v.variantName,
                        variantDescription: v.variantDescription,
                        pricing: v.pricing,
                    })),
                    serviceAddOns: svc.serviceAddOns || [],
                    isActive: svc.isActive,
                };
            });
            const staff = (staffResult || []).map((s) => ({
                id: s._id,
                staffId: s.staffId,
                firstName: s.userId?.firstName || s.firstName,
                lastName: s.userId?.lastName || s.lastName,
                email: s.email,
                phone: s.phone,
                profileImage: s.profileImage,
                bio: s.bio,
                title: s.title,
                role: s.role,
                employmentType: s.employmentType,
                status: s.status,
                skills: (s.skills || []).filter((sk) => sk.isActive).map((sk) => ({
                    serviceId: sk.serviceId?.toString(),
                    serviceName: sk.serviceName,
                    skillLevel: sk.skillLevel,
                })),
                serviceIds: (s.skills || []).filter((sk) => sk.isActive).map((sk) => sk.serviceId?.toString()),
                rating: {
                    average: s.totalReviews > 0 ? (s.totalRating / s.totalReviews).toFixed(1) : null,
                    totalReviews: s.totalReviews || 0,
                },
                completedAppointments: s.completedAppointments || 0,
                certifications: s.certifications || [],
            }));
            const theme = themeResult.theme || {};
            const storefrontLayout = theme.storefront || this.getDefaultStorefrontLayout();
            const componentStyles = theme.componentStyles || this.getDefaultComponentStyles();
            this.logger.log(`✅ Storefront data fetched: ${categories.length} categories, ${services.length} services, ${staff.length} staff`);
            return {
                success: true,
                business: businessInfo,
                theme: {
                    colors: theme.colors || this.getDefaultTheme().colors,
                    typography: theme.typography || this.getDefaultTheme().typography,
                    logo: theme.logo,
                    favicon: theme.favicon,
                    customCss: theme.customCss,
                    seo: theme.seo,
                    navbar: theme.navbar || this.getDefaultNavbar(),
                    footer: theme.footer || this.getDefaultFooter(),
                },
                isDefaultTheme: themeResult.isDefault,
                layout: {
                    hero: storefrontLayout.hero || this.getDefaultHeroSection(),
                    sections: storefrontLayout.sections || this.getDefaultSections(),
                    serviceDisplay: storefrontLayout.serviceDisplay || { layout: 'grid', columns: 3, showPrices: true, showDuration: true, showDescription: true, showImages: true, groupByCategory: true },
                    staffDisplay: storefrontLayout.staffDisplay || { layout: 'grid', columns: 4, showBio: true, showSpecialties: true, showRatings: true },
                    gallery: storefrontLayout.gallery || { enabled: false, images: [], layout: 'grid', columns: 3 },
                    testimonials: storefrontLayout.testimonials || { enabled: true, showRating: true, layout: 'carousel', maxToShow: 6 },
                    contact: storefrontLayout.contact || { showMap: true, showAddress: true, showPhone: true, showEmail: true, showSocialLinks: true, showBusinessHours: true },
                    bookingFlow: storefrontLayout.bookingFlow || this.getDefaultBookingFlow(),
                    socialProof: storefrontLayout.socialProof || { showReviewCount: true, showAverageRating: true, showTotalBookings: false },
                    content: storefrontLayout.content || { testimonials: [], faqs: [], about: {}, galleryImages: [] },
                },
                componentStyles,
                categories,
                services,
                staff,
                message: 'Storefront data retrieved successfully',
            };
        }
        catch (error) {
            this.logger.error(`❌ Failed to fetch storefront: ${error.message}`);
            throw error;
        }
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
                muted: '#6B7280',
                border: '#E5E7EB',
                cardBackground: '#FFFFFF',
                inputBackground: '#F9FAFB',
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
    getDefaultHeroSection() {
        return {
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
        };
    }
    getDefaultSections() {
        return [
            { id: 'services', type: 'services', title: 'Our Services', enabled: true, order: 1 },
            { id: 'staff', type: 'staff', title: 'Meet Our Team', enabled: true, order: 2 },
            { id: 'gallery', type: 'gallery', title: 'Our Work', enabled: false, order: 3 },
            { id: 'testimonials', type: 'testimonials', title: 'What Our Clients Say', enabled: true, order: 4 },
            { id: 'about', type: 'about', title: 'About Us', enabled: true, order: 5 },
            { id: 'contact', type: 'contact', title: 'Contact Us', enabled: true, order: 6 },
        ];
    }
    getDefaultStorefrontLayout() {
        return {
            hero: this.getDefaultHeroSection(),
            sections: this.getDefaultSections(),
            serviceDisplay: { layout: 'grid', columns: 3, showPrices: true, showDuration: true, showDescription: true, showImages: true, groupByCategory: true, showFilters: false },
            staffDisplay: { layout: 'grid', columns: 4, showBio: true, showSpecialties: true, showRatings: true, showBookButton: false },
            gallery: { enabled: false, images: [], layout: 'grid', columns: 3 },
            testimonials: { enabled: true, showRating: true, layout: 'carousel', maxToShow: 6 },
            contact: { showMap: true, showAddress: true, showPhone: true, showEmail: true, showSocialLinks: true, showBusinessHours: true },
            bookingFlow: this.getDefaultBookingFlow(),
            socialProof: { showReviewCount: true, showAverageRating: true, showTotalBookings: false, showTrustBadges: false, badges: [] },
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
    getDefaultBookingFlow() {
        return {
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
};
BusinessService = BusinessService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(business_schema_1.Business.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => branding_service_1.BrandingService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => service_service_1.ServiceService))),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => staff_service_1.StaffService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        subscription_service_1.SubscriptionService,
        paystack_service_1.PaystackService,
        branding_service_1.BrandingService,
        service_service_1.ServiceService,
        staff_service_1.StaffService])
], BusinessService);
exports.BusinessService = BusinessService;
//# sourceMappingURL=business.service.js.map