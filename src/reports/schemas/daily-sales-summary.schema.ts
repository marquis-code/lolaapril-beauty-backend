import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type DailySalesSummaryDocument = DailySalesSummary & Document

@Schema()
export class ServiceSummary {
  @Prop({ required: true })
  serviceId: string

  @Prop({ required: true })
  serviceName: string

  @Prop({ required: true })
  quantity: number

  @Prop({ required: true })
  revenue: number
}

@Schema()
export class StaffSummary {
  @Prop({ required: true })
  staffId: string

  @Prop({ required: true })
  staffName: string

  @Prop({ required: true })
  appointmentsCompleted: number

  @Prop({ required: true })
  revenue: number

  @Prop({ required: true })
  commission: number
}

@Schema()
export class PaymentMethodSummary {
  @Prop({ required: true })
  method: string

  @Prop({ required: true })
  count: number

  @Prop({ required: true })
  amount: number
}

@Schema({ timestamps: true })
export class DailySalesSummary {
  @Prop({ type: 'ObjectId', ref: 'Business', required: true, index: true })
  businessId: string
  @Prop({ required: true, unique: true })
  date: string // YYYY-MM-DD format

  @Prop({ required: true })
  totalRevenue: number

  @Prop({ required: true })
  totalAppointments: number

  @Prop({ required: true })
  completedAppointments: number

  @Prop({ required: true })
  cancelledAppointments: number

  @Prop({ required: true })
  noShowAppointments: number

  @Prop({ required: true })
  newClients: number

  @Prop({ required: true })
  returningClients: number

  @Prop({ type: [ServiceSummary], default: [] })
  servicesSummary: ServiceSummary[]

  @Prop({ type: [StaffSummary], default: [] })
  staffSummary: StaffSummary[]

  @Prop({ type: [PaymentMethodSummary], default: [] })
  paymentMethodsSummary: PaymentMethodSummary[]

  @Prop({ required: true })
  averageTicketSize: number

  @Prop({ required: true })
  totalTax: number

  @Prop({ required: true })
  totalDiscount: number

  @Prop({ required: true })
  totalServiceCharge: number

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const DailySalesSummarySchema = SchemaFactory.createForClass(DailySalesSummary)

// Add indexes
DailySalesSummarySchema.index({ businessId: 1, date: 1 })
DailySalesSummarySchema.index({ createdAt: -1 })
