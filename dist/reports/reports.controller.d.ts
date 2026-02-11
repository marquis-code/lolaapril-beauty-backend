import { ReportsService } from "./reports.service";
import { DailySalesSummary } from "./schemas/daily-sales-summary.schema";
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    generateDailySalesSummary(businessId: string, date: string): Promise<import("../common/interfaces/common.interface").ApiResponse<DailySalesSummary>>;
    getDailySalesSummary(businessId: string, date: string): Promise<import("../common/interfaces/common.interface").ApiResponse<DailySalesSummary>>;
    getWeeklySalesReport(businessId: string, startDate: string, endDate: string): Promise<import("../common/interfaces/common.interface").ApiResponse<any>>;
    getMonthlySalesReport(businessId: string, year: number, month: number): Promise<import("../common/interfaces/common.interface").ApiResponse<any>>;
}
