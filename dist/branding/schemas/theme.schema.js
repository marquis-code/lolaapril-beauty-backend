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
exports.ThemeSchema = exports.Theme = exports.ComponentStyles = exports.CardStyles = exports.ButtonStyles = exports.StorefrontLayout = exports.SocialProof = exports.BookingFlowSettings = exports.ContactDisplaySettings = exports.StaffDisplaySettings = exports.ServiceDisplaySettings = exports.StorefrontContent = exports.GalleryImage = exports.AboutContent = exports.FAQItem = exports.TestimonialItem = exports.TestimonialsSettings = exports.GallerySettings = exports.StorefrontSection = exports.HeroSection = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let HeroSection = class HeroSection {
};
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], HeroSection.prototype, "enabled", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['image', 'video', 'slideshow', 'gradient'], default: 'image' }),
    __metadata("design:type", String)
], HeroSection.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HeroSection.prototype, "coverImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], HeroSection.prototype, "slideshowImages", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HeroSection.prototype, "videoUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            from: String,
            to: String,
            direction: { type: String, default: 'to-right' }
        }
    }),
    __metadata("design:type", Object)
], HeroSection.prototype, "gradient", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HeroSection.prototype, "headline", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HeroSection.prototype, "subheadline", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'center' }),
    __metadata("design:type", String)
], HeroSection.prototype, "textAlignment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'light' }),
    __metadata("design:type", String)
], HeroSection.prototype, "overlayStyle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0.4 }),
    __metadata("design:type", Number)
], HeroSection.prototype, "overlayOpacity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '500px' }),
    __metadata("design:type", String)
], HeroSection.prototype, "height", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], HeroSection.prototype, "showBookButton", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Book Now' }),
    __metadata("design:type", String)
], HeroSection.prototype, "bookButtonText", void 0);
HeroSection = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], HeroSection);
exports.HeroSection = HeroSection;
let StorefrontSection = class StorefrontSection {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], StorefrontSection.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], StorefrontSection.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], StorefrontSection.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StorefrontSection.prototype, "subtitle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], StorefrontSection.prototype, "enabled", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], StorefrontSection.prototype, "order", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], StorefrontSection.prototype, "settings", void 0);
StorefrontSection = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], StorefrontSection);
exports.StorefrontSection = StorefrontSection;
let GallerySettings = class GallerySettings {
};
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], GallerySettings.prototype, "enabled", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], GallerySettings.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'grid' }),
    __metadata("design:type", String)
], GallerySettings.prototype, "layout", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 3 }),
    __metadata("design:type", Number)
], GallerySettings.prototype, "columns", void 0);
GallerySettings = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], GallerySettings);
exports.GallerySettings = GallerySettings;
let TestimonialsSettings = class TestimonialsSettings {
};
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], TestimonialsSettings.prototype, "enabled", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], TestimonialsSettings.prototype, "showRating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'carousel' }),
    __metadata("design:type", String)
], TestimonialsSettings.prototype, "layout", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 6 }),
    __metadata("design:type", Number)
], TestimonialsSettings.prototype, "maxToShow", void 0);
TestimonialsSettings = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], TestimonialsSettings);
exports.TestimonialsSettings = TestimonialsSettings;
let TestimonialItem = class TestimonialItem {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TestimonialItem.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TestimonialItem.prototype, "clientName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TestimonialItem.prototype, "clientPhoto", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TestimonialItem.prototype, "clientTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TestimonialItem.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 1, max: 5, default: 5 }),
    __metadata("design:type", Number)
], TestimonialItem.prototype, "rating", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TestimonialItem.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TestimonialItem.prototype, "serviceName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], TestimonialItem.prototype, "isVisible", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], TestimonialItem.prototype, "order", void 0);
TestimonialItem = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], TestimonialItem);
exports.TestimonialItem = TestimonialItem;
let FAQItem = class FAQItem {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], FAQItem.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], FAQItem.prototype, "question", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], FAQItem.prototype, "answer", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], FAQItem.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], FAQItem.prototype, "isVisible", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], FAQItem.prototype, "order", void 0);
FAQItem = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], FAQItem);
exports.FAQItem = FAQItem;
let AboutContent = class AboutContent {
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AboutContent.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AboutContent.prototype, "subtitle", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AboutContent.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AboutContent.prototype, "image", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AboutContent.prototype, "imagePosition", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], AboutContent.prototype, "highlights", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AboutContent.prototype, "founderName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AboutContent.prototype, "founderPhoto", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AboutContent.prototype, "founderTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AboutContent.prototype, "founderQuote", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], AboutContent.prototype, "showTeamStats", void 0);
AboutContent = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], AboutContent);
exports.AboutContent = AboutContent;
let GalleryImage = class GalleryImage {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], GalleryImage.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], GalleryImage.prototype, "url", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], GalleryImage.prototype, "thumbnail", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], GalleryImage.prototype, "caption", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], GalleryImage.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], GalleryImage.prototype, "serviceName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], GalleryImage.prototype, "isVisible", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], GalleryImage.prototype, "order", void 0);
GalleryImage = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], GalleryImage);
exports.GalleryImage = GalleryImage;
let StorefrontContent = class StorefrontContent {
};
__decorate([
    (0, mongoose_1.Prop)({ type: [TestimonialItem], default: [] }),
    __metadata("design:type", Array)
], StorefrontContent.prototype, "testimonials", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [FAQItem], default: [] }),
    __metadata("design:type", Array)
], StorefrontContent.prototype, "faqs", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: AboutContent, default: {} }),
    __metadata("design:type", AboutContent)
], StorefrontContent.prototype, "about", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [GalleryImage], default: [] }),
    __metadata("design:type", Array)
], StorefrontContent.prototype, "galleryImages", void 0);
StorefrontContent = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], StorefrontContent);
exports.StorefrontContent = StorefrontContent;
let ServiceDisplaySettings = class ServiceDisplaySettings {
};
__decorate([
    (0, mongoose_1.Prop)({ default: 'grid' }),
    __metadata("design:type", String)
], ServiceDisplaySettings.prototype, "layout", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 3 }),
    __metadata("design:type", Number)
], ServiceDisplaySettings.prototype, "columns", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ServiceDisplaySettings.prototype, "showPrices", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ServiceDisplaySettings.prototype, "showDuration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ServiceDisplaySettings.prototype, "showDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ServiceDisplaySettings.prototype, "showImages", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ServiceDisplaySettings.prototype, "groupByCategory", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ServiceDisplaySettings.prototype, "showFilters", void 0);
ServiceDisplaySettings = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ServiceDisplaySettings);
exports.ServiceDisplaySettings = ServiceDisplaySettings;
let StaffDisplaySettings = class StaffDisplaySettings {
};
__decorate([
    (0, mongoose_1.Prop)({ default: 'grid' }),
    __metadata("design:type", String)
], StaffDisplaySettings.prototype, "layout", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 4 }),
    __metadata("design:type", Number)
], StaffDisplaySettings.prototype, "columns", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], StaffDisplaySettings.prototype, "showBio", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], StaffDisplaySettings.prototype, "showSpecialties", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], StaffDisplaySettings.prototype, "showRatings", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], StaffDisplaySettings.prototype, "showBookButton", void 0);
StaffDisplaySettings = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], StaffDisplaySettings);
exports.StaffDisplaySettings = StaffDisplaySettings;
let ContactDisplaySettings = class ContactDisplaySettings {
};
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ContactDisplaySettings.prototype, "showMap", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ContactDisplaySettings.prototype, "showAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ContactDisplaySettings.prototype, "showPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ContactDisplaySettings.prototype, "showEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ContactDisplaySettings.prototype, "showSocialLinks", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ContactDisplaySettings.prototype, "showBusinessHours", void 0);
ContactDisplaySettings = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ContactDisplaySettings);
exports.ContactDisplaySettings = ContactDisplaySettings;
let BookingFlowSettings = class BookingFlowSettings {
};
__decorate([
    (0, mongoose_1.Prop)({ default: 'service-first' }),
    __metadata("design:type", String)
], BookingFlowSettings.prototype, "flow", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], BookingFlowSettings.prototype, "allowGuestBooking", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], BookingFlowSettings.prototype, "showStaffSelection", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], BookingFlowSettings.prototype, "requireStaffSelection", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], BookingFlowSettings.prototype, "showServiceImages", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], BookingFlowSettings.prototype, "allowMultipleServices", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'calendar' }),
    __metadata("design:type", String)
], BookingFlowSettings.prototype, "datePickerStyle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], BookingFlowSettings.prototype, "showAvailableSlots", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 30 }),
    __metadata("design:type", Number)
], BookingFlowSettings.prototype, "slotDuration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 30 }),
    __metadata("design:type", Number)
], BookingFlowSettings.prototype, "advanceBookingDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 2 }),
    __metadata("design:type", Number)
], BookingFlowSettings.prototype, "minAdvanceHours", void 0);
BookingFlowSettings = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], BookingFlowSettings);
exports.BookingFlowSettings = BookingFlowSettings;
let SocialProof = class SocialProof {
};
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], SocialProof.prototype, "showReviewCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], SocialProof.prototype, "showAverageRating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], SocialProof.prototype, "showTotalBookings", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], SocialProof.prototype, "showTrustBadges", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], SocialProof.prototype, "badges", void 0);
SocialProof = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], SocialProof);
exports.SocialProof = SocialProof;
let StorefrontLayout = class StorefrontLayout {
};
__decorate([
    (0, mongoose_1.Prop)({ type: HeroSection, default: {} }),
    __metadata("design:type", HeroSection)
], StorefrontLayout.prototype, "hero", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [StorefrontSection], default: [] }),
    __metadata("design:type", Array)
], StorefrontLayout.prototype, "sections", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: ServiceDisplaySettings, default: {} }),
    __metadata("design:type", ServiceDisplaySettings)
], StorefrontLayout.prototype, "serviceDisplay", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: StaffDisplaySettings, default: {} }),
    __metadata("design:type", StaffDisplaySettings)
], StorefrontLayout.prototype, "staffDisplay", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: GallerySettings, default: {} }),
    __metadata("design:type", GallerySettings)
], StorefrontLayout.prototype, "gallery", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: TestimonialsSettings, default: {} }),
    __metadata("design:type", TestimonialsSettings)
], StorefrontLayout.prototype, "testimonials", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: ContactDisplaySettings, default: {} }),
    __metadata("design:type", ContactDisplaySettings)
], StorefrontLayout.prototype, "contact", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: BookingFlowSettings, default: {} }),
    __metadata("design:type", BookingFlowSettings)
], StorefrontLayout.prototype, "bookingFlow", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: SocialProof, default: {} }),
    __metadata("design:type", SocialProof)
], StorefrontLayout.prototype, "socialProof", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: StorefrontContent, default: {} }),
    __metadata("design:type", StorefrontContent)
], StorefrontLayout.prototype, "content", void 0);
StorefrontLayout = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], StorefrontLayout);
exports.StorefrontLayout = StorefrontLayout;
let ButtonStyles = class ButtonStyles {
};
__decorate([
    (0, mongoose_1.Prop)({ default: '8px' }),
    __metadata("design:type", String)
], ButtonStyles.prototype, "borderRadius", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'filled' }),
    __metadata("design:type", String)
], ButtonStyles.prototype, "style", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'medium' }),
    __metadata("design:type", String)
], ButtonStyles.prototype, "size", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ButtonStyles.prototype, "uppercase", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '600' }),
    __metadata("design:type", String)
], ButtonStyles.prototype, "fontWeight", void 0);
ButtonStyles = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ButtonStyles);
exports.ButtonStyles = ButtonStyles;
let CardStyles = class CardStyles {
};
__decorate([
    (0, mongoose_1.Prop)({ default: '12px' }),
    __metadata("design:type", String)
], CardStyles.prototype, "borderRadius", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], CardStyles.prototype, "shadow", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'medium' }),
    __metadata("design:type", String)
], CardStyles.prototype, "shadowIntensity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], CardStyles.prototype, "border", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '#E5E7EB' }),
    __metadata("design:type", String)
], CardStyles.prototype, "borderColor", void 0);
CardStyles = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], CardStyles);
exports.CardStyles = CardStyles;
let ComponentStyles = class ComponentStyles {
};
__decorate([
    (0, mongoose_1.Prop)({ type: ButtonStyles, default: {} }),
    __metadata("design:type", ButtonStyles)
], ComponentStyles.prototype, "buttons", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: CardStyles, default: {} }),
    __metadata("design:type", CardStyles)
], ComponentStyles.prototype, "cards", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '8px' }),
    __metadata("design:type", String)
], ComponentStyles.prototype, "inputBorderRadius", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '24px' }),
    __metadata("design:type", String)
], ComponentStyles.prototype, "sectionSpacing", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '1200px' }),
    __metadata("design:type", String)
], ComponentStyles.prototype, "maxContentWidth", void 0);
ComponentStyles = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ComponentStyles);
exports.ComponentStyles = ComponentStyles;
let Theme = class Theme {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Theme.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            primary: { type: String, required: true },
            secondary: { type: String, required: true },
            accent: { type: String, required: true },
            background: { type: String, required: true },
            text: { type: String, required: true },
            error: { type: String, required: true },
            success: { type: String, required: true },
            muted: { type: String, default: '#6B7280' },
            border: { type: String, default: '#E5E7EB' },
            cardBackground: { type: String, default: '#FFFFFF' },
            inputBackground: { type: String, default: '#F9FAFB' },
        },
        required: true
    }),
    __metadata("design:type", Object)
], Theme.prototype, "colors", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            fontFamily: { type: String, required: true },
            headingFont: { type: String, required: true },
            bodyFont: { type: String, required: true },
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
    }),
    __metadata("design:type", Object)
], Theme.prototype, "typography", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            url: String,
            width: Number,
            height: Number,
            alt: String,
        }
    }),
    __metadata("design:type", Object)
], Theme.prototype, "logo", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            url: String,
        }
    }),
    __metadata("design:type", Object)
], Theme.prototype, "favicon", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            enabled: { type: Boolean, default: false },
            cssCode: { type: String, default: '' },
        },
        default: { enabled: false, cssCode: '' }
    }),
    __metadata("design:type", Object)
], Theme.prototype, "customCss", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: StorefrontLayout, default: {} }),
    __metadata("design:type", StorefrontLayout)
], Theme.prototype, "storefront", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: ComponentStyles, default: {} }),
    __metadata("design:type", ComponentStyles)
], Theme.prototype, "componentStyles", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            title: String,
            description: String,
            keywords: [String],
            ogImage: String,
        },
        default: {}
    }),
    __metadata("design:type", Object)
], Theme.prototype, "seo", void 0);
__decorate([
    (0, mongoose_1.Prop)({
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
    }),
    __metadata("design:type", Object)
], Theme.prototype, "footer", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            style: { type: String, default: 'default' },
            showLogo: { type: Boolean, default: true },
            showBusinessName: { type: Boolean, default: true },
            showBookButton: { type: Boolean, default: true },
            bookButtonText: { type: String, default: 'Book Now' },
            menuItems: [{
                    label: String,
                    sectionId: String,
                    url: String,
                }]
        },
        default: {}
    }),
    __metadata("design:type", Object)
], Theme.prototype, "navbar", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Theme.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Theme.prototype, "updatedAt", void 0);
Theme = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Theme);
exports.Theme = Theme;
exports.ThemeSchema = mongoose_1.SchemaFactory.createForClass(Theme);
exports.ThemeSchema.index({ tenantId: 1 }, { unique: true });
//# sourceMappingURL=theme.schema.js.map