import { Model } from "mongoose";
import { DailySalesSummary, DailySalesSummaryDocument } from "./schemas/daily-sales-summary.schema";
import { SaleDocument } from "../sales/schemas/sale.schema";
import { AppointmentDocument } from "../appointment/schemas/appointment.schema";
import { ClientDocument } from "../client/schemas/client.schema";
import { ApiResponse } from "../common/interfaces/common.interface";
export declare class ReportsService {
    private dailySalesSummaryModel;
    private saleModel;
    private appointmentModel;
    private clientModel;
    constructor(dailySalesSummaryModel: Model<DailySalesSummaryDocument>, saleModel: Model<SaleDocument>, appointmentModel: Model<AppointmentDocument>, clientModel: Model<ClientDocument>);
    generateDailySalesSummary(date: string): Promise<ApiResponse<DailySalesSummary>>;
    getDailySalesSummary(date: string): Promise<ApiResponse<DailySalesSummary>>;
    getWeeklySalesReport(startDate: string, endDate: string): Promise<ApiResponse<any>>;
    getMonthlySalesReport(year: number, month: number): Promise<ApiResponse<any>>;
    private calculateServicesSummary;
    private calculateStaffSummary;
    private calculatePaymentMethodsSummary;
    private aggregateTopServices;
    private aggregateTopStaff;
}
