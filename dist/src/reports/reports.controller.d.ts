import type { ReportsService } from "./reports.service";
import { DailySalesSummary } from "./schemas/daily-sales-summary.schema";
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    generateDailySalesSummary(date: string): Promise<ApiResponse<DailySalesSummary>>;
    getDailySalesSummary(date: string): Promise<ApiResponse<DailySalesSummary>>;
    getWeeklySalesReport(startDate: string, endDate: string): Promise<ApiResponse<any>>;
    getMonthlySalesReport(year: number, month: number): Promise<ApiResponse<any>>;
}
