import { Model } from "mongoose";
import { Voucher, type VoucherDocument } from "./schemas/voucher.schema";
import { CreateVoucherDto } from "./dto/create-voucher.dto";
import { UpdateVoucherDto } from "./dto/update-voucher.dto";
import { VoucherQueryDto } from "./dto/voucher-query.dto";
export declare class VoucherService {
    private voucherModel;
    constructor(voucherModel: Model<VoucherDocument>);
    create(createVoucherDto: CreateVoucherDto): Promise<Voucher>;
    findAll(query: VoucherQueryDto): Promise<{
        vouchers: (import("mongoose").Document<unknown, {}, VoucherDocument, {}> & Voucher & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
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
    getVoucherStats(): Promise<{
        overview: any;
        byDiscountType: any[];
    }>;
}
