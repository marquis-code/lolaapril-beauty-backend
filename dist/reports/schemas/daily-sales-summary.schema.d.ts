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
import type { Document } from "mongoose";
export type DailySalesSummaryDocument = DailySalesSummary & Document;
export declare class ServiceSummary {
    serviceId: string;
    serviceName: string;
    quantity: number;
    revenue: number;
}
export declare class StaffSummary {
    staffId: string;
    staffName: string;
    appointmentsCompleted: number;
    revenue: number;
    commission: number;
}
export declare class PaymentMethodSummary {
    method: string;
    count: number;
    amount: number;
}
export declare class DailySalesSummary {
    date: string;
    totalRevenue: number;
    totalAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    noShowAppointments: number;
    newClients: number;
    returningClients: number;
    servicesSummary: ServiceSummary[];
    staffSummary: StaffSummary[];
    paymentMethodsSummary: PaymentMethodSummary[];
    averageTicketSize: number;
    totalTax: number;
    totalDiscount: number;
    totalServiceCharge: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const DailySalesSummarySchema: import("mongoose").Schema<DailySalesSummary, import("mongoose").Model<DailySalesSummary, any, any, any, Document<unknown, any, DailySalesSummary, any, {}> & DailySalesSummary & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DailySalesSummary, Document<unknown, {}, import("mongoose").FlatRecord<DailySalesSummary>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<DailySalesSummary> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
