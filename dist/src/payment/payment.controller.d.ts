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
import { RawBodyRequest } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { PaymentQueryDto } from "./dto/payment-query.dto";
import { RequestWithUser } from "../auth/types/request-with-user.interface";
import { InitializePaymentDto } from "./dto/initialize-payment.dto";
import { Request } from 'express';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    initializePayment(jwtBusinessId: string | undefined, initializePaymentDto: InitializePaymentDto): Promise<import("../common/interfaces/common.interface").ApiResponse<any>>;
    verifyPayment(businessId: string, reference: string): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/payment.schema").Payment>>;
    handleWebhook(signature: string, req: RawBodyRequest<Request>): Promise<{
        message: string;
    }>;
    initiateRefund(businessId: string, reference: string, body: {
        amount?: number;
    }): Promise<void>;
    create(businessId: string, createPaymentDto: CreatePaymentDto): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/payment.schema").Payment>>;
    getMyTransactions(user: RequestWithUser['user']): Promise<import("../common/interfaces/common.interface").ApiResponse<any>>;
    findAll(businessId: string, query: PaymentQueryDto): Promise<{
        success: boolean;
        data: {
            payments: (import("mongoose").Document<unknown, {}, import("./schemas/payment.schema").PaymentDocument, {}, {}> & import("./schemas/payment.schema").Payment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: import("mongoose").Types.ObjectId;
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
    getStats(businessId: string): Promise<import("../common/interfaces/common.interface").ApiResponse<any>>;
    findOne(businessId: string, id: string): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/payment.schema").Payment>>;
    update(businessId: string, id: string, updatePaymentDto: UpdatePaymentDto): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/payment.schema").Payment>>;
    updateStatus(businessId: string, id: string, body: {
        status: string;
        transactionId?: string;
    }): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/payment.schema").Payment>>;
    processRefund(businessId: string, id: string, body: {
        refundAmount: number;
        refundReason: string;
    }): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/payment.schema").Payment>>;
    remove(businessId: string, id: string): Promise<import("../common/interfaces/common.interface").ApiResponse<void>>;
}
