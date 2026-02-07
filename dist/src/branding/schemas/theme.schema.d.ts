/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { Document, Types } from 'mongoose';
export type ThemeDocument = Theme & Document;
export declare class HeroSection {
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
    textAlignment?: string;
    overlayStyle?: string;
    overlayOpacity?: number;
    height?: string;
    showBookButton?: boolean;
    bookButtonText?: string;
}
export declare class StorefrontSection {
    id: string;
    type: string;
    title: string;
    subtitle?: string;
    enabled: boolean;
    order: number;
    settings: Record<string, any>;
}
export declare class GallerySettings {
    enabled: boolean;
    images: string[];
    layout: string;
    columns: number;
}
export declare class TestimonialsSettings {
    enabled: boolean;
    showRating: boolean;
    layout: string;
    maxToShow: number;
}
export declare class TestimonialItem {
    id: string;
    clientName: string;
    clientPhoto?: string;
    clientTitle?: string;
    content: string;
    rating: number;
    date?: string;
    serviceName?: string;
    isVisible: boolean;
    order: number;
}
export declare class FAQItem {
    id: string;
    question: string;
    answer: string;
    category?: string;
    isVisible: boolean;
    order: number;
}
export declare class AboutContent {
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
    showTeamStats: boolean;
}
export declare class GalleryImage {
    id: string;
    url: string;
    thumbnail?: string;
    caption?: string;
    category?: string;
    serviceName?: string;
    isVisible: boolean;
    order: number;
}
export declare class StorefrontContent {
    testimonials: TestimonialItem[];
    faqs: FAQItem[];
    about: AboutContent;
    galleryImages: GalleryImage[];
}
export declare class ServiceDisplaySettings {
    layout: string;
    columns: number;
    showPrices: boolean;
    showDuration: boolean;
    showDescription: boolean;
    showImages: boolean;
    groupByCategory: boolean;
    showFilters: boolean;
}
export declare class StaffDisplaySettings {
    layout: string;
    columns: number;
    showBio: boolean;
    showSpecialties: boolean;
    showRatings: boolean;
    showBookButton: boolean;
}
export declare class ContactDisplaySettings {
    showMap: boolean;
    showAddress: boolean;
    showPhone: boolean;
    showEmail: boolean;
    showSocialLinks: boolean;
    showBusinessHours: boolean;
}
export declare class BookingFlowSettings {
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
export declare class SocialProof {
    showReviewCount: boolean;
    showAverageRating: boolean;
    showTotalBookings: boolean;
    showTrustBadges: boolean;
    badges: string[];
}
export declare class StorefrontLayout {
    hero: HeroSection;
    sections: StorefrontSection[];
    serviceDisplay: ServiceDisplaySettings;
    staffDisplay: StaffDisplaySettings;
    gallery: GallerySettings;
    testimonials: TestimonialsSettings;
    contact: ContactDisplaySettings;
    bookingFlow: BookingFlowSettings;
    socialProof: SocialProof;
    content: StorefrontContent;
}
export declare class ButtonStyles {
    borderRadius: string;
    style: string;
    size: string;
    uppercase: boolean;
    fontWeight: string;
}
export declare class CardStyles {
    borderRadius: string;
    shadow: boolean;
    shadowIntensity: string;
    border: boolean;
    borderColor: string;
}
export declare class ComponentStyles {
    buttons: ButtonStyles;
    cards: CardStyles;
    inputBorderRadius: string;
    sectionSpacing: string;
    maxContentWidth: string;
}
export declare class Theme {
    tenantId: Types.ObjectId;
    colors: {
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
    };
    typography: {
        fontFamily: string;
        headingFont: string;
        bodyFont: string;
        fontSize?: Record<string, string>;
        fontWeight?: Record<string, string>;
        lineHeight?: Record<string, string>;
    };
    logo?: {
        url: string;
        width: number;
        height: number;
        alt: string;
    };
    favicon?: {
        url: string;
    };
    customCss: {
        enabled: boolean;
        cssCode: string;
    };
    storefront: StorefrontLayout;
    componentStyles: ComponentStyles;
    seo?: {
        title?: string;
        description?: string;
        keywords?: string[];
        ogImage?: string;
    };
    footer?: {
        enabled: boolean;
        showSocialLinks: boolean;
        showQuickLinks: boolean;
        showContactInfo: boolean;
        showNewsletter: boolean;
        copyrightText?: string;
        customLinks?: Array<{
            label: string;
            url: string;
            openInNewTab: boolean;
        }>;
    };
    navbar?: {
        style: string;
        showLogo: boolean;
        showBusinessName: boolean;
        showBookButton: boolean;
        bookButtonText: string;
        menuItems?: Array<{
            label: string;
            sectionId?: string;
            url?: string;
        }>;
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const ThemeSchema: import("mongoose").Schema<Theme, import("mongoose").Model<Theme, any, any, any, Document<unknown, any, Theme, any, {}> & Theme & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Theme, Document<unknown, {}, import("mongoose").FlatRecord<Theme>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Theme> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
