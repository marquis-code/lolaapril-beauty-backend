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
exports.CreateBookingWithSourceDto = exports.BookingSourceDto = exports.BookingSourceType = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const create_booking_dto_1 = require("./create-booking.dto");
var BookingSourceType;
(function (BookingSourceType) {
    BookingSourceType["MARKETPLACE"] = "marketplace";
    BookingSourceType["DIRECT_LINK"] = "direct_link";
    BookingSourceType["QR_CODE"] = "qr_code";
    BookingSourceType["BUSINESS_WEBSITE"] = "business_website";
    BookingSourceType["GOOGLE_SEARCH"] = "google_search";
    BookingSourceType["SOCIAL_MEDIA"] = "social_media";
    BookingSourceType["REFERRAL"] = "referral";
    BookingSourceType["WALK_IN"] = "walk_in";
    BookingSourceType["PHONE"] = "phone";
})(BookingSourceType = exports.BookingSourceType || (exports.BookingSourceType = {}));
class BookingSourceDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: BookingSourceType,
        example: BookingSourceType.DIRECT_LINK,
        description: 'The source type of the booking (REQUIRED for commission tracking)'
    }),
    (0, class_validator_1.IsEnum)(BookingSourceType),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "sourceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'web',
        description: 'The channel through which booking was made'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "channel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'https://google.com',
        description: 'The referrer URL'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "referrer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'https://google.com/search',
        description: 'The full referrer URL'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "referrerUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'TRACK-123456',
        description: 'Tracking code for analytics'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "trackingCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'CAMP-001',
        description: 'Campaign identifier'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "campaignId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'AFF-123',
        description: 'Affiliate identifier'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "affiliateId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'QR-ABC123-XYZ',
        description: 'QR code ID, tracking link ID, etc.'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "sourceIdentifier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'REF-JOHN123',
        description: 'Referral code'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "referralCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'google',
        description: 'UTM source parameter'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "utmSource", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'cpc',
        description: 'UTM medium parameter'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "utmMedium", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'summer_sale',
        description: 'UTM campaign parameter'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "utmCampaign", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '192.168.1.1',
        description: 'Client IP address'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Mozilla/5.0...',
        description: 'Client user agent string'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "userAgent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional metadata for tracking'
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], BookingSourceDto.prototype, "metadata", void 0);
exports.BookingSourceDto = BookingSourceDto;
class CreateBookingWithSourceDto extends create_booking_dto_1.CreateBookingDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: BookingSourceDto,
        description: 'Booking source information for tracking and commission calculation'
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BookingSourceDto),
    __metadata("design:type", BookingSourceDto)
], CreateBookingWithSourceDto.prototype, "bookingSource", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: BookingSourceType,
        example: BookingSourceType.DIRECT_LINK,
        description: 'DEPRECATED: Use bookingSource.sourceType instead'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(BookingSourceType),
    __metadata("design:type", String)
], CreateBookingWithSourceDto.prototype, "sourceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'QR-ABC123-XYZ',
        description: 'DEPRECATED: Use bookingSource.sourceIdentifier instead'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBookingWithSourceDto.prototype, "sourceIdentifier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'REF-JOHN123',
        description: 'DEPRECATED: Use bookingSource.referralCode instead'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBookingWithSourceDto.prototype, "referralCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'google',
        description: 'DEPRECATED: Use bookingSource.utmSource instead'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBookingWithSourceDto.prototype, "utmSource", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'cpc',
        description: 'DEPRECATED: Use bookingSource.utmMedium instead'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBookingWithSourceDto.prototype, "utmMedium", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'summer_sale',
        description: 'DEPRECATED: Use bookingSource.utmCampaign instead'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBookingWithSourceDto.prototype, "utmCampaign", void 0);
exports.CreateBookingWithSourceDto = CreateBookingWithSourceDto;
//# sourceMappingURL=create-booking-with-source.dto.js.map