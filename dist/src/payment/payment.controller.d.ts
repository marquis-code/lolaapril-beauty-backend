import type { PaymentService } from "./payment.service";
import type { CreatePaymentDto } from "./dto/create-payment.dto";
import type { UpdatePaymentDto } from "./dto/update-payment.dto";
import type { PaymentQueryDto } from "./dto/payment-query.dto";
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    create(createPaymentDto: CreatePaymentDto): Promise<ApiResponse<import("./schemas/payment.schema").Payment>>;
    findAll(query: PaymentQueryDto): Promise<{
        success: boolean;
        data: {
            payments: (import("mongoose").Document<unknown, {}, import("./schemas/payment.schema").PaymentDocument, {}> & import("./schemas/payment.schema").Payment & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
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
    getStats(): Promise<ApiResponse<any>>;
    findOne(id: string): Promise<ApiResponse<import("./schemas/payment.schema").Payment>>;
    update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<ApiResponse<import("./schemas/payment.schema").Payment>>;
    updateStatus(id: string, body: {
        status: string;
        transactionId?: string;
    }): Promise<ApiResponse<import("./schemas/payment.schema").Payment>>;
    processRefund(id: string, body: {
        refundAmount: number;
        refundReason: string;
    }): Promise<ApiResponse<import("./schemas/payment.schema").Payment>>;
    remove(id: string): Promise<ApiResponse<void>>;
}
