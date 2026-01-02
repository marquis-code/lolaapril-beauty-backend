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
import { VoucherService } from "./voucher.service";
import { CreateVoucherDto } from "./dto/create-voucher.dto";
import { UpdateVoucherDto } from "./dto/update-voucher.dto";
import { VoucherQueryDto } from "./dto/voucher-query.dto";
import { RequestWithUser } from "../auth/types/request-with-user.interface";
export declare class VoucherController {
    private readonly voucherService;
    constructor(voucherService: VoucherService);
    create(createVoucherDto: CreateVoucherDto, req: RequestWithUser): Promise<import("./schemas/voucher.schema").Voucher>;
    findAll(query: VoucherQueryDto): Promise<{
        vouchers: (import("mongoose").Document<unknown, {}, import("./schemas/voucher.schema").VoucherDocument, {}, {}> & import("./schemas/voucher.schema").Voucher & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    }>;
    getStats(): Promise<{
        overview: any;
        byDiscountType: any[];
    }>;
    validateVoucher(body: {
        voucherCode: string;
        clientId: string;
        serviceIds: string[];
        totalAmount: number;
    }): Promise<{
        isValid: boolean;
        voucher?: import("./schemas/voucher.schema").Voucher;
        discountAmount?: number;
        message?: string;
    }>;
    useVoucher(voucherCode: string): Promise<import("./schemas/voucher.schema").Voucher>;
    findByCode(voucherCode: string): Promise<import("./schemas/voucher.schema").Voucher>;
    findOne(id: string): Promise<import("./schemas/voucher.schema").Voucher>;
    update(id: string, updateVoucherDto: UpdateVoucherDto): Promise<import("./schemas/voucher.schema").Voucher>;
    remove(id: string): Promise<void>;
}
