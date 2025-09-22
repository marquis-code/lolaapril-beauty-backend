import { ServiceCategory } from "../../schemas/service.schema";
export declare class CreateServiceDto {
    name: string;
    description: string;
    price: number;
    duration: number;
    category: ServiceCategory;
    image?: string;
    isActive?: boolean;
    tags?: string[];
    preparationTime?: number;
    cleanupTime?: number;
    requirements?: string;
    aftercareInstructions?: string;
}
