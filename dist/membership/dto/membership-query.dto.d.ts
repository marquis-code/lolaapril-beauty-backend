import { PaginationDto } from "../../common/dto/pagination.dto";
export declare class MembershipQueryDto extends PaginationDto {
    membershipType?: string;
    isActive?: boolean;
    search?: string;
}
