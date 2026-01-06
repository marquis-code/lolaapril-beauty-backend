import { PaginationDto } from "../../common/dto/pagination.dto";
export declare class ServiceQueryDto extends PaginationDto {
    search?: string;
    category?: string;
    serviceType?: string;
    priceType?: string;
    isActive?: boolean;
    onlineBookingEnabled?: boolean;
}
