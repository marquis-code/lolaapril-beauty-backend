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
exports.VerifyDomainDto = exports.RequestCustomDomainDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class RequestCustomDomainDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'booking.example.com',
        description: 'Custom domain name (must be a valid domain)'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i, { message: 'Invalid domain format' }),
    __metadata("design:type", String)
], RequestCustomDomainDto.prototype, "domain", void 0);
exports.RequestCustomDomainDto = RequestCustomDomainDto;
class VerifyDomainDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Force verification even if DNS records are not fully propagated',
        example: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], VerifyDomainDto.prototype, "forceVerify", void 0);
exports.VerifyDomainDto = VerifyDomainDto;
//# sourceMappingURL=custom-domain.dto.js.map