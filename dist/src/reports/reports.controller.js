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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reports_service_1 = require("./reports.service");
const daily_sales_summary_schema_1 = require("./schemas/daily-sales-summary.schema");
const api_response_decorator_1 = require("../common/decorators/api-response.decorator");
const business_context_decorator_1 = require("../auth/decorators/business-context.decorator");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    generateDailySalesSummary(businessId, date) {
        return this.reportsService.generateDailySalesSummary(businessId, date);
    }
    getDailySalesSummary(businessId, date) {
        return this.reportsService.getDailySalesSummary(businessId, date);
    }
    getWeeklySalesReport(businessId, startDate, endDate) {
        return this.reportsService.getWeeklySalesReport(businessId, startDate, endDate);
    }
    getMonthlySalesReport(businessId, year, month) {
        return this.reportsService.getMonthlySalesReport(businessId, +year, +month);
    }
};
__decorate([
    (0, common_1.Post)("daily-sales/:date"),
    (0, swagger_1.ApiOperation)({ summary: "Generate daily sales summary for a specific date" }),
    (0, api_response_decorator_1.ApiResponseWrapper)(daily_sales_summary_schema_1.DailySalesSummary, 201, "Daily sales summary generated successfully"),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "generateDailySalesSummary", null);
__decorate([
    (0, common_1.Get)("daily-sales/:date"),
    (0, swagger_1.ApiOperation)({ summary: "Get daily sales summary for a specific date" }),
    (0, api_response_decorator_1.ApiResponseWrapper)(daily_sales_summary_schema_1.DailySalesSummary),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getDailySalesSummary", null);
__decorate([
    (0, common_1.Get)("weekly-sales"),
    (0, swagger_1.ApiOperation)({ summary: "Get weekly sales report" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Weekly sales report retrieved successfully" }),
    (0, swagger_1.ApiQuery)({ name: "startDate", required: true, type: String, description: "Start date (YYYY-MM-DD)" }),
    (0, swagger_1.ApiQuery)({ name: "endDate", required: true, type: String, description: "End date (YYYY-MM-DD)" }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getWeeklySalesReport", null);
__decorate([
    (0, common_1.Get)("monthly-sales"),
    (0, swagger_1.ApiOperation)({ summary: "Get monthly sales report" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Monthly sales report retrieved successfully" }),
    (0, swagger_1.ApiQuery)({ name: "year", required: true, type: Number, description: "Year (YYYY)" }),
    (0, swagger_1.ApiQuery)({ name: "month", required: true, type: Number, description: "Month (1-12)" }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getMonthlySalesReport", null);
ReportsController = __decorate([
    (0, swagger_1.ApiTags)("Reports"),
    (0, common_1.Controller)("reports"),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
exports.ReportsController = ReportsController;
//# sourceMappingURL=reports.controller.js.map