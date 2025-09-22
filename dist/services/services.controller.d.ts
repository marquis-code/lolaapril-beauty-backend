import type { ServicesService } from "./services.service";
import type { CreateServiceDto } from "./dto/create-service.dto";
import type { UpdateServiceDto } from "./dto/update-service.dto";
import type { ServiceFilterDto } from "./dto/service-filter.dto";
import { ServiceCategory } from "../schemas/service.schema";
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(createServiceDto: CreateServiceDto): Promise<import("../schemas/service.schema").Service>;
    findAll(filterDto: ServiceFilterDto): Promise<import("../schemas/service.schema").Service[]>;
    getCategories(): Promise<ServiceCategory[]>;
    getPopular(limit?: number): Promise<import("../schemas/service.schema").Service[]>;
    getStats(): Promise<any>;
    findByCategory(category: ServiceCategory): Promise<import("../schemas/service.schema").Service[]>;
    findOne(id: string): Promise<import("../schemas/service.schema").Service>;
    update(id: string, updateServiceDto: UpdateServiceDto): Promise<import("../schemas/service.schema").Service>;
    toggleActive(id: string): Promise<import("../schemas/service.schema").Service>;
    remove(id: string): Promise<void>;
}
