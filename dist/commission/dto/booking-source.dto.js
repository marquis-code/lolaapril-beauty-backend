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
exports.BookingSourceDto = exports.BookingSourceType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
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
        description: 'The source type of the booking'
    }),
    (0, class_validator_1.IsEnum)(BookingSourceType),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "sourceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'QR-ABC123-XYZ' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "sourceIdentifier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'TRACK-123456' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "trackingCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'REF-JOHN123' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "referralCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'CAMP-001' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "campaignId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'AFF-123' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "affiliateId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'google' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "utmSource", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'cpc' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "utmMedium", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'summer_sale' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "utmCampaign", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'web' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "channel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://google.com' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "referrer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://google.com/search' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "referrerUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '192.168.1.1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Mozilla/5.0...' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingSourceDto.prototype, "userAgent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], BookingSourceDto.prototype, "metadata", void 0);
exports.BookingSourceDto = BookingSourceDto;
//# sourceMappingURL=booking-source.dto.js.map