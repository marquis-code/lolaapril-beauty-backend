import { PaginationDto } from "../../common/dto/pagination.dto";
export declare class BookingQueryDto extends PaginationDto {
    clientId?: string;
    status?: string;
    bookingSource?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
}
