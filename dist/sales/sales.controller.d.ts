import { SalesService } from "./sales.service";
import { CreateSaleDto } from "./dto/create-sale.dto";
import { UpdateSaleDto } from "./dto/update-sale.dto";
import { SalesQueryDto } from "./dto/sales-query.dto";
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(businessId: string, createSaleDto: CreateSaleDto): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/sale.schema").Sale>>;
    findAll(businessId: string, query: SalesQueryDto): Promise<{
        success: boolean;
        data: {
            sales: import("./schemas/sale.schema").SaleDocument[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                pages: number;
            };
        };
    }>;
    getStats(businessId: string): Promise<import("../common/interfaces/common.interface").ApiResponse<any>>;
    getTopServices(businessId: string): Promise<import("../common/interfaces/common.interface").ApiResponse<any>>;
    getRevenueByPeriod(businessId: string, period?: "daily" | "weekly" | "monthly"): Promise<import("../common/interfaces/common.interface").ApiResponse<any>>;
    findOne(businessId: string, id: string): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/sale.schema").Sale>>;
    update(businessId: string, id: string, updateSaleDto: UpdateSaleDto): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/sale.schema").Sale>>;
    completeSale(businessId: string, id: string, body: {
        completedBy: string;
    }): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/sale.schema").Sale>>;
    updateStatus(businessId: string, id: string, body: {
        status: string;
    }): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/sale.schema").Sale>>;
    updatePaymentStatus(businessId: string, id: string, body: {
        paymentStatus: string;
        amountPaid?: number;
    }): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/sale.schema").Sale>>;
    remove(businessId: string, id: string): Promise<import("../common/interfaces/common.interface").ApiResponse<void>>;
}
