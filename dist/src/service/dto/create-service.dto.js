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
exports.CreateServiceDto = exports.ServiceSettingsDto = exports.OnlineBookingDto = exports.PricingAndDurationDto = exports.ExtraTimeOptionsDto = exports.ServiceDurationDto = exports.PriceDto = exports.ResourcesDto = exports.TeamMembersDto = exports.TeamMemberDto = exports.BasicDetailsDto = exports.TimeValueDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class TimeValueDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TimeValueDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "h", enum: ["min", "h"] }),
    (0, class_validator_1.IsEnum)(["min", "h"]),
    __metadata("design:type", String)
], TimeValueDto.prototype, "unit", void 0);
exports.TimeValueDto = TimeValueDto;
class BasicDetailsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Men's Haircut" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BasicDetailsDto.prototype, "serviceName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Hair Styling" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BasicDetailsDto.prototype, "serviceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "64a1b2c3d4e5f6789012345a", description: "ServiceCategory ObjectId" }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BasicDetailsDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Professional men's haircut service including consultation, precision cutting, and basic styling.",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BasicDetailsDto.prototype, "description", void 0);
exports.BasicDetailsDto = BasicDetailsDto;
class TeamMemberDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "64a1b2c3d4e5f6789012345b", description: "User ObjectId" }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TeamMemberDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "John Doe" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TeamMemberDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Hair Stylist" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TeamMemberDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], TeamMemberDto.prototype, "selected", void 0);
exports.TeamMemberDto = TeamMemberDto;
class TeamMembersDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], TeamMembersDto.prototype, "allTeamMembers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TeamMemberDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TeamMemberDto),
    __metadata("design:type", Array)
], TeamMembersDto.prototype, "selectedMembers", void 0);
exports.TeamMembersDto = TeamMembersDto;
class ResourcesDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ResourcesDto.prototype, "isRequired", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        example: ["64a1b2c3d4e5f6789012345c", "64a1b2c3d4e5f6789012345d"],
        description: "Array of Resource ObjectIds"
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsMongoId)({ each: true }),
    __metadata("design:type", Array)
], ResourcesDto.prototype, "resourceList", void 0);
exports.ResourcesDto = ResourcesDto;
class PriceDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "NGN" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PriceDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5000 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PriceDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PriceDto.prototype, "minimumAmount", void 0);
exports.PriceDto = PriceDto;
class ServiceDurationDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: TimeValueDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TimeValueDto),
    __metadata("design:type", TimeValueDto)
], ServiceDurationDto.prototype, "servicingTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: TimeValueDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TimeValueDto),
    __metadata("design:type", TimeValueDto)
], ServiceDurationDto.prototype, "processingTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "1h 10min" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ServiceDurationDto.prototype, "totalDuration", void 0);
exports.ServiceDurationDto = ServiceDurationDto;
class ExtraTimeOptionsDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Team member becomes available during processing time" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExtraTimeOptionsDto.prototype, "processingTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Team member remains occupied during blocked time" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExtraTimeOptionsDto.prototype, "blockedTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Team member remains occupied during servicing time" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExtraTimeOptionsDto.prototype, "extraServicingTime", void 0);
exports.ExtraTimeOptionsDto = ExtraTimeOptionsDto;
class PricingAndDurationDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Fixed", enum: ["Fixed", "Free", "From"] }),
    (0, class_validator_1.IsEnum)(["Fixed", "Free", "From"]),
    __metadata("design:type", String)
], PricingAndDurationDto.prototype, "priceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PriceDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PriceDto),
    __metadata("design:type", PriceDto)
], PricingAndDurationDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ServiceDurationDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ServiceDurationDto),
    __metadata("design:type", ServiceDurationDto)
], PricingAndDurationDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: ExtraTimeOptionsDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ExtraTimeOptionsDto),
    __metadata("design:type", ExtraTimeOptionsDto)
], PricingAndDurationDto.prototype, "extraTimeOptions", void 0);
exports.PricingAndDurationDto = PricingAndDurationDto;
class OnlineBookingDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], OnlineBookingDto.prototype, "enabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "All clients" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OnlineBookingDto.prototype, "availableFor", void 0);
exports.OnlineBookingDto = OnlineBookingDto;
class ServiceSettingsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: OnlineBookingDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => OnlineBookingDto),
    __metadata("design:type", OnlineBookingDto)
], ServiceSettingsDto.prototype, "onlineBooking", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        example: ["64a1b2c3d4e5f6789012345e", "64a1b2c3d4e5f6789012345f"],
        description: "Array of Form ObjectIds"
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsMongoId)({ each: true }),
    __metadata("design:type", Array)
], ServiceSettingsDto.prototype, "forms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        example: ["64a1b2c3d4e5f6789012345g", "64a1b2c3d4e5f6789012345h"],
        description: "Array of Commission ObjectIds"
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsMongoId)({ each: true }),
    __metadata("design:type", Array)
], ServiceSettingsDto.prototype, "commissions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: "object",
        additionalProperties: true,
        example: {}
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ServiceSettingsDto.prototype, "generalSettings", void 0);
exports.ServiceSettingsDto = ServiceSettingsDto;
class CreateServiceDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: BasicDetailsDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BasicDetailsDto),
    __metadata("design:type", BasicDetailsDto)
], CreateServiceDto.prototype, "basicDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: TeamMembersDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TeamMembersDto),
    __metadata("design:type", TeamMembersDto)
], CreateServiceDto.prototype, "teamMembers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: ResourcesDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ResourcesDto),
    __metadata("design:type", ResourcesDto)
], CreateServiceDto.prototype, "resources", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PricingAndDurationDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PricingAndDurationDto),
    __metadata("design:type", PricingAndDurationDto)
], CreateServiceDto.prototype, "pricingAndDuration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        example: ["64a1b2c3d4e5f6789012345i", "64a1b2c3d4e5f6789012345j"],
        description: "Array of ServiceAddOn ObjectIds"
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsMongoId)({ each: true }),
    __metadata("design:type", Array)
], CreateServiceDto.prototype, "serviceAddOns", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: ServiceSettingsDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ServiceSettingsDto),
    __metadata("design:type", ServiceSettingsDto)
], CreateServiceDto.prototype, "settings", void 0);
exports.CreateServiceDto = CreateServiceDto;
//# sourceMappingURL=create-service.dto.js.map