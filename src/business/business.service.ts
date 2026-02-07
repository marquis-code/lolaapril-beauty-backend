import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger, Inject, forwardRef } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Business, BusinessDocument } from './schemas/business.schema'
import { SubscriptionService } from '../subscription/subscription.service' 
import { User, UserDocument, UserRole } from '../auth/schemas/user.schema'
import { PaystackService } from '../integration/payment-gateways/paystack/paystack.service'
import { BrandingService } from '../branding/branding.service'
import { ServiceService } from '../service/service.service'
import { StaffService } from '../staff/staff.service'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class BusinessService {
  private readonly logger = new Logger(BusinessService.name);

  constructor(
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly subscriptionService: SubscriptionService,
    private readonly paystackService: PaystackService,
    @Inject(forwardRef(() => BrandingService)) private readonly brandingService: BrandingService,
    @Inject(forwardRef(() => ServiceService)) private readonly serviceService: ServiceService,
    @Inject(forwardRef(() => StaffService)) private readonly staffService: StaffService,
  ) {}

  // ==================== BUSINESS WORKING HOURS ====================
  async getBusinessWorkingHours(businessId: string): Promise<any[]> {
    const business = await this.businessModel.findById(businessId).select('businessHours').exec();
    if (!business) {
      throw new NotFoundException('Business not found');
    }
    return business.businessHours || [];
  }

  async createBusinessWorkingHours(businessId: string, workingHours: any[]): Promise<any[]> {
    const business = await this.businessModel.findById(businessId).exec();
    if (!business) {
      throw new NotFoundException('Business not found');
    }
    business.businessHours = workingHours;
    await business.save();
    return business.businessHours;
  }

  async updateBusinessWorkingHours(businessId: string, workingHours: any[]): Promise<any[]> {
    const business = await this.businessModel.findByIdAndUpdate(
      businessId,
      { businessHours: workingHours, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('businessHours').exec();
    if (!business) {
      throw new NotFoundException('Business not found');
    }
    return business.businessHours || [];
  }

  // ==================== BUSINESS LOOKUP ====================
  
  async isSubdomainAvailable(subdomain: string): Promise<boolean> {
    // SCORCHED EARTH: Cast model to any
    const model: any = this.businessModel
    const existing: any = await model.findOne({ subdomain }).lean().exec()
    return !existing
  }

  async getBySubdomain(subdomain: string): Promise<any> {
    // SCORCHED EARTH: Cast model to any
    const model: any = this.businessModel
    const business: any = await model
      .findOne({ subdomain })
      .populate('ownerId', 'firstName lastName email')
      .lean()
      .exec()

    if (!business) {
      throw new NotFoundException('Business not found')
    }

    return business
  }

  async getById(businessId: string): Promise<any> {
    if (!Types.ObjectId.isValid(businessId)) {
      throw new BadRequestException('Invalid business ID format')
    }

    // SCORCHED EARTH: Cast model to any
    const model: any = this.businessModel
    const business: any = await model
      .findById(businessId)
      .populate('ownerId', 'firstName lastName email')
      .populate('adminIds', 'firstName lastName email role')
      .populate('staffIds', 'firstName lastName email role')
      .lean()
      .exec()

    if (!business) {
      throw new NotFoundException('Business not found')
    }

    return business
  }

  async getBusinessesByUser(userId: string): Promise<any[]> {
    // SCORCHED EARTH: Cast model to any
    const model: any = this.businessModel
    const businesses: any = await model
      .find({
        $or: [
          { ownerId: new Types.ObjectId(userId) },
          { adminIds: new Types.ObjectId(userId) },
          { staffIds: new Types.ObjectId(userId) }
        ]
      })
      .sort({ createdAt: -1 })
      .lean()
      .exec()

    return businesses
  }

  // ==================== BUSINESS MANAGEMENT ====================
  
  async update(businessId: string, updateData: any): Promise<any> {
    // SCORCHED EARTH: Cast model to any
    const model: any = this.businessModel
    const business: any = await model
      .findByIdAndUpdate(
        businessId,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      )
      .lean()
      .exec()

    if (!business) {
      throw new NotFoundException('Business not found')
    }

    return business
  }

  // ==================== STAFF MANAGEMENT ====================
  
  async addStaff(
    businessId: string,
    staffData: { email: string; firstName: string; lastName: string; phone?: string }
  ): Promise<any> {
    // SCORCHED EARTH: Cast model to any
    const model: any = this.businessModel
    const business: any = await model.findById(businessId).exec()
    
    if (!business) {
      throw new NotFoundException('Business not found')
    }

    // Check if user exists
    const userModel: any = this.userModel
    const existingUser: any = await userModel.findOne({ email: staffData.email }).exec()

    let userId: any

    if (!existingUser) {
      // Create new staff user
      const tempPassword = Math.random().toString(36).slice(-8)
      const hashedPassword = await bcrypt.hash(tempPassword, 12)

      const newUser: any = await userModel.create({
        email: staffData.email,
        firstName: staffData.firstName,
        lastName: staffData.lastName,
        phone: staffData.phone,
        password: hashedPassword,
        role: UserRole.STAFF,
        status: 'active',
        staffBusinessId: business._id,
        authProvider: 'local'
      })

      userId = newUser._id
    } else {
      // Update existing user to staff role
      await userModel.findByIdAndUpdate(existingUser._id, {
        role: UserRole.STAFF,
        staffBusinessId: business._id
      }).exec()
      userId = existingUser._id
    }

    // Add to business staff list
    await model.findByIdAndUpdate(businessId, {
      $addToSet: { staffIds: userId }
    }).exec()

    const finalUser: any = await userModel.findById(userId).lean().exec()

    return {
      id: finalUser._id,
      firstName: finalUser.firstName,
      lastName: finalUser.lastName,
      email: finalUser.email,
      role: finalUser.role
    }
  }

  async removeStaff(businessId: string, staffId: string): Promise<void> {
    // SCORCHED EARTH: Cast models to any
    const businessModel: any = this.businessModel
    const userModel: any = this.userModel

    await businessModel.findByIdAndUpdate(businessId, {
      $pull: { staffIds: new Types.ObjectId(staffId) }
    }).exec()

    await userModel.findByIdAndUpdate(staffId, {
      staffBusinessId: null,
      role: UserRole.CLIENT
    }).exec()
  }

  // ==================== ADMIN MANAGEMENT ====================
  
  async addAdmin(businessId: string, adminId: string): Promise<void> {
    // SCORCHED EARTH: Cast models to any
    const businessModel: any = this.businessModel
    const userModel: any = this.userModel

    await businessModel.findByIdAndUpdate(businessId, {
      $addToSet: { adminIds: new Types.ObjectId(adminId) }
    }).exec()

    await userModel.findByIdAndUpdate(adminId, {
      role: UserRole.BUSINESS_ADMIN,
      $addToSet: { adminBusinesses: new Types.ObjectId(businessId) }
    }).exec()
  }

  async removeAdmin(businessId: string, adminId: string): Promise<void> {
    // SCORCHED EARTH: Cast models to any
    const businessModel: any = this.businessModel
    const userModel: any = this.userModel

    await businessModel.findByIdAndUpdate(businessId, {
      $pull: { adminIds: new Types.ObjectId(adminId) }
    }).exec()

    await userModel.findByIdAndUpdate(adminId, {
      $pull: { adminBusinesses: new Types.ObjectId(adminId) }
    }).exec()
  }

  // ==================== SETTINGS ====================
  
  async getSettings(businessId: string): Promise<any> {
    // SCORCHED EARTH: Cast model to any
    const model: any = this.businessModel
    const business: any = await model
      .findById(businessId)
      .select('settings')
      .lean()
      .exec()

    if (!business) {
      throw new NotFoundException('Business not found')
    }

    return business.settings
  }

  async updateSettings(businessId: string, settings: any): Promise<any> {
    // SCORCHED EARTH: Cast model to any
    const model: any = this.businessModel
    const business: any = await model
      .findByIdAndUpdate(
        businessId,
        { settings, updatedAt: new Date() },
        { new: true, runValidators: true }
      )
      .select('settings')
      .lean()
      .exec()

    if (!business) {
      throw new NotFoundException('Business not found')
    }

    return business.settings
  }

  async checkSubscriptionLimits(
    businessId: string,
    context?: 'booking' | 'staff' | 'service'
  ): Promise<{
    isValid: boolean
    canProceed: boolean
    limits: any
    usage: any
    warnings: string[]
    blocked: string[]
  }> {
    return this.subscriptionService.checkLimits(businessId, context)
  }

  // ==================== PAYSTACK SUBACCOUNT ====================
  
  /**
   * Create a Paystack subaccount for a verified business
   * This enables automatic payment splitting for marketplace model
   */
  async createPaystackSubaccount(businessId: string): Promise<any> {
    try {
      const business = await this.getById(businessId);

      // Validate KYC status
      if (business.businessDocuments?.kycStatus !== 'verified') {
        throw new BadRequestException('Business KYC must be verified before creating subaccount');
      }

      // Check if subaccount already exists
      if (business.paymentSettings?.paystackSubaccountCode) {
        this.logger.warn(`Business ${businessId} already has a subaccount`);
        return {
          subaccountCode: business.paymentSettings.paystackSubaccountCode,
          alreadyExists: true,
        };
      }

      // Validate bank details
      const bankAccount = business.businessDocuments?.bankAccount;
      if (!bankAccount?.accountNumber || !bankAccount?.bankCode) {
        throw new BadRequestException('Complete bank account details required to create subaccount');
      }

      this.logger.log(`Creating Paystack subaccount for business: ${business.businessName}`);

      // Calculate platform fee percentage (Lola April's commission)
      // Business receives 100% - platformFeePercentage
      const platformFeePercentage = 2.5; // Lola April keeps 2.5%
      const businessPercentage = 100 - platformFeePercentage; // Business keeps 97.5%

      // Create subaccount via Paystack
      const subaccountData = await this.paystackService.createSubaccount({
        businessName: business.businessName,
        settlementBank: bankAccount.bankCode,
        accountNumber: bankAccount.accountNumber,
        percentageCharge: businessPercentage, // Business keeps 97.5%
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

      // Update business with subaccount details
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
    } catch (error) {
      this.logger.error(`Failed to create subaccount for business ${businessId}:`, error.message);
      throw error;
    }
  }

  /**
   * Verify business KYC and create subaccount
   */
  async verifyBusinessKYC(businessId: string, adminId?: string): Promise<any> {
    try {
      const business = await this.getById(businessId);

      // Validate required documents are uploaded
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
        throw new BadRequestException(
          `Missing required documents: ${missingDocs.join(', ')}. Please upload all required documents before KYC verification.`
        );
      }

      // Update KYC status
      const updateData: any = {
        'businessDocuments.kycStatus': 'verified',
        'businessDocuments.kycVerifiedAt': new Date(),
      };

      if (adminId) {
        updateData['businessDocuments.kycVerifiedBy'] = adminId;
      }

      await this.businessModel.findByIdAndUpdate(businessId, { $set: updateData });

      this.logger.log(`✅ KYC verified for business: ${business.businessName}`);

      // Automatically create Paystack subaccount
      const subaccountResult = await this.createPaystackSubaccount(businessId);

      return {
        kycVerified: true,
        subaccount: subaccountResult,
        message: 'Business verified and subaccount created successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to verify KYC for business ${businessId}:`, error.message);
      throw error;
    }
  }

  /**
   * Reject business KYC with reason
   */
  async rejectBusinessKYC(businessId: string, reason: string, adminId?: string): Promise<any> {
    try {
      const business = await this.getById(businessId);

      const updateData: any = {
        'businessDocuments.kycStatus': 'rejected',
        'businessDocuments.rejectionReason': reason,
      };

      if (adminId) {
        updateData['businessDocuments.kycVerifiedBy'] = adminId;
      }

      await this.businessModel.findByIdAndUpdate(businessId, { $set: updateData });

      this.logger.log(`❌ KYC rejected for business: ${business.businessName}`);

      // TODO: Send notification to business owner about rejection
      // await this.notificationService.sendKYCRejectionNotification(business.ownerId, reason);

      return {
        kycRejected: true,
        reason,
        message: 'KYC verification rejected. Business owner will be notified.',
      };
    } catch (error) {
      this.logger.error(`Failed to reject KYC for business ${businessId}:`, error.message);
      throw error;
    }
  }

  /**
   * Get business subaccount details
   */
  async getSubaccountDetails(businessId: string): Promise<any> {
    const business = await this.getById(businessId);
    
    if (!business.paymentSettings?.paystackSubaccountCode) {
      throw new NotFoundException('Business does not have a Paystack subaccount');
    }

    const subaccountData = await this.paystackService.getSubaccount(
      business.paymentSettings.paystackSubaccountCode
    );

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

  // ==================== PUBLIC STOREFRONT ====================

  /**
   * Get complete storefront data for public booking widget
   * Returns business info, theme/branding, services, categories, staff, and layout configuration
   * This endpoint powers the entire booking widget UI with full customization
   */
  async getPublicStorefront(subdomain: string): Promise<any> {
    try {
      this.logger.log(`📦 Fetching storefront data for subdomain: ${subdomain}`);

      // 1. Get business data
      const business = await this.getBySubdomain(subdomain);
      if (!business) {
        throw new NotFoundException(`Business with subdomain '${subdomain}' not found`);
      }

      const businessId = business._id.toString();

      // 2. Fetch all data (using separate async calls to avoid complex type inference)
      let themeResult: any = { isDefault: true, theme: this.getDefaultTheme() };
      let categoriesResult: any = { success: false, data: [] };
      let servicesResult: any = { success: false, data: [] };
      let staffResult: any = [];

      try {
        themeResult = await this.brandingService.getTheme(businessId);
      } catch (err: any) {
        this.logger.warn(`Theme fetch failed: ${err.message}`);
      }

      try {
        categoriesResult = await this.serviceService.findAllCategories(undefined, businessId);
      } catch (err: any) {
        this.logger.warn(`Categories fetch failed: ${err.message}`);
      }

      try {
        servicesResult = await this.serviceService.findAllServices({} as any, businessId);
      } catch (err: any) {
        this.logger.warn(`Services fetch failed: ${err.message}`);
      }

      try {
        staffResult = await this.staffService.getStaffByBusiness(businessId, 'active');
      } catch (err: any) {
        this.logger.warn(`Staff fetch failed: ${err.message}`);
      }

      // 3. Format business info (exclude sensitive data)
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
        // Statistics for social proof
        stats: {
          totalReviews: business.totalReviews || 0,
          averageRating: business.averageRating || 0,
          totalClients: business.totalClients || 0,
        },
      };

      // 4. Format categories with full details
      const categories = (categoriesResult?.data || []).map((cat: any) => ({
        id: cat._id,
        categoryName: cat.categoryName,
        description: cat.description,
        icon: cat.icon,
        image: cat.image,
        displayOrder: cat.displayOrder || 0,
        appointmentColor: cat.appointmentColor,
        isActive: cat.isActive,
      }));

      // 5. Format services with FULL details for booking interface
      const services = (servicesResult?.data || [])
        .filter((svc: any) => svc.isActive)
        .map((svc: any) => {
          // Handle the nested structure from Service schema
          const basicDetails = svc.basicDetails || {};
          const pricingAndDuration = svc.pricingAndDuration || {};
          const teamMembers = svc.teamMembers || {};
          const settings = svc.settings || {};

          return {
            id: svc._id,
            // Basic details
            serviceName: basicDetails.serviceName || svc.serviceName,
            serviceType: basicDetails.serviceType || svc.serviceType,
            categoryId: basicDetails.category || svc.categoryId,
            description: basicDetails.description || svc.description,
            // Pricing
            priceType: pricingAndDuration.priceType || 'Fixed',
            price: pricingAndDuration.price || svc.price || { currency: 'NGN', amount: 0 },
            // Duration
            duration: pricingAndDuration.duration || svc.duration || {
              servicingTime: { value: 30, unit: 'min' },
              processingTime: { value: 0, unit: 'min' },
              totalDuration: '30 min',
            },
            extraTimeOptions: pricingAndDuration.extraTimeOptions,
            // Images
            images: svc.images || [],
            // Team/Staff assignment
            allTeamMembers: teamMembers.allTeamMembers || false,
            assignedStaffIds: (teamMembers.selectedMembers || [])
              .filter((m: any) => m.selected)
              .map((m: any) => m.id?.toString()),
            // Booking settings
            onlineBooking: {
              enabled: settings.onlineBooking?.enabled ?? true,
              availableFor: settings.onlineBooking?.availableFor || 'All clients',
            },
            // Variants (if any)
            variants: (svc.variants || []).map((v: any) => ({
              variantName: v.variantName,
              variantDescription: v.variantDescription,
              pricing: v.pricing,
            })),
            // Add-ons
            serviceAddOns: svc.serviceAddOns || [],
            isActive: svc.isActive,
          };
        });

      // 6. Format staff with FULL details for booking interface
      const staff = (staffResult || []).map((s: any) => ({
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
        // Services this staff can perform
        skills: (s.skills || []).filter((sk: any) => sk.isActive).map((sk: any) => ({
          serviceId: sk.serviceId?.toString(),
          serviceName: sk.serviceName,
          skillLevel: sk.skillLevel,
        })),
        serviceIds: (s.skills || []).filter((sk: any) => sk.isActive).map((sk: any) => sk.serviceId?.toString()),
        // Ratings
        rating: {
          average: s.totalReviews > 0 ? (s.totalRating / s.totalReviews).toFixed(1) : null,
          totalReviews: s.totalReviews || 0,
        },
        completedAppointments: s.completedAppointments || 0,
        certifications: s.certifications || [],
      }));

      // 7. Extract storefront layout configuration from theme
      const theme = themeResult.theme || {};
      const storefrontLayout = theme.storefront || this.getDefaultStorefrontLayout();
      const componentStyles = theme.componentStyles || this.getDefaultComponentStyles();

      this.logger.log(`✅ Storefront data fetched: ${categories.length} categories, ${services.length} services, ${staff.length} staff`);

      return {
        success: true,
        business: businessInfo,
        // Theme & Branding
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
        // Storefront Layout & Customization
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
          // Section Content (testimonials, FAQs, about, gallery images)
          content: storefrontLayout.content || { testimonials: [], faqs: [], about: {}, galleryImages: [] },
        },
        componentStyles,
        // Data
        categories,
        services,
        staff,
        message: 'Storefront data retrieved successfully',
      };
    } catch (error) {
      this.logger.error(`❌ Failed to fetch storefront: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get default theme for businesses without custom branding
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

  private getDefaultHeroSection() {
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

  private getDefaultSections() {
    return [
      { id: 'services', type: 'services', title: 'Our Services', enabled: true, order: 1 },
      { id: 'staff', type: 'staff', title: 'Meet Our Team', enabled: true, order: 2 },
      { id: 'gallery', type: 'gallery', title: 'Our Work', enabled: false, order: 3 },
      { id: 'testimonials', type: 'testimonials', title: 'What Our Clients Say', enabled: true, order: 4 },
      { id: 'about', type: 'about', title: 'About Us', enabled: true, order: 5 },
      { id: 'contact', type: 'contact', title: 'Contact Us', enabled: true, order: 6 },
    ];
  }

  private getDefaultStorefrontLayout() {
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

  private getDefaultComponentStyles() {
    return {
      buttons: { borderRadius: '8px', style: 'filled', size: 'medium', uppercase: false, fontWeight: '600' },
      cards: { borderRadius: '12px', shadow: true, shadowIntensity: 'medium', border: true, borderColor: '#E5E7EB' },
      inputBorderRadius: '8px',
      sectionSpacing: '24px',
      maxContentWidth: '1200px',
    };
  }

  private getDefaultBookingFlow() {
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
}