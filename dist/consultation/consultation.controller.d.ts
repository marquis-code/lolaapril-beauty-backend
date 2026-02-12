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
import { ConsultationService } from './consultation.service';
import { BusinessService } from '../business/business.service';
import { CreateConsultationPackageDto, UpdateConsultationPackageDto, UpdateConsultationAvailabilityDto, BookConsultationDto } from './dto/consultation.dto';
export declare class ConsultationController {
    private readonly consultationService;
    private readonly businessService;
    constructor(consultationService: ConsultationService, businessService: BusinessService);
    createPackage(businessId: string, dto: CreateConsultationPackageDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/consultation.schema").ConsultationPackageDocument, {}, {}> & import("./schemas/consultation.schema").ConsultationPackage & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAllPackages(businessId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/consultation.schema").ConsultationPackageDocument, {}, {}> & import("./schemas/consultation.schema").ConsultationPackage & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    updatePackage(businessId: string, id: string, dto: UpdateConsultationPackageDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/consultation.schema").ConsultationPackageDocument, {}, {}> & import("./schemas/consultation.schema").ConsultationPackage & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateAvailability(businessId: string, dto: UpdateConsultationAvailabilityDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/consultation.schema").ConsultationAvailabilityDocument, {}, {}> & import("./schemas/consultation.schema").ConsultationAvailability & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAvailability(businessId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/consultation.schema").ConsultationAvailabilityDocument, {}, {}> & import("./schemas/consultation.schema").ConsultationAvailability & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
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
    getBookings(businessId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/consultation.schema").ConsultationBookingDocument, {}, {}> & import("./schemas/consultation.schema").ConsultationBooking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    confirmBooking(businessId: string, id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/consultation.schema").ConsultationBookingDocument, {}, {}> & import("./schemas/consultation.schema").ConsultationBooking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    completeBooking(businessId: string, id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/consultation.schema").ConsultationBookingDocument, {}, {}> & import("./schemas/consultation.schema").ConsultationBooking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getActivePackages(subdomain: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/consultation.schema").ConsultationPackageDocument, {}, {}> & import("./schemas/consultation.schema").ConsultationPackage & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getSlots(subdomain: string, date: string, packageId: string): Promise<string[]>;
    book(user: any, subdomain: string, dto: BookConsultationDto): Promise<{
        booking: import("mongoose").Document<unknown, {}, import("./schemas/consultation.schema").ConsultationBookingDocument, {}, {}> & import("./schemas/consultation.schema").ConsultationBooking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        payment: {
            authorization_url: any;
            reference: string;
        };
    }>;
    getMyBookings(user: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/consultation.schema").ConsultationBookingDocument, {}, {}> & import("./schemas/consultation.schema").ConsultationBooking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    verifyPayment(reference: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/consultation.schema").ConsultationBookingDocument, {}, {}> & import("./schemas/consultation.schema").ConsultationBooking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
