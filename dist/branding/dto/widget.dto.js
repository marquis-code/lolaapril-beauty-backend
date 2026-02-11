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
exports.UpdateWidgetDto = exports.CreateWidgetDto = exports.WidgetTheme = exports.WidgetDisplayType = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
var WidgetDisplayType;
(function (WidgetDisplayType) {
    WidgetDisplayType["MODAL"] = "modal";
    WidgetDisplayType["INLINE"] = "inline";
    WidgetDisplayType["POPUP"] = "popup";
    WidgetDisplayType["SIDEBAR"] = "sidebar";
})(WidgetDisplayType = exports.WidgetDisplayType || (exports.WidgetDisplayType = {}));
var WidgetTheme;
(function (WidgetTheme) {
    WidgetTheme["LIGHT"] = "light";
    WidgetTheme["DARK"] = "dark";
    WidgetTheme["CUSTOM"] = "custom";
})(WidgetTheme = exports.WidgetTheme || (exports.WidgetTheme = {}));
class WidgetConfiguration {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: WidgetDisplayType,
        example: WidgetDisplayType.MODAL,
        description: 'How the widget is displayed'
    }),
    (0, class_validator_1.IsEnum)(WidgetDisplayType),
    __metadata("design:type", String)
], WidgetConfiguration.prototype, "displayType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Book Now',
        description: 'Text on the booking button'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WidgetConfiguration.prototype, "buttonText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '#3B82F6',
        description: 'Button color (hex)'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WidgetConfiguration.prototype, "buttonColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Show "Powered by" branding'
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], WidgetConfiguration.prototype, "showBranding", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: ['https://example.com', 'https://www.example.com'],
        description: 'Allowed origins for CORS'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], WidgetConfiguration.prototype, "allowedOrigins", void 0);
class WidgetStyling {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: WidgetTheme,
        example: WidgetTheme.LIGHT,
        description: 'Widget theme'
    }),
    (0, class_validator_1.IsEnum)(WidgetTheme),
    __metadata("design:type", String)
], WidgetStyling.prototype, "theme", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '#3B82F6',
        description: 'Primary color for the widget'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WidgetStyling.prototype, "primaryColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '8px',
        description: 'Border radius'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WidgetStyling.prototype, "borderRadius", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '14px',
        description: 'Font size'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WidgetStyling.prototype, "fontSize", void 0);
class CreateWidgetDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Homepage Widget',
        description: 'Widget name for internal reference'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWidgetDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: WidgetConfiguration,
        description: 'Widget configuration options'
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => WidgetConfiguration),
    __metadata("design:type", WidgetConfiguration)
], CreateWidgetDto.prototype, "configuration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: WidgetStyling,
        description: 'Widget styling options'
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => WidgetStyling),
    __metadata("design:type", WidgetStyling)
], CreateWidgetDto.prototype, "styling", void 0);
exports.CreateWidgetDto = CreateWidgetDto;
class UpdateWidgetDto extends (0, swagger_1.PartialType)(CreateWidgetDto) {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Set widget as active or inactive',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateWidgetDto.prototype, "isActive", void 0);
exports.UpdateWidgetDto = UpdateWidgetDto;
//# sourceMappingURL=widget.dto.js.map