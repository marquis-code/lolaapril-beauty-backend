import { Model } from "mongoose";
import { Sale, SaleDocument } from "./schemas/sale.schema";
import { CreateSaleDto } from "./dto/create-sale.dto";
import { ApiResponse } from "../common/interfaces/common.interface";
import { SalesQueryDto } from "./dto/sales-query.dto";
import { UpdateSaleDto } from "./dto/update-sale.dto";
export declare class SalesService {
    private saleModel;
    constructor(saleModel: Model<SaleDocument>);
    create(businessId: string, createSaleDto: CreateSaleDto): Promise<ApiResponse<Sale>>;
    createFromAppointment(appointment: any, businessId: string): Promise<Sale>;
    findAll(businessId: string): Promise<ApiResponse<Sale[]>>;
    findOne(businessId: string, id: string): Promise<ApiResponse<Sale>>;
    completeSale(businessId: string, id: string, completedBy: string): Promise<ApiResponse<Sale>>;
    getSalesStats(businessId: string): Promise<ApiResponse<any>>;
    findAllWithQuery(businessId: string, query: SalesQueryDto): Promise<{
        success: boolean;
        data: {
            sales: SaleDocument[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                pages: number;
            };
        };
    }>;
    update(businessId: string, id: string, updateSaleDto: UpdateSaleDto): Promise<ApiResponse<Sale>>;
    updateStatus(businessId: string, id: string, status: string): Promise<ApiResponse<Sale>>;
    updatePaymentStatus(businessId: string, id: string, paymentStatus: string, amountPaid?: number): Promise<ApiResponse<Sale>>;
    getTopServices(businessId: string): Promise<ApiResponse<any>>;
    getRevenueByPeriod(businessId: string, period: "daily" | "weekly" | "monthly"): Promise<ApiResponse<any>>;
    remove(businessId: string, id: string): Promise<ApiResponse<void>>;
}
