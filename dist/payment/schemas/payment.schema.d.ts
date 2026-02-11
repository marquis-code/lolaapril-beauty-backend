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
export declare class PaymentItem {
    itemType: string;
    itemId?: Types.ObjectId;
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    discount: number;
    tax: number;
}
export declare const PaymentItemSchema: import("mongoose").Schema<PaymentItem, import("mongoose").Model<PaymentItem, any, any, any, Document<unknown, any, PaymentItem, any, {}> & PaymentItem & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PaymentItem, Document<unknown, {}, import("mongoose").FlatRecord<PaymentItem>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<PaymentItem> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class Payment {
    clientId: Types.ObjectId;
    appointmentId?: Types.ObjectId;
    bookingId?: Types.ObjectId;
    businessId?: Types.ObjectId;
    paymentReference: string;
    transactionId?: string;
    items: PaymentItem[];
    subtotal: number;
    totalTax: number;
    totalDiscount: number;
    totalAmount: number;
    gateway?: string;
    paymentMethod: string;
    status: string;
    paidAt?: Date;
    refundedAmount?: number;
    refundedAt?: Date;
    refundReason?: string;
    gatewayResponse?: string;
    processedBy?: Types.ObjectId;
    notes?: string;
    metadata?: Record<string, any>;
}
export type PaymentDocument = Payment & Document;
export declare const PaymentSchema: import("mongoose").Schema<Payment, import("mongoose").Model<Payment, any, any, any, Document<unknown, any, Payment, any, {}> & Payment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Payment, Document<unknown, {}, import("mongoose").FlatRecord<Payment>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Payment> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
