/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { AppointmentService } from "./appointment.service";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { AppointmentQueryDto } from "./dto/appointment-query.dto";
export declare class AppointmentController {
    private readonly appointmentService;
    constructor(appointmentService: AppointmentService);
    create(createAppointmentDto: CreateAppointmentDto): Promise<import("./schemas/appointment.schema").Appointment>;
    findAll(query: AppointmentQueryDto): Promise<{
        appointments: (import("mongoose").Document<unknown, {}, import("./schemas/appointment.schema").AppointmentDocument, {}, {}> & import("./schemas/appointment.schema").Appointment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
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
