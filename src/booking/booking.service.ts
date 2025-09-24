import { Injectable, NotFoundException, ConflictException } from "@nestjs/common"
import { Model } from "mongoose"
import { Booking, BookingDocument } from "./schemas/booking.schema"
import { CreateBookingDto } from "./dto/create-booking.dto"
import { UpdateBookingDto } from "./dto/update-booking.dto"
import { BookingQueryDto } from "./dto/booking-query.dto"
import { InjectModel } from "@nestjs/mongoose"

@Injectable()
export class BookingService {

  constructor(
  @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    // Check for time slot conflicts
    const conflictingBooking = await this.bookingModel.findOne({
      bookingDate: createBookingDto.bookingDate,
      startTime: createBookingDto.startTime,
      status: { $nin: ["cancelled", "no_show"] },
    })

    if (conflictingBooking) {
      throw new ConflictException("Time slot is already booked")
    }

    const booking = new this.bookingModel(createBookingDto)
    return booking.save()
  }

  async findAll(query: BookingQueryDto) {
    const {
      page = 1,
      limit = 10,
      clientId,
      status,
      bookingSource,
      date,
      startDate,
      endDate,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query

    const filter: any = {}

    if (clientId) filter.clientId = clientId
    if (status) filter.status = status
    if (bookingSource) filter.bookingSource = bookingSource

    // Date filtering
    if (date) {
      const searchDate = new Date(date)
      filter.bookingDate = {
        $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
        $lt: new Date(searchDate.setHours(23, 59, 59, 999)),
      }
    } else if (startDate || endDate) {
      filter.bookingDate = {}
      if (startDate) filter.bookingDate.$gte = new Date(startDate)
      if (endDate) filter.bookingDate.$lte = new Date(endDate)
    }

    // Search functionality
    if (search) {
      filter.$or = [
        { "services.serviceName": { $regex: search, $options: "i" } },
        { "services.staffName": { $regex: search, $options: "i" } },
        { specialRequests: { $regex: search, $options: "i" } },
        { internalNotes: { $regex: search, $options: "i" } },
      ]
    }

    const skip = (page - 1) * limit
    const sortOptions: any = {}
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1

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
    ])

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingModel
      .findById(id)
      .populate("clientId", "firstName lastName email phone")
      .populate("createdBy", "firstName lastName email")
      .exec()

    if (!booking) {
      throw new NotFoundException("Booking not found")
    }
    return booking
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    // If updating time/date, check for conflicts
    if (updateBookingDto.bookingDate || updateBookingDto.startTime) {
      const existingBooking = await this.bookingModel.findById(id)
      if (!existingBooking) {
        throw new NotFoundException("Booking not found")
      }

      const newDate = updateBookingDto.bookingDate || existingBooking.bookingDate
      const newTime = updateBookingDto.startTime || existingBooking.startTime

      const conflictingBooking = await this.bookingModel.findOne({
        _id: { $ne: id },
        bookingDate: newDate,
        startTime: newTime,
        status: { $nin: ["cancelled", "no_show"] },
      })

      if (conflictingBooking) {
        throw new ConflictException("Time slot is already booked")
      }
    }

    const booking = await this.bookingModel
      .findByIdAndUpdate(id, updateBookingDto, { new: true })
      .populate("clientId", "firstName lastName email phone")
      .populate("createdBy", "firstName lastName email")
      .exec()

    if (!booking) {
      throw new NotFoundException("Booking not found")
    }
    return booking
  }

  async remove(id: string): Promise<void> {
    const result = await this.bookingModel.findByIdAndDelete(id)
    if (!result) {
      throw new NotFoundException("Booking not found")
    }
  }

  async updateStatus(id: string, status: string, cancellationReason?: string): Promise<Booking> {
    const updateData: any = { status }

    if (status === "cancelled" && cancellationReason) {
      updateData.cancellationReason = cancellationReason
      updateData.cancellationDate = new Date()
    }

    const booking = await this.bookingModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate("clientId", "firstName lastName email phone")
      .populate("createdBy", "firstName lastName email")
      .exec()

    if (!booking) {
      throw new NotFoundException("Booking not found")
    }
    return booking
  }

  async getBookingsByDate(date: Date): Promise<Booking[]> {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0))
    const endOfDay = new Date(date.setHours(23, 59, 59, 999))

    return this.bookingModel
      .find({
        bookingDate: { $gte: startOfDay, $lte: endOfDay },
        status: { $nin: ["cancelled", "no_show"] },
      })
      .populate("clientId", "firstName lastName email phone")
      .sort({ startTime: 1 })
      .exec()
  }

  async getBookingStats() {
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

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
    ])

    const sourceStats = await this.bookingModel.aggregate([
      {
        $group: {
          _id: "$bookingSource",
          count: { $sum: 1 },
        },
      },
    ])

    const revenueStats = await this.bookingModel.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          averageBookingValue: { $avg: "$totalAmount" },
        },
      },
    ])

    return {
      overview: stats[0] || { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, todayBookings: 0 },
      bySource: sourceStats,
      revenue: revenueStats[0] || { totalRevenue: 0, averageBookingValue: 0 },
    }
  }
}
