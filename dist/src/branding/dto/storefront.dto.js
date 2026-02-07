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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportFAQsFromChatDto = exports.AddGalleryImageDto = exports.UpdateGalleryContentDto = exports.UpdateAboutContentDto = exports.AddFAQDto = exports.UpdateFAQsContentDto = exports.AddTestimonialDto = exports.UpdateTestimonialsContentDto = exports.GalleryImageDto = exports.AboutContentDto = exports.FAQItemDto = exports.TestimonialItemDto = exports.UpdateFullStorefrontDto = exports.UpdateStorefrontLayoutDto = exports.UpdateSeoDto = exports.UpdateFooterDto = exports.FooterLinkDto = exports.UpdateNavbarDto = exports.NavbarMenuItemDto = exports.UpdateComponentStylesDto = exports.UpdateCardStylesDto = exports.UpdateButtonStylesDto = exports.UpdateSocialProofDto = exports.UpdateBookingFlowDto = exports.UpdateContactDisplayDto = exports.UpdateTestimonialsSettingsDto = exports.UpdateGallerySettingsDto = exports.UpdateStaffDisplayDto = exports.UpdateServiceDisplayDto = exports.StorefrontSectionDto = exports.UpdateHeroSectionDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class GradientDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#3B82F6' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GradientDto.prototype, "from", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#8B5CF6' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GradientDto.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'to-right' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GradientDto.prototype, "direction", void 0);
class UpdateHeroSectionDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateHeroSectionDto.prototype, "enabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['image', 'video', 'slideshow', 'gradient'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateHeroSectionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/hero.jpg' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateHeroSectionDto.prototype, "coverImage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateHeroSectionDto.prototype, "slideshowImages", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/video.mp4' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateHeroSectionDto.prototype, "videoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: GradientDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => GradientDto),
    __metadata("design:type", GradientDto)
], UpdateHeroSectionDto.prototype, "gradient", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Welcome to Our Salon' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateHeroSectionDto.prototype, "headline", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Book your appointment today' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateHeroSectionDto.prototype, "subheadline", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['left', 'center', 'right'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateHeroSectionDto.prototype, "textAlignment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['light', 'dark', 'none'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateHeroSectionDto.prototype, "overlayStyle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0.4 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], UpdateHeroSectionDto.prototype, "overlayOpacity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '500px' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateHeroSectionDto.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateHeroSectionDto.prototype, "showBookButton", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Book Now' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateHeroSectionDto.prototype, "bookButtonText", void 0);
exports.UpdateHeroSectionDto = UpdateHeroSectionDto;
class StorefrontSectionDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'services' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StorefrontSectionDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'services', description: 'services, staff, gallery, testimonials, about, contact, map, hours, faq, custom' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StorefrontSectionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Our Services' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StorefrontSectionDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Choose from our wide range of services' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StorefrontSectionDto.prototype, "subtitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], StorefrontSectionDto.prototype, "enabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Display order (for drag-and-drop)' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], StorefrontSectionDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Section-specific settings' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], StorefrontSectionDto.prototype, "settings", void 0);
exports.StorefrontSectionDto = StorefrontSectionDto;
class UpdateServiceDisplayDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['grid', 'list', 'cards'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateServiceDisplayDto.prototype, "layout", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(6),
    __metadata("design:type", Number)
], UpdateServiceDisplayDto.prototype, "columns", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateServiceDisplayDto.prototype, "showPrices", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateServiceDisplayDto.prototype, "showDuration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateServiceDisplayDto.prototype, "showDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateServiceDisplayDto.prototype, "showImages", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateServiceDisplayDto.prototype, "groupByCategory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateServiceDisplayDto.prototype, "showFilters", void 0);
exports.UpdateServiceDisplayDto = UpdateServiceDisplayDto;
class UpdateStaffDisplayDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['grid', 'carousel', 'list'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStaffDisplayDto.prototype, "layout", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 4 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(6),
    __metadata("design:type", Number)
], UpdateStaffDisplayDto.prototype, "columns", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateStaffDisplayDto.prototype, "showBio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateStaffDisplayDto.prototype, "showSpecialties", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateStaffDisplayDto.prototype, "showRatings", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateStaffDisplayDto.prototype, "showBookButton", void 0);
exports.UpdateStaffDisplayDto = UpdateStaffDisplayDto;
class UpdateGallerySettingsDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateGallerySettingsDto.prototype, "enabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateGallerySettingsDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['grid', 'masonry', 'carousel'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGallerySettingsDto.prototype, "layout", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(6),
    __metadata("design:type", Number)
], UpdateGallerySettingsDto.prototype, "columns", void 0);
exports.UpdateGallerySettingsDto = UpdateGallerySettingsDto;
class UpdateTestimonialsSettingsDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTestimonialsSettingsDto.prototype, "enabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTestimonialsSettingsDto.prototype, "showRating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['carousel', 'grid'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTestimonialsSettingsDto.prototype, "layout", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 6 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(20),
    __metadata("design:type", Number)
], UpdateTestimonialsSettingsDto.prototype, "maxToShow", void 0);
exports.UpdateTestimonialsSettingsDto = UpdateTestimonialsSettingsDto;
class UpdateContactDisplayDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateContactDisplayDto.prototype, "showMap", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateContactDisplayDto.prototype, "showAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateContactDisplayDto.prototype, "showPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateContactDisplayDto.prototype, "showEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateContactDisplayDto.prototype, "showSocialLinks", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateContactDisplayDto.prototype, "showBusinessHours", void 0);
exports.UpdateContactDisplayDto = UpdateContactDisplayDto;
class UpdateBookingFlowDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['service-first', 'staff-first', 'date-first'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBookingFlowDto.prototype, "flow", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateBookingFlowDto.prototype, "allowGuestBooking", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateBookingFlowDto.prototype, "showStaffSelection", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateBookingFlowDto.prototype, "requireStaffSelection", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateBookingFlowDto.prototype, "showServiceImages", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateBookingFlowDto.prototype, "allowMultipleServices", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['calendar', 'list'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBookingFlowDto.prototype, "datePickerStyle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateBookingFlowDto.prototype, "showAvailableSlots", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 30 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(5),
    (0, class_validator_1.Max)(120),
    __metadata("design:type", Number)
], UpdateBookingFlowDto.prototype, "slotDuration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 30 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(365),
    __metadata("design:type", Number)
], UpdateBookingFlowDto.prototype, "advanceBookingDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(72),
    __metadata("design:type", Number)
], UpdateBookingFlowDto.prototype, "minAdvanceHours", void 0);
exports.UpdateBookingFlowDto = UpdateBookingFlowDto;
class UpdateSocialProofDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSocialProofDto.prototype, "showReviewCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSocialProofDto.prototype, "showAverageRating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSocialProofDto.prototype, "showTotalBookings", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSocialProofDto.prototype, "showTrustBadges", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateSocialProofDto.prototype, "badges", void 0);
exports.UpdateSocialProofDto = UpdateSocialProofDto;
class UpdateButtonStylesDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '8px' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateButtonStylesDto.prototype, "borderRadius", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['filled', 'outlined', 'ghost'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateButtonStylesDto.prototype, "style", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['small', 'medium', 'large'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateButtonStylesDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateButtonStylesDto.prototype, "uppercase", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '600' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateButtonStylesDto.prototype, "fontWeight", void 0);
exports.UpdateButtonStylesDto = UpdateButtonStylesDto;
class UpdateCardStylesDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '12px' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCardStylesDto.prototype, "borderRadius", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateCardStylesDto.prototype, "shadow", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['light', 'medium', 'strong'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCardStylesDto.prototype, "shadowIntensity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateCardStylesDto.prototype, "border", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '#E5E7EB' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCardStylesDto.prototype, "borderColor", void 0);
exports.UpdateCardStylesDto = UpdateCardStylesDto;
class UpdateComponentStylesDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: UpdateButtonStylesDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => UpdateButtonStylesDto),
    __metadata("design:type", UpdateButtonStylesDto)
], UpdateComponentStylesDto.prototype, "buttons", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: UpdateCardStylesDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => UpdateCardStylesDto),
    __metadata("design:type", UpdateCardStylesDto)
], UpdateComponentStylesDto.prototype, "cards", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '8px' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateComponentStylesDto.prototype, "inputBorderRadius", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '24px' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateComponentStylesDto.prototype, "sectionSpacing", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1200px' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateComponentStylesDto.prototype, "maxContentWidth", void 0);
exports.UpdateComponentStylesDto = UpdateComponentStylesDto;
class NavbarMenuItemDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Services' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NavbarMenuItemDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'services' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NavbarMenuItemDto.prototype, "sectionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NavbarMenuItemDto.prototype, "url", void 0);
exports.NavbarMenuItemDto = NavbarMenuItemDto;
class UpdateNavbarDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['default', 'transparent', 'sticky'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNavbarDto.prototype, "style", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateNavbarDto.prototype, "showLogo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateNavbarDto.prototype, "showBusinessName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateNavbarDto.prototype, "showBookButton", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Book Now' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNavbarDto.prototype, "bookButtonText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [NavbarMenuItemDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => NavbarMenuItemDto),
    __metadata("design:type", Array)
], UpdateNavbarDto.prototype, "menuItems", void 0);
exports.UpdateNavbarDto = UpdateNavbarDto;
class FooterLinkDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Privacy Policy' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FooterLinkDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '/privacy' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FooterLinkDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FooterLinkDto.prototype, "openInNewTab", void 0);
exports.FooterLinkDto = FooterLinkDto;
class UpdateFooterDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateFooterDto.prototype, "enabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateFooterDto.prototype, "showSocialLinks", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateFooterDto.prototype, "showQuickLinks", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateFooterDto.prototype, "showContactInfo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateFooterDto.prototype, "showNewsletter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '© 2026 All rights reserved.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFooterDto.prototype, "copyrightText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [FooterLinkDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => FooterLinkDto),
    __metadata("design:type", Array)
], UpdateFooterDto.prototype, "customLinks", void 0);
exports.UpdateFooterDto = UpdateFooterDto;
class UpdateSeoDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Best Salon in Lagos | Debbie Spa' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSeoDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Book your appointment at the best salon in Lagos. Professional hair, nails, and spa services.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSeoDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], example: ['salon', 'spa', 'beauty', 'lagos'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateSeoDto.prototype, "keywords", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/og-image.jpg' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSeoDto.prototype, "ogImage", void 0);
exports.UpdateSeoDto = UpdateSeoDto;
class UpdateStorefrontLayoutDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: UpdateHeroSectionDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => UpdateHeroSectionDto),
    __metadata("design:type", UpdateHeroSectionDto)
], UpdateStorefrontLayoutDto.prototype, "hero", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [StorefrontSectionDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => StorefrontSectionDto),
    __metadata("design:type", Array)
], UpdateStorefrontLayoutDto.prototype, "sections", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: UpdateServiceDisplayDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => UpdateServiceDisplayDto),
    __metadata("design:type", UpdateServiceDisplayDto)
], UpdateStorefrontLayoutDto.prototype, "serviceDisplay", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: UpdateStaffDisplayDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => UpdateStaffDisplayDto),
    __metadata("design:type", UpdateStaffDisplayDto)
], UpdateStorefrontLayoutDto.prototype, "staffDisplay", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: UpdateGallerySettingsDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => UpdateGallerySettingsDto),
    __metadata("design:type", UpdateGallerySettingsDto)
], UpdateStorefrontLayoutDto.prototype, "gallery", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: UpdateTestimonialsSettingsDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => UpdateTestimonialsSettingsDto),
    __metadata("design:type", UpdateTestimonialsSettingsDto)
], UpdateStorefrontLayoutDto.prototype, "testimonials", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: UpdateContactDisplayDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => UpdateContactDisplayDto),
    __metadata("design:type", UpdateContactDisplayDto)
], UpdateStorefrontLayoutDto.prototype, "contact", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: UpdateBookingFlowDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => UpdateBookingFlowDto),
    __metadata("design:type", UpdateBookingFlowDto)
], UpdateStorefrontLayoutDto.prototype, "bookingFlow", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: UpdateSocialProofDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => UpdateSocialProofDto),
    __metadata("design:type", UpdateSocialProofDto)
], UpdateStorefrontLayoutDto.prototype, "socialProof", void 0);
exports.UpdateStorefrontLayoutDto = UpdateStorefrontLayoutDto;
class UpdateFullStorefrontDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: UpdateStorefrontLayoutDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => UpdateStorefrontLayoutDto),
    __metadata("design:type", UpdateStorefrontLayoutDto)
], UpdateFullStorefrontDto.prototype, "storefront", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: UpdateComponentStylesDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => UpdateComponentStylesDto),
    __metadata("design:type", UpdateComponentStylesDto)
], UpdateFullStorefrontDto.prototype, "componentStyles", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: UpdateNavbarDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => UpdateNavbarDto),
    __metadata("design:type", UpdateNavbarDto)
], UpdateFullStorefrontDto.prototype, "navbar", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: UpdateFooterDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => UpdateFooterDto),
    __metadata("design:type", UpdateFooterDto)
], UpdateFullStorefrontDto.prototype, "footer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: UpdateSeoDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => UpdateSeoDto),
    __metadata("design:type", UpdateSeoDto)
], UpdateFullStorefrontDto.prototype, "seo", void 0);
exports.UpdateFullStorefrontDto = UpdateFullStorefrontDto;
class TestimonialItemDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'testimonial-123' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestimonialItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Jane Smith' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestimonialItemDto.prototype, "clientName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/photo.jpg' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestimonialItemDto.prototype, "clientPhoto", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Regular Client' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestimonialItemDto.prototype, "clientTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Amazing service! I always leave feeling beautiful.' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestimonialItemDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], TestimonialItemDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-01-15' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestimonialItemDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Hair Styling' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestimonialItemDto.prototype, "serviceName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], TestimonialItemDto.prototype, "isVisible", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TestimonialItemDto.prototype, "order", void 0);
exports.TestimonialItemDto = TestimonialItemDto;
class FAQItemDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'faq-123' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FAQItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'What are your opening hours?' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FAQItemDto.prototype, "question", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'We are open Monday to Saturday, 9am to 6pm.' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FAQItemDto.prototype, "answer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'booking' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FAQItemDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FAQItemDto.prototype, "isVisible", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FAQItemDto.prototype, "order", void 0);
exports.FAQItemDto = FAQItemDto;
class AboutContentDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'About Our Salon' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AboutContentDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Your beauty is our passion' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AboutContentDto.prototype, "subtitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'We have been serving the community for over 10 years...' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AboutContentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/about-image.jpg' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AboutContentDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['left', 'right', 'top', 'bottom'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AboutContentDto.prototype, "imagePosition", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], example: ['10+ Years Experience', '5000+ Happy Clients'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AboutContentDto.prototype, "highlights", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Jane Doe' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AboutContentDto.prototype, "founderName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/founder.jpg' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AboutContentDto.prototype, "founderPhoto", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Founder & Lead Stylist' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AboutContentDto.prototype, "founderTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Beauty is not just about looks, it\'s about feeling confident.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AboutContentDto.prototype, "founderQuote", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AboutContentDto.prototype, "showTeamStats", void 0);
exports.AboutContentDto = AboutContentDto;
class GalleryImageDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'gallery-123' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GalleryImageDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/gallery/image1.jpg' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GalleryImageDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/gallery/thumb1.jpg' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GalleryImageDto.prototype, "thumbnail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Beautiful balayage transformation' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GalleryImageDto.prototype, "caption", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'hair' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GalleryImageDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Balayage Highlights' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GalleryImageDto.prototype, "serviceName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GalleryImageDto.prototype, "isVisible", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GalleryImageDto.prototype, "order", void 0);
exports.GalleryImageDto = GalleryImageDto;
class UpdateTestimonialsContentDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TestimonialItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TestimonialItemDto),
    __metadata("design:type", Array)
], UpdateTestimonialsContentDto.prototype, "testimonials", void 0);
exports.UpdateTestimonialsContentDto = UpdateTestimonialsContentDto;
class AddTestimonialDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Jane Smith' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddTestimonialDto.prototype, "clientName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/photo.jpg' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddTestimonialDto.prototype, "clientPhoto", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Regular Client' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddTestimonialDto.prototype, "clientTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Amazing service! I always leave feeling beautiful.' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddTestimonialDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], AddTestimonialDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Hair Styling' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddTestimonialDto.prototype, "serviceName", void 0);
exports.AddTestimonialDto = AddTestimonialDto;
class UpdateFAQsContentDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [FAQItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => FAQItemDto),
    __metadata("design:type", Array)
], UpdateFAQsContentDto.prototype, "faqs", void 0);
exports.UpdateFAQsContentDto = UpdateFAQsContentDto;
class AddFAQDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'What are your opening hours?' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddFAQDto.prototype, "question", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'We are open Monday to Saturday, 9am to 6pm.' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddFAQDto.prototype, "answer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'booking' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddFAQDto.prototype, "category", void 0);
exports.AddFAQDto = AddFAQDto;
class UpdateAboutContentDto extends AboutContentDto {
}
exports.UpdateAboutContentDto = UpdateAboutContentDto;
class UpdateGalleryContentDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [GalleryImageDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => GalleryImageDto),
    __metadata("design:type", Array)
], UpdateGalleryContentDto.prototype, "images", void 0);
exports.UpdateGalleryContentDto = UpdateGalleryContentDto;
class AddGalleryImageDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/gallery/image1.jpg' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddGalleryImageDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Beautiful balayage transformation' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddGalleryImageDto.prototype, "caption", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'hair' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddGalleryImageDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Balayage Highlights' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddGalleryImageDto.prototype, "serviceName", void 0);
exports.AddGalleryImageDto = AddGalleryImageDto;
class ImportFAQsFromChatDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Replace existing FAQs or append to them' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ImportFAQsFromChatDto.prototype, "replaceExisting", void 0);
exports.ImportFAQsFromChatDto = ImportFAQsFromChatDto;
//# sourceMappingURL=storefront.dto.js.map