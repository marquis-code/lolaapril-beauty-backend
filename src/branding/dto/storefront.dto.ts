// src/branding/dto/storefront.dto.ts
import { 
  IsObject, 
  IsBoolean, 
  IsOptional, 
  ValidateNested, 
  IsString, 
  IsNumber, 
  IsArray,
  IsEnum,
  Min,
  Max
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

// ==================== HERO SECTION DTOs ====================

class GradientDto {
  @ApiProperty({ example: '#3B82F6' })
  @IsString()
  from: string;

  @ApiProperty({ example: '#8B5CF6' })
  @IsString()
  to: string;

  @ApiPropertyOptional({ example: 'to-right' })
  @IsOptional()
  @IsString()
  direction?: string;
}

export class UpdateHeroSectionDto {
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @ApiPropertyOptional({ enum: ['image', 'video', 'slideshow', 'gradient'] })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 'https://example.com/hero.jpg' })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  slideshowImages?: string[];

  @ApiPropertyOptional({ example: 'https://example.com/video.mp4' })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional({ type: GradientDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GradientDto)
  gradient?: GradientDto;

  @ApiPropertyOptional({ example: 'Welcome to Our Salon' })
  @IsOptional()
  @IsString()
  headline?: string;

  @ApiPropertyOptional({ example: 'Book your appointment today' })
  @IsOptional()
  @IsString()
  subheadline?: string;

  @ApiPropertyOptional({ enum: ['left', 'center', 'right'] })
  @IsOptional()
  @IsString()
  textAlignment?: string;

  @ApiPropertyOptional({ enum: ['light', 'dark', 'none'] })
  @IsOptional()
  @IsString()
  overlayStyle?: string;

  @ApiPropertyOptional({ example: 0.4 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  overlayOpacity?: number;

  @ApiPropertyOptional({ example: '500px' })
  @IsOptional()
  @IsString()
  height?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  showBookButton?: boolean;

  @ApiPropertyOptional({ example: 'Book Now' })
  @IsOptional()
  @IsString()
  bookButtonText?: string;
}

// ==================== SECTION DTOs ====================

export class StorefrontSectionDto {
  @ApiProperty({ example: 'services' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'services', description: 'services, staff, gallery, testimonials, about, contact, map, hours, faq, custom' })
  @IsString()
  type: string;

  @ApiProperty({ example: 'Our Services' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Choose from our wide range of services' })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({ example: 1, description: 'Display order (for drag-and-drop)' })
  @IsNumber()
  order: number;

  @ApiPropertyOptional({ description: 'Section-specific settings' })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}

// ==================== DISPLAY SETTINGS DTOs ====================

export class UpdateServiceDisplayDto {
  @ApiPropertyOptional({ enum: ['grid', 'list', 'cards'] })
  @IsOptional()
  @IsString()
  layout?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(6)
  columns?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showPrices?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showDuration?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showDescription?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showImages?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  groupByCategory?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showFilters?: boolean;
}

export class UpdateStaffDisplayDto {
  @ApiPropertyOptional({ enum: ['grid', 'carousel', 'list'] })
  @IsOptional()
  @IsString()
  layout?: string;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(6)
  columns?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showBio?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showSpecialties?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showRatings?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showBookButton?: boolean;
}

export class UpdateGallerySettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ enum: ['grid', 'masonry', 'carousel'] })
  @IsOptional()
  @IsString()
  layout?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(6)
  columns?: number;
}

export class UpdateTestimonialsSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showRating?: boolean;

  @ApiPropertyOptional({ enum: ['carousel', 'grid'] })
  @IsOptional()
  @IsString()
  layout?: string;

  @ApiPropertyOptional({ example: 6 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  maxToShow?: number;
}

export class UpdateContactDisplayDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showMap?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showAddress?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showPhone?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showEmail?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showSocialLinks?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showBusinessHours?: boolean;
}

// ==================== BOOKING FLOW DTOs ====================

export class UpdateBookingFlowDto {
  @ApiPropertyOptional({ enum: ['service-first', 'staff-first', 'date-first'] })
  @IsOptional()
  @IsString()
  flow?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  allowGuestBooking?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showStaffSelection?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  requireStaffSelection?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showServiceImages?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  allowMultipleServices?: boolean;

  @ApiPropertyOptional({ enum: ['calendar', 'list'] })
  @IsOptional()
  @IsString()
  datePickerStyle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showAvailableSlots?: boolean;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(120)
  slotDuration?: number;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(365)
  advanceBookingDays?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(72)
  minAdvanceHours?: number;
}

// ==================== SOCIAL PROOF DTOs ====================

export class UpdateSocialProofDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showReviewCount?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showAverageRating?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showTotalBookings?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showTrustBadges?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  badges?: string[];
}

// ==================== COMPONENT STYLES DTOs ====================

export class UpdateButtonStylesDto {
  @ApiPropertyOptional({ example: '8px' })
  @IsOptional()
  @IsString()
  borderRadius?: string;

  @ApiPropertyOptional({ enum: ['filled', 'outlined', 'ghost'] })
  @IsOptional()
  @IsString()
  style?: string;

  @ApiPropertyOptional({ enum: ['small', 'medium', 'large'] })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  uppercase?: boolean;

  @ApiPropertyOptional({ example: '600' })
  @IsOptional()
  @IsString()
  fontWeight?: string;
}

export class UpdateCardStylesDto {
  @ApiPropertyOptional({ example: '12px' })
  @IsOptional()
  @IsString()
  borderRadius?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  shadow?: boolean;

  @ApiPropertyOptional({ enum: ['light', 'medium', 'strong'] })
  @IsOptional()
  @IsString()
  shadowIntensity?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  border?: boolean;

  @ApiPropertyOptional({ example: '#E5E7EB' })
  @IsOptional()
  @IsString()
  borderColor?: string;
}

export class UpdateComponentStylesDto {
  @ApiPropertyOptional({ type: UpdateButtonStylesDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateButtonStylesDto)
  buttons?: UpdateButtonStylesDto;

  @ApiPropertyOptional({ type: UpdateCardStylesDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateCardStylesDto)
  cards?: UpdateCardStylesDto;

  @ApiPropertyOptional({ example: '8px' })
  @IsOptional()
  @IsString()
  inputBorderRadius?: string;

  @ApiPropertyOptional({ example: '24px' })
  @IsOptional()
  @IsString()
  sectionSpacing?: string;

  @ApiPropertyOptional({ example: '1200px' })
  @IsOptional()
  @IsString()
  maxContentWidth?: string;
}

// ==================== NAVBAR & FOOTER DTOs ====================

export class NavbarMenuItemDto {
  @ApiProperty({ example: 'Services' })
  @IsString()
  label: string;

  @ApiPropertyOptional({ example: 'services' })
  @IsOptional()
  @IsString()
  sectionId?: string;

  @ApiPropertyOptional({ example: 'https://example.com' })
  @IsOptional()
  @IsString()
  url?: string;
}

export class UpdateNavbarDto {
  @ApiPropertyOptional({ enum: ['default', 'transparent', 'sticky'] })
  @IsOptional()
  @IsString()
  style?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showLogo?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showBusinessName?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showBookButton?: boolean;

  @ApiPropertyOptional({ example: 'Book Now' })
  @IsOptional()
  @IsString()
  bookButtonText?: string;

  @ApiPropertyOptional({ type: [NavbarMenuItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NavbarMenuItemDto)
  menuItems?: NavbarMenuItemDto[];
}

export class FooterLinkDto {
  @ApiProperty({ example: 'Privacy Policy' })
  @IsString()
  label: string;

  @ApiProperty({ example: '/privacy' })
  @IsString()
  url: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  openInNewTab?: boolean;
}

export class UpdateFooterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showSocialLinks?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showQuickLinks?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showContactInfo?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showNewsletter?: boolean;

  @ApiPropertyOptional({ example: '© 2026 All rights reserved.' })
  @IsOptional()
  @IsString()
  copyrightText?: string;

  @ApiPropertyOptional({ type: [FooterLinkDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FooterLinkDto)
  customLinks?: FooterLinkDto[];
}

// ==================== SEO DTOs ====================

export class UpdateSeoDto {
  @ApiPropertyOptional({ example: 'Best Salon in Lagos | Debbie Spa' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Book your appointment at the best salon in Lagos. Professional hair, nails, and spa services.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: [String], example: ['salon', 'spa', 'beauty', 'lagos'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @ApiPropertyOptional({ example: 'https://example.com/og-image.jpg' })
  @IsOptional()
  @IsString()
  ogImage?: string;
}

// ==================== MAIN STOREFRONT UPDATE DTO ====================

export class UpdateStorefrontLayoutDto {
  @ApiPropertyOptional({ type: UpdateHeroSectionDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateHeroSectionDto)
  hero?: UpdateHeroSectionDto;

  @ApiPropertyOptional({ type: [StorefrontSectionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StorefrontSectionDto)
  sections?: StorefrontSectionDto[];

  @ApiPropertyOptional({ type: UpdateServiceDisplayDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateServiceDisplayDto)
  serviceDisplay?: UpdateServiceDisplayDto;

  @ApiPropertyOptional({ type: UpdateStaffDisplayDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateStaffDisplayDto)
  staffDisplay?: UpdateStaffDisplayDto;

  @ApiPropertyOptional({ type: UpdateGallerySettingsDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateGallerySettingsDto)
  gallery?: UpdateGallerySettingsDto;

  @ApiPropertyOptional({ type: UpdateTestimonialsSettingsDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateTestimonialsSettingsDto)
  testimonials?: UpdateTestimonialsSettingsDto;

  @ApiPropertyOptional({ type: UpdateContactDisplayDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateContactDisplayDto)
  contact?: UpdateContactDisplayDto;

  @ApiPropertyOptional({ type: UpdateBookingFlowDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateBookingFlowDto)
  bookingFlow?: UpdateBookingFlowDto;

  @ApiPropertyOptional({ type: UpdateSocialProofDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateSocialProofDto)
  socialProof?: UpdateSocialProofDto;
}

// ==================== COMPLETE STOREFRONT CONFIG DTO ====================

export class UpdateFullStorefrontDto {
  @ApiPropertyOptional({ type: UpdateStorefrontLayoutDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateStorefrontLayoutDto)
  storefront?: UpdateStorefrontLayoutDto;

  @ApiPropertyOptional({ type: UpdateComponentStylesDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateComponentStylesDto)
  componentStyles?: UpdateComponentStylesDto;

  @ApiPropertyOptional({ type: UpdateNavbarDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateNavbarDto)
  navbar?: UpdateNavbarDto;

  @ApiPropertyOptional({ type: UpdateFooterDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateFooterDto)
  footer?: UpdateFooterDto;

  @ApiPropertyOptional({ type: UpdateSeoDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateSeoDto)
  seo?: UpdateSeoDto;
}
// ==================== SECTION CONTENT DTOs ====================

export class TestimonialItemDto {
  @ApiProperty({ example: 'testimonial-123' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'Jane Smith' })
  @IsString()
  clientName: string;

  @ApiPropertyOptional({ example: 'https://example.com/photo.jpg' })
  @IsOptional()
  @IsString()
  clientPhoto?: string;

  @ApiPropertyOptional({ example: 'Regular Client' })
  @IsOptional()
  @IsString()
  clientTitle?: string;

  @ApiProperty({ example: 'Amazing service! I always leave feeling beautiful.' })
  @IsString()
  content: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: '2026-01-15' })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({ example: 'Hair Styling' })
  @IsOptional()
  @IsString()
  serviceName?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  order?: number;
}

export class FAQItemDto {
  @ApiProperty({ example: 'faq-123' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'What are your opening hours?' })
  @IsString()
  question: string;

  @ApiProperty({ example: 'We are open Monday to Saturday, 9am to 6pm.' })
  @IsString()
  answer: string;

  @ApiPropertyOptional({ example: 'booking' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  order?: number;
}

export class AboutContentDto {
  @ApiPropertyOptional({ example: 'About Our Salon' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Your beauty is our passion' })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional({ example: 'We have been serving the community for over 10 years...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/about-image.jpg' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ enum: ['left', 'right', 'top', 'bottom'] })
  @IsOptional()
  @IsString()
  imagePosition?: string;

  @ApiPropertyOptional({ type: [String], example: ['10+ Years Experience', '5000+ Happy Clients'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  highlights?: string[];

  @ApiPropertyOptional({ example: 'Jane Doe' })
  @IsOptional()
  @IsString()
  founderName?: string;

  @ApiPropertyOptional({ example: 'https://example.com/founder.jpg' })
  @IsOptional()
  @IsString()
  founderPhoto?: string;

  @ApiPropertyOptional({ example: 'Founder & Lead Stylist' })
  @IsOptional()
  @IsString()
  founderTitle?: string;

  @ApiPropertyOptional({ example: 'Beauty is not just about looks, it\'s about feeling confident.' })
  @IsOptional()
  @IsString()
  founderQuote?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  showTeamStats?: boolean;
}

export class GalleryImageDto {
  @ApiProperty({ example: 'gallery-123' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'https://example.com/gallery/image1.jpg' })
  @IsString()
  url: string;

  @ApiPropertyOptional({ example: 'https://example.com/gallery/thumb1.jpg' })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({ example: 'Beautiful balayage transformation' })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional({ example: 'hair' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'Balayage Highlights' })
  @IsOptional()
  @IsString()
  serviceName?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  order?: number;
}

// ==================== CONTENT UPDATE DTOs ====================

export class UpdateTestimonialsContentDto {
  @ApiProperty({ type: [TestimonialItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestimonialItemDto)
  testimonials: TestimonialItemDto[];
}

export class AddTestimonialDto {
  @ApiProperty({ example: 'Jane Smith' })
  @IsString()
  clientName: string;

  @ApiPropertyOptional({ example: 'https://example.com/photo.jpg' })
  @IsOptional()
  @IsString()
  clientPhoto?: string;

  @ApiPropertyOptional({ example: 'Regular Client' })
  @IsOptional()
  @IsString()
  clientTitle?: string;

  @ApiProperty({ example: 'Amazing service! I always leave feeling beautiful.' })
  @IsString()
  content: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: 'Hair Styling' })
  @IsOptional()
  @IsString()
  serviceName?: string;
}

export class UpdateFAQsContentDto {
  @ApiProperty({ type: [FAQItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FAQItemDto)
  faqs: FAQItemDto[];
}

export class AddFAQDto {
  @ApiProperty({ example: 'What are your opening hours?' })
  @IsString()
  question: string;

  @ApiProperty({ example: 'We are open Monday to Saturday, 9am to 6pm.' })
  @IsString()
  answer: string;

  @ApiPropertyOptional({ example: 'booking' })
  @IsOptional()
  @IsString()
  category?: string;
}

export class UpdateAboutContentDto extends AboutContentDto {}

export class UpdateGalleryContentDto {
  @ApiProperty({ type: [GalleryImageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GalleryImageDto)
  images: GalleryImageDto[];
}

export class AddGalleryImageDto {
  @ApiProperty({ example: 'https://example.com/gallery/image1.jpg' })
  @IsString()
  url: string;

  @ApiPropertyOptional({ example: 'Beautiful balayage transformation' })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional({ example: 'hair' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'Balayage Highlights' })
  @IsOptional()
  @IsString()
  serviceName?: string;
}

export class ImportFAQsFromChatDto {
  @ApiPropertyOptional({ example: true, description: 'Replace existing FAQs or append to them' })
  @IsOptional()
  @IsBoolean()
  replaceExisting?: boolean;
}