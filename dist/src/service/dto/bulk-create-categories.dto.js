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
exports.BulkCreateServiceCategoriesDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const create_service_category_dto_1 = require("./create-service-category.dto");
class BulkCreateServiceCategoriesDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of service categories to create',
        type: [create_service_category_dto_1.CreateServiceCategoryDto],
        example: [
            {
                categoryName: 'Hair Services',
                appointmentColor: 'Blue',
                description: 'Professional hair styling, cutting, and treatment services',
            },
            {
                categoryName: 'Nail Services',
                appointmentColor: 'Pink',
                description: 'Manicure, pedicure, and nail art services',
            },
        ],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_service_category_dto_1.CreateServiceCategoryDto),
    __metadata("design:type", Array)
], BulkCreateServiceCategoriesDto.prototype, "categories", void 0);
exports.BulkCreateServiceCategoriesDto = BulkCreateServiceCategoriesDto;
//# sourceMappingURL=bulk-create-categories.dto.js.map