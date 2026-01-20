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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DropOldCategoryIndexMigration_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropOldCategoryIndexMigration = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const service_category_schema_1 = require("../service/schemas/service-category.schema");
let DropOldCategoryIndexMigration = DropOldCategoryIndexMigration_1 = class DropOldCategoryIndexMigration {
    constructor(serviceCategoryModel) {
        this.serviceCategoryModel = serviceCategoryModel;
        this.logger = new common_1.Logger(DropOldCategoryIndexMigration_1.name);
    }
    async run() {
        try {
            this.logger.log('🔄 Starting migration: Drop old categoryName_1 index');
            await this.serviceCategoryModel.collection.dropIndex('categoryName_1');
            this.logger.log('✅ Successfully dropped categoryName_1 index');
        }
        catch (error) {
            if (error.code === 27 || error.codeName === 'IndexNotFound') {
                this.logger.log('ℹ️  categoryName_1 index does not exist (already removed or never created)');
            }
            else {
                this.logger.error('❌ Error dropping index:', error.message);
                throw error;
            }
        }
    }
};
DropOldCategoryIndexMigration = DropOldCategoryIndexMigration_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(service_category_schema_1.ServiceCategory.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DropOldCategoryIndexMigration);
exports.DropOldCategoryIndexMigration = DropOldCategoryIndexMigration;
//# sourceMappingURL=drop-old-category-index.migration.js.map