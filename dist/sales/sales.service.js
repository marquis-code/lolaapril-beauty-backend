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
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const sale_schema_1 = require("./schemas/sale.schema");
const mongoose_2 = require("@nestjs/mongoose");
let SalesService = class SalesService {
    constructor(saleModel) {
        this.saleModel = saleModel;
    }
    async create(businessId, createSaleDto) {
        try {
            const sale = new this.saleModel({ ...createSaleDto, businessId });
            await sale.save();
            const savedSale = await this.saleModel
                .findOne({ _id: sale._id, businessId })
                .lean()
                .exec();
            if (!savedSale) {
                throw new Error("Failed to retrieve saved sale");
            }
            return {
                success: true,
                data: savedSale,
                message: "Sale created successfully",
            };
        }
        catch (error) {
            throw new Error(`Failed to create sale: ${error.message}`);
        }
    }
    async createFromAppointment(appointment, businessId) {
        const saleNumber = `SALE-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const items = [{
                itemType: 'service',
                itemId: appointment.serviceDetails?.serviceId?.toString() || appointment._id.toString(),
                itemName: appointment.serviceDetails?.serviceName || 'Service',
                quantity: 1,
                unitPrice: appointment.serviceDetails?.price || 0,
                totalPrice: appointment.serviceDetails?.price || 0,
                discount: 0,
                tax: 0,
            }];
        const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
        const sale = new this.saleModel({
            saleNumber,
            businessId,
            clientId: appointment.clientId,
            appointmentId: appointment._id,
            items,
            subtotal: totalAmount,
            totalAmount,
            amountPaid: totalAmount,
            amountDue: 0,
            paymentStatus: 'paid',
            status: 'completed',
            createdBy: appointment.clientId,
            completedBy: appointment.clientId,
            completedAt: new Date(),
            notes: `Auto-generated from completed appointment ${appointment.appointmentNumber || appointment._id}`,
        });
        return sale.save();
    }
    async findAll(businessId) {
        try {
            const sales = await this.saleModel
                .find({ businessId })
                .populate("clientId", "profile.firstName profile.lastName profile.email")
                .populate("createdBy", "firstName lastName")
                .sort({ createdAt: -1 })
                .lean()
                .exec();
            return {
                success: true,
                data: sales,
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch sales: ${error.message}`);
        }
    }
    async findOne(businessId, id) {
        try {
            const sale = await this.saleModel
                .findOne({ _id: id, businessId })
                .populate("clientId", "profile.firstName profile.lastName profile.email")
                .populate("createdBy", "firstName lastName")
                .populate("completedBy", "firstName lastName")
                .lean()
                .exec();
            if (!sale) {
                throw new common_1.NotFoundException("Sale not found");
            }
            return {
                success: true,
                data: sale,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to fetch sale: ${error.message}`);
        }
    }
    async completeSale(businessId, id, completedBy) {
        try {
            const sale = await this.saleModel
                .findOneAndUpdate({ _id: id, businessId }, {
                status: "completed",
                completedBy,
                completedAt: new Date(),
                updatedAt: new Date(),
            }, { new: true, runValidators: true })
                .lean()
                .exec();
            if (!sale) {
                throw new common_1.NotFoundException("Sale not found");
            }
            return {
                success: true,
                data: sale,
                message: "Sale completed successfully",
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to complete sale: ${error.message}`);
        }
    }
    async getSalesStats(businessId) {
        try {
            const [totalSales, completedSales, totalRevenue, pendingSales] = await Promise.all([
                this.saleModel.countDocuments({ businessId }),
                this.saleModel.countDocuments({ businessId, status: "completed" }),
                this.saleModel.aggregate([
                    { $match: { businessId, status: "completed" } },
                    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
                ]),
                this.saleModel.countDocuments({ businessId, status: { $in: ["draft", "confirmed"] } }),
            ]);
            const topServices = await this.saleModel.aggregate([
                { $match: { businessId, status: "completed" } },
                { $unwind: "$items" },
                {
                    $group: {
                        _id: "$items.itemName",
                        count: { $sum: "$items.quantity" },
                        revenue: { $sum: "$items.totalPrice" },
                    },
                },
                { $sort: { revenue: -1 } },
                { $limit: 10 },
            ]);
            return {
                success: true,
                data: {
                    totalSales,
                    completedSales,
                    totalRevenue: totalRevenue[0]?.total || 0,
                    pendingSales,
                    topServices,
                },
            };
        }
        catch (error) {
            throw new Error(`Failed to get sales stats: ${error.message}`);
        }
    }
    async findAllWithQuery(businessId, query) {
        const { page = 1, limit = 10, clientId, appointmentId, bookingId, status, paymentStatus, staffId, startDate, endDate, search, sortBy = "createdAt", sortOrder = "desc", } = query;
        const filter = { businessId };
        if (clientId)
            filter.clientId = clientId;
        if (appointmentId)
            filter.appointmentId = appointmentId;
        if (bookingId)
            filter.bookingId = bookingId;
        if (status)
            filter.status = status;
        if (paymentStatus)
            filter.paymentStatus = paymentStatus;
        if (staffId) {
            filter["items.staffId"] = staffId;
        }
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate)
                filter.createdAt.$gte = new Date(startDate);
            if (endDate)
                filter.createdAt.$lte = new Date(endDate);
        }
        if (search) {
            filter.$or = [
                { saleNumber: { $regex: search, $options: "i" } },
                { notes: { $regex: search, $options: "i" } },
                { "items.itemName": { $regex: search, $options: "i" } },
            ];
        }
        const skip = (page - 1) * limit;
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
        const sales = await this.saleModel
            .find(filter)
            .populate("clientId", "firstName lastName email phone")
            .populate("appointmentId", "selectedDate selectedTime")
            .populate("bookingId", "bookingDate startTime")
            .populate("createdBy", "firstName lastName email")
            .populate("completedBy", "firstName lastName email")
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .lean()
            .exec();
        const total = await this.saleModel.countDocuments(filter).exec();
        return {
            success: true,
            data: {
                sales,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        };
    }
    async update(businessId, id, updateSaleDto) {
        try {
            const sale = await this.saleModel
                .findOneAndUpdate({ _id: id, businessId }, { ...updateSaleDto, updatedAt: new Date() }, { new: true })
                .populate("clientId", "firstName lastName email phone")
                .populate("createdBy", "firstName lastName email")
                .populate("completedBy", "firstName lastName email")
                .lean()
                .exec();
            if (!sale) {
                throw new common_1.NotFoundException("Sale not found");
            }
            return {
                success: true,
                data: sale,
                message: "Sale updated successfully",
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to update sale: ${error.message}`);
        }
    }
    async updateStatus(businessId, id, status) {
        try {
            const sale = await this.saleModel
                .findOneAndUpdate({ _id: id, businessId }, { status, updatedAt: new Date() }, { new: true })
                .populate("clientId", "firstName lastName email phone")
                .populate("createdBy", "firstName lastName email")
                .lean()
                .exec();
            if (!sale) {
                throw new common_1.NotFoundException("Sale not found");
            }
            return {
                success: true,
                data: sale,
                message: "Sale status updated successfully",
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to update sale status: ${error.message}`);
        }
    }
    async updatePaymentStatus(businessId, id, paymentStatus, amountPaid) {
        try {
            const updateData = { paymentStatus, updatedAt: new Date() };
            if (amountPaid !== undefined) {
                updateData.amountPaid = amountPaid;
                const sale = await this.saleModel
                    .findOne({ _id: id, businessId })
                    .lean()
                    .exec();
                if (sale) {
                    updateData.amountDue = Math.max(0, sale.totalAmount - amountPaid);
                }
            }
            const sale = await this.saleModel
                .findOneAndUpdate({ _id: id, businessId }, updateData, { new: true })
                .populate("clientId", "firstName lastName email phone")
                .populate("createdBy", "firstName lastName email")
                .lean()
                .exec();
            if (!sale) {
                throw new common_1.NotFoundException("Sale not found");
            }
            return {
                success: true,
                data: sale,
                message: "Payment status updated successfully",
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to update payment status: ${error.message}`);
        }
    }
    async getTopServices(businessId) {
        try {
            const topServices = await this.saleModel.aggregate([
                { $match: { businessId, status: "completed" } },
                { $unwind: "$items" },
                {
                    $group: {
                        _id: {
                            itemId: "$items.itemId",
                            itemName: "$items.itemName",
                            itemType: "$items.itemType",
                        },
                        totalQuantity: { $sum: "$items.quantity" },
                        totalRevenue: { $sum: "$items.totalPrice" },
                        averagePrice: { $avg: "$items.unitPrice" },
                        salesCount: { $sum: 1 },
                    },
                },
                { $sort: { totalRevenue: -1 } },
                { $limit: 20 },
            ]);
            return {
                success: true,
                data: topServices,
            };
        }
        catch (error) {
            throw new Error(`Failed to get top services: ${error.message}`);
        }
    }
    async getRevenueByPeriod(businessId, period) {
        try {
            let groupBy;
            let dateFormat;
            switch (period) {
                case "daily":
                    groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
                    dateFormat = "YYYY-MM-DD";
                    break;
                case "weekly":
                    groupBy = { $dateToString: { format: "%Y-W%U", date: "$createdAt" } };
                    dateFormat = "YYYY-[W]WW";
                    break;
                case "monthly":
                    groupBy = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
                    dateFormat = "YYYY-MM";
                    break;
            }
            const revenueData = await this.saleModel.aggregate([
                { $match: { businessId, status: "completed" } },
                {
                    $group: {
                        _id: groupBy,
                        totalRevenue: { $sum: "$totalAmount" },
                        totalSales: { $sum: 1 },
                        averageTicketSize: { $avg: "$totalAmount" },
                    },
                },
                { $sort: { _id: 1 } },
                { $limit: 30 },
            ]);
            return {
                success: true,
                data: {
                    period,
                    dateFormat,
                    data: revenueData,
                },
            };
        }
        catch (error) {
            throw new Error(`Failed to get revenue by period: ${error.message}`);
        }
    }
    async remove(businessId, id) {
        try {
            const result = await this.saleModel.findOneAndDelete({ _id: id, businessId }).exec();
            if (!result) {
                throw new common_1.NotFoundException("Sale not found");
            }
            return {
                success: true,
                message: "Sale deleted successfully",
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to delete sale: ${error.message}`);
        }
    }
};
SalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(sale_schema_1.Sale.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], SalesService);
exports.SalesService = SalesService;
//# sourceMappingURL=sales.service.js.map