import { PaginationDto } from "../../common/dto/pagination.dto";
export declare class ClientQueryDto extends PaginationDto {
    search?: string;
    clientSource?: string;
    gender?: string;
    isActive?: boolean;
    country?: string;
}
