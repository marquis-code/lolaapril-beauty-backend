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
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const booking_schema_1 = require("./schemas/booking.schema");
const mongoose_2 = require("@nestjs/mongoose");
let BookingService = class BookingService {
    constructor(bookingModel) {
        this.bookingModel = bookingModel;
    }
    async create(createBookingDto) {
        const conflictingBooking = await this.bookingModel.findOne({
            bookingDate: createBookingDto.bookingDate,
            startTime: createBookingDto.startTime,
            status: { $nin: ["cancelled", "no_show"] },
        });
        if (conflictingBooking) {
            throw new common_1.ConflictException("Time slot is already booked");
        }
        const booking = new this.bookingModel(createBookingDto);
        return booking.save();
    }
    async findAll(query) {
        const { page = 1, limit = 10, clientId, status, bookingSource, date, startDate, endDate, search, sortBy = "createdAt", sortOrder = "desc", } = query;
        const filter = {};
        if (clientId)
            filter.clientId = clientId;
        if (status)
            filter.status = status;
        if (bookingSource)
            filter.bookingSource = bookingSource;
        if (date) {
            const searchDate = new Date(date);
            filter.bookingDate = {
                $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
                $lt: new Date(searchDate.setHours(23, 59, 59, 999)),
            };
        }
        else if (startDate || endDate) {
            filter.bookingDate = {};
            if (startDate)
                filter.bookingDate.$gte = new Date(startDate);
            if (endDate)
                filter.bookingDate.$lte = new Date(endDate);
        }
        if (search) {
            filter.$or = [
                { "services.serviceName": { $regex: search, $options: "i" } },
                { "services.staffName": { $regex: search, $options: "i" } },
                { specialRequests: { $regex: search, $options: "i" } },
                { internalNotes: { $regex: search, $options: "i" } },
            ];
        }
        const skip = (page - 1) * limit;
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
        const [bookings, total] = await Promise.all([
            this.bookingModel
                .find(filter)
                .populate("clientId", "firstName lastName email phone")
                .populate("createdBy", "firstName lastName email")
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.bookingModel.countDocuments(filter),
        ]);
        return {
            bookings,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const booking = await this.bookingModel
            .findById(id)
            .populate("clientId", "firstName lastName email phone")
            .populate("createdBy", "firstName lastName email")
            .exec();
        if (!booking) {
            throw new common_1.NotFoundException("Booking not found");
        }
        return booking;
    }
    async update(id, updateBookingDto) {
        if (updateBookingDto.bookingDate || updateBookingDto.startTime) {
            const existingBooking = await this.bookingModel.findById(id);
            if (!existingBooking) {
                throw new common_1.NotFoundException("Booking not found");
            }
            const newDate = updateBookingDto.bookingDate || existingBooking.bookingDate;
            const newTime = updateBookingDto.startTime || existingBooking.startTime;
            const conflictingBooking = await this.bookingModel.findOne({
                _id: { $ne: id },
                bookingDate: newDate,
                startTime: newTime,
                status: { $nin: ["cancelled", "no_show"] },
            });
            if (conflictingBooking) {
                throw new common_1.ConflictException("Time slot is already booked");
            }
        }
        const booking = await this.bookingModel
            .findByIdAndUpdate(id, updateBookingDto, { new: true })
            .populate("clientId", "firstName lastName email phone")
            .populate("createdBy", "firstName lastName email")
            .exec();
        if (!booking) {
            throw new common_1.NotFoundException("Booking not found");
        }
        return booking;
    }
    async remove(id) {
        const result = await this.bookingModel.findByIdAndDelete(id);
        if (!result) {
            throw new common_1.NotFoundException("Booking not found");
        }
    }
    async updateStatus(id, status, cancellationReason) {
        const updateData = { status };
        if (status === "cancelled" && cancellationReason) {
            updateData.cancellationReason = cancellationReason;
            updateData.cancellationDate = new Date();
        }
        const booking = await this.bookingModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .populate("clientId", "firstName lastName email phone")
            .populate("createdBy", "firstName lastName email")
            .exec();
        if (!booking) {
            throw new common_1.NotFoundException("Booking not found");
        }
        return booking;
    }
    async getBookingsByDate(date) {
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));
        return this.bookingModel
            .find({
            bookingDate: { $gte: startOfDay, $lte: endOfDay },
            status: { $nin: ["cancelled", "no_show"] },
        })
            .populate("clientId", "firstName lastName email phone")
            .sort({ startTime: 1 })
            .exec();
    }
    async getBookingStats() {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        const stats = await this.bookingModel.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
                    confirmed: { $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] } },
                    completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
                    cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
                    todayBookings: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [{ $gte: ["$bookingDate", startOfDay] }, { $lte: ["$bookingDate", endOfDay] }],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
        ]);
        const sourceStats = await this.bookingModel.aggregate([
            {
                $group: {
                    _id: "$bookingSource",
                    count: { $sum: 1 },
                },
            },
        ]);
        const revenueStats = await this.bookingModel.aggregate([
            { $match: { status: "completed" } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" },
                    averageBookingValue: { $avg: "$totalAmount" },
                },
            },
        ]);
        return {
            overview: stats[0] || { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, todayBookings: 0 },
            bySource: sourceStats,
            revenue: revenueStats[0] || { totalRevenue: 0, averageBookingValue: 0 },
        };
    }
};
BookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(booking_schema_1.Booking.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], BookingService);
exports.BookingService = BookingService;
//# sourceMappingURL=booking.service.js.map