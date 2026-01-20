import { Model } from 'mongoose';
import { ServiceCategory } from '../service/schemas/service-category.schema';
export declare class DropOldCategoryIndexMigration {
    private serviceCategoryModel;
    private readonly logger;
    constructor(serviceCategoryModel: Model<ServiceCategory>);
    run(): Promise<void>;
}
