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
        vouchers: (import("mongoose").Document<unknown, {}, import("./schemas/voucher.schema").VoucherDocument, {}, {}> & import("./schemas/voucher.schema").Voucher & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
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
