import { Injectable, NotFoundException, ConflictException } from "@nestjs/common"
import { Model } from "mongoose"
import { Appointment, AppointmentDocument } from "./schemas/appointment.schema"
import { CreateAppointmentDto } from "./dto/create-appointment.dto"
import { UpdateAppointmentDto } from "./dto/update-appointment.dto"
import { AppointmentQueryDto } from "./dto/appointment-query.dto"
import { InjectModel } from "@nestjs/mongoose"

@Injectable()
export class AppointmentService {
  constructor(
  @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    // Check for time slot conflicts
    const conflictingAppointment = await this.appointmentModel.findOne({
      selectedDate: createAppointmentDto.selectedDate,
      selectedTime: createAppointmentDto.selectedTime,
      status: { $nin: ["cancelled", "no_show"] },
      ...(createAppointmentDto.assignedStaff && { assignedStaff: createAppointmentDto.assignedStaff }),
    })

    if (conflictingAppointment) {
      throw new ConflictException("Time slot is already booked")
    }

    const appointment = new this.appointmentModel(createAppointmentDto)
    return appointment.save()
  }

  async findAll(query: AppointmentQueryDto) {
    const {
      page = 1,
      limit = 10,
      clientId,
      status,
      date,
      startDate,
      endDate,
      assignedStaff,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query

    const filter: any = {}

    if (clientId) filter.clientId = clientId
    if (status) filter.status = status
    if (assignedStaff) filter.assignedStaff = assignedStaff

    // Date filtering
    if (date) {
      filter.selectedDate = date
    } else if (startDate || endDate) {
      filter.selectedDate = {}
      if (startDate) filter.selectedDate.$gte = startDate
      if (endDate) filter.selectedDate.$lte = endDate
    }

    // Search functionality
    if (search) {
      filter.$or = [
        { "serviceDetails.serviceName": { $regex: search, $options: "i" } },
        { "serviceDetails.serviceDescription": { $regex: search, $options: "i" } },
        { customerNotes: { $regex: search, $options: "i" } },
      ]
    }

    const skip = (page - 1) * limit
    const sortOptions: any = {}
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1

    const [appointments, total] = await Promise.all([
      this.appointmentModel
        .find(filter)
        .populate("clientId", "firstName lastName email phone")
        .populate("assignedStaff", "firstName lastName email")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.appointmentModel.countDocuments(filter),
    ])

    return {
      appointments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentModel
      .findById(id)
      .populate("clientId", "firstName lastName email phone")
      .populate("assignedStaff", "firstName lastName email")
      .exec()

    if (!appointment) {
      throw new NotFoundException("Appointment not found")
    }
    return appointment
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    // If updating time/date, check for conflicts
    if (updateAppointmentDto.selectedDate || updateAppointmentDto.selectedTime) {
      const existingAppointment = await this.appointmentModel.findById(id)
      if (!existingAppointment) {
        throw new NotFoundException("Appointment not found")
      }

      const newDate = updateAppointmentDto.selectedDate || existingAppointment.selectedDate
      const newTime = updateAppointmentDto.selectedTime || existingAppointment.selectedTime
      const newStaff = updateAppointmentDto.assignedStaff || existingAppointment.assignedStaff

      const conflictingAppointment = await this.appointmentModel.findOne({
        _id: { $ne: id },
        selectedDate: newDate,
        selectedTime: newTime,
        status: { $nin: ["cancelled", "no_show"] },
        ...(newStaff && { assignedStaff: newStaff }),
      })

      if (conflictingAppointment) {
        throw new ConflictException("Time slot is already booked")
      }
    }

    const appointment = await this.appointmentModel
      .findByIdAndUpdate(id, updateAppointmentDto, { new: true })
      .populate("clientId", "firstName lastName email phone")
      .populate("assignedStaff", "firstName lastName email")
      .exec()

    if (!appointment) {
      throw new NotFoundException("Appointment not found")
    }
    return appointment
  }

  async remove(id: string): Promise<void> {
    const result = await this.appointmentModel.findByIdAndDelete(id)
    if (!result) {
      throw new NotFoundException("Appointment not found")
    }
  }

  async updateStatus(id: string, status: string, cancellationReason?: string): Promise<Appointment> {
    const updateData: any = { status }

    if (status === "cancelled" && cancellationReason) {
      updateData.cancellationReason = cancellationReason
      updateData.cancellationDate = new Date()
    }

    const appointment = await this.appointmentModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate("clientId", "firstName lastName email phone")
      .populate("assignedStaff", "firstName lastName email")
      .exec()

    if (!appointment) {
      throw new NotFoundException("Appointment not found")
    }
    return appointment
  }

  async assignStaff(id: string, staffId: string): Promise<Appointment> {
    const appointment = await this.appointmentModel
      .findByIdAndUpdate(id, { assignedStaff: staffId }, { new: true })
      .populate("clientId", "firstName lastName email phone")
      .populate("assignedStaff", "firstName lastName email")
      .exec()

    if (!appointment) {
      throw new NotFoundException("Appointment not found")
    }
    return appointment
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    return this.appointmentModel
      .find({ selectedDate: date, status: { $nin: ["cancelled", "no_show"] } })
      .populate("clientId", "firstName lastName email phone")
      .populate("assignedStaff", "firstName lastName email")
      .sort({ selectedTime: 1 })
      .exec()
  }

  async getAppointmentsByStaff(staffId: string, date?: string): Promise<Appointment[]> {
    const filter: any = { assignedStaff: staffId, status: { $nin: ["cancelled", "no_show"] } }
    if (date) filter.selectedDate = date

    return this.appointmentModel
      .find(filter)
      .populate("clientId", "firstName lastName email phone")
      .sort({ selectedDate: 1, selectedTime: 1 })
      .exec()
  }

  async getAppointmentStats() {
    const today = new Date().toISOString().split("T")[0]

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
    ])

    const revenueStats = await this.appointmentModel.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$paymentDetails.total.amount" },
          averageBookingValue: { $avg: "$paymentDetails.total.amount" },
        },
      },
    ])

    return {
      overview: stats[0] || { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, todayAppointments: 0 },
      revenue: revenueStats[0] || { totalRevenue: 0, averageBookingValue: 0 },
    }
  }

  async getAvailableTimeSlots(date: string, staffId?: string): Promise<string[]> {
    const bookedSlots = await this.appointmentModel
      .find({
        selectedDate: date,
        status: { $nin: ["cancelled", "no_show"] },
        ...(staffId && { assignedStaff: staffId }),
      })
      .select("selectedTime")
      .exec()

    const bookedTimes = bookedSlots.map((slot) => slot.selectedTime)

    // Generate available time slots (9 AM to 6 PM, 30-minute intervals)
    const allSlots = []
    for (let hour = 9; hour < 18; hour++) {
      allSlots.push(`${hour.toString().padStart(2, "0")}:00`)
      allSlots.push(`${hour.toString().padStart(2, "0")}:30`)
    }

    return allSlots.filter((slot) => !bookedTimes.includes(slot))
  }
}
