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
import { PaymentService } from "./payment.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { PaymentQueryDto } from "./dto/payment-query.dto";
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
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
