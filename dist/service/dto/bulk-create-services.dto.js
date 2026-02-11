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
exports.BulkCreateServicesDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const create_service_dto_1 = require("./create-service.dto");
class BulkCreateServicesDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of services to create',
        type: [create_service_dto_1.CreateServiceDto],
        example: [
            {
                basicDetails: {
                    serviceName: "Men's Haircut",
                    serviceType: 'Hair Styling',
                    category: '64a1b2c3d4e5f6789012345a',
                    description: 'Professional haircut for men',
                },
                teamMembers: {
                    allTeamMembers: true,
                    selectedMembers: [],
                },
                resources: {
                    isRequired: false,
                    resources: [],
                },
                pricing: {
                    basePrice: 5000,
                    currency: 'NGN',
                },
                duration: {
                    value: 30,
                    unit: 'min',
                },
                booking: {
                    bookableOnline: true,
                },
                visibility: {
                    displayOnline: true,
                },
            },
        ],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_service_dto_1.CreateServiceDto),
    __metadata("design:type", Array)
], BulkCreateServicesDto.prototype, "services", void 0);
exports.BulkCreateServicesDto = BulkCreateServicesDto;
//# sourceMappingURL=bulk-create-services.dto.js.map