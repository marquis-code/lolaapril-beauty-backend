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
import { SalesService } from "./sales.service";
import { CreateSaleDto } from "./dto/create-sale.dto";
import { UpdateSaleDto } from "./dto/update-sale.dto";
import { SalesQueryDto } from "./dto/sales-query.dto";
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(createSaleDto: CreateSaleDto): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/sale.schema").Sale>>;
    findAll(query: SalesQueryDto): Promise<{
        success: boolean;
        data: {
            sales: (import("mongoose").Document<unknown, {}, import("./schemas/sale.schema").SaleDocument, {}, {}> & import("./schemas/sale.schema").Sale & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
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
    getTopServices(): Promise<import("../common/interfaces/common.interface").ApiResponse<any>>;
    getRevenueByPeriod(period?: "daily" | "weekly" | "monthly"): Promise<import("../common/interfaces/common.interface").ApiResponse<any>>;
    findOne(id: string): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/sale.schema").Sale>>;
    update(id: string, updateSaleDto: UpdateSaleDto): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/sale.schema").Sale>>;
    completeSale(id: string, body: {
        completedBy: string;
    }): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/sale.schema").Sale>>;
    updateStatus(id: string, body: {
        status: string;
    }): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/sale.schema").Sale>>;
    updatePaymentStatus(id: string, body: {
        paymentStatus: string;
        amountPaid?: number;
    }): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/sale.schema").Sale>>;
    remove(id: string): Promise<import("../common/interfaces/common.interface").ApiResponse<void>>;
}
