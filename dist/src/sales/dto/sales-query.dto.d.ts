import { PaginationDto } from "../../common/dto/pagination.dto";
export declare class SalesQueryDto extends PaginationDto {
    clientId?: string;
    appointmentId?: string;
    bookingId?: string;
    status?: string;
    paymentStatus?: string;
    staffId?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
}
