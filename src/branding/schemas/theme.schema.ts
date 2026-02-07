
// export const ThemeSchema = SchemaFactory.createForClass(Theme)

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ThemeDocument = Theme & Document;

// ==================== STOREFRONT LAYOUT SCHEMAS ====================

@Schema({ _id: false })
export class HeroSection {
  @Prop({ default: true })
  enabled: boolean;

  @Prop({ enum: ['image', 'video', 'slideshow', 'gradient'], default: 'image' })
  type: string;

  @Prop()
  coverImage?: string; // Main hero/cover image URL

  @Prop({ type: [String], default: [] })
  slideshowImages?: string[]; // Multiple images for slideshow

  @Prop()
  videoUrl?: string; // Video URL for video hero

  @Prop({
    type: {
      from: String,
      to: String,
      direction: { type: String, default: 'to-right' }
    }
  })
  gradient?: {
    from: string;
    to: string;
    direction: string;
  };

  @Prop()
  headline?: string; // Custom headline text

  @Prop()
  subheadline?: string; // Custom subheadline

  @Prop({ default: 'center' })
  textAlignment?: string; // left, center, right

  @Prop({ default: 'light' })
  overlayStyle?: string; // light, dark, none

  @Prop({ default: 0.4 })
  overlayOpacity?: number;

  @Prop({ default: '500px' })
  height?: string; // Hero section height

  @Prop({ default: true })
  showBookButton?: boolean;

  @Prop({ default: 'Book Now' })
  bookButtonText?: string;
}

@Schema({ _id: false })
export class StorefrontSection {
  @Prop({ required: true })
  id: string; // Unique section identifier

  @Prop({ required: true })
  type: string; // services, staff, gallery, testimonials, about, contact, map, hours, faq, custom

  @Prop({ required: true })
  title: string;

  @Prop()
  subtitle?: string;

  @Prop({ default: true })
  enabled: boolean;

  @Prop({ default: 0 })
  order: number; // Display order for drag-and-drop

  @Prop({ type: Object, default: {} })
  settings: Record<string, any>; // Section-specific settings (columns, layout, etc.)
}

@Schema({ _id: false })
export class GallerySettings {
  @Prop({ default: true })
  enabled: boolean;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: 'grid' })
  layout: string; // grid, masonry, carousel

  @Prop({ default: 3 })
  columns: number;
}

@Schema({ _id: false })
export class TestimonialsSettings {
  @Prop({ default: true })
  enabled: boolean;

  @Prop({ default: true })
  showRating: boolean;

  @Prop({ default: 'carousel' })
  layout: string; // carousel, grid

  @Prop({ default: 6 })
  maxToShow: number;
}

// ==================== SECTION CONTENT SCHEMAS ====================

@Schema({ _id: false })
export class TestimonialItem {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  clientName: string;

  @Prop()
  clientPhoto?: string;

  @Prop()
  clientTitle?: string; // e.g., "Regular Client", "First-time visitor"

  @Prop({ required: true })
  content: string;

  @Prop({ min: 1, max: 5, default: 5 })
  rating: number;

  @Prop()
  date?: string;

  @Prop()
  serviceName?: string; // Which service they received

  @Prop({ default: true })
  isVisible: boolean;

  @Prop({ default: 0 })
  order: number;
}

@Schema({ _id: false })
export class FAQItem {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  answer: string;

  @Prop()
  category?: string; // booking, services, policies, etc.

  @Prop({ default: true })
  isVisible: boolean;

  @Prop({ default: 0 })
  order: number;
}

@Schema({ _id: false })
export class AboutContent {
  @Prop()
  title?: string;

  @Prop()
  subtitle?: string;

  @Prop()
  description?: string; // Main about text (supports HTML/markdown)

  @Prop()
  image?: string;

  @Prop()
  imagePosition?: string; // left, right, top, bottom

  @Prop({ type: [String], default: [] })
  highlights?: string[]; // Key points like "10+ Years Experience", "5000+ Happy Clients"

  @Prop()
  founderName?: string;

  @Prop()
  founderPhoto?: string;

  @Prop()
  founderTitle?: string;

  @Prop()
  founderQuote?: string;

  @Prop({ default: true })
  showTeamStats: boolean;
}

@Schema({ _id: false })
export class GalleryImage {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  url: string;

  @Prop()
  thumbnail?: string;

  @Prop()
  caption?: string;

  @Prop()
  category?: string; // hair, nails, makeup, etc.

  @Prop()
  serviceName?: string;

  @Prop({ default: true })
  isVisible: boolean;

  @Prop({ default: 0 })
  order: number;
}

@Schema({ _id: false })
export class StorefrontContent {
  @Prop({ type: [TestimonialItem], default: [] })
  testimonials: TestimonialItem[];

  @Prop({ type: [FAQItem], default: [] })
  faqs: FAQItem[];

  @Prop({ type: AboutContent, default: {} })
  about: AboutContent;

  @Prop({ type: [GalleryImage], default: [] })
  galleryImages: GalleryImage[];
}

@Schema({ _id: false })
export class ServiceDisplaySettings {
  @Prop({ default: 'grid' })
  layout: string; // grid, list, cards

  @Prop({ default: 3 })
  columns: number;

  @Prop({ default: true })
  showPrices: boolean;

  @Prop({ default: true })
  showDuration: boolean;

  @Prop({ default: true })
  showDescription: boolean;

  @Prop({ default: true })
  showImages: boolean;

  @Prop({ default: true })
  groupByCategory: boolean;

  @Prop({ default: false })
  showFilters: boolean;
}

@Schema({ _id: false })
export class StaffDisplaySettings {
  @Prop({ default: 'grid' })
  layout: string; // grid, carousel, list

  @Prop({ default: 4 })
  columns: number;

  @Prop({ default: true })
  showBio: boolean;

  @Prop({ default: true })
  showSpecialties: boolean;

  @Prop({ default: true })
  showRatings: boolean;

  @Prop({ default: false })
  showBookButton: boolean;
}

@Schema({ _id: false })
export class ContactDisplaySettings {
  @Prop({ default: true })
  showMap: boolean;

  @Prop({ default: true })
  showAddress: boolean;

  @Prop({ default: true })
  showPhone: boolean;

  @Prop({ default: true })
  showEmail: boolean;

  @Prop({ default: true })
  showSocialLinks: boolean;

  @Prop({ default: true })
  showBusinessHours: boolean;
}

@Schema({ _id: false })
export class BookingFlowSettings {
  @Prop({ default: 'service-first' })
  flow: string; // service-first, staff-first, date-first

  @Prop({ default: true })
  allowGuestBooking: boolean;

  @Prop({ default: true })
  showStaffSelection: boolean;

  @Prop({ default: false })
  requireStaffSelection: boolean;

  @Prop({ default: true })
  showServiceImages: boolean;

  @Prop({ default: true })
  allowMultipleServices: boolean;

  @Prop({ default: 'calendar' })
  datePickerStyle: string; // calendar, list

  @Prop({ default: true })
  showAvailableSlots: boolean;

  @Prop({ default: 30 })
  slotDuration: number; // In minutes

  @Prop({ default: 30 })
  advanceBookingDays: number;

  @Prop({ default: 2 })
  minAdvanceHours: number; // Minimum hours before appointment
}

@Schema({ _id: false })
export class SocialProof {
  @Prop({ default: true })
  showReviewCount: boolean;

  @Prop({ default: true })
  showAverageRating: boolean;

  @Prop({ default: true })
  showTotalBookings: boolean;

  @Prop({ default: false })
  showTrustBadges: boolean;

  @Prop({ type: [String], default: [] })
  badges: string[]; // Custom badge URLs
}

@Schema({ _id: false })
export class StorefrontLayout {
  @Prop({ type: HeroSection, default: {} })
  hero: HeroSection;

  @Prop({ type: [StorefrontSection], default: [] })
  sections: StorefrontSection[];

  @Prop({ type: ServiceDisplaySettings, default: {} })
  serviceDisplay: ServiceDisplaySettings;

  @Prop({ type: StaffDisplaySettings, default: {} })
  staffDisplay: StaffDisplaySettings;

  @Prop({ type: GallerySettings, default: {} })
  gallery: GallerySettings;

  @Prop({ type: TestimonialsSettings, default: {} })
  testimonials: TestimonialsSettings;

  @Prop({ type: ContactDisplaySettings, default: {} })
  contact: ContactDisplaySettings;

  @Prop({ type: BookingFlowSettings, default: {} })
  bookingFlow: BookingFlowSettings;

  @Prop({ type: SocialProof, default: {} })
  socialProof: SocialProof;

  // ==================== SECTION CONTENT ====================
  @Prop({ type: StorefrontContent, default: {} })
  content: StorefrontContent;
}

@Schema({ _id: false })
export class ButtonStyles {
  @Prop({ default: '8px' })
  borderRadius: string;

  @Prop({ default: 'filled' })
  style: string; // filled, outlined, ghost

  @Prop({ default: 'medium' })
  size: string; // small, medium, large

  @Prop({ default: false })
  uppercase: boolean;

  @Prop({ default: '600' })
  fontWeight: string;
}

@Schema({ _id: false })
export class CardStyles {
  @Prop({ default: '12px' })
  borderRadius: string;

  @Prop({ default: true })
  shadow: boolean;

  @Prop({ default: 'medium' })
  shadowIntensity: string; // light, medium, strong

  @Prop({ default: true })
  border: boolean;

  @Prop({ default: '#E5E7EB' })
  borderColor: string;
}

@Schema({ _id: false })
export class ComponentStyles {
  @Prop({ type: ButtonStyles, default: {} })
  buttons: ButtonStyles;

  @Prop({ type: CardStyles, default: {} })
  cards: CardStyles;

  @Prop({ default: '8px' })
  inputBorderRadius: string;

  @Prop({ default: '24px' })
  sectionSpacing: string;

  @Prop({ default: '1200px' })
  maxContentWidth: string;
}

// ==================== MAIN THEME SCHEMA ====================

@Schema({ timestamps: true })
export class Theme {
  @Prop({ type: Types.ObjectId, ref: 'Business', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({
    type: {
      primary: { type: String, required: true },
      secondary: { type: String, required: true },
      accent: { type: String, required: true },
      background: { type: String, required: true },
      text: { type: String, required: true },
      error: { type: String, required: true },
      success: { type: String, required: true },
      // Extended color palette
      muted: { type: String, default: '#6B7280' },
      border: { type: String, default: '#E5E7EB' },
      cardBackground: { type: String, default: '#FFFFFF' },
      inputBackground: { type: String, default: '#F9FAFB' },
    },
    required: true
  })
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

  @Prop({
    type: {
      fontFamily: { type: String, required: true },
      headingFont: { type: String, required: true },
      bodyFont: { type: String, required: true },
      // Extended typography
      fontSize: {
        type: {
          xs: { type: String, default: '12px' },
          sm: { type: String, default: '14px' },
          base: { type: String, default: '16px' },
          lg: { type: String, default: '18px' },
          xl: { type: String, default: '20px' },
          '2xl': { type: String, default: '24px' },
          '3xl': { type: String, default: '30px' },
          '4xl': { type: String, default: '36px' },
        },
        default: {}
      },
      fontWeight: {
        type: {
          normal: { type: String, default: '400' },
          medium: { type: String, default: '500' },
          semibold: { type: String, default: '600' },
          bold: { type: String, default: '700' },
        },
        default: {}
      },
      lineHeight: {
        type: {
          tight: { type: String, default: '1.25' },
          normal: { type: String, default: '1.5' },
          relaxed: { type: String, default: '1.75' },
        },
        default: {}
      }
    },
    required: true
  })
  typography: {
    fontFamily: string;
    headingFont: string;
    bodyFont: string;
    fontSize?: Record<string, string>;
    fontWeight?: Record<string, string>;
    lineHeight?: Record<string, string>;
  };

  @Prop({
    type: {
      url: String,
      width: Number,
      height: Number,
      alt: String,
    }
  })
  logo?: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };

  @Prop({
    type: {
      url: String,
    }
  })
  favicon?: {
    url: string;
  };

  @Prop({
    type: {
      enabled: { type: Boolean, default: false },
      cssCode: { type: String, default: '' },
    },
    default: { enabled: false, cssCode: '' }
  })
  customCss: {
    enabled: boolean;
    cssCode: string;
  };

  // ==================== NEW: STOREFRONT CUSTOMIZATION ====================

  @Prop({ type: StorefrontLayout, default: {} })
  storefront: StorefrontLayout;

  @Prop({ type: ComponentStyles, default: {} })
  componentStyles: ComponentStyles;

  // SEO & Meta
  @Prop({
    type: {
      title: String,
      description: String,
      keywords: [String],
      ogImage: String,
    },
    default: {}
  })
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
  };

  // Footer customization
  @Prop({
    type: {
      enabled: { type: Boolean, default: true },
      showSocialLinks: { type: Boolean, default: true },
      showQuickLinks: { type: Boolean, default: true },
      showContactInfo: { type: Boolean, default: true },
      showNewsletter: { type: Boolean, default: false },
      copyrightText: String,
      customLinks: [{
        label: String,
        url: String,
        openInNewTab: { type: Boolean, default: false }
      }]
    },
    default: {}
  })
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

  // Navbar customization
  @Prop({
    type: {
      style: { type: String, default: 'default' }, // default, transparent, sticky
      showLogo: { type: Boolean, default: true },
      showBusinessName: { type: Boolean, default: true },
      showBookButton: { type: Boolean, default: true },
      bookButtonText: { type: String, default: 'Book Now' },
      menuItems: [{
        label: String,
        sectionId: String, // Links to section on page
        url: String, // External URL
      }]
    },
    default: {}
  })
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

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ThemeSchema = SchemaFactory.createForClass(Theme);

// Indexes
ThemeSchema.index({ tenantId: 1 }, { unique: true });