import type { Model } from "mongoose";
import { type Service, type ServiceDocument, ServiceCategory } from "../schemas/service.schema";
import type { CreateServiceDto } from "./dto/create-service.dto";
import type { UpdateServiceDto } from "./dto/update-service.dto";
import type { ServiceFilterDto } from "./dto/service-filter.dto";
export declare class ServicesService {
    private serviceModel;
    constructor(serviceModel: Model<ServiceDocument>);
    create(createServiceDto: CreateServiceDto): Promise<Service>;
    findAll(filterDto?: ServiceFilterDto): Promise<Service[]>;
    findOne(id: string): Promise<Service>;
    findByCategory(category: ServiceCategory): Promise<Service[]>;
    findPopular(limit?: number): Promise<Service[]>;
    update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service>;
    remove(id: string): Promise<void>;
    toggleActive(id: string): Promise<Service>;
    incrementPopularity(id: string): Promise<void>;
    getServicesByIds(serviceIds: string[]): Promise<Service[]>;
    calculateTotalPrice(serviceIds: string[]): Promise<number>;
    calculateTotalDuration(serviceIds: string[]): Promise<number>;
    getServiceCategories(): Promise<ServiceCategory[]>;
    getServiceStats(): Promise<any>;
}
