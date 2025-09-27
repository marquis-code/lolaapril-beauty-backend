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
exports.AppointmentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const appointment_schema_1 = require("./schemas/appointment.schema");
const mongoose_2 = require("@nestjs/mongoose");
const payment_service_1 = require("../payment/payment.service");
const notification_service_1 = require("../notification/notification.service");
const staff_service_1 = require("../staff/staff.service");
let AppointmentService = class AppointmentService {
    constructor(appointmentModel, paymentService, notificationService, staffService) {
        this.appointmentModel = appointmentModel;
        this.paymentService = paymentService;
        this.notificationService = notificationService;
        this.staffService = staffService;
    }
    async create(createAppointmentDto) {
        const conflictingAppointment = await this.appointmentModel.findOne(Object.assign({ selectedDate: createAppointmentDto.selectedDate, selectedTime: createAppointmentDto.selectedTime, status: { $nin: ["cancelled", "no_show"] } }, (createAppointmentDto.assignedStaff && { assignedStaff: createAppointmentDto.assignedStaff })));
        if (conflictingAppointment) {
            throw new common_1.ConflictException("Time slot is already booked");
        }
        const appointment = new this.appointmentModel(createAppointmentDto);
        return appointment.save();
    }
    async findAll(query) {
        const { page = 1, limit = 10, clientId, status, date, startDate, endDate, assignedStaff, search, sortBy = "createdAt", sortOrder = "desc", } = query;
        const filter = {};
        if (clientId)
            filter.clientId = clientId;
        if (status)
            filter.status = status;
        if (assignedStaff)
            filter.assignedStaff = assignedStaff;
        if (date) {
            filter.selectedDate = date;
        }
        else if (startDate || endDate) {
            filter.selectedDate = {};
            if (startDate)
                filter.selectedDate.$gte = startDate;
            if (endDate)
                filter.selectedDate.$lte = endDate;
        }
        if (search) {
            filter.$or = [
                { "serviceDetails.serviceName": { $regex: search, $options: "i" } },
                { "serviceDetails.serviceDescription": { $regex: search, $options: "i" } },
                { customerNotes: { $regex: search, $options: "i" } },
            ];
        }
        const skip = (page - 1) * limit;
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
        const appointments = await this.appointmentModel
            .find(filter)
            .populate("clientId", "firstName lastName email phone")
            .populate("assignedStaff", "firstName lastName email")
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .exec();
        const total = await this.appointmentModel.countDocuments(filter);
        return {
            appointments,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const appointment = await this.appointmentModel
            .findById(id)
            .populate("clientId", "firstName lastName email phone")
            .populate("assignedStaff", "firstName lastName email")
            .exec();
        if (!appointment) {
            throw new common_1.NotFoundException("Appointment not found");
        }
        return appointment;
    }
    async update(id, updateAppointmentDto) {
        if (updateAppointmentDto.selectedDate || updateAppointmentDto.selectedTime) {
            const existingAppointment = await this.appointmentModel.findById(id);
            if (!existingAppointment) {
                throw new common_1.NotFoundException("Appointment not found");
            }
            const newDate = updateAppointmentDto.selectedDate || existingAppointment.selectedDate;
            const newTime = updateAppointmentDto.selectedTime || existingAppointment.selectedTime;
            const newStaff = updateAppointmentDto.assignedStaff || existingAppointment.assignedStaff;
            const conflictingAppointment = await this.appointmentModel.findOne(Object.assign({ _id: { $ne: id }, selectedDate: newDate, selectedTime: newTime, status: { $nin: ["cancelled", "no_show"] } }, (newStaff && { assignedStaff: newStaff })));
            if (conflictingAppointment) {
                throw new common_1.ConflictException("Time slot is already booked");
            }
        }
        const appointment = await this.appointmentModel
            .findByIdAndUpdate(id, updateAppointmentDto, { new: true })
            .populate("clientId", "firstName lastName email phone")
            .populate("assignedStaff", "firstName lastName email")
            .exec();
        if (!appointment) {
            throw new common_1.NotFoundException("Appointment not found");
        }
        return appointment;
    }
    async remove(id) {
        const result = await this.appointmentModel.findByIdAndDelete(id);
        if (!result) {
            throw new common_1.NotFoundException("Appointment not found");
        }
    }
    async updateStatus(id, status, cancellationReason) {
        const updateData = { status };
        if (status === "cancelled" && cancellationReason) {
            updateData.cancellationReason = cancellationReason;
            updateData.cancellationDate = new Date();
        }
        const appointment = await this.appointmentModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .populate("clientId", "firstName lastName email phone")
            .populate("assignedStaff", "firstName lastName email")
            .exec();
        if (!appointment) {
            throw new common_1.NotFoundException("Appointment not found");
        }
        return appointment;
    }
    async assignStaff(id, staffId) {
        const appointment = await this.appointmentModel
            .findByIdAndUpdate(id, { assignedStaff: staffId }, { new: true })
            .populate("clientId", "firstName lastName email phone")
            .populate("assignedStaff", "firstName lastName email")
            .exec();
        if (!appointment) {
            throw new common_1.NotFoundException("Appointment not found");
        }
        return appointment;
    }
    async getAppointmentsByDate(date) {
        return this.appointmentModel
            .find({ selectedDate: date, status: { $nin: ["cancelled", "no_show"] } })
            .populate("clientId", "firstName lastName email phone")
            .populate("assignedStaff", "firstName lastName email")
            .sort({ selectedTime: 1 })
            .exec();
    }
    async getAppointmentsByStaff(staffId, date) {
        const filter = { assignedStaff: staffId, status: { $nin: ["cancelled", "no_show"] } };
        if (date)
            filter.selectedDate = date;
        return this.appointmentModel
            .find(filter)
            .populate("clientId", "firstName lastName email phone")
            .sort({ selectedDate: 1, selectedTime: 1 })
            .exec();
    }
    async getAppointmentStats() {
        const today = new Date().toISOString().split("T")[0];
        const stats = await this.appointmentModel.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    pending: { $sum: { $cond: [{ $eq: ["$status", "pending_confirmation"] }, 1, 0] } },
                    confirmed: { $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] } },
                    completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
                    cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
                    todayAppointments: {
                        $sum: { $cond: [{ $eq: ["$selectedDate", today] }, 1, 0] },
                    },
                },
            },
        ]);
        const revenueStats = await this.appointmentModel.aggregate([
            { $match: { status: "completed" } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$paymentDetails.total.amount" },
                    averageBookingValue: { $avg: "$paymentDetails.total.amount" },
                },
            },
        ]);
        return {
            overview: stats[0] || { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, todayAppointments: 0 },
            revenue: revenueStats[0] || { totalRevenue: 0, averageBookingValue: 0 },
        };
    }
    async getAvailableTimeSlots(date, staffId) {
        const bookedSlots = await this.appointmentModel
            .find(Object.assign({ selectedDate: date, status: { $nin: ["cancelled", "no_show"] } }, (staffId && { assignedStaff: staffId })))
            .select("selectedTime")
            .exec();
        const bookedTimes = bookedSlots.map((slot) => slot.selectedTime);
        const allSlots = [];
        for (let hour = 9; hour < 18; hour++) {
            allSlots.push(`${hour.toString().padStart(2, "0")}:00`);
            allSlots.push(`${hour.toString().padStart(2, "0")}:30`);
        }
        return allSlots.filter((slot) => !bookedTimes.includes(slot));
    }
    async createFromBooking(booking) {
        const appointmentData = {
            bookingId: booking._id,
            clientId: booking.clientId,
            businessId: booking.businessId,
            appointmentNumber: await this.generateAppointmentNumber(),
            clientName: booking.clientName,
            clientEmail: booking.clientEmail,
            clientPhone: booking.clientPhone,
            services: booking.services.map(service => ({
                serviceId: service.serviceId,
                serviceName: service.serviceName,
                duration: service.duration,
                price: service.price,
            })),
            scheduledDate: booking.preferredDate,
            scheduledStartTime: booking.preferredStartTime,
            scheduledEndTime: booking.estimatedEndTime,
            totalDuration: booking.totalDuration,
            totalAmount: booking.estimatedTotal,
            status: 'scheduled'
        };
        const appointment = new this.appointmentModel(appointmentData);
        return await appointment.save();
    }
    async generateAppointmentNumber() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const count = await this.appointmentModel.countDocuments({
            createdAt: {
                $gte: new Date(year, today.getMonth(), today.getDate()),
                $lt: new Date(year, today.getMonth(), today.getDate() + 1)
            }
        });
        return `APT-${year}${month}${day}-${String(count + 1).padStart(3, '0')}`;
    }
    async completeAppointment(appointmentId) {
        const appointment = await this.appointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        appointment.status = 'completed';
        appointment.checkOutTime = new Date();
        appointment.actualEndTime = new Date();
        if (!appointment.actualStartTime) {
            appointment.actualStartTime = appointment.checkInTime || new Date();
        }
        await appointment.save();
        const assignments = await this.staffService.getStaffAssignments(appointment._id.toString(), appointment.selectedDate, appointment.selectedDate);
        for (const assignment of assignments) {
            if (assignment.status !== 'completed') {
                await this.staffService.completeStaffAssignment(assignment._id.toString(), {
                    actualStartTime: appointment.actualStartTime || new Date(appointment.selectedDate + 'T' + appointment.selectedTime),
                    actualEndTime: appointment.actualEndTime || new Date(),
                    completionNotes: 'Service completed successfully'
                });
            }
        }
        const existingPayment = await this.paymentService.getPaymentByAppointment(appointmentId);
        if (!existingPayment) {
            await this.paymentService.createPaymentForAppointment(appointment);
        }
        try {
            await this.notificationService.notifyAppointmentCompletion(appointmentId, appointment.clientId.toString(), appointment.businessInfo.businessId, {
                clientName: appointment.clientId,
                serviceName: appointment.serviceDetails.serviceName,
                appointmentDate: appointment.selectedDate,
                appointmentTime: appointment.selectedTime,
                businessName: appointment.businessInfo.businessName,
                appointmentNumber: appointment.appointmentNumber || appointmentId,
            });
        }
        catch (error) {
            console.error('Failed to send completion notification:', error);
        }
    }
};
AppointmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(appointment_schema_1.Appointment.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        payment_service_1.PaymentService,
        notification_service_1.NotificationService,
        staff_service_1.StaffService])
], AppointmentService);
exports.AppointmentService = AppointmentService;
//# sourceMappingURL=appointment.service.js.map