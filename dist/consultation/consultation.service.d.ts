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
import { Model, Types } from 'mongoose';
import { ConsultationPackage, ConsultationPackageDocument, ConsultationBooking, ConsultationBookingDocument, ConsultationAvailability, ConsultationAvailabilityDocument } from './schemas/consultation.schema';
import { CreateConsultationPackageDto, UpdateConsultationPackageDto, UpdateConsultationAvailabilityDto, BookConsultationDto } from './dto/consultation.dto';
import { GoogleCalendarService } from '../integration/google-calendar.service';
import { NotificationService } from '../notification/notification.service';
import { IntegrationDocument } from '../integration/schemas/integration.schema';
import { GatewayManagerService } from '../integration/gateway-manager.service';
export declare class ConsultationService {
    private packageModel;
    private bookingModel;
    private availabilityModel;
    private integrationModel;
    private readonly googleCalendarService;
    private readonly notificationService;
    private readonly gatewayManager;
    private readonly logger;
    constructor(packageModel: Model<ConsultationPackageDocument>, bookingModel: Model<ConsultationBookingDocument>, availabilityModel: Model<ConsultationAvailabilityDocument>, integrationModel: Model<IntegrationDocument>, googleCalendarService: GoogleCalendarService, notificationService: NotificationService, gatewayManager: GatewayManagerService);
    createPackage(businessId: string, dto: CreateConsultationPackageDto): Promise<import("mongoose").Document<unknown, {}, ConsultationPackageDocument, {}, {}> & ConsultationPackage & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getPackages(businessId: string, onlyActive?: boolean): Promise<(import("mongoose").Document<unknown, {}, ConsultationPackageDocument, {}, {}> & ConsultationPackage & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    updatePackage(businessId: string, packageId: string, dto: UpdateConsultationPackageDto): Promise<import("mongoose").Document<unknown, {}, ConsultationPackageDocument, {}, {}> & ConsultationPackage & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateAvailability(businessId: string, dto: UpdateConsultationAvailabilityDto): Promise<import("mongoose").Document<unknown, {}, ConsultationAvailabilityDocument, {}, {}> & ConsultationAvailability & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAvailability(businessId: string): Promise<(import("mongoose").Document<unknown, {}, ConsultationAvailabilityDocument, {}, {}> & ConsultationAvailability & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        businessId: string;
        weeklySchedule: {
            dayOfWeek: number;
            isOpen: boolean;
            timeSlots: any[];
        }[];
    }>;
    getAvailableSlots(businessId: string, dateStr: string, packageId: string): Promise<string[]>;
    getBookings(businessId: string): Promise<(import("mongoose").Document<unknown, {}, ConsultationBookingDocument, {}, {}> & ConsultationBooking & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getClientBookings(clientId: string): Promise<(import("mongoose").Document<unknown, {}, ConsultationBookingDocument, {}, {}> & ConsultationBooking & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    bookConsultation(clientId: string, businessId: string, dto: BookConsultationDto): Promise<{
        booking: import("mongoose").Document<unknown, {}, ConsultationBookingDocument, {}, {}> & ConsultationBooking & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
        payment: {
            authorization_url: any;
            reference: string;
        };
    }>;
    verifyBookingPayment(reference: string): Promise<import("mongoose").Document<unknown, {}, ConsultationBookingDocument, {}, {}> & ConsultationBooking & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    completeBooking(businessId: string, bookingId: string): Promise<import("mongoose").Document<unknown, {}, ConsultationBookingDocument, {}, {}> & ConsultationBooking & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    cleanupExpiredBookings(): Promise<void>;
    confirmBooking(bookingId: string): Promise<import("mongoose").Document<unknown, {}, ConsultationBookingDocument, {}, {}> & ConsultationBooking & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    private getBusinessCalendarRefreshToken;
    private sendConfirmationEmail;
    sendReminders(): Promise<void>;
    private sendReminderEmail;
    sendThankYouEmails(): Promise<void>;
}
