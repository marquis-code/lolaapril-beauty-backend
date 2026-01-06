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
exports.UpdateThemeDto = exports.CreateThemeDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class ColorScheme {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#3B82F6', description: 'Primary brand color' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ColorScheme.prototype, "primary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#10B981', description: 'Secondary brand color' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ColorScheme.prototype, "secondary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#F59E0B', description: 'Accent color' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ColorScheme.prototype, "accent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#FFFFFF', description: 'Background color' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ColorScheme.prototype, "background", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#1F2937', description: 'Text color' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ColorScheme.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#EF4444', description: 'Error color' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ColorScheme.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#10B981', description: 'Success color' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ColorScheme.prototype, "success", void 0);
class Typography {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Inter, sans-serif', description: 'Default font family' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Typography.prototype, "fontFamily", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Inter, sans-serif', description: 'Heading font' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Typography.prototype, "headingFont", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Inter, sans-serif', description: 'Body text font' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Typography.prototype, "bodyFont", void 0);
class Logo {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/logo.png', description: 'Logo URL' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Logo.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 200, description: 'Logo width in pixels' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Logo.prototype, "width", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 80, description: 'Logo height in pixels' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Logo.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Company Logo', description: 'Logo alt text' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Logo.prototype, "alt", void 0);
class Favicon {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/favicon.ico', description: 'Favicon URL' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Favicon.prototype, "url", void 0);
class CustomCss {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, description: 'Enable custom CSS' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CustomCss.prototype, "enabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '.custom-class { color: red; }', description: 'Custom CSS code' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomCss.prototype, "cssCode", void 0);
class CreateThemeDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ColorScheme, description: 'Color scheme configuration' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ColorScheme),
    __metadata("design:type", ColorScheme)
], CreateThemeDto.prototype, "colors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Typography, description: 'Typography configuration' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Typography),
    __metadata("design:type", Typography)
], CreateThemeDto.prototype, "typography", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Logo, description: 'Logo configuration' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Logo),
    __metadata("design:type", Logo)
], CreateThemeDto.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Favicon, description: 'Favicon configuration' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Favicon),
    __metadata("design:type", Favicon)
], CreateThemeDto.prototype, "favicon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CustomCss, description: 'Custom CSS configuration' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CustomCss),
    __metadata("design:type", CustomCss)
], CreateThemeDto.prototype, "customCss", void 0);
exports.CreateThemeDto = CreateThemeDto;
class UpdateThemeDto extends (0, swagger_1.PartialType)(CreateThemeDto) {
}
exports.UpdateThemeDto = UpdateThemeDto;
//# sourceMappingURL=create-theme.dto.js.map