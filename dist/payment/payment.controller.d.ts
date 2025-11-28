import { RawBodyRequest } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { PaymentQueryDto } from "./dto/payment-query.dto";
import { InitializePaymentDto } from "./dto/initialize-payment.dto";
import { Request } from 'express';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    initializePayment(initializePaymentDto: InitializePaymentDto): Promise<import("../common/interfaces/common.interface").ApiResponse<any>>;
    verifyPayment(reference: string): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/payment.schema").Payment>>;
    handleWebhook(signature: string, req: RawBodyRequest<Request>): Promise<{
        message: string;
    }>;
    initiateRefund(reference: string, body: {
        amount?: number;
    }): Promise<void>;
    create(createPaymentDto: CreatePaymentDto): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/payment.schema").Payment>>;
    findAll(query: PaymentQueryDto): Promise<{
        success: boolean;
        data: {
            payments: (import("mongoose").Document<unknown, {}, import("./schemas/payment.schema").PaymentDocument, {}, {}> & import("./schemas/payment.schema").Payment & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
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
    getStats(): Promise<import("../common/interfaces/common.interface").ApiResponse<any>>;
    findOne(id: string): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/payment.schema").Payment>>;
    update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/payment.schema").Payment>>;
    updateStatus(id: string, body: {
        status: string;
        transactionId?: string;
    }): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/payment.schema").Payment>>;
    processRefund(id: string, body: {
        refundAmount: number;
        refundReason: string;
    }): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/payment.schema").Payment>>;
    remove(id: string): Promise<import("../common/interfaces/common.interface").ApiResponse<void>>;
}
