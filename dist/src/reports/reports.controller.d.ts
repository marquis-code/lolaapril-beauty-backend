import { ReportsService } from "./reports.service";
import { DailySalesSummary } from "./schemas/daily-sales-summary.schema";
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    generateDailySalesSummary(date: string): Promise<import("../common/interfaces/common.interface").ApiResponse<DailySalesSummary>>;
    getDailySalesSummary(date: string): Promise<import("../common/interfaces/common.interface").ApiResponse<DailySalesSummary>>;
    getWeeklySalesReport(startDate: string, endDate: string): Promise<import("../common/interfaces/common.interface").ApiResponse<any>>;
    getMonthlySalesReport(year: number, month: number): Promise<import("../common/interfaces/common.interface").ApiResponse<any>>;
}
