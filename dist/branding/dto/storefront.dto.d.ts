declare class GradientDto {
    from: string;
    to: string;
    direction?: string;
}
export declare class UpdateHeroSectionDto {
    enabled?: boolean;
    type?: string;
    coverImage?: string;
    slideshowImages?: string[];
    videoUrl?: string;
    gradient?: GradientDto;
    headline?: string;
    subheadline?: string;
    textAlignment?: string;
    overlayStyle?: string;
    overlayOpacity?: number;
    height?: string;
    showBookButton?: boolean;
    bookButtonText?: string;
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
export declare class UpdateServiceDisplayDto {
    layout?: string;
    columns?: number;
    showPrices?: boolean;
    showDuration?: boolean;
    showDescription?: boolean;
    showImages?: boolean;
    groupByCategory?: boolean;
    showFilters?: boolean;
}
export declare class UpdateStaffDisplayDto {
    layout?: string;
    columns?: number;
    showBio?: boolean;
    showSpecialties?: boolean;
    showRatings?: boolean;
    showBookButton?: boolean;
}
export declare class UpdateGallerySettingsDto {
    enabled?: boolean;
    images?: string[];
    layout?: string;
    columns?: number;
}
export declare class UpdateTestimonialsSettingsDto {
    enabled?: boolean;
    showRating?: boolean;
    layout?: string;
    maxToShow?: number;
}
export declare class UpdateContactDisplayDto {
    showMap?: boolean;
    showAddress?: boolean;
    showPhone?: boolean;
    showEmail?: boolean;
    showSocialLinks?: boolean;
    showBusinessHours?: boolean;
}
export declare class UpdateBookingFlowDto {
    flow?: string;
    allowGuestBooking?: boolean;
    showStaffSelection?: boolean;
    requireStaffSelection?: boolean;
    showServiceImages?: boolean;
    allowMultipleServices?: boolean;
    datePickerStyle?: string;
    showAvailableSlots?: boolean;
    slotDuration?: number;
    advanceBookingDays?: number;
    minAdvanceHours?: number;
}
export declare class UpdateSocialProofDto {
    showReviewCount?: boolean;
    showAverageRating?: boolean;
    showTotalBookings?: boolean;
    showTrustBadges?: boolean;
    badges?: string[];
}
export declare class UpdateButtonStylesDto {
    borderRadius?: string;
    style?: string;
    size?: string;
    uppercase?: boolean;
    fontWeight?: string;
}
export declare class UpdateCardStylesDto {
    borderRadius?: string;
    shadow?: boolean;
    shadowIntensity?: string;
    border?: boolean;
    borderColor?: string;
}
export declare class UpdateComponentStylesDto {
    buttons?: UpdateButtonStylesDto;
    cards?: UpdateCardStylesDto;
    inputBorderRadius?: string;
    sectionSpacing?: string;
    maxContentWidth?: string;
}
export declare class NavbarMenuItemDto {
    label: string;
    sectionId?: string;
    url?: string;
}
export declare class UpdateNavbarDto {
    style?: string;
    showLogo?: boolean;
    showBusinessName?: boolean;
    showBookButton?: boolean;
    bookButtonText?: string;
    menuItems?: NavbarMenuItemDto[];
}
export declare class FooterLinkDto {
    label: string;
    url: string;
    openInNewTab?: boolean;
}
export declare class UpdateFooterDto {
    enabled?: boolean;
    showSocialLinks?: boolean;
    showQuickLinks?: boolean;
    showContactInfo?: boolean;
    showNewsletter?: boolean;
    copyrightText?: string;
    customLinks?: FooterLinkDto[];
}
export declare class UpdateSeoDto {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
}
export declare class UpdateStorefrontLayoutDto {
    hero?: UpdateHeroSectionDto;
    sections?: StorefrontSectionDto[];
    serviceDisplay?: UpdateServiceDisplayDto;
    staffDisplay?: UpdateStaffDisplayDto;
    gallery?: UpdateGallerySettingsDto;
    testimonials?: UpdateTestimonialsSettingsDto;
    contact?: UpdateContactDisplayDto;
    bookingFlow?: UpdateBookingFlowDto;
    socialProof?: UpdateSocialProofDto;
}
export declare class UpdateFullStorefrontDto {
    storefront?: UpdateStorefrontLayoutDto;
    componentStyles?: UpdateComponentStylesDto;
    navbar?: UpdateNavbarDto;
    footer?: UpdateFooterDto;
    seo?: UpdateSeoDto;
}
export declare class TestimonialItemDto {
    id: string;
    clientName: string;
    clientPhoto?: string;
    clientTitle?: string;
    content: string;
    rating: number;
    date?: string;
    serviceName?: string;
    isVisible?: boolean;
    order?: number;
}
export declare class FAQItemDto {
    id: string;
    question: string;
    answer: string;
    category?: string;
    isVisible?: boolean;
    order?: number;
}
export declare class AboutContentDto {
    title?: string;
    subtitle?: string;
    description?: string;
    image?: string;
    imagePosition?: string;
    highlights?: string[];
    founderName?: string;
    founderPhoto?: string;
    founderTitle?: string;
    founderQuote?: string;
    showTeamStats?: boolean;
}
export declare class GalleryImageDto {
    id: string;
    url: string;
    thumbnail?: string;
    caption?: string;
    category?: string;
    serviceName?: string;
    isVisible?: boolean;
    order?: number;
}
export declare class UpdateTestimonialsContentDto {
    testimonials: TestimonialItemDto[];
}
export declare class AddTestimonialDto {
    clientName: string;
    clientPhoto?: string;
    clientTitle?: string;
    content: string;
    rating: number;
    serviceName?: string;
}
export declare class UpdateFAQsContentDto {
    faqs: FAQItemDto[];
}
export declare class AddFAQDto {
    question: string;
    answer: string;
    category?: string;
}
export declare class UpdateAboutContentDto extends AboutContentDto {
}
export declare class UpdateGalleryContentDto {
    images: GalleryImageDto[];
}
export declare class AddGalleryImageDto {
    url: string;
    caption?: string;
    category?: string;
    serviceName?: string;
}
export declare class ImportFAQsFromChatDto {
    replaceExisting?: boolean;
}
export {};
