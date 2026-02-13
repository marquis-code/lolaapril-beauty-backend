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
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { Model, Types } from "mongoose";
import { Appointment, AppointmentDocument } from "./schemas/appointment.schema";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { AppointmentQueryDto } from "./dto/appointment-query.dto";
import { PaymentService } from '../payment/payment.service';
import { NotificationService } from '../notification/notification.service';
import { StaffService } from '../staff/staff.service';
import { SalesService } from '../sales/sales.service';
import { EmailService } from '../notification/email.service';
import { EmailTemplatesService } from '../notification/templates/email-templates.service';
import { GoogleCalendarService } from '../integration/google-calendar.service';
import { ScheduledReminderDocument } from '../jobs/schemas/scheduled-reminder.schema';
import { ConfigService } from '@nestjs/config';
import { ClientDocument } from '../client/schemas/client.schema';
export declare class AppointmentService {
    private appointmentModel;
    private scheduledReminderModel;
    private paymentService;
    private notificationService;
    private staffService;
    private salesService;
    private emailService;
    private emailTemplatesService;
    private googleCalendarService;
    private configService;
    private clientModel;
    private readonly logger;
    constructor(appointmentModel: Model<AppointmentDocument>, scheduledReminderModel: Model<ScheduledReminderDocument>, paymentService: PaymentService, notificationService: NotificationService, staffService: StaffService, salesService: SalesService, emailService: EmailService, emailTemplatesService: EmailTemplatesService, googleCalendarService: GoogleCalendarService, configService: ConfigService, clientModel: Model<ClientDocument>);
    create(createAppointmentDto: CreateAppointmentDto & {
        businessId: string;
    }): Promise<Appointment>;
    findAll(query: AppointmentQueryDto & {
        businessId: string;
    }): Promise<{
        appointments: (import("mongoose").Document<unknown, {}, AppointmentDocument, {}, {}> & Appointment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
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
    findOne(id: string): Promise<Appointment>;
    update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment>;
    remove(id: string): Promise<void>;
    updateStatus(id: string, status: string, cancellationReason?: string): Promise<Appointment>;
    assignStaff(id: string, staffId: string): Promise<Appointment>;
    getAppointmentsByDate(businessId: string, date: string): Promise<Appointment[]>;
    getAppointmentsByStaff(businessId: string, staffId: string, date?: string): Promise<Appointment[]>;
    getAppointmentStats(): Promise<{
        overview: any;
        revenue: any;
    }>;
    getAvailableTimeSlots(date: string, staffId?: string): Promise<string[]>;
    createFromBooking(booking: any): Promise<any>;
    private mapToPlainObject;
    private generateAppointmentNumber;
    completeAppointment(appointmentId: string): Promise<any>;
}
