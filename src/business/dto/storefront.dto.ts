// src/business/dto/storefront.dto.ts
import { ApiProperty } from '@nestjs/swagger';

// ==================== THEME DTOs ====================

export class ThemeColorsDto {
  @ApiProperty() primary: string;
  @ApiProperty() secondary: string;
  @ApiProperty() accent: string;
  @ApiProperty() background: string;
  @ApiProperty() text: string;
  @ApiProperty() error: string;
  @ApiProperty() success: string;
  @ApiProperty({ required: false }) muted?: string;
  @ApiProperty({ required: false }) border?: string;
  @ApiProperty({ required: false }) cardBackground?: string;
  @ApiProperty({ required: false }) inputBackground?: string;
}

export class ThemeTypographyDto {
  @ApiProperty() fontFamily: string;
  @ApiProperty() headingFont: string;
  @ApiProperty() bodyFont: string;
  @ApiProperty({ required: false }) fontSize?: Record<string, string>;
  @ApiProperty({ required: false }) fontWeight?: Record<string, string>;
  @ApiProperty({ required: false }) lineHeight?: Record<string, string>;
}

export class ThemeLogoDto {
  @ApiProperty() url: string;
  @ApiProperty() width: number;
  @ApiProperty() height: number;
  @ApiProperty() alt: string;
}

export class ThemeSeoDto {
  @ApiProperty({ required: false }) title?: string;
  @ApiProperty({ required: false }) description?: string;
  @ApiProperty({ required: false, type: [String] }) keywords?: string[];
  @ApiProperty({ required: false }) ogImage?: string;
}

export class NavbarMenuItemDto {
  @ApiProperty() label: string;
  @ApiProperty({ required: false }) sectionId?: string;
  @ApiProperty({ required: false }) url?: string;
}

export class NavbarDto {
  @ApiProperty() style: string;
  @ApiProperty() showLogo: boolean;
  @ApiProperty() showBusinessName: boolean;
  @ApiProperty() showBookButton: boolean;
  @ApiProperty() bookButtonText: string;
  @ApiProperty({ type: [NavbarMenuItemDto], required: false }) menuItems?: NavbarMenuItemDto[];
}

export class FooterLinkDto {
  @ApiProperty() label: string;
  @ApiProperty() url: string;
  @ApiProperty() openInNewTab: boolean;
}

export class FooterDto {
  @ApiProperty() enabled: boolean;
  @ApiProperty() showSocialLinks: boolean;
  @ApiProperty() showQuickLinks: boolean;
  @ApiProperty() showContactInfo: boolean;
  @ApiProperty() showNewsletter: boolean;
  @ApiProperty({ required: false }) copyrightText?: string;
  @ApiProperty({ type: [FooterLinkDto], required: false }) customLinks?: FooterLinkDto[];
}

export class StorefrontThemeDto {
  @ApiProperty({ type: ThemeColorsDto }) colors: ThemeColorsDto;
  @ApiProperty({ type: ThemeTypographyDto }) typography: ThemeTypographyDto;
  @ApiProperty({ type: ThemeLogoDto, required: false }) logo?: ThemeLogoDto;
  @ApiProperty({ required: false }) favicon?: { url: string };
  @ApiProperty({ required: false }) customCss?: { enabled: boolean; cssCode: string };
  @ApiProperty({ type: ThemeSeoDto, required: false }) seo?: ThemeSeoDto;
  @ApiProperty({ type: NavbarDto, required: false }) navbar?: NavbarDto;
  @ApiProperty({ type: FooterDto, required: false }) footer?: FooterDto;
}

// ==================== LAYOUT DTOs ====================

export class HeroSectionDto {
  @ApiProperty() enabled: boolean;
  @ApiProperty({ description: 'image, video, slideshow, or gradient' }) type: string;
  @ApiProperty({ required: false }) coverImage?: string;
  @ApiProperty({ type: [String], required: false }) slideshowImages?: string[];
  @ApiProperty({ required: false }) videoUrl?: string;
  @ApiProperty({ required: false }) gradient?: { from: string; to: string; direction: string };
  @ApiProperty({ required: false }) headline?: string;
  @ApiProperty({ required: false }) subheadline?: string;
  @ApiProperty() textAlignment: string;
  @ApiProperty() overlayStyle: string;
  @ApiProperty() overlayOpacity: number;
  @ApiProperty() height: string;
  @ApiProperty() showBookButton: boolean;
  @ApiProperty() bookButtonText: string;
}

export class StorefrontSectionDto {
  @ApiProperty() id: string;
  @ApiProperty() type: string;
  @ApiProperty() title: string;
  @ApiProperty({ required: false }) subtitle?: string;
  @ApiProperty() enabled: boolean;
  @ApiProperty() order: number;
  @ApiProperty({ required: false }) settings?: Record<string, any>;
}

export class ServiceDisplaySettingsDto {
  @ApiProperty() layout: string;
  @ApiProperty() columns: number;
  @ApiProperty() showPrices: boolean;
  @ApiProperty() showDuration: boolean;
  @ApiProperty() showDescription: boolean;
  @ApiProperty() showImages: boolean;
  @ApiProperty() groupByCategory: boolean;
  @ApiProperty({ required: false }) showFilters?: boolean;
}

export class StaffDisplaySettingsDto {
  @ApiProperty() layout: string;
  @ApiProperty() columns: number;
  @ApiProperty() showBio: boolean;
  @ApiProperty() showSpecialties: boolean;
  @ApiProperty() showRatings: boolean;
  @ApiProperty({ required: false }) showBookButton?: boolean;
}

export class GallerySettingsDto {
  @ApiProperty() enabled: boolean;
  @ApiProperty({ type: [String] }) images: string[];
  @ApiProperty() layout: string;
  @ApiProperty() columns: number;
}

export class TestimonialsSettingsDto {
  @ApiProperty() enabled: boolean;
  @ApiProperty() showRating: boolean;
  @ApiProperty() layout: string;
  @ApiProperty() maxToShow: number;
}

export class ContactDisplaySettingsDto {
  @ApiProperty() showMap: boolean;
  @ApiProperty() showAddress: boolean;
  @ApiProperty() showPhone: boolean;
  @ApiProperty() showEmail: boolean;
  @ApiProperty() showSocialLinks: boolean;
  @ApiProperty() showBusinessHours: boolean;
}

export class BookingFlowSettingsDto {
  @ApiProperty({ description: 'service-first, staff-first, or date-first' }) flow: string;
  @ApiProperty() allowGuestBooking: boolean;
  @ApiProperty() showStaffSelection: boolean;
  @ApiProperty() requireStaffSelection: boolean;
  @ApiProperty() showServiceImages: boolean;
  @ApiProperty() allowMultipleServices: boolean;
  @ApiProperty() datePickerStyle: string;
  @ApiProperty() showAvailableSlots: boolean;
  @ApiProperty() slotDuration: number;
  @ApiProperty() advanceBookingDays: number;
  @ApiProperty() minAdvanceHours: number;
}

export class SocialProofSettingsDto {
  @ApiProperty() showReviewCount: boolean;
  @ApiProperty() showAverageRating: boolean;
  @ApiProperty() showTotalBookings: boolean;
  @ApiProperty({ required: false }) showTrustBadges?: boolean;
  @ApiProperty({ type: [String], required: false }) badges?: string[];
}

export class StorefrontLayoutDto {
  @ApiProperty({ type: HeroSectionDto }) hero: HeroSectionDto;
  @ApiProperty({ type: [StorefrontSectionDto] }) sections: StorefrontSectionDto[];
  @ApiProperty({ type: ServiceDisplaySettingsDto }) serviceDisplay: ServiceDisplaySettingsDto;
  @ApiProperty({ type: StaffDisplaySettingsDto }) staffDisplay: StaffDisplaySettingsDto;
  @ApiProperty({ type: GallerySettingsDto }) gallery: GallerySettingsDto;
  @ApiProperty({ type: TestimonialsSettingsDto }) testimonials: TestimonialsSettingsDto;
  @ApiProperty({ type: ContactDisplaySettingsDto }) contact: ContactDisplaySettingsDto;
  @ApiProperty({ type: BookingFlowSettingsDto }) bookingFlow: BookingFlowSettingsDto;
  @ApiProperty({ type: SocialProofSettingsDto }) socialProof: SocialProofSettingsDto;
}

// ==================== COMPONENT STYLES DTOs ====================

export class ButtonStylesDto {
  @ApiProperty() borderRadius: string;
  @ApiProperty() style: string;
  @ApiProperty() size: string;
  @ApiProperty() uppercase: boolean;
  @ApiProperty() fontWeight: string;
}

export class CardStylesDto {
  @ApiProperty() borderRadius: string;
  @ApiProperty() shadow: boolean;
  @ApiProperty() shadowIntensity: string;
  @ApiProperty() border: boolean;
  @ApiProperty() borderColor: string;
}

export class ComponentStylesDto {
  @ApiProperty({ type: ButtonStylesDto }) buttons: ButtonStylesDto;
  @ApiProperty({ type: CardStylesDto }) cards: CardStylesDto;
  @ApiProperty() inputBorderRadius: string;
  @ApiProperty() sectionSpacing: string;
  @ApiProperty() maxContentWidth: string;
}

// ==================== BUSINESS INFO DTOs ====================

export class BusinessStatsDto {
  @ApiProperty() totalReviews: number;
  @ApiProperty() averageRating: number;
  @ApiProperty() totalClients: number;
}

export class BusinessAddressDto {
  @ApiProperty() street: string;
  @ApiProperty() city: string;
  @ApiProperty() state: string;
  @ApiProperty() country: string;
  @ApiProperty({ required: false }) postalCode?: string;
  @ApiProperty({ required: false }) latitude?: number;
  @ApiProperty({ required: false }) longitude?: number;
}

export class SocialMediaDto {
  @ApiProperty({ required: false }) facebook?: string;
  @ApiProperty({ required: false }) instagram?: string;
  @ApiProperty({ required: false }) twitter?: string;
  @ApiProperty({ required: false }) tiktok?: string;
}

export class BusinessContactDto {
  @ApiProperty() primaryPhone: string;
  @ApiProperty({ required: false }) secondaryPhone?: string;
  @ApiProperty() email: string;
  @ApiProperty({ required: false }) website?: string;
  @ApiProperty({ type: SocialMediaDto, required: false }) socialMedia?: SocialMediaDto;
}

export class BusinessSettingsDto {
  @ApiProperty() timezone: string;
  @ApiProperty() currency: string;
  @ApiProperty() language: string;
  @ApiProperty() defaultAppointmentDuration: number;
  @ApiProperty() bufferTimeBetweenAppointments: number;
  @ApiProperty() cancellationPolicyHours: number;
  @ApiProperty() advanceBookingDays: number;
  @ApiProperty() allowOnlineBooking: boolean;
  @ApiProperty() taxRate: number;
  @ApiProperty() serviceCharge: number;
}

export class BusinessHoursBreakDto {
  @ApiProperty() openTime: string;
  @ApiProperty() closeTime: string;
}

export class BusinessHoursDto {
  @ApiProperty() day: string;
  @ApiProperty() isOpen: boolean;
  @ApiProperty({ required: false }) openTime?: string;
  @ApiProperty({ required: false }) closeTime?: string;
  @ApiProperty({ type: [BusinessHoursBreakDto], required: false }) breaks?: BusinessHoursBreakDto[];
}

export class StorefrontBusinessInfoDto {
  @ApiProperty() id: string;
  @ApiProperty() businessName: string;
  @ApiProperty() subdomain: string;
  @ApiProperty({ required: false }) businessDescription?: string;
  @ApiProperty() businessType: string;
  @ApiProperty({ required: false }) logo?: string;
  @ApiProperty({ type: [String] }) images: string[];
  @ApiProperty({ type: BusinessAddressDto }) address: BusinessAddressDto;
  @ApiProperty({ type: BusinessContactDto }) contact: BusinessContactDto;
  @ApiProperty({ type: BusinessSettingsDto }) settings: BusinessSettingsDto;
  @ApiProperty({ type: [BusinessHoursDto] }) businessHours: BusinessHoursDto[];
  @ApiProperty({ type: BusinessStatsDto }) stats: BusinessStatsDto;
}

// ==================== CATEGORY DTO ====================

export class StorefrontServiceCategoryDto {
  @ApiProperty() id: string;
  @ApiProperty() categoryName: string;
  @ApiProperty({ required: false }) description?: string;
  @ApiProperty({ required: false }) icon?: string;
  @ApiProperty({ required: false }) image?: string;
  @ApiProperty() displayOrder: number;
  @ApiProperty() appointmentColor: string;
  @ApiProperty() isActive: boolean;
}

// ==================== SERVICE DTOs ====================

export class ServicePriceDto {
  @ApiProperty() currency: string;
  @ApiProperty() amount: number;
  @ApiProperty({ required: false }) minimumAmount?: number;
}

export class ServiceDurationDto {
  @ApiProperty() servicingTime: { value: number; unit: string };
  @ApiProperty() processingTime: { value: number; unit: string };
  @ApiProperty() totalDuration: string;
}

export class ServiceVariantDto {
  @ApiProperty() variantName: string;
  @ApiProperty() variantDescription: string;
  @ApiProperty() pricing: {
    priceType: string;
    price: ServicePriceDto;
    duration: { value: number; unit: string };
  };
}

export class ServiceOnlineBookingDto {
  @ApiProperty() enabled: boolean;
  @ApiProperty() availableFor: string;
}

export class StorefrontServiceDto {
  @ApiProperty() id: string;
  @ApiProperty() serviceName: string;
  @ApiProperty({ required: false }) serviceType?: string;
  @ApiProperty() categoryId: string;
  @ApiProperty({ required: false }) description?: string;
  @ApiProperty() priceType: string;
  @ApiProperty({ type: ServicePriceDto }) price: ServicePriceDto;
  @ApiProperty({ type: ServiceDurationDto }) duration: ServiceDurationDto;
  @ApiProperty({ required: false }) extraTimeOptions?: Record<string, any>;
  @ApiProperty({ type: [String] }) images: string[];
  @ApiProperty() allTeamMembers: boolean;
  @ApiProperty({ type: [String] }) assignedStaffIds: string[];
  @ApiProperty({ type: ServiceOnlineBookingDto }) onlineBooking: ServiceOnlineBookingDto;
  @ApiProperty({ type: [ServiceVariantDto], required: false }) variants?: ServiceVariantDto[];
  @ApiProperty({ type: [String], required: false }) serviceAddOns?: string[];
  @ApiProperty() isActive: boolean;
}

// ==================== STAFF DTOs ====================

export class StaffSkillDto {
  @ApiProperty() serviceId: string;
  @ApiProperty() serviceName: string;
  @ApiProperty() skillLevel: string;
}

export class StaffRatingDto {
  @ApiProperty({ required: false }) average?: string;
  @ApiProperty() totalReviews: number;
}

export class StorefrontStaffDto {
  @ApiProperty() id: string;
  @ApiProperty() staffId: string;
  @ApiProperty() firstName: string;
  @ApiProperty() lastName: string;
  @ApiProperty({ required: false }) email?: string;
  @ApiProperty({ required: false }) phone?: string;
  @ApiProperty({ required: false }) profileImage?: string;
  @ApiProperty({ required: false }) bio?: string;
  @ApiProperty({ required: false }) title?: string;
  @ApiProperty({ required: false }) role?: string;
  @ApiProperty({ required: false }) employmentType?: string;
  @ApiProperty() status: string;
  @ApiProperty({ type: [StaffSkillDto] }) skills: StaffSkillDto[];
  @ApiProperty({ type: [String] }) serviceIds: string[];
  @ApiProperty({ type: StaffRatingDto }) rating: StaffRatingDto;
  @ApiProperty() completedAppointments: number;
  @ApiProperty({ type: [String] }) certifications: string[];
}

// ==================== MAIN RESPONSE DTO ====================

export class StorefrontResponseDto {
  @ApiProperty() success: boolean;

  @ApiProperty({ type: StorefrontBusinessInfoDto }) 
  business: StorefrontBusinessInfoDto;

  @ApiProperty({ type: StorefrontThemeDto }) 
  theme: StorefrontThemeDto;

  @ApiProperty() 
  isDefaultTheme: boolean;

  @ApiProperty({ type: StorefrontLayoutDto }) 
  layout: StorefrontLayoutDto;

  @ApiProperty({ type: ComponentStylesDto }) 
  componentStyles: ComponentStylesDto;

  @ApiProperty({ type: [StorefrontServiceCategoryDto] }) 
  categories: StorefrontServiceCategoryDto[];

  @ApiProperty({ type: [StorefrontServiceDto] }) 
  services: StorefrontServiceDto[];

  @ApiProperty({ type: [StorefrontStaffDto] }) 
  staff: StorefrontStaffDto[];

  @ApiProperty() 
  message: string;
}
