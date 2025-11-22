import { PaginationDto } from "../../common/dto/pagination.dto";
export declare class PaymentQueryDto extends PaginationDto {
    clientId?: string;
    appointmentId?: string;
    bookingId?: string;
    status?: string;
    paymentMethod?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
}
