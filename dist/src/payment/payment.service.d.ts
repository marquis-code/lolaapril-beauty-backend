import { Model } from "mongoose";
import { Payment, PaymentDocument } from "./schemas/payment.schema";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { ApiResponse } from "../common/interfaces/common.interface";
import { PaymentQueryDto } from "./dto/payment-query.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
export declare class PaymentService {
    private paymentModel;
    constructor(paymentModel: Model<PaymentDocument>);
    create(createPaymentDto: CreatePaymentDto): Promise<ApiResponse<Payment>>;
    findAll(): Promise<ApiResponse<Payment[]>>;
    findAllWithQuery(query: PaymentQueryDto): Promise<{
        success: boolean;
        data: {
            payments: (import("mongoose").Document<unknown, {}, PaymentDocument, {}> & Payment & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
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
}
