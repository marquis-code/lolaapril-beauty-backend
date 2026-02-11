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
import { Document, Types } from 'mongoose';
export type FinancialReportDocument = FinancialReport & Document;
export declare class RevenueBreakdown {
    grossRevenue: number;
    platformCommissions: number;
    processingFees: number;
    refunds: number;
    netRevenue: number;
    businessPayout: number;
}
export declare class CommissionBreakdown {
    marketplaceBookings: number;
    marketplaceCommissions: number;
    directBookings: number;
    commissionSavings: number;
    averageCommissionRate: number;
}
export declare class SourceBreakdown {
    sourceType: string;
    bookingCount: number;
    revenue: number;
    commissions: number;
    netRevenue: number;
}
export declare class FinancialReport {
    businessId: Types.ObjectId;
    reportPeriod: string;
    startDate: Date;
    endDate: Date;
    revenue: RevenueBreakdown;
    commissions: CommissionBreakdown;
    sourceBreakdown: SourceBreakdown[];
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    noShows: number;
    averageBookingValue: number;
    generatedAt: Date;
}
export declare const FinancialReportSchema: import("mongoose").Schema<FinancialReport, import("mongoose").Model<FinancialReport, any, any, any, Document<unknown, any, FinancialReport, any, {}> & FinancialReport & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, FinancialReport, Document<unknown, {}, import("mongoose").FlatRecord<FinancialReport>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<FinancialReport> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
