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
exports.RejectMobileSpaDto = exports.SuggestTimeMobileSpaDto = exports.AcceptMobileSpaDto = exports.CreateMobileSpaDto = exports.MobileSpaLocationDto = exports.MobileSpaServiceDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class MobileSpaServiceDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: '507f1f77bcf86cd799439011' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MobileSpaServiceDto.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], MobileSpaServiceDto.prototype, "quantity", void 0);
exports.MobileSpaServiceDto = MobileSpaServiceDto;
class MobileSpaLocationDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123 Main St, Lagos' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MobileSpaLocationDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 6.5244 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], MobileSpaLocationDto.prototype, "lat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3.3792 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], MobileSpaLocationDto.prototype, "lng", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'ChIJxx2J0...' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MobileSpaLocationDto.prototype, "placeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Use the side gate' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MobileSpaLocationDto.prototype, "additionalDirections", void 0);
exports.MobileSpaLocationDto = MobileSpaLocationDto;
class CreateMobileSpaDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: '507f1f77bcf86cd799439011' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMobileSpaDto.prototype, "businessId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [MobileSpaServiceDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => MobileSpaServiceDto),
    __metadata("design:type", Array)
], CreateMobileSpaDto.prototype, "services", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateMobileSpaDto.prototype, "numberOfPeople", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: MobileSpaLocationDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => MobileSpaLocationDto),
    __metadata("design:type", MobileSpaLocationDto)
], CreateMobileSpaDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-03-15' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMobileSpaDto.prototype, "requestedDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '14:00' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMobileSpaDto.prototype, "requestedTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Please bring extra towels' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMobileSpaDto.prototype, "clientNotes", void 0);
exports.CreateMobileSpaDto = CreateMobileSpaDto;
class AcceptMobileSpaDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://pay.example.com/link123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AcceptMobileSpaDto.prototype, "paymentLink", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'We will arrive 15 minutes early' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AcceptMobileSpaDto.prototype, "businessNotes", void 0);
exports.AcceptMobileSpaDto = AcceptMobileSpaDto;
class SuggestTimeMobileSpaDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-03-16' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], SuggestTimeMobileSpaDto.prototype, "suggestedDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '10:00' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SuggestTimeMobileSpaDto.prototype, "suggestedTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'The original time is unavailable, how about this?' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SuggestTimeMobileSpaDto.prototype, "businessNotes", void 0);
exports.SuggestTimeMobileSpaDto = SuggestTimeMobileSpaDto;
class RejectMobileSpaDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'We cannot service this area' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RejectMobileSpaDto.prototype, "reason", void 0);
exports.RejectMobileSpaDto = RejectMobileSpaDto;
//# sourceMappingURL=mobile-spa.dto.js.map