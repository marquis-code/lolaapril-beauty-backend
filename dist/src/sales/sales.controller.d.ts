import type { SalesService } from "./sales.service";
import type { CreateSaleDto } from "./dto/create-sale.dto";
import type { UpdateSaleDto } from "./dto/update-sale.dto";
import type { SalesQueryDto } from "./dto/sales-query.dto";
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(createSaleDto: CreateSaleDto): Promise<ApiResponse<import("./schemas/sale.schema").Sale>>;
    findAll(query: SalesQueryDto): Promise<{
        success: boolean;
        data: {
            sales: (import("mongoose").Document<unknown, {}, import("./schemas/sale.schema").SaleDocument, {}> & import("./schemas/sale.schema").Sale & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
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
    getTopServices(): Promise<ApiResponse<any>>;
    getRevenueByPeriod(period?: "daily" | "weekly" | "monthly"): Promise<ApiResponse<any>>;
    findOne(id: string): Promise<ApiResponse<import("./schemas/sale.schema").Sale>>;
    update(id: string, updateSaleDto: UpdateSaleDto): Promise<ApiResponse<import("./schemas/sale.schema").Sale>>;
    completeSale(id: string, body: {
        completedBy: string;
    }): Promise<ApiResponse<import("./schemas/sale.schema").Sale>>;
    updateStatus(id: string, body: {
        status: string;
    }): Promise<ApiResponse<import("./schemas/sale.schema").Sale>>;
    updatePaymentStatus(id: string, body: {
        paymentStatus: string;
        amountPaid?: number;
    }): Promise<ApiResponse<import("./schemas/sale.schema").Sale>>;
    remove(id: string): Promise<ApiResponse<void>>;
}
