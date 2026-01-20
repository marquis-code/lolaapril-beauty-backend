import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceCategory, ServiceCategorySchema } from '../service/schemas/service-category.schema';
import { DropOldCategoryIndexMigration } from './drop-old-category-index.migration';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceCategory.name, schema: ServiceCategorySchema },
    ]),
  ],
  providers: [DropOldCategoryIndexMigration],
  exports: [DropOldCategoryIndexMigration],
})
export class MigrationsModule {}