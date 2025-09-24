import { AppointmentService } from "./appointment.service";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { AppointmentQueryDto } from "./dto/appointment-query.dto";
export declare class AppointmentController {
    private readonly appointmentService;
    constructor(appointmentService: AppointmentService);
    create(createAppointmentDto: CreateAppointmentDto): Promise<import("./schemas/appointment.schema").Appointment>;
    findAll(query: AppointmentQueryDto): Promise<{
        appointments: (import("mongoose").Document<unknown, {}, import("./schemas/appointment.schema").AppointmentDocument, {}> & import("./schemas/appointment.schema").Appointment & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getStats(): Promise<{
        overview: any;
        revenue: any;
    }>;
    getAvailableSlots(date: string, staffId?: string): Promise<string[]>;
    getByDate(date: string): Promise<import("./schemas/appointment.schema").Appointment[]>;
    getByStaff(staffId: string, date?: string): Promise<import("./schemas/appointment.schema").Appointment[]>;
    findOne(id: string): Promise<import("./schemas/appointment.schema").Appointment>;
    update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<import("./schemas/appointment.schema").Appointment>;
    updateStatus(id: string, body: {
        status: string;
        cancellationReason?: string;
    }): Promise<import("./schemas/appointment.schema").Appointment>;
    assignStaff(id: string, body: {
        staffId: string;
    }): Promise<import("./schemas/appointment.schema").Appointment>;
    remove(id: string): Promise<void>;
}
