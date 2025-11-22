import { Model } from "mongoose";
import { Payment, PaymentDocument } from "./schemas/payment.schema";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { ApiResponse } from "../common/interfaces/common.interface";
import { PaymentQueryDto } from "./dto/payment-query.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { NotificationService } from '../notification/notification.service';
import { ConfigService } from '@nestjs/config';
export declare class PaymentService {
    private paymentModel;
    private notificationService;
    private configService;
    private readonly paystackSecretKey;
    private readonly paystackBaseUrl;
    constructor(paymentModel: Model<PaymentDocument>, notificationService: NotificationService, configService: ConfigService);
    initializePayment(data: {
        email: string;
        amount: number;
        clientId: string;
        appointmentId?: string;
        bookingId?: string;
        metadata?: any;
    }): Promise<ApiResponse<any>>;
    verifyPayment(reference: string): Promise<ApiResponse<Payment>>;
    handleWebhook(payload: any, signature: string): Promise<void>;
    private handleSuccessfulCharge;
    private handleFailedCharge;
    initiateRefund(transactionReference: string, amount?: number): Promise<ApiResponse<any>>;
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
    private generatePaymentReference;
    updatePaymentStatus(paymentId: string, status: string, metadata?: any): Promise<any>;
    createPaymentFromBooking(booking: any, transactionReference: string, paymentData: any): Promise<any>;
    createPaymentForAppointment(appointment: any): Promise<any>;
    getPaymentByAppointment(appointmentId: string): Promise<any>;
    createFailedPayment(data: {
        bookingId: string;
        transactionReference: string;
        errorMessage: string;
        clientId: string;
        businessId: string;
        amount: number;
    }): Promise<any>;
}
