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
import { Voucher, type VoucherDocument } from "./schemas/voucher.schema";
import { CreateVoucherDto } from "./dto/create-voucher.dto";
import { UpdateVoucherDto } from "./dto/update-voucher.dto";
import { VoucherQueryDto } from "./dto/voucher-query.dto";
export declare class VoucherService {
    private voucherModel;
    constructor(voucherModel: Model<VoucherDocument>);
    create(createVoucherDto: CreateVoucherDto, userId: string): Promise<Voucher>;
    findAll(query: VoucherQueryDto): Promise<{
        vouchers: (import("mongoose").Document<unknown, {}, VoucherDocument, {}, {}> & Voucher & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    findOne(id: string): Promise<Voucher>;
    findByCode(voucherCode: string): Promise<Voucher>;
    update(id: string, updateVoucherDto: UpdateVoucherDto): Promise<Voucher>;
    remove(id: string): Promise<void>;
    validateVoucher(voucherCode: string, clientId: string, serviceIds: string[], totalAmount: number): Promise<{
        isValid: boolean;
        voucher?: Voucher;
        discountAmount?: number;
        message?: string;
    }>;
    useVoucher(voucherCode: string): Promise<Voucher>;
    getVoucherStats(businessId: string): Promise<{
        overview: any;
        byDiscountType: any[];
    }>;
}
