export declare class ThemeColorsDto {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    error: string;
    success: string;
    muted?: string;
    border?: string;
    cardBackground?: string;
    inputBackground?: string;
}
export declare class ThemeTypographyDto {
    fontFamily: string;
    headingFont: string;
    bodyFont: string;
    fontSize?: Record<string, string>;
    fontWeight?: Record<string, string>;
    lineHeight?: Record<string, string>;
}
export declare class ThemeLogoDto {
    url: string;
    width: number;
    height: number;
    alt: string;
}
export declare class ThemeSeoDto {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
}
export declare class NavbarMenuItemDto {
    label: string;
    sectionId?: string;
    url?: string;
}
export declare class NavbarDto {
    style: string;
    showLogo: boolean;
    showBusinessName: boolean;
    showBookButton: boolean;
    bookButtonText: string;
    menuItems?: NavbarMenuItemDto[];
}
export declare class FooterLinkDto {
    label: string;
    url: string;
    openInNewTab: boolean;
}
export declare class FooterDto {
    enabled: boolean;
    showSocialLinks: boolean;
    showQuickLinks: boolean;
    showContactInfo: boolean;
    showNewsletter: boolean;
    copyrightText?: string;
    customLinks?: FooterLinkDto[];
}
export declare class StorefrontThemeDto {
    colors: ThemeColorsDto;
    typography: ThemeTypographyDto;
    logo?: ThemeLogoDto;
    favicon?: {
        url: string;
    };
    customCss?: {
        enabled: boolean;
        cssCode: string;
    };
    seo?: ThemeSeoDto;
    navbar?: NavbarDto;
    footer?: FooterDto;
}
export declare class HeroSectionDto {
    enabled: boolean;
    type: string;
    coverImage?: string;
    slideshowImages?: string[];
    videoUrl?: string;
    gradient?: {
        from: string;
        to: string;
        direction: string;
    };
    headline?: string;
    subheadline?: string;
    textAlignment: string;
    overlayStyle: string;
    overlayOpacity: number;
    height: string;
    showBookButton: boolean;
    bookButtonText: string;
}
export declare class StorefrontSectionDto {
    id: string;
    type: string;
    title: string;
    subtitle?: string;
    enabled: boolean;
    order: number;
    settings?: Record<string, any>;
}
export declare class ServiceDisplaySettingsDto {
    layout: string;
    columns: number;
    showPrices: boolean;
    showDuration: boolean;
    showDescription: boolean;
    showImages: boolean;
    groupByCategory: boolean;
    showFilters?: boolean;
}
export declare class StaffDisplaySettingsDto {
    layout: string;
    columns: number;
    showBio: boolean;
    showSpecialties: boolean;
    showRatings: boolean;
    showBookButton?: boolean;
}
export declare class GallerySettingsDto {
    enabled: boolean;
    images: string[];
    layout: string;
    columns: number;
}
export declare class TestimonialsSettingsDto {
    enabled: boolean;
    showRating: boolean;
    layout: string;
    maxToShow: number;
}
export declare class ContactDisplaySettingsDto {
    showMap: boolean;
    showAddress: boolean;
    showPhone: boolean;
    showEmail: boolean;
    showSocialLinks: boolean;
    showBusinessHours: boolean;
}
export declare class BookingFlowSettingsDto {
    flow: string;
    allowGuestBooking: boolean;
    showStaffSelection: boolean;
    requireStaffSelection: boolean;
    showServiceImages: boolean;
    allowMultipleServices: boolean;
    datePickerStyle: string;
    showAvailableSlots: boolean;
    slotDuration: number;
    advanceBookingDays: number;
    minAdvanceHours: number;
}
export declare class SocialProofSettingsDto {
    showReviewCount: boolean;
    showAverageRating: boolean;
    showTotalBookings: boolean;
    showTrustBadges?: boolean;
    badges?: string[];
}
export declare class StorefrontLayoutDto {
    hero: HeroSectionDto;
    sections: StorefrontSectionDto[];
    serviceDisplay: ServiceDisplaySettingsDto;
    staffDisplay: StaffDisplaySettingsDto;
    gallery: GallerySettingsDto;
    testimonials: TestimonialsSettingsDto;
    contact: ContactDisplaySettingsDto;
    bookingFlow: BookingFlowSettingsDto;
    socialProof: SocialProofSettingsDto;
}
export declare class ButtonStylesDto {
    borderRadius: string;
    style: string;
    size: string;
    uppercase: boolean;
    fontWeight: string;
}
export declare class CardStylesDto {
    borderRadius: string;
    shadow: boolean;
    shadowIntensity: string;
    border: boolean;
    borderColor: string;
}
export declare class ComponentStylesDto {
    buttons: ButtonStylesDto;
    cards: CardStylesDto;
    inputBorderRadius: string;
    sectionSpacing: string;
    maxContentWidth: string;
}
export declare class BusinessStatsDto {
    totalReviews: number;
    averageRating: number;
    totalClients: number;
}
export declare class BusinessAddressDto {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
}
export declare class SocialMediaDto {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
}
export declare class BusinessContactDto {
    primaryPhone: string;
    secondaryPhone?: string;
    email: string;
    website?: string;
    socialMedia?: SocialMediaDto;
}
export declare class BusinessSettingsDto {
    timezone: string;
    currency: string;
    language: string;
    defaultAppointmentDuration: number;
    bufferTimeBetweenAppointments: number;
    cancellationPolicyHours: number;
    advanceBookingDays: number;
    allowOnlineBooking: boolean;
    taxRate: number;
    serviceCharge: number;
}
export declare class BusinessHoursBreakDto {
    openTime: string;
    closeTime: string;
}
export declare class BusinessHoursDto {
    day: string;
    isOpen: boolean;
    openTime?: string;
    closeTime?: string;
    breaks?: BusinessHoursBreakDto[];
}
export declare class StorefrontBusinessInfoDto {
    id: string;
    businessName: string;
    subdomain: string;
    businessDescription?: string;
    businessType: string;
    logo?: string;
    images: string[];
    address: BusinessAddressDto;
    contact: BusinessContactDto;
    settings: BusinessSettingsDto;
    businessHours: BusinessHoursDto[];
    stats: BusinessStatsDto;
}
export declare class StorefrontServiceCategoryDto {
    id: string;
    categoryName: string;
    description?: string;
    icon?: string;
    image?: string;
    displayOrder: number;
    appointmentColor: string;
    isActive: boolean;
}
export declare class ServicePriceDto {
    currency: string;
    amount: number;
    minimumAmount?: number;
}
export declare class ServiceDurationDto {
    servicingTime: {
        value: number;
        unit: string;
    };
    processingTime: {
        value: number;
        unit: string;
    };
    totalDuration: string;
}
export declare class ServiceVariantDto {
    variantName: string;
    variantDescription: string;
    pricing: {
        priceType: string;
        price: ServicePriceDto;
        duration: {
            value: number;
            unit: string;
        };
    };
}
export declare class ServiceOnlineBookingDto {
    enabled: boolean;
    availableFor: string;
}
export declare class StorefrontServiceDto {
    id: string;
    serviceName: string;
    serviceType?: string;
    categoryId: string;
    description?: string;
    priceType: string;
    price: ServicePriceDto;
    duration: ServiceDurationDto;
    extraTimeOptions?: Record<string, any>;
    images: string[];
    allTeamMembers: boolean;
    assignedStaffIds: string[];
    onlineBooking: ServiceOnlineBookingDto;
    variants?: ServiceVariantDto[];
    serviceAddOns?: string[];
    isActive: boolean;
}
export declare class StaffSkillDto {
    serviceId: string;
    serviceName: string;
    skillLevel: string;
}
export declare class StaffRatingDto {
    average?: string;
    totalReviews: number;
}
export declare class StorefrontStaffDto {
    id: string;
    staffId: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    profileImage?: string;
    bio?: string;
    title?: string;
    role?: string;
    employmentType?: string;
    status: string;
    skills: StaffSkillDto[];
    serviceIds: string[];
    rating: StaffRatingDto;
    completedAppointments: number;
    certifications: string[];
}
export declare class StorefrontResponseDto {
    success: boolean;
    business: StorefrontBusinessInfoDto;
    theme: StorefrontThemeDto;
    isDefaultTheme: boolean;
    layout: StorefrontLayoutDto;
    componentStyles: ComponentStylesDto;
    categories: StorefrontServiceCategoryDto[];
    services: StorefrontServiceDto[];
    staff: StorefrontStaffDto[];
    message: string;
}
