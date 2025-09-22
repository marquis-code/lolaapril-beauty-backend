import { Controller, Get, Post } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger"
import type { ReportsService } from "./reports.service"
import { DailySalesSummary } from "./schemas/daily-sales-summary.schema"
import { ApiResponseWrapper } from "../common/decorators/api-response.decorator"

@ApiTags("Reports")
@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post("daily-sales/:date")
  @ApiOperation({ summary: "Generate daily sales summary for a specific date" })
  @ApiResponseWrapper(DailySalesSummary, 201, "Daily sales summary generated successfully")
  generateDailySalesSummary(date: string) {
    return this.reportsService.generateDailySalesSummary(date)
  }

  @Get("daily-sales/:date")
  @ApiOperation({ summary: "Get daily sales summary for a specific date" })
  @ApiResponseWrapper(DailySalesSummary)
  getDailySalesSummary(date: string) {
    return this.reportsService.getDailySalesSummary(date)
  }

  @Get("weekly-sales")
  @ApiOperation({ summary: "Get weekly sales report" })
  @ApiResponse({ status: 200, description: "Weekly sales report retrieved successfully" })
  @ApiQuery({ name: "startDate", required: true, type: String, description: "Start date (YYYY-MM-DD)" })
  @ApiQuery({ name: "endDate", required: true, type: String, description: "End date (YYYY-MM-DD)" })
  getWeeklySalesReport(startDate: string, endDate: string) {
    return this.reportsService.getWeeklySalesReport(startDate, endDate)
  }

  @Get("monthly-sales")
  @ApiOperation({ summary: "Get monthly sales report" })
  @ApiResponse({ status: 200, description: "Monthly sales report retrieved successfully" })
  @ApiQuery({ name: "year", required: true, type: Number, description: "Year (YYYY)" })
  @ApiQuery({ name: "month", required: true, type: Number, description: "Month (1-12)" })
  getMonthlySalesReport(year: number, month: number) {
    return this.reportsService.getMonthlySalesReport(+year, +month)
  }
}
