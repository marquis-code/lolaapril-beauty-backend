import { Injectable } from "@nestjs/common"
import { Model } from "mongoose"
import { DailySalesSummary, DailySalesSummaryDocument } from "./schemas/daily-sales-summary.schema"
import { SaleDocument, Sale } from "../sales/schemas/sale.schema"
import { AppointmentDocument, Appointment } from "../appointment/schemas/appointment.schema"
import { ClientDocument, Client } from "../client/schemas/client.schema"
import { ApiResponse } from "../common/interfaces/common.interface"
import * as moment from "moment"
import { InjectModel } from "@nestjs/mongoose"

@Injectable()
export class ReportsService {

  constructor(
    @InjectModel(DailySalesSummary.name) private dailySalesSummaryModel: Model<DailySalesSummaryDocument>,
    @InjectModel(Sale.name) private saleModel: Model<SaleDocument>,
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Client.name)  private clientModel: Model<ClientDocument>
  ) {

  }

  async generateDailySalesSummary(date: string): Promise<ApiResponse<DailySalesSummary>> {
    try {
      const startDate = moment(date).startOf("day").toDate()
      const endDate = moment(date).endOf("day").toDate()

      // Get sales data for the day
      const [sales, appointments, newClients] = await Promise.all([
        this.saleModel.find({
          createdAt: { $gte: startDate, $lte: endDate },
          status: "completed",
        }),
        this.appointmentModel.find({
          selectedDate: date,
        }),
        this.clientModel.find({
          createdAt: { $gte: startDate, $lte: endDate },
        }),
      ])

      // Calculate totals
      const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0)
      const totalAppointments = appointments.length
      const completedAppointments = appointments.filter((apt) => apt.status === "completed").length
      const cancelledAppointments = appointments.filter((apt) => apt.status === "cancelled").length
      const noShowAppointments = appointments.filter((apt) => apt.status === "no_show").length

      // Calculate client metrics
      const clientIds = new Set(sales.map((sale) => sale.clientId.toString()))
      const returningClients = clientIds.size - newClients.length

      // Services summary
      const servicesSummary = this.calculateServicesSummary(sales)

      // Staff summary
      const staffSummary = this.calculateStaffSummary(sales)

      // Payment methods summary
      const paymentMethodsSummary = this.calculatePaymentMethodsSummary(sales)

      // Calculate averages and totals
      const averageTicketSize = totalRevenue / (completedAppointments || 1)
      const totalTax = sales.reduce((sum, sale) => sum + sale.totalTax, 0)
      const totalDiscount = sales.reduce((sum, sale) => sum + sale.totalDiscount, 0)
      const totalServiceCharge = sales.reduce((sum, sale) => sum + sale.serviceCharge, 0)

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
      }

      // Save or update the summary
      const existingSummary = await this.dailySalesSummaryModel.findOne({ date })
      let summary

      if (existingSummary) {
        summary = await this.dailySalesSummaryModel.findOneAndUpdate(
          { date },
          { ...summaryData, updatedAt: new Date() },
          { new: true },
        )
      } else {
        summary = new this.dailySalesSummaryModel(summaryData)
        await summary.save()
      }

      return {
        success: true,
        data: summary,
        message: "Daily sales summary generated successfully",
      }
    } catch (error) {
      throw new Error(`Failed to generate daily sales summary: ${error.message}`)
    }
  }

  // async getDailySalesSummary(date: string): Promise<ApiResponse<DailySalesSummary>> {
  //   try {
  //     let summary = await this.dailySalesSummaryModel.findOne({ date })

  //     if (!summary) {
  //       // Generate summary if it doesn't exist
  //       const result = await this.generateDailySalesSummary(date)
  //       summary = result.data
  //     }

  //     return {
  //       success: true,
  //       data: summary,
  //     }
  //   } catch (error) {
  //     throw new Error(`Failed to get daily sales summary: ${error.message}`)
  //   }
  // }

    async getDailySalesSummary(date: string): Promise<ApiResponse<DailySalesSummary>> {
    try {
      let summary = await this.dailySalesSummaryModel.findOne({ date })

      if (!summary) {
        // Generate summary if it doesn't exist
        const result = await this.generateDailySalesSummary(date)
        return result
      }

      return {
        success: true,
        data: summary,
      }
    } catch (error) {
      throw new Error(`Failed to get daily sales summary: ${error.message}`)
    }
  }

  async getWeeklySalesReport(startDate: string, endDate: string): Promise<ApiResponse<any>> {
    try {
      const summaries = await this.dailySalesSummaryModel
        .find({
          date: { $gte: startDate, $lte: endDate },
        })
        .sort({ date: 1 })

      const weeklyTotals = {
        totalRevenue: summaries.reduce((sum, s) => sum + s.totalRevenue, 0),
        totalAppointments: summaries.reduce((sum, s) => sum + s.totalAppointments, 0),
        completedAppointments: summaries.reduce((sum, s) => sum + s.completedAppointments, 0),
        newClients: summaries.reduce((sum, s) => sum + s.newClients, 0),
        averageTicketSize: summaries.reduce((sum, s) => sum + s.averageTicketSize, 0) / summaries.length,
        dailyBreakdown: summaries,
      }

      return {
        success: true,
        data: weeklyTotals,
      }
    } catch (error) {
      throw new Error(`Failed to get weekly sales report: ${error.message}`)
    }
  }

  async getMonthlySalesReport(year: number, month: number): Promise<ApiResponse<any>> {
    try {
      const startDate = moment({ year, month: month - 1 })
        .startOf("month")
        .format("YYYY-MM-DD")
      const endDate = moment({ year, month: month - 1 })
        .endOf("month")
        .format("YYYY-MM-DD")

      const summaries = await this.dailySalesSummaryModel
        .find({
          date: { $gte: startDate, $lte: endDate },
        })
        .sort({ date: 1 })

      const monthlyTotals = {
        totalRevenue: summaries.reduce((sum, s) => sum + s.totalRevenue, 0),
        totalAppointments: summaries.reduce((sum, s) => sum + s.totalAppointments, 0),
        completedAppointments: summaries.reduce((sum, s) => sum + s.completedAppointments, 0),
        newClients: summaries.reduce((sum, s) => sum + s.newClients, 0),
        averageTicketSize: summaries.reduce((sum, s) => sum + s.averageTicketSize, 0) / summaries.length,
        dailyBreakdown: summaries,
        topServices: this.aggregateTopServices(summaries),
        topStaff: this.aggregateTopStaff(summaries),
      }

      return {
        success: true,
        data: monthlyTotals,
      }
    } catch (error) {
      throw new Error(`Failed to get monthly sales report: ${error.message}`)
    }
  }

  private calculateServicesSummary(sales: any[]): any[] {
    const servicesMap = new Map()

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        if (servicesMap.has(item.itemId)) {
          const existing = servicesMap.get(item.itemId)
          existing.quantity += item.quantity
          existing.revenue += item.totalPrice
        } else {
          servicesMap.set(item.itemId, {
            serviceId: item.itemId,
            serviceName: item.itemName,
            quantity: item.quantity,
            revenue: item.totalPrice,
          })
        }
      })
    })

    return Array.from(servicesMap.values()).sort((a, b) => b.revenue - a.revenue)
  }

  private calculateStaffSummary(sales: any[]): any[] {
    const staffMap = new Map()

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        if (item.staffId) {
          if (staffMap.has(item.staffId)) {
            const existing = staffMap.get(item.staffId)
            existing.appointmentsCompleted += 1
            existing.revenue += item.totalPrice
            existing.commission += item.commission || 0
          } else {
            staffMap.set(item.staffId, {
              staffId: item.staffId,
              staffName: item.staffName,
              appointmentsCompleted: 1,
              revenue: item.totalPrice,
              commission: item.commission || 0,
            })
          }
        }
      })
    })

    return Array.from(staffMap.values()).sort((a, b) => b.revenue - a.revenue)
  }

  private calculatePaymentMethodsSummary(sales: any[]): any[] {
    const paymentMap = new Map()

    // Note: This would need to be connected to actual payment data
    // For now, we'll create a placeholder
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
    ]
  }

  private aggregateTopServices(summaries: any[]): any[] {
    const servicesMap = new Map()

    summaries.forEach((summary) => {
      summary.servicesSummary.forEach((service) => {
        if (servicesMap.has(service.serviceId)) {
          const existing = servicesMap.get(service.serviceId)
          existing.quantity += service.quantity
          existing.revenue += service.revenue
        } else {
          servicesMap.set(service.serviceId, { ...service })
        }
      })
    })

    return Array.from(servicesMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
  }

  private aggregateTopStaff(summaries: any[]): any[] {
    const staffMap = new Map()

    summaries.forEach((summary) => {
      summary.staffSummary.forEach((staff) => {
        if (staffMap.has(staff.staffId)) {
          const existing = staffMap.get(staff.staffId)
          existing.appointmentsCompleted += staff.appointmentsCompleted
          existing.revenue += staff.revenue
          existing.commission += staff.commission
        } else {
          staffMap.set(staff.staffId, { ...staff })
        }
      })
    })

    return Array.from(staffMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
  }
}
