import { ServiceCategory } from "../../schemas/service.schema";
export declare class ServiceFilterDto {
    category?: ServiceCategory;
    isActive?: boolean;
    minPrice?: number;
    maxPrice?: number;
    minDuration?: number;
    maxDuration?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
}
