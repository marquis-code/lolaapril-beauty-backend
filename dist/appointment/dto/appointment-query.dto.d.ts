import { PaginationDto } from "../../common/dto/pagination.dto";
export declare class AppointmentQueryDto extends PaginationDto {
    clientId?: string;
    status?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
    assignedStaff?: string;
    search?: string;
}
