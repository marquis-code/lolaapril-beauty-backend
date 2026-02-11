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
import { ConfigService } from '@nestjs/config';
import { Payment, PaymentDocument } from "./schemas/payment.schema";
import { BookingDocument } from "../booking/schemas/booking.schema";
import { BusinessDocument } from "../business/schemas/business.schema";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { ApiResponse } from "../common/interfaces/common.interface";
import { PaymentQueryDto } from "./dto/payment-query.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { NotificationService } from '../notification/notification.service';
import { PricingService } from '../pricing/pricing.service';
import { CommissionService } from '../commission/services/commission.service';
import { GatewayManagerService } from '../integration/gateway-manager.service';
import { JobsService } from '../jobs/jobs.service';
import { CacheService } from '../cache/cache.service';
import { BusinessService } from '../business/business.service';
export declare class PaymentService {
    private paymentModel;
    private bookingModel;
    private businessModel;
    private notificationService;
    private configService;
    private pricingService;
    private commissionService;
    private gatewayManager;
    private jobsService;
    private cacheService;
    private businessService;
    private readonly paystackSecretKey;
    private readonly paystackBaseUrl;
    constructor(paymentModel: Model<PaymentDocument>, bookingModel: Model<BookingDocument>, businessModel: Model<BusinessDocument>, notificationService: NotificationService, configService: ConfigService, pricingService: PricingService, commissionService: CommissionService, gatewayManager: GatewayManagerService, jobsService: JobsService, cacheService: CacheService, businessService: BusinessService);
    getUserTransactions(userId: string): Promise<ApiResponse<any>>;
    private resolveBusinessId;
    initializePayment(data: {
        email: string;
        amount: number;
        clientId: string;
        businessId?: string;
        subdomain?: string;
        appointmentId?: string;
        bookingId?: string;
        gateway?: string;
        metadata?: any;
    }): Promise<ApiResponse<any>>;
    verifyPayment(reference: string): Promise<ApiResponse<Payment>>;
    handleWebhook(payload: any, signature: string, source: string): Promise<void>;
    private handleSuccessfulCharge;
    private handleFailedCharge;
    createPaymentFromBooking(booking: any, transactionReference: string, paymentInfo: {
        paymentMethod: string;
        gateway: string;
        status: string;
        amount: number;
        paymentType?: 'full' | 'deposit' | 'remaining';
    }): Promise<any>;
    createFailedPayment(data: {
        bookingId: string;
        transactionReference: string;
        errorMessage: string;
        clientId: string;
        businessId: string;
        amount: number;
    }): Promise<any>;
    createPaymentForAppointment(appointment: any): Promise<any>;
    updatePaymentStatus(paymentId: string, status: 'completed' | 'failed' | 'pending' | 'cancelled' | 'refunded', transactionReference: string): Promise<any>;
    processRefund(businessId: string, id: string, refundAmount: number, refundReason: string): Promise<ApiResponse<Payment>>;
    initiateRefund(businessId: string, transactionReference: string, amount: number): Promise<void>;
    create(createPaymentDto: CreatePaymentDto): Promise<ApiResponse<Payment>>;
    findAll(): Promise<ApiResponse<Payment[]>>;
    findAllWithQuery(query: PaymentQueryDto): Promise<{
        success: boolean;
        data: {
            payments: (import("mongoose").Document<unknown, {}, PaymentDocument, {}, {}> & Payment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
        };
    }>;
    findOne(id: string): Promise<ApiResponse<Payment>>;
    update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<ApiResponse<Payment>>;
    updateStatus(id: string, status: string, transactionId?: string): Promise<ApiResponse<Payment>>;
    remove(id: string): Promise<ApiResponse<void>>;
    getPaymentByAppointment(appointmentId: string): Promise<any>;
    getPaymentByBookingId(bookingId: string): Promise<any>;
    getPaymentStats(): Promise<ApiResponse<any>>;
    private generatePaymentReference;
    private buildPaymentItems;
}
