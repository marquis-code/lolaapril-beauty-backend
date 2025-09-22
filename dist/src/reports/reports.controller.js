"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const daily_sales_summary_schema_1 = require("./schemas/daily-sales-summary.schema");
const api_response_decorator_1 = require("../../common/decorators/api-response.decorator");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    generateDailySalesSummary(date) {
        return this.reportsService.generateDailySalesSummary(date);
    }
    getDailySalesSummary(date) {
        return this.reportsService.getDailySalesSummary(date);
    }
    getWeeklySalesReport(startDate, endDate) {
        return this.reportsService.getWeeklySalesReport(startDate, endDate);
    }
    getMonthlySalesReport(year, month) {
        return this.reportsService.getMonthlySalesReport(+year, +month);
    }
};
__decorate([
    (0, common_1.Post)("daily-sales/:date"),
    (0, swagger_1.ApiOperation)({ summary: "Generate daily sales summary for a specific date" }),
    (0, api_response_decorator_1.ApiResponseWrapper)(daily_sales_summary_schema_1.DailySalesSummary, 201, "Daily sales summary generated successfully"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "generateDailySalesSummary", null);
__decorate([
    (0, common_1.Get)("daily-sales/:date"),
    (0, swagger_1.ApiOperation)({ summary: "Get daily sales summary for a specific date" }),
    (0, api_response_decorator_1.ApiResponseWrapper)(daily_sales_summary_schema_1.DailySalesSummary),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getDailySalesSummary", null);
__decorate([
    (0, common_1.Get)("weekly-sales"),
    (0, swagger_1.ApiOperation)({ summary: "Get weekly sales report" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Weekly sales report retrieved successfully" }),
    (0, swagger_1.ApiQuery)({ name: "startDate", required: true, type: String, description: "Start date (YYYY-MM-DD)" }),
    (0, swagger_1.ApiQuery)({ name: "endDate", required: true, type: String, description: "End date (YYYY-MM-DD)" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getWeeklySalesReport", null);
__decorate([
    (0, common_1.Get)("monthly-sales"),
    (0, swagger_1.ApiOperation)({ summary: "Get monthly sales report" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Monthly sales report retrieved successfully" }),
    (0, swagger_1.ApiQuery)({ name: "year", required: true, type: Number, description: "Year (YYYY)" }),
    (0, swagger_1.ApiQuery)({ name: "month", required: true, type: Number, description: "Month (1-12)" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getMonthlySalesReport", null);
ReportsController = __decorate([
    (0, swagger_1.ApiTags)("Reports"),
    (0, common_1.Controller)("reports"),
    __metadata("design:paramtypes", [Function])
], ReportsController);
exports.ReportsController = ReportsController;
//# sourceMappingURL=reports.controller.js.map