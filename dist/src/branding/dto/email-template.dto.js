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
exports.UpdateEmailTemplateDto = exports.CreateEmailTemplateDto = exports.EmailTemplateType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var EmailTemplateType;
(function (EmailTemplateType) {
    EmailTemplateType["BOOKING_CONFIRMATION"] = "booking_confirmation";
    EmailTemplateType["BOOKING_REMINDER"] = "booking_reminder";
    EmailTemplateType["BOOKING_CANCELLATION"] = "booking_cancellation";
    EmailTemplateType["WELCOME"] = "welcome";
    EmailTemplateType["PASSWORD_RESET"] = "password_reset";
    EmailTemplateType["INVOICE"] = "invoice";
    EmailTemplateType["RECEIPT"] = "receipt";
    EmailTemplateType["CUSTOM"] = "custom";
})(EmailTemplateType = exports.EmailTemplateType || (exports.EmailTemplateType = {}));
class CreateEmailTemplateDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: EmailTemplateType,
        description: 'Type of email template',
        example: EmailTemplateType.BOOKING_CONFIRMATION
    }),
    (0, class_validator_1.IsEnum)(EmailTemplateType),
    __metadata("design:type", String)
], CreateEmailTemplateDto.prototype, "templateType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Booking Confirmed - {{businessName}}',
        description: 'Email subject line (can include variables like {{businessName}})'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmailTemplateDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '<h1>Hello {{clientName}}</h1><p>Your booking is confirmed!</p>',
        description: 'HTML content of the email (can include variables)'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmailTemplateDto.prototype, "htmlContent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Hello {{clientName}}, Your booking is confirmed!',
        description: 'Plain text version (auto-generated if not provided)'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmailTemplateDto.prototype, "textContent", void 0);
exports.CreateEmailTemplateDto = CreateEmailTemplateDto;
class UpdateEmailTemplateDto extends (0, swagger_1.PartialType)(CreateEmailTemplateDto) {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Set template as active or inactive',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateEmailTemplateDto.prototype, "isActive", void 0);
exports.UpdateEmailTemplateDto = UpdateEmailTemplateDto;
//# sourceMappingURL=email-template.dto.js.map