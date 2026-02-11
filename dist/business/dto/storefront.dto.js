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
exports.StorefrontResponseDto = exports.StorefrontStaffDto = exports.StaffRatingDto = exports.StaffSkillDto = exports.StorefrontServiceDto = exports.ServiceOnlineBookingDto = exports.ServiceVariantDto = exports.ServiceDurationDto = exports.ServicePriceDto = exports.StorefrontServiceCategoryDto = exports.StorefrontBusinessInfoDto = exports.BusinessHoursDto = exports.BusinessHoursBreakDto = exports.BusinessSettingsDto = exports.BusinessContactDto = exports.SocialMediaDto = exports.BusinessAddressDto = exports.BusinessStatsDto = exports.ComponentStylesDto = exports.CardStylesDto = exports.ButtonStylesDto = exports.StorefrontLayoutDto = exports.SocialProofSettingsDto = exports.BookingFlowSettingsDto = exports.ContactDisplaySettingsDto = exports.TestimonialsSettingsDto = exports.GallerySettingsDto = exports.StaffDisplaySettingsDto = exports.ServiceDisplaySettingsDto = exports.StorefrontSectionDto = exports.HeroSectionDto = exports.StorefrontThemeDto = exports.FooterDto = exports.FooterLinkDto = exports.NavbarDto = exports.NavbarMenuItemDto = exports.ThemeSeoDto = exports.ThemeLogoDto = exports.ThemeTypographyDto = exports.ThemeColorsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ThemeColorsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ThemeColorsDto.prototype, "primary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ThemeColorsDto.prototype, "secondary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ThemeColorsDto.prototype, "accent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ThemeColorsDto.prototype, "background", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ThemeColorsDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ThemeColorsDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ThemeColorsDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], ThemeColorsDto.prototype, "muted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], ThemeColorsDto.prototype, "border", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], ThemeColorsDto.prototype, "cardBackground", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], ThemeColorsDto.prototype, "inputBackground", void 0);
exports.ThemeColorsDto = ThemeColorsDto;
class ThemeTypographyDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ThemeTypographyDto.prototype, "fontFamily", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ThemeTypographyDto.prototype, "headingFont", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ThemeTypographyDto.prototype, "bodyFont", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], ThemeTypographyDto.prototype, "fontSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], ThemeTypographyDto.prototype, "fontWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], ThemeTypographyDto.prototype, "lineHeight", void 0);
exports.ThemeTypographyDto = ThemeTypographyDto;
class ThemeLogoDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ThemeLogoDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ThemeLogoDto.prototype, "width", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ThemeLogoDto.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ThemeLogoDto.prototype, "alt", void 0);
exports.ThemeLogoDto = ThemeLogoDto;
class ThemeSeoDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], ThemeSeoDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], ThemeSeoDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: [String] }),
    __metadata("design:type", Array)
], ThemeSeoDto.prototype, "keywords", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], ThemeSeoDto.prototype, "ogImage", void 0);
exports.ThemeSeoDto = ThemeSeoDto;
class NavbarMenuItemDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NavbarMenuItemDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], NavbarMenuItemDto.prototype, "sectionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], NavbarMenuItemDto.prototype, "url", void 0);
exports.NavbarMenuItemDto = NavbarMenuItemDto;
class NavbarDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NavbarDto.prototype, "style", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], NavbarDto.prototype, "showLogo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], NavbarDto.prototype, "showBusinessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], NavbarDto.prototype, "showBookButton", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NavbarDto.prototype, "bookButtonText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [NavbarMenuItemDto], required: false }),
    __metadata("design:type", Array)
], NavbarDto.prototype, "menuItems", void 0);
exports.NavbarDto = NavbarDto;
class FooterLinkDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FooterLinkDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FooterLinkDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], FooterLinkDto.prototype, "openInNewTab", void 0);
exports.FooterLinkDto = FooterLinkDto;
class FooterDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], FooterDto.prototype, "enabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], FooterDto.prototype, "showSocialLinks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], FooterDto.prototype, "showQuickLinks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], FooterDto.prototype, "showContactInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], FooterDto.prototype, "showNewsletter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], FooterDto.prototype, "copyrightText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [FooterLinkDto], required: false }),
    __metadata("design:type", Array)
], FooterDto.prototype, "customLinks", void 0);
exports.FooterDto = FooterDto;
class StorefrontThemeDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ThemeColorsDto }),
    __metadata("design:type", ThemeColorsDto)
], StorefrontThemeDto.prototype, "colors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ThemeTypographyDto }),
    __metadata("design:type", ThemeTypographyDto)
], StorefrontThemeDto.prototype, "typography", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ThemeLogoDto, required: false }),
    __metadata("design:type", ThemeLogoDto)
], StorefrontThemeDto.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], StorefrontThemeDto.prototype, "favicon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], StorefrontThemeDto.prototype, "customCss", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ThemeSeoDto, required: false }),
    __metadata("design:type", ThemeSeoDto)
], StorefrontThemeDto.prototype, "seo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: NavbarDto, required: false }),
    __metadata("design:type", NavbarDto)
], StorefrontThemeDto.prototype, "navbar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: FooterDto, required: false }),
    __metadata("design:type", FooterDto)
], StorefrontThemeDto.prototype, "footer", void 0);
exports.StorefrontThemeDto = StorefrontThemeDto;
class HeroSectionDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], HeroSectionDto.prototype, "enabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'image, video, slideshow, or gradient' }),
    __metadata("design:type", String)
], HeroSectionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], HeroSectionDto.prototype, "coverImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], required: false }),
    __metadata("design:type", Array)
], HeroSectionDto.prototype, "slideshowImages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], HeroSectionDto.prototype, "videoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], HeroSectionDto.prototype, "gradient", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], HeroSectionDto.prototype, "headline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], HeroSectionDto.prototype, "subheadline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], HeroSectionDto.prototype, "textAlignment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], HeroSectionDto.prototype, "overlayStyle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], HeroSectionDto.prototype, "overlayOpacity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], HeroSectionDto.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], HeroSectionDto.prototype, "showBookButton", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], HeroSectionDto.prototype, "bookButtonText", void 0);
exports.HeroSectionDto = HeroSectionDto;
class StorefrontSectionDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StorefrontSectionDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StorefrontSectionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StorefrontSectionDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], StorefrontSectionDto.prototype, "subtitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], StorefrontSectionDto.prototype, "enabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], StorefrontSectionDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], StorefrontSectionDto.prototype, "settings", void 0);
exports.StorefrontSectionDto = StorefrontSectionDto;
class ServiceDisplaySettingsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ServiceDisplaySettingsDto.prototype, "layout", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ServiceDisplaySettingsDto.prototype, "columns", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ServiceDisplaySettingsDto.prototype, "showPrices", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ServiceDisplaySettingsDto.prototype, "showDuration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ServiceDisplaySettingsDto.prototype, "showDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ServiceDisplaySettingsDto.prototype, "showImages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ServiceDisplaySettingsDto.prototype, "groupByCategory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Boolean)
], ServiceDisplaySettingsDto.prototype, "showFilters", void 0);
exports.ServiceDisplaySettingsDto = ServiceDisplaySettingsDto;
class StaffDisplaySettingsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StaffDisplaySettingsDto.prototype, "layout", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], StaffDisplaySettingsDto.prototype, "columns", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], StaffDisplaySettingsDto.prototype, "showBio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], StaffDisplaySettingsDto.prototype, "showSpecialties", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], StaffDisplaySettingsDto.prototype, "showRatings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Boolean)
], StaffDisplaySettingsDto.prototype, "showBookButton", void 0);
exports.StaffDisplaySettingsDto = StaffDisplaySettingsDto;
class GallerySettingsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GallerySettingsDto.prototype, "enabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], GallerySettingsDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GallerySettingsDto.prototype, "layout", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GallerySettingsDto.prototype, "columns", void 0);
exports.GallerySettingsDto = GallerySettingsDto;
class TestimonialsSettingsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], TestimonialsSettingsDto.prototype, "enabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], TestimonialsSettingsDto.prototype, "showRating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TestimonialsSettingsDto.prototype, "layout", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TestimonialsSettingsDto.prototype, "maxToShow", void 0);
exports.TestimonialsSettingsDto = TestimonialsSettingsDto;
class ContactDisplaySettingsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ContactDisplaySettingsDto.prototype, "showMap", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ContactDisplaySettingsDto.prototype, "showAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ContactDisplaySettingsDto.prototype, "showPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ContactDisplaySettingsDto.prototype, "showEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ContactDisplaySettingsDto.prototype, "showSocialLinks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ContactDisplaySettingsDto.prototype, "showBusinessHours", void 0);
exports.ContactDisplaySettingsDto = ContactDisplaySettingsDto;
class BookingFlowSettingsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'service-first, staff-first, or date-first' }),
    __metadata("design:type", String)
], BookingFlowSettingsDto.prototype, "flow", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], BookingFlowSettingsDto.prototype, "allowGuestBooking", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], BookingFlowSettingsDto.prototype, "showStaffSelection", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], BookingFlowSettingsDto.prototype, "requireStaffSelection", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], BookingFlowSettingsDto.prototype, "showServiceImages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], BookingFlowSettingsDto.prototype, "allowMultipleServices", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BookingFlowSettingsDto.prototype, "datePickerStyle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], BookingFlowSettingsDto.prototype, "showAvailableSlots", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BookingFlowSettingsDto.prototype, "slotDuration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BookingFlowSettingsDto.prototype, "advanceBookingDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BookingFlowSettingsDto.prototype, "minAdvanceHours", void 0);
exports.BookingFlowSettingsDto = BookingFlowSettingsDto;
class SocialProofSettingsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SocialProofSettingsDto.prototype, "showReviewCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SocialProofSettingsDto.prototype, "showAverageRating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SocialProofSettingsDto.prototype, "showTotalBookings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Boolean)
], SocialProofSettingsDto.prototype, "showTrustBadges", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], required: false }),
    __metadata("design:type", Array)
], SocialProofSettingsDto.prototype, "badges", void 0);
exports.SocialProofSettingsDto = SocialProofSettingsDto;
class StorefrontLayoutDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: HeroSectionDto }),
    __metadata("design:type", HeroSectionDto)
], StorefrontLayoutDto.prototype, "hero", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [StorefrontSectionDto] }),
    __metadata("design:type", Array)
], StorefrontLayoutDto.prototype, "sections", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ServiceDisplaySettingsDto }),
    __metadata("design:type", ServiceDisplaySettingsDto)
], StorefrontLayoutDto.prototype, "serviceDisplay", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: StaffDisplaySettingsDto }),
    __metadata("design:type", StaffDisplaySettingsDto)
], StorefrontLayoutDto.prototype, "staffDisplay", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: GallerySettingsDto }),
    __metadata("design:type", GallerySettingsDto)
], StorefrontLayoutDto.prototype, "gallery", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: TestimonialsSettingsDto }),
    __metadata("design:type", TestimonialsSettingsDto)
], StorefrontLayoutDto.prototype, "testimonials", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ContactDisplaySettingsDto }),
    __metadata("design:type", ContactDisplaySettingsDto)
], StorefrontLayoutDto.prototype, "contact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: BookingFlowSettingsDto }),
    __metadata("design:type", BookingFlowSettingsDto)
], StorefrontLayoutDto.prototype, "bookingFlow", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SocialProofSettingsDto }),
    __metadata("design:type", SocialProofSettingsDto)
], StorefrontLayoutDto.prototype, "socialProof", void 0);
exports.StorefrontLayoutDto = StorefrontLayoutDto;
class ButtonStylesDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ButtonStylesDto.prototype, "borderRadius", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ButtonStylesDto.prototype, "style", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ButtonStylesDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ButtonStylesDto.prototype, "uppercase", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ButtonStylesDto.prototype, "fontWeight", void 0);
exports.ButtonStylesDto = ButtonStylesDto;
class CardStylesDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CardStylesDto.prototype, "borderRadius", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], CardStylesDto.prototype, "shadow", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CardStylesDto.prototype, "shadowIntensity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], CardStylesDto.prototype, "border", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CardStylesDto.prototype, "borderColor", void 0);
exports.CardStylesDto = CardStylesDto;
class ComponentStylesDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ButtonStylesDto }),
    __metadata("design:type", ButtonStylesDto)
], ComponentStylesDto.prototype, "buttons", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CardStylesDto }),
    __metadata("design:type", CardStylesDto)
], ComponentStylesDto.prototype, "cards", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ComponentStylesDto.prototype, "inputBorderRadius", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ComponentStylesDto.prototype, "sectionSpacing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ComponentStylesDto.prototype, "maxContentWidth", void 0);
exports.ComponentStylesDto = ComponentStylesDto;
class BusinessStatsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BusinessStatsDto.prototype, "totalReviews", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BusinessStatsDto.prototype, "averageRating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BusinessStatsDto.prototype, "totalClients", void 0);
exports.BusinessStatsDto = BusinessStatsDto;
class BusinessAddressDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BusinessAddressDto.prototype, "street", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BusinessAddressDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BusinessAddressDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BusinessAddressDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], BusinessAddressDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], BusinessAddressDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], BusinessAddressDto.prototype, "longitude", void 0);
exports.BusinessAddressDto = BusinessAddressDto;
class SocialMediaDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], SocialMediaDto.prototype, "facebook", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], SocialMediaDto.prototype, "instagram", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], SocialMediaDto.prototype, "twitter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], SocialMediaDto.prototype, "tiktok", void 0);
exports.SocialMediaDto = SocialMediaDto;
class BusinessContactDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BusinessContactDto.prototype, "primaryPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], BusinessContactDto.prototype, "secondaryPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BusinessContactDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], BusinessContactDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SocialMediaDto, required: false }),
    __metadata("design:type", SocialMediaDto)
], BusinessContactDto.prototype, "socialMedia", void 0);
exports.BusinessContactDto = BusinessContactDto;
class BusinessSettingsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BusinessSettingsDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BusinessSettingsDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BusinessSettingsDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BusinessSettingsDto.prototype, "defaultAppointmentDuration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BusinessSettingsDto.prototype, "bufferTimeBetweenAppointments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BusinessSettingsDto.prototype, "cancellationPolicyHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BusinessSettingsDto.prototype, "advanceBookingDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], BusinessSettingsDto.prototype, "allowOnlineBooking", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BusinessSettingsDto.prototype, "taxRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BusinessSettingsDto.prototype, "serviceCharge", void 0);
exports.BusinessSettingsDto = BusinessSettingsDto;
class BusinessHoursBreakDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BusinessHoursBreakDto.prototype, "openTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BusinessHoursBreakDto.prototype, "closeTime", void 0);
exports.BusinessHoursBreakDto = BusinessHoursBreakDto;
class BusinessHoursDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BusinessHoursDto.prototype, "day", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], BusinessHoursDto.prototype, "isOpen", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], BusinessHoursDto.prototype, "openTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], BusinessHoursDto.prototype, "closeTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [BusinessHoursBreakDto], required: false }),
    __metadata("design:type", Array)
], BusinessHoursDto.prototype, "breaks", void 0);
exports.BusinessHoursDto = BusinessHoursDto;
class StorefrontBusinessInfoDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StorefrontBusinessInfoDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StorefrontBusinessInfoDto.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StorefrontBusinessInfoDto.prototype, "subdomain", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], StorefrontBusinessInfoDto.prototype, "businessDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StorefrontBusinessInfoDto.prototype, "businessType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], StorefrontBusinessInfoDto.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], StorefrontBusinessInfoDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: BusinessAddressDto }),
    __metadata("design:type", BusinessAddressDto)
], StorefrontBusinessInfoDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: BusinessContactDto }),
    __metadata("design:type", BusinessContactDto)
], StorefrontBusinessInfoDto.prototype, "contact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: BusinessSettingsDto }),
    __metadata("design:type", BusinessSettingsDto)
], StorefrontBusinessInfoDto.prototype, "settings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [BusinessHoursDto] }),
    __metadata("design:type", Array)
], StorefrontBusinessInfoDto.prototype, "businessHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: BusinessStatsDto }),
    __metadata("design:type", BusinessStatsDto)
], StorefrontBusinessInfoDto.prototype, "stats", void 0);
exports.StorefrontBusinessInfoDto = StorefrontBusinessInfoDto;
class StorefrontServiceCategoryDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StorefrontServiceCategoryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StorefrontServiceCategoryDto.prototype, "categoryName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], StorefrontServiceCategoryDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], StorefrontServiceCategoryDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], StorefrontServiceCategoryDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], StorefrontServiceCategoryDto.prototype, "displayOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StorefrontServiceCategoryDto.prototype, "appointmentColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], StorefrontServiceCategoryDto.prototype, "isActive", void 0);
exports.StorefrontServiceCategoryDto = StorefrontServiceCategoryDto;
class ServicePriceDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ServicePriceDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ServicePriceDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], ServicePriceDto.prototype, "minimumAmount", void 0);
exports.ServicePriceDto = ServicePriceDto;
class ServiceDurationDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], ServiceDurationDto.prototype, "servicingTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], ServiceDurationDto.prototype, "processingTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ServiceDurationDto.prototype, "totalDuration", void 0);
exports.ServiceDurationDto = ServiceDurationDto;
class ServiceVariantDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ServiceVariantDto.prototype, "variantName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ServiceVariantDto.prototype, "variantDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], ServiceVariantDto.prototype, "pricing", void 0);
exports.ServiceVariantDto = ServiceVariantDto;
class ServiceOnlineBookingDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ServiceOnlineBookingDto.prototype, "enabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ServiceOnlineBookingDto.prototype, "availableFor", void 0);
exports.ServiceOnlineBookingDto = ServiceOnlineBookingDto;
class StorefrontServiceDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StorefrontServiceDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StorefrontServiceDto.prototype, "serviceName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], StorefrontServiceDto.prototype, "serviceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StorefrontServiceDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], StorefrontServiceDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StorefrontServiceDto.prototype, "priceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ServicePriceDto }),
    __metadata("design:type", ServicePriceDto)
], StorefrontServiceDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ServiceDurationDto }),
    __metadata("design:type", ServiceDurationDto)
], StorefrontServiceDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], StorefrontServiceDto.prototype, "extraTimeOptions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], StorefrontServiceDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], StorefrontServiceDto.prototype, "allTeamMembers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], StorefrontServiceDto.prototype, "assignedStaffIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ServiceOnlineBookingDto }),
    __metadata("design:type", ServiceOnlineBookingDto)
], StorefrontServiceDto.prototype, "onlineBooking", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ServiceVariantDto], required: false }),
    __metadata("design:type", Array)
], StorefrontServiceDto.prototype, "variants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], required: false }),
    __metadata("design:type", Array)
], StorefrontServiceDto.prototype, "serviceAddOns", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], StorefrontServiceDto.prototype, "isActive", void 0);
exports.StorefrontServiceDto = StorefrontServiceDto;
class StaffSkillDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StaffSkillDto.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StaffSkillDto.prototype, "serviceName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StaffSkillDto.prototype, "skillLevel", void 0);
exports.StaffSkillDto = StaffSkillDto;
class StaffRatingDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], StaffRatingDto.prototype, "average", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], StaffRatingDto.prototype, "totalReviews", void 0);
exports.StaffRatingDto = StaffRatingDto;
class StorefrontStaffDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StorefrontStaffDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StorefrontStaffDto.prototype, "staffId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StorefrontStaffDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StorefrontStaffDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], StorefrontStaffDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], StorefrontStaffDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], StorefrontStaffDto.prototype, "profileImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], StorefrontStaffDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], StorefrontStaffDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], StorefrontStaffDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], StorefrontStaffDto.prototype, "employmentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StorefrontStaffDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [StaffSkillDto] }),
    __metadata("design:type", Array)
], StorefrontStaffDto.prototype, "skills", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], StorefrontStaffDto.prototype, "serviceIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: StaffRatingDto }),
    __metadata("design:type", StaffRatingDto)
], StorefrontStaffDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], StorefrontStaffDto.prototype, "completedAppointments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], StorefrontStaffDto.prototype, "certifications", void 0);
exports.StorefrontStaffDto = StorefrontStaffDto;
class StorefrontResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], StorefrontResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: StorefrontBusinessInfoDto }),
    __metadata("design:type", StorefrontBusinessInfoDto)
], StorefrontResponseDto.prototype, "business", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: StorefrontThemeDto }),
    __metadata("design:type", StorefrontThemeDto)
], StorefrontResponseDto.prototype, "theme", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], StorefrontResponseDto.prototype, "isDefaultTheme", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: StorefrontLayoutDto }),
    __metadata("design:type", StorefrontLayoutDto)
], StorefrontResponseDto.prototype, "layout", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ComponentStylesDto }),
    __metadata("design:type", ComponentStylesDto)
], StorefrontResponseDto.prototype, "componentStyles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [StorefrontServiceCategoryDto] }),
    __metadata("design:type", Array)
], StorefrontResponseDto.prototype, "categories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [StorefrontServiceDto] }),
    __metadata("design:type", Array)
], StorefrontResponseDto.prototype, "services", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [StorefrontStaffDto] }),
    __metadata("design:type", Array)
], StorefrontResponseDto.prototype, "staff", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StorefrontResponseDto.prototype, "message", void 0);
exports.StorefrontResponseDto = StorefrontResponseDto;
//# sourceMappingURL=storefront.dto.js.map