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
import { Sale, SaleDocument } from "./schemas/sale.schema";
import { CreateSaleDto } from "./dto/create-sale.dto";
import { ApiResponse } from "../common/interfaces/common.interface";
import { SalesQueryDto } from "./dto/sales-query.dto";
import { UpdateSaleDto } from "./dto/update-sale.dto";
export declare class SalesService {
    private saleModel;
    constructor(saleModel: Model<SaleDocument>);
    create(createSaleDto: CreateSaleDto): Promise<ApiResponse<Sale>>;
    findAll(): Promise<ApiResponse<Sale[]>>;
    findOne(id: string): Promise<ApiResponse<Sale>>;
    completeSale(id: string, completedBy: string): Promise<ApiResponse<Sale>>;
    getSalesStats(): Promise<ApiResponse<any>>;
    findAllWithQuery(query: SalesQueryDto): Promise<{
        success: boolean;
        data: {
            sales: (import("mongoose").Document<unknown, {}, SaleDocument, {}, {}> & Sale & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
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
    update(id: string, updateSaleDto: UpdateSaleDto): Promise<ApiResponse<Sale>>;
    updateStatus(id: string, status: string): Promise<ApiResponse<Sale>>;
    updatePaymentStatus(id: string, paymentStatus: string, amountPaid?: number): Promise<ApiResponse<Sale>>;
    getTopServices(): Promise<ApiResponse<any>>;
    getRevenueByPeriod(period: "daily" | "weekly" | "monthly"): Promise<ApiResponse<any>>;
    remove(id: string): Promise<ApiResponse<void>>;
}
