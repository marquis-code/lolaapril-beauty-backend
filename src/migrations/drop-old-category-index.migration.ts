import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceCategory } from '../service/schemas/service-category.schema';

@Injectable()
export class DropOldCategoryIndexMigration {
  private readonly logger = new Logger(DropOldCategoryIndexMigration.name);

  constructor(
    @InjectModel(ServiceCategory.name)
    private serviceCategoryModel: Model<ServiceCategory>,
  ) {}

  async run() {
    try {
      this.logger.log('🔄 Starting migration: Drop old categoryName_1 index');
      
      // Drop the old single-field unique index
      await this.serviceCategoryModel.collection.dropIndex('categoryName_1');
      
      this.logger.log('✅ Successfully dropped categoryName_1 index');
    } catch (error) {
      // Index might not exist, which is fine
      if (error.code === 27 || error.codeName === 'IndexNotFound') {
        this.logger.log('ℹ️  categoryName_1 index does not exist (already removed or never created)');
      } else {
        this.logger.error('❌ Error dropping index:', error.message);
        throw error;
      }
    }
  }
}