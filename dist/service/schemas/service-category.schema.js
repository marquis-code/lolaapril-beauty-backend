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
exports.ServiceCategorySchema = exports.ServiceCategory = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
let ServiceCategory = class ServiceCategory {
};
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Hair Services' }),
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], ServiceCategory.prototype, "categoryName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#3B82F6' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ServiceCategory.prototype, "appointmentColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Professional hair styling, cutting, and treatment services for all hair types.'
    }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ServiceCategory.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '507f1f77bcf86cd799439011' }),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ServiceCategory.prototype, "businessId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ServiceCategory.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ServiceCategory.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ServiceCategory.prototype, "updatedAt", void 0);
ServiceCategory = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ServiceCategory);
exports.ServiceCategory = ServiceCategory;
exports.ServiceCategorySchema = mongoose_1.SchemaFactory.createForClass(ServiceCategory);
exports.ServiceCategorySchema.index({ businessId: 1, categoryName: 1 }, { unique: true });
exports.ServiceCategorySchema.index({ businessId: 1, isActive: 1 });
//# sourceMappingURL=service-category.schema.js.map