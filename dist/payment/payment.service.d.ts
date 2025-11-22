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
import { Model } from "mongoose";
import { Payment, PaymentDocument } from "./schemas/payment.schema";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { ApiResponse } from "../common/interfaces/common.interface";
import { PaymentQueryDto } from "./dto/payment-query.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { NotificationService } from '../notification/notification.service';
export declare class PaymentService {
    private paymentModel;
    private notificationService;
    constructor(paymentModel: Model<PaymentDocument>, notificationService: NotificationService);
    create(createPaymentDto: CreatePaymentDto): Promise<ApiResponse<Payment>>;
    findAll(): Promise<ApiResponse<Payment[]>>;
    findAllWithQuery(query: PaymentQueryDto): Promise<{
        success: boolean;
        data: {
            payments: (import("mongoose").Document<unknown, {}, PaymentDocument, {}, {}> & Payment & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
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
        };
    }>;
    findOne(id: string): Promise<ApiResponse<Payment>>;
    updateStatus(id: string, status: string, transactionId?: string): Promise<ApiResponse<Payment>>;
    processRefund(id: string, refundAmount: number, refundReason: string): Promise<ApiResponse<Payment>>;
    getPaymentStats(): Promise<ApiResponse<any>>;
    update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<ApiResponse<Payment>>;
    remove(id: string): Promise<ApiResponse<void>>;
    createPaymentFromBooking(booking: any, transactionReference: string, paymentData: any): Promise<any>;
    createFailedPayment(data: {
        bookingId: string;
        transactionReference: string;
        errorMessage: string;
        clientId: string;
        businessId: string;
        amount: number;
    }): Promise<any>;
    initiateRefund(transactionReference: string, amount: number): Promise<void>;
    private generatePaymentReference;
    getPaymentByAppointment(appointmentId: string): Promise<any>;
    createPaymentForAppointment(appointment: any): Promise<any>;
    updatePaymentStatus(paymentId: string, status: string, metadata?: any): Promise<any>;
    getPaymentsByClient(clientId: string, limit?: number, offset?: number): Promise<any>;
}
