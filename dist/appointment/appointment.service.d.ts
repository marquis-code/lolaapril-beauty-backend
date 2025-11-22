import { Model } from "mongoose";
import { Appointment, AppointmentDocument } from "./schemas/appointment.schema";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { AppointmentQueryDto } from "./dto/appointment-query.dto";
import { PaymentService } from '../payment/payment.service';
import { NotificationService } from '../notification/notification.service';
import { StaffService } from '../staff/staff.service';
export declare class AppointmentService {
    private appointmentModel;
    private paymentService;
    private notificationService;
    private staffService;
    constructor(appointmentModel: Model<AppointmentDocument>, paymentService: PaymentService, notificationService: NotificationService, staffService: StaffService);
    create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment>;
    findAll(query: AppointmentQueryDto): Promise<{
        appointments: (import("mongoose").Document<unknown, {}, AppointmentDocument, {}, {}> & Appointment & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
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
    findOne(id: string): Promise<Appointment>;
    update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment>;
    remove(id: string): Promise<void>;
    updateStatus(id: string, status: string, cancellationReason?: string): Promise<Appointment>;
    assignStaff(id: string, staffId: string): Promise<Appointment>;
    getAppointmentsByDate(date: string): Promise<Appointment[]>;
    getAppointmentsByStaff(staffId: string, date?: string): Promise<Appointment[]>;
    getAppointmentStats(): Promise<{
        overview: any;
        revenue: any;
    }>;
    getAvailableTimeSlots(date: string, staffId?: string): Promise<string[]>;
    createFromBooking(booking: any): Promise<any>;
    private generateAppointmentNumber;
    completeAppointment(appointmentId: string): Promise<void>;
}
