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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const daily_sales_summary_schema_1 = require("./schemas/daily-sales-summary.schema");
const sale_schema_1 = require("../sales/schemas/sale.schema");
const appointment_schema_1 = require("../appointment/schemas/appointment.schema");
const client_schema_1 = require("../client/schemas/client.schema");
const moment_1 = require("moment");
const mongoose_2 = require("@nestjs/mongoose");
let ReportsService = class ReportsService {
    constructor(dailySalesSummaryModel, saleModel, appointmentModel, clientModel) {
        this.dailySalesSummaryModel = dailySalesSummaryModel;
        this.saleModel = saleModel;
        this.appointmentModel = appointmentModel;
        this.clientModel = clientModel;
    }
    async generateDailySalesSummary(date) {
        try {
            const startDate = (0, moment_1.default)(date).startOf("day").toDate();
            const endDate = (0, moment_1.default)(date).endOf("day").toDate();
            const sales = await this.saleModel.find({
                createdAt: { $gte: startDate, $lte: endDate },
                status: "completed",
            }).lean();
            const appointments = await this.appointmentModel.find({
                selectedDate: date,
            }).lean();
            const newClients = await this.clientModel.find({
                createdAt: { $gte: startDate, $lte: endDate },
            }).lean();
            const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
            const totalAppointments = appointments.length;
            const completedAppointments = appointments.filter((apt) => apt.status === "completed").length;
            const cancelledAppointments = appointments.filter((apt) => apt.status === "cancelled").length;
            const noShowAppointments = appointments.filter((apt) => apt.status === "no_show").length;
            const clientIds = new Set(sales.map((sale) => sale.clientId.toString()));
            const returningClients = clientIds.size - newClients.length;
            const servicesSummary = this.calculateServicesSummary(sales);
            const staffSummary = this.calculateStaffSummary(sales);
            const paymentMethodsSummary = this.calculatePaymentMethodsSummary(sales);
            const averageTicketSize = totalRevenue / (completedAppointments || 1);
            const totalTax = sales.reduce((sum, sale) => sum + sale.totalTax, 0);
            const totalDiscount = sales.reduce((sum, sale) => sum + sale.totalDiscount, 0);
            const totalServiceCharge = sales.reduce((sum, sale) => sum + sale.serviceCharge, 0);
            const summaryData = {
                date,
                totalRevenue,
                totalAppointments,
                completedAppointments,
                cancelledAppointments,
                noShowAppointments,
                newClients: newClients.length,
                returningClients,
                servicesSummary,
                staffSummary,
                paymentMethodsSummary,
                averageTicketSize,
                totalTax,
                totalDiscount,
                totalServiceCharge,
            };
            const existingSummary = await this.dailySalesSummaryModel.findOne({ date });
            let summary;
            if (existingSummary) {
                summary = await this.dailySalesSummaryModel.findOneAndUpdate({ date }, { ...summaryData, updatedAt: new Date() }, { new: true });
            }
            else {
                summary = new this.dailySalesSummaryModel(summaryData);
                await summary.save();
            }
            return {
                success: true,
                data: summary,
                message: "Daily sales summary generated successfully",
            };
        }
        catch (error) {
            throw new Error(`Failed to generate daily sales summary: ${error.message}`);
        }
    }
    async getDailySalesSummary(date) {
        try {
            let summary = await this.dailySalesSummaryModel.findOne({ date });
            if (!summary) {
                const result = await this.generateDailySalesSummary(date);
                return result;
            }
            return {
                success: true,
                data: summary,
            };
        }
        catch (error) {
            throw new Error(`Failed to get daily sales summary: ${error.message}`);
        }
    }
    async getWeeklySalesReport(startDate, endDate) {
        try {
            const summaries = await this.dailySalesSummaryModel
                .find({
                date: { $gte: startDate, $lte: endDate },
            })
                .sort({ date: 1 });
            const weeklyTotals = {
                totalRevenue: summaries.reduce((sum, s) => sum + s.totalRevenue, 0),
                totalAppointments: summaries.reduce((sum, s) => sum + s.totalAppointments, 0),
                completedAppointments: summaries.reduce((sum, s) => sum + s.completedAppointments, 0),
                newClients: summaries.reduce((sum, s) => sum + s.newClients, 0),
                averageTicketSize: summaries.reduce((sum, s) => sum + s.averageTicketSize, 0) / summaries.length,
                dailyBreakdown: summaries,
            };
            return {
                success: true,
                data: weeklyTotals,
            };
        }
        catch (error) {
            throw new Error(`Failed to get weekly sales report: ${error.message}`);
        }
    }
    async getMonthlySalesReport(year, month) {
        try {
            const startDate = (0, moment_1.default)({ year, month: month - 1 })
                .startOf("month")
                .format("YYYY-MM-DD");
            const endDate = (0, moment_1.default)({ year, month: month - 1 })
                .endOf("month")
                .format("YYYY-MM-DD");
            const summaries = await this.dailySalesSummaryModel
                .find({
                date: { $gte: startDate, $lte: endDate },
            })
                .sort({ date: 1 });
            const monthlyTotals = {
                totalRevenue: summaries.reduce((sum, s) => sum + s.totalRevenue, 0),
                totalAppointments: summaries.reduce((sum, s) => sum + s.totalAppointments, 0),
                completedAppointments: summaries.reduce((sum, s) => sum + s.completedAppointments, 0),
                newClients: summaries.reduce((sum, s) => sum + s.newClients, 0),
                averageTicketSize: summaries.reduce((sum, s) => sum + s.averageTicketSize, 0) / summaries.length,
                dailyBreakdown: summaries,
                topServices: this.aggregateTopServices(summaries),
                topStaff: this.aggregateTopStaff(summaries),
            };
            return {
                success: true,
                data: monthlyTotals,
            };
        }
        catch (error) {
            throw new Error(`Failed to get monthly sales report: ${error.message}`);
        }
    }
    calculateServicesSummary(sales) {
        const servicesMap = new Map();
        sales.forEach((sale) => {
            sale.items.forEach((item) => {
                if (servicesMap.has(item.itemId)) {
                    const existing = servicesMap.get(item.itemId);
                    existing.quantity += item.quantity;
                    existing.revenue += item.totalPrice;
                }
                else {
                    servicesMap.set(item.itemId, {
                        serviceId: item.itemId,
                        serviceName: item.itemName,
                        quantity: item.quantity,
                        revenue: item.totalPrice,
                    });
                }
            });
        });
        return Array.from(servicesMap.values()).sort((a, b) => b.revenue - a.revenue);
    }
    calculateStaffSummary(sales) {
        const staffMap = new Map();
        sales.forEach((sale) => {
            sale.items.forEach((item) => {
                if (item.staffId) {
                    if (staffMap.has(item.staffId)) {
                        const existing = staffMap.get(item.staffId);
                        existing.appointmentsCompleted += 1;
                        existing.revenue += item.totalPrice;
                        existing.commission += item.commission || 0;
                    }
                    else {
                        staffMap.set(item.staffId, {
                            staffId: item.staffId,
                            staffName: item.staffName,
                            appointmentsCompleted: 1,
                            revenue: item.totalPrice,
                            commission: item.commission || 0,
                        });
                    }
                }
            });
        });
        return Array.from(staffMap.values()).sort((a, b) => b.revenue - a.revenue);
    }
    calculatePaymentMethodsSummary(sales) {
        const paymentMap = new Map();
        return [
            {
                method: "Cash",
                count: Math.floor(sales.length * 0.4),
                amount: sales.reduce((sum, s) => sum + s.totalAmount, 0) * 0.4,
            },
            {
                method: "Card",
                count: Math.floor(sales.length * 0.6),
                amount: sales.reduce((sum, s) => sum + s.totalAmount, 0) * 0.6,
            },
        ];
    }
    aggregateTopServices(summaries) {
        const servicesMap = new Map();
        summaries.forEach((summary) => {
            summary.servicesSummary.forEach((service) => {
                if (servicesMap.has(service.serviceId)) {
                    const existing = servicesMap.get(service.serviceId);
                    existing.quantity += service.quantity;
                    existing.revenue += service.revenue;
                }
                else {
                    servicesMap.set(service.serviceId, { ...service });
                }
            });
        });
        return Array.from(servicesMap.values())
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);
    }
    aggregateTopStaff(summaries) {
        const staffMap = new Map();
        summaries.forEach((summary) => {
            summary.staffSummary.forEach((staff) => {
                if (staffMap.has(staff.staffId)) {
                    const existing = staffMap.get(staff.staffId);
                    existing.appointmentsCompleted += staff.appointmentsCompleted;
                    existing.revenue += staff.revenue;
                    existing.commission += staff.commission;
                }
                else {
                    staffMap.set(staff.staffId, { ...staff });
                }
            });
        });
        return Array.from(staffMap.values())
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);
    }
};
ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(daily_sales_summary_schema_1.DailySalesSummary.name)),
    __param(1, (0, mongoose_2.InjectModel)(sale_schema_1.Sale.name)),
    __param(2, (0, mongoose_2.InjectModel)(appointment_schema_1.Appointment.name)),
    __param(3, (0, mongoose_2.InjectModel)(client_schema_1.Client.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model])
], ReportsService);
exports.ReportsService = ReportsService;
//# sourceMappingURL=reports.service.js.map