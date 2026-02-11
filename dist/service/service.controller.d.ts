import { ServiceService } from "./service.service";
import { CreateServiceCategoryDto } from "./dto/create-service-category.dto";
import { CreateServiceDto } from "./dto/create-service.dto";
import { CreateServiceBundleDto } from "./dto/create-service-bundle.dto";
import { CreateServiceVariantDto } from "./dto/service-variant.dto";
import { UpdateServiceCategoryDto } from "./dto/update-service-category.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { UpdateServiceBundleDto } from "./dto/update-service-bundle.dto";
import { ServiceQueryDto } from "./dto/service-query.dto";
import { BulkCreateServiceCategoriesDto } from "./dto/bulk-create-categories.dto";
import { BulkCreateServicesDto } from "./dto/bulk-create-services.dto";
import { ServiceCategory } from "./schemas/service-category.schema";
import { Service } from "./schemas/service.schema";
import { ServiceBundle } from "./schemas/service-bundle.schema";
import { RequestWithUser } from "../auth/types/request-with-user.interface";
export declare class ServiceController {
    private readonly serviceService;
    constructor(serviceService: ServiceService);
    createCategory(createCategoryDto: CreateServiceCategoryDto, businessId: string): Promise<import("../common/interfaces/common.interface").ApiResponse<ServiceCategory>>;
    bulkCreateCategories(bulkCreateDto: BulkCreateServiceCategoriesDto, businessId: string): Promise<import("../common/interfaces/common.interface").ApiResponse<{
        created: ServiceCategory[];
        failed: {
            category: string;
            error: string;
        }[];
    }>>;
    findAllCategories(subdomain?: string, businessId?: string, req?: RequestWithUser): Promise<import("../common/interfaces/common.interface").ApiResponse<ServiceCategory[]>>;
    updateCategory(id: string, updateCategoryDto: UpdateServiceCategoryDto): Promise<import("../common/interfaces/common.interface").ApiResponse<ServiceCategory>>;
    create(createServiceDto: CreateServiceDto, businessId: string): Promise<import("../common/interfaces/common.interface").ApiResponse<Service>>;
    bulkCreateServices(bulkCreateDto: BulkCreateServicesDto, businessId: string): Promise<import("../common/interfaces/common.interface").ApiResponse<{
        created: Service[];
        failed: {
            service: string;
            error: string;
        }[];
    }>>;
    findAll(query: ServiceQueryDto, businessId?: string, req?: RequestWithUser): Promise<import("../common/interfaces/common.interface").ApiResponse<Service[]>>;
    getStats(businessId: string): Promise<import("../common/interfaces/common.interface").ApiResponse<any>>;
    createBundle(createBundleDto: CreateServiceBundleDto, businessId: string): Promise<import("../common/interfaces/common.interface").ApiResponse<ServiceBundle>>;
    findAllBundles(subdomain?: string, businessId?: string): Promise<import("../common/interfaces/common.interface").ApiResponse<ServiceBundle[]>>;
    findOneBundle(id: string): Promise<import("../common/interfaces/common.interface").ApiResponse<ServiceBundle>>;
    updateBundle(id: string, updateBundleDto: UpdateServiceBundleDto): Promise<import("../common/interfaces/common.interface").ApiResponse<ServiceBundle>>;
    findOne(id: string): Promise<import("../common/interfaces/common.interface").ApiResponse<Service>>;
    update(id: string, updateServiceDto: UpdateServiceDto): Promise<import("../common/interfaces/common.interface").ApiResponse<Service>>;
    addVariant(id: string, variantDto: CreateServiceVariantDto): Promise<import("../common/interfaces/common.interface").ApiResponse<Service>>;
    remove(id: string): Promise<import("../common/interfaces/common.interface").ApiResponse<null>>;
}
