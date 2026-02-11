// import { Injectable, NotFoundException } from "@nestjs/common"
// import { Model } from "mongoose"
// import { Sale, SaleDocument } from "./schemas/sale.schema"
// import { CreateSaleDto } from "./dto/create-sale.dto"
// import { ApiResponse } from "../common/interfaces/common.interface"
// import { SalesQueryDto } from "./dto/sales-query.dto"
// import { UpdateSaleDto } from "./dto/update-sale.dto"
// import { InjectModel } from "@nestjs/mongoose"

// @Injectable()
// export class SalesService {
//   constructor(@InjectModel(Sale.name) private saleModel: Model<SaleDocument>) {}

//   async create(createSaleDto: CreateSaleDto): Promise<ApiResponse<Sale>> {
//     try {
//       const sale = new this.saleModel(createSaleDto)
//       const savedSale = await sale.save()

//       return {
//         success: true,
//         data: savedSale,
//         message: "Sale created successfully",
//       }
//     } catch (error) {
//       throw new Error(`Failed to create sale: ${error.message}`)
//     }
//   }

//   async findAll(): Promise<ApiResponse<Sale[]>> {
//     try {
//       const sales = await this.saleModel
//         .find()
//         .populate("clientId", "profile.firstName profile.lastName profile.email")
//         .populate("createdBy", "firstName lastName")
//         .sort({ createdAt: -1 })

//       return {
//         success: true,
//         data: sales,
//       }
//     } catch (error) {
//       throw new Error(`Failed to fetch sales: ${error.message}`)
//     }
//   }

//   async findOne(id: string): Promise<ApiResponse<Sale>> {
//     try {
//       const sale = await this.saleModel
//         .findById(id)
//         .populate("clientId", "profile.firstName profile.lastName profile.email")
//         .populate("createdBy", "firstName lastName")
//         .populate("completedBy", "firstName lastName")

//       if (!sale) {
//         throw new NotFoundException("Sale not found")
//       }

//       return {
//         success: true,
//         data: sale,
//       }
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error
//       }
//       throw new Error(`Failed to fetch sale: ${error.message}`)
//     }
//   }

//   async completeSale(id: string, completedBy: string): Promise<ApiResponse<Sale>> {
//     try {
//       const sale = await this.saleModel.findByIdAndUpdate(
//         id,
//         {
//           status: "completed",
//           completedBy,
//           completedAt: new Date(),
//           updatedAt: new Date(),
//         },
//         { new: true, runValidators: true },
//       )

//       if (!sale) {
//         throw new NotFoundException("Sale not found")
//       }

//       return {
//         success: true,
//         data: sale,
//         message: "Sale completed successfully",
//       }
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error
//       }
//       throw new Error(`Failed to complete sale: ${error.message}`)
//     }
//   }

//   async getSalesStats(): Promise<ApiResponse<any>> {
//     try {
//       const [totalSales, completedSales, totalRevenue, pendingSales] = await Promise.all([
//         this.saleModel.countDocuments(),
//         this.saleModel.countDocuments({ status: "completed" }),
//         this.saleModel.aggregate([
//           { $match: { status: "completed" } },
//           { $group: { _id: null, total: { $sum: "$totalAmount" } } },
//         ]),
//         this.saleModel.countDocuments({ status: { $in: ["draft", "confirmed"] } }),
//       ])

//       const topServices = await this.saleModel.aggregate([
//         { $match: { status: "completed" } },
//         { $unwind: "$items" },
//         {
//           $group: {
//             _id: "$items.itemName",
//             count: { $sum: "$items.quantity" },
//             revenue: { $sum: "$items.totalPrice" },
//           },
//         },
//         { $sort: { revenue: -1 } },
//         { $limit: 10 },
//       ])

//       return {
//         success: true,
//         data: {
//           totalSales,
//           completedSales,
//           totalRevenue: totalRevenue[0]?.total || 0,
//           pendingSales,
//           topServices,
//         },
//       }
//     } catch (error) {
//       throw new Error(`Failed to get sales stats: ${error.message}`)
//     }
//   }

//   async findAllWithQuery(query: SalesQueryDto) {
//     const {
//       page = 1,
//       limit = 10,
//       clientId,
//       appointmentId,
//       bookingId,
//       status,
//       paymentStatus,
//       staffId,
//       startDate,
//       endDate,
//       search,
//       sortBy = "createdAt",
//       sortOrder = "desc",
//     } = query

//     const filter: any = {}

//     if (clientId) filter.clientId = clientId
//     if (appointmentId) filter.appointmentId = appointmentId
//     if (bookingId) filter.bookingId = bookingId
//     if (status) filter.status = status
//     if (paymentStatus) filter.paymentStatus = paymentStatus

//     // Staff filtering
//     if (staffId) {
//       filter["items.staffId"] = staffId
//     }

//     // Date filtering
//     if (startDate || endDate) {
//       filter.createdAt = {}
//       if (startDate) filter.createdAt.$gte = new Date(startDate)
//       if (endDate) filter.createdAt.$lte = new Date(endDate)
//     }

//     // Search functionality
//     if (search) {
//       filter.$or = [
//         { saleNumber: { $regex: search, $options: "i" } },
//         { notes: { $regex: search, $options: "i" } },
//         { "items.itemName": { $regex: search, $options: "i" } },
//       ]
//     }

//     const skip = (page - 1) * limit
//     const sortOptions: any = {}
//     sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1

//     const [sales, total] = await Promise.all([
//       this.saleModel
//         .find(filter)
//         .populate("clientId", "firstName lastName email phone")
//         .populate("appointmentId", "selectedDate selectedTime")
//         .populate("bookingId", "bookingDate startTime")
//         .populate("createdBy", "firstName lastName email")
//         .populate("completedBy", "firstName lastName email")
//         .sort(sortOptions)
//         .skip(skip)
//         .limit(limit)
//         .exec(),
//       this.saleModel.countDocuments(filter),
//     ])

//     return {
//       success: true,
//       data: {
//         sales,
//         pagination: {
//           page,
//           limit,
//           total,
//           pages: Math.ceil(total / limit),
//         },
//       },
//     }
//   }

//   async update(id: string, updateSaleDto: UpdateSaleDto): Promise<ApiResponse<Sale>> {
//     try {
//       const sale = await this.saleModel
//         .findByIdAndUpdate(id, { ...updateSaleDto, updatedAt: new Date() }, { new: true })
//         .populate("clientId", "firstName lastName email phone")
//         .populate("createdBy", "firstName lastName email")
//         .populate("completedBy", "firstName lastName email")
//         .exec()

//       if (!sale) {
//         throw new NotFoundException("Sale not found")
//       }

//       return {
//         success: true,
//         data: sale,
//         message: "Sale updated successfully",
//       }
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error
//       }
//       throw new Error(`Failed to update sale: ${error.message}`)
//     }
//   }

//   async updateStatus(id: string, status: string): Promise<ApiResponse<Sale>> {
//     try {
//       const sale = await this.saleModel
//         .findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true })
//         .populate("clientId", "firstName lastName email phone")
//         .populate("createdBy", "firstName lastName email")
//         .exec()

//       if (!sale) {
//         throw new NotFoundException("Sale not found")
//       }

//       return {
//         success: true,
//         data: sale,
//         message: "Sale status updated successfully",
//       }
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error
//       }
//       throw new Error(`Failed to update sale status: ${error.message}`)
//     }
//   }

//   async updatePaymentStatus(id: string, paymentStatus: string, amountPaid?: number): Promise<ApiResponse<Sale>> {
//     try {
//       const updateData: any = { paymentStatus, updatedAt: new Date() }

//       if (amountPaid !== undefined) {
//         updateData.amountPaid = amountPaid
//         // Calculate amount due
//         const sale = await this.saleModel.findById(id)
//         if (sale) {
//           updateData.amountDue = Math.max(0, sale.totalAmount - amountPaid)
//         }
//       }

//       const sale = await this.saleModel
//         .findByIdAndUpdate(id, updateData, { new: true })
//         .populate("clientId", "firstName lastName email phone")
//         .populate("createdBy", "firstName lastName email")
//         .exec()

//       if (!sale) {
//         throw new NotFoundException("Sale not found")
//       }

//       return {
//         success: true,
//         data: sale,
//         message: "Payment status updated successfully",
//       }
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error
//       }
//       throw new Error(`Failed to update payment status: ${error.message}`)
//     }
//   }

//   async getTopServices(): Promise<ApiResponse<any>> {
//     try {
//       const topServices = await this.saleModel.aggregate([
//         { $match: { status: "completed" } },
//         { $unwind: "$items" },
//         {
//           $group: {
//             _id: {
//               itemId: "$items.itemId",
//               itemName: "$items.itemName",
//               itemType: "$items.itemType",
//             },
//             totalQuantity: { $sum: "$items.quantity" },
//             totalRevenue: { $sum: "$items.totalPrice" },
//             averagePrice: { $avg: "$items.unitPrice" },
//             salesCount: { $sum: 1 },
//           },
//         },
//         { $sort: { totalRevenue: -1 } },
//         { $limit: 20 },
//       ])

//       return {
//         success: true,
//         data: topServices,
//       }
//     } catch (error) {
//       throw new Error(`Failed to get top services: ${error.message}`)
//     }
//   }

//   async getRevenueByPeriod(period: "daily" | "weekly" | "monthly"): Promise<ApiResponse<any>> {
//     try {
//       let groupBy: any
//       let dateFormat: string

//       switch (period) {
//         case "daily":
//           groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
//           dateFormat = "YYYY-MM-DD"
//           break
//         case "weekly":
//           groupBy = { $dateToString: { format: "%Y-W%U", date: "$createdAt" } }
//           dateFormat = "YYYY-[W]WW"
//           break
//         case "monthly":
//           groupBy = { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
//           dateFormat = "YYYY-MM"
//           break
//       }

//       const revenueData = await this.saleModel.aggregate([
//         { $match: { status: "completed" } },
//         {
//           $group: {
//             _id: groupBy,
//             totalRevenue: { $sum: "$totalAmount" },
//             totalSales: { $sum: 1 },
//             averageTicketSize: { $avg: "$totalAmount" },
//           },
//         },
//         { $sort: { _id: 1 } },
//         { $limit: 30 }, // Last 30 periods
//       ])

//       return {
//         success: true,
//         data: {
//           period,
//           dateFormat,
//           data: revenueData,
//         },
//       }
//     } catch (error) {
//       throw new Error(`Failed to get revenue by period: ${error.message}`)
//     }
//   }

//   async remove(id: string): Promise<ApiResponse<void>> {
//     try {
//       const result = await this.saleModel.findByIdAndDelete(id)
//       if (!result) {
//         throw new NotFoundException("Sale not found")
//       }

//       return {
//         success: true,
//         message: "Sale deleted successfully",
//       }
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error
//       }
//       throw new Error(`Failed to delete sale: ${error.message}`)
//     }
//   }
// }



import { Injectable, NotFoundException } from "@nestjs/common"
import { Model } from "mongoose"
import { Sale, SaleDocument } from "./schemas/sale.schema"
import { CreateSaleDto } from "./dto/create-sale.dto"
import { ApiResponse } from "../common/interfaces/common.interface"
import { SalesQueryDto } from "./dto/sales-query.dto"
import { UpdateSaleDto } from "./dto/update-sale.dto"
import { InjectModel } from "@nestjs/mongoose"

@Injectable()
export class SalesService {
  constructor(@InjectModel(Sale.name) private saleModel: Model<SaleDocument>) { }

  async create(businessId: string, createSaleDto: CreateSaleDto): Promise<ApiResponse<Sale>> {
    try {
      const sale = new this.saleModel({ ...createSaleDto, businessId })
      await sale.save()
      const savedSale = await this.saleModel
        .findOne({ _id: sale._id, businessId })
        .lean<SaleDocument>()
        .exec()
      if (!savedSale) {
        throw new Error("Failed to retrieve saved sale")
      }
      return {
        success: true,
        data: savedSale,
        message: "Sale created successfully",
      }
    } catch (error) {
      throw new Error(`Failed to create sale: ${error.message}`)
    }
  }

  /**
   * Create a sale record directly from a completed appointment.
   * Only called when a business marks an appointment as completed.
   * This is what feeds into daily reports and tax remittance.
   */
  async createFromAppointment(appointment: any, businessId: string): Promise<Sale> {
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

  async findAll(businessId: string): Promise<ApiResponse<Sale[]>> {
    try {
      const sales = await this.saleModel
        .find({ businessId })
        .populate("clientId", "profile.firstName profile.lastName profile.email")
        .populate("createdBy", "firstName lastName")
        .sort({ createdAt: -1 })
        .lean<SaleDocument[]>()
        .exec()
      return {
        success: true,
        data: sales,
      }
    } catch (error) {
      throw new Error(`Failed to fetch sales: ${error.message}`)
    }
  }

  async findOne(businessId: string, id: string): Promise<ApiResponse<Sale>> {
    try {
      const sale = await this.saleModel
        .findOne({ _id: id, businessId })
        .populate("clientId", "profile.firstName profile.lastName profile.email")
        .populate("createdBy", "firstName lastName")
        .populate("completedBy", "firstName lastName")
        .lean<SaleDocument>()
        .exec()
      if (!sale) {
        throw new NotFoundException("Sale not found")
      }
      return {
        success: true,
        data: sale,
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new Error(`Failed to fetch sale: ${error.message}`)
    }
  }

  async completeSale(businessId: string, id: string, completedBy: string): Promise<ApiResponse<Sale>> {
    try {
      const sale = await this.saleModel
        .findOneAndUpdate(
          { _id: id, businessId },
          {
            status: "completed",
            completedBy,
            completedAt: new Date(),
            updatedAt: new Date(),
          },
          { new: true, runValidators: true },
        )
        .lean<SaleDocument>()
        .exec()
      if (!sale) {
        throw new NotFoundException("Sale not found")
      }
      return {
        success: true,
        data: sale,
        message: "Sale completed successfully",
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new Error(`Failed to complete sale: ${error.message}`)
    }
  }

  async getSalesStats(businessId: string): Promise<ApiResponse<any>> {
    try {
      const [totalSales, completedSales, totalRevenue, pendingSales] = await Promise.all([
        this.saleModel.countDocuments({ businessId }),
        this.saleModel.countDocuments({ businessId, status: "completed" }),
        this.saleModel.aggregate([
          { $match: { businessId, status: "completed" } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]),
        this.saleModel.countDocuments({ businessId, status: { $in: ["draft", "confirmed"] } }),
      ])
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
      ])
      return {
        success: true,
        data: {
          totalSales,
          completedSales,
          totalRevenue: totalRevenue[0]?.total || 0,
          pendingSales,
          topServices,
        },
      }
    } catch (error) {
      throw new Error(`Failed to get sales stats: ${error.message}`)
    }
  }

  async findAllWithQuery(businessId: string, query: SalesQueryDto) {
    const {
      page = 1,
      limit = 10,
      clientId,
      appointmentId,
      bookingId,
      status,
      paymentStatus,
      staffId,
      startDate,
      endDate,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query

    const filter: any = { businessId }

    if (clientId) filter.clientId = clientId
    if (appointmentId) filter.appointmentId = appointmentId
    if (bookingId) filter.bookingId = bookingId
    if (status) filter.status = status
    if (paymentStatus) filter.paymentStatus = paymentStatus

    // Staff filtering
    if (staffId) {
      filter["items.staffId"] = staffId
    }

    // Date filtering
    if (startDate || endDate) {
      filter.createdAt = {}
      if (startDate) filter.createdAt.$gte = new Date(startDate)
      if (endDate) filter.createdAt.$lte = new Date(endDate)
    }

    // Search functionality
    if (search) {
      filter.$or = [
        { saleNumber: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } },
        { "items.itemName": { $regex: search, $options: "i" } },
      ]
    }

    const skip = (page - 1) * limit
    const sortOptions: any = {}
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1

    // Execute queries separately to avoid complex union type
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
      .lean<SaleDocument[]>()
      .exec()
    const total = await this.saleModel.countDocuments(filter).exec()

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
    }
  }

  async update(businessId: string, id: string, updateSaleDto: UpdateSaleDto): Promise<ApiResponse<Sale>> {
    try {
      const sale = await this.saleModel
        .findOneAndUpdate({ _id: id, businessId }, { ...updateSaleDto, updatedAt: new Date() }, { new: true })
        .populate("clientId", "firstName lastName email phone")
        .populate("createdBy", "firstName lastName email")
        .populate("completedBy", "firstName lastName email")
        .lean<SaleDocument>()
        .exec()
      if (!sale) {
        throw new NotFoundException("Sale not found")
      }
      return {
        success: true,
        data: sale,
        message: "Sale updated successfully",
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new Error(`Failed to update sale: ${error.message}`)
    }
  }

  async updateStatus(businessId: string, id: string, status: string): Promise<ApiResponse<Sale>> {
    try {
      const sale = await this.saleModel
        .findOneAndUpdate({ _id: id, businessId }, { status, updatedAt: new Date() }, { new: true })
        .populate("clientId", "firstName lastName email phone")
        .populate("createdBy", "firstName lastName email")
        .lean<SaleDocument>()
        .exec()
      if (!sale) {
        throw new NotFoundException("Sale not found")
      }
      return {
        success: true,
        data: sale,
        message: "Sale status updated successfully",
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new Error(`Failed to update sale status: ${error.message}`)
    }
  }

  async updatePaymentStatus(businessId: string, id: string, paymentStatus: string, amountPaid?: number): Promise<ApiResponse<Sale>> {
    try {
      const updateData: any = { paymentStatus, updatedAt: new Date() }
      if (amountPaid !== undefined) {
        updateData.amountPaid = amountPaid
        // Calculate amount due
        const sale = await this.saleModel
          .findOne({ _id: id, businessId })
          .lean<SaleDocument>()
          .exec()
        if (sale) {
          updateData.amountDue = Math.max(0, sale.totalAmount - amountPaid)
        }
      }
      const sale = await this.saleModel
        .findOneAndUpdate({ _id: id, businessId }, updateData, { new: true })
        .populate("clientId", "firstName lastName email phone")
        .populate("createdBy", "firstName lastName email")
        .lean<SaleDocument>()
        .exec()
      if (!sale) {
        throw new NotFoundException("Sale not found")
      }
      return {
        success: true,
        data: sale,
        message: "Payment status updated successfully",
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new Error(`Failed to update payment status: ${error.message}`)
    }
  }

  async getTopServices(businessId: string): Promise<ApiResponse<any>> {
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
      ])
      return {
        success: true,
        data: topServices,
      }
    } catch (error) {
      throw new Error(`Failed to get top services: ${error.message}`)
    }
  }

  async getRevenueByPeriod(businessId: string, period: "daily" | "weekly" | "monthly"): Promise<ApiResponse<any>> {
    try {
      let groupBy: any
      let dateFormat: string
      switch (period) {
        case "daily":
          groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
          dateFormat = "YYYY-MM-DD"
          break
        case "weekly":
          groupBy = { $dateToString: { format: "%Y-W%U", date: "$createdAt" } }
          dateFormat = "YYYY-[W]WW"
          break
        case "monthly":
          groupBy = { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
          dateFormat = "YYYY-MM"
          break
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
        { $limit: 30 }, // Last 30 periods
      ])
      return {
        success: true,
        data: {
          period,
          dateFormat,
          data: revenueData,
        },
      }
    } catch (error) {
      throw new Error(`Failed to get revenue by period: ${error.message}`)
    }
  }

  async remove(businessId: string, id: string): Promise<ApiResponse<void>> {
    try {
      const result = await this.saleModel.findOneAndDelete({ _id: id, businessId }).exec()
      if (!result) {
        throw new NotFoundException("Sale not found")
      }
      return {
        success: true,
        message: "Sale deleted successfully",
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new Error(`Failed to delete sale: ${error.message}`)
    }
  }
}