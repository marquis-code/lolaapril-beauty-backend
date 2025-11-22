import { PaginationDto } from "../../common/dto/pagination.dto";
export declare class VoucherQueryDto extends PaginationDto {
    status?: string;
    discountType?: string;
    validFrom?: string;
    validUntil?: string;
    search?: string;
}
