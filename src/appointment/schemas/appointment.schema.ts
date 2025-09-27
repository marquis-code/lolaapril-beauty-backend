import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type AppointmentDocument = Appointment & Document

@Schema()
export class BusinessInfo {
  @Prop({ required: true })
  businessId: string

  @Prop({ required: true })
  businessName: string

  @Prop()
  rating: number

  @Prop()
  reviewCount: number

  @Prop({ required: true })
  address: string
}

@Schema()
export class SelectedOption {
  @Prop({ required: true })
  optionId: string

  @Prop({ required: true })
  optionName: string

  @Prop({
    type: {
      hours: { type: Number, required: true },
      minutes: { type: Number, required: true },
    },
    required: true,
  })
  duration: {
    hours: number
    minutes: number
  }

  @Prop({ required: true })
  description: string

  @Prop({
    type: {
      currency: { type: String, required: true },
      amount: { type: Number, required: true },
    },
    required: true,
  })
  price: {
    currency: string
    amount: number
  }
}

@Schema()
export class AdditionalService {
  @Prop({ required: true })
  serviceId: string

  @Prop({ required: true })
  serviceName: string

  @Prop({
    type: {
      hours: { type: Number, required: true },
      minutes: { type: Number, required: true },
    },
    required: true,
  })
  duration: {
    hours: number
    minutes: number
  }

  @Prop({ required: true })
  description: string

  @Prop({
    type: {
      currency: { type: String, required: true },
      amount: { type: Number, required: true },
    },
    required: true,
  })
  price: {
    currency: string
    amount: number
  }
}

@Schema()
export class SelectedService {
  @Prop({ required: true })
  serviceId: string

  @Prop({ required: true })
  serviceName: string

  @Prop({ required: true })
  serviceType: string

  @Prop({ type: SelectedOption, required: true })
  selectedOption: SelectedOption

  @Prop({ type: [AdditionalService], default: [] })
  additionalServices: AdditionalService[]
}

@Schema()
export class AppointmentDetails {
  @Prop({ required: true })
  date: string

  @Prop({ required: true })
  dayOfWeek: string

  @Prop({ required: true })
  startTime: string

  @Prop({ required: true })
  endTime: string

  @Prop({ required: true })
  duration: string
}

@Schema()
export class ServiceDetails {
  @Prop({ required: true })
  serviceName: string

  @Prop({ required: true })
  serviceDescription: string

  @Prop({
    type: {
      currency: { type: String, required: true },
      amount: { type: Number, required: true },
    },
    required: true,
  })
  price: {
    currency: string
    amount: number
  }
}

@Schema()
export class PaymentDetails {
  @Prop({ required: true })
  paymentMethod: string

  @Prop({
    type: {
      currency: { type: String, required: true },
      amount: { type: Number, required: true },
    },
    required: true,
  })
  subtotal: {
    currency: string
    amount: number
  }

  @Prop({
    type: {
      currency: { type: String, required: true },
      amount: { type: Number, required: true },
      rate: { type: Number, required: true },
    },
    required: true,
  })
  tax: {
    currency: string
    amount: number
    rate: number
  }

  @Prop({
    type: {
      currency: { type: String, required: true },
      amount: { type: Number, required: true },
    },
    required: true,
  })
  total: {
    currency: string
    amount: number
  }

  @Prop({
    type: {
      payNow: {
        type: {
          currency: { type: String, required: true },
          amount: { type: Number, required: true },
        },
        required: true,
      },
      payAtVenue: {
        type: {
          currency: { type: String, required: true },
          amount: { type: Number, required: true },
        },
        required: true,
      },
    },
    required: true,
  })
  paymentStatus: {
    payNow: {
      currency: string
      amount: number
    }
    payAtVenue: {
      currency: string
      amount: number
    }
  }
}

@Schema()
export class PaymentInstructions {
  @Prop()
  paymentUrl: string

  @Prop({ required: true })
  confirmationPolicy: string
}

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: Types.ObjectId, ref: "Client", required: true })
  clientId: Types.ObjectId

  @Prop({ type: BusinessInfo, required: true })
  businessInfo: BusinessInfo

  @Prop({ type: [SelectedService], required: true })
  selectedServices: SelectedService[]

  @Prop({
    type: {
      hours: { type: Number, required: true },
      minutes: { type: Number, required: true },
    },
    required: true,
  })
  totalDuration: {
    hours: number
    minutes: number
  }

  @Prop({ required: true })
  selectedDate: Date

  @Prop({ required: true })
  selectedTime: string

  @Prop({ type: AppointmentDetails, required: true })
  appointmentDetails: AppointmentDetails

  @Prop({ type: ServiceDetails, required: true })
  serviceDetails: ServiceDetails

  @Prop({ type: PaymentDetails, required: true })
  paymentDetails: PaymentDetails

  @Prop({ type: PaymentInstructions })
  paymentInstructions: PaymentInstructions

  @Prop({ maxlength: 500 })
  customerNotes: string

  @Prop({
    required: true,
    enum: ["pending_confirmation", "confirmed", "in_progress", "completed", "cancelled", "no_show"],
    default: "pending_confirmation",
  })
  status: string

  @Prop({ type: Types.ObjectId, ref: "User" })
  assignedStaff: Types.ObjectId

  @Prop()
  cancellationReason: string

  @Prop()
  cancellationDate: Date

   // Added missing fields for appointment tracking
  @Prop()
  checkInTime: Date

  @Prop()
  checkOutTime: Date

  @Prop()
  actualStartTime: Date

  @Prop()
  actualEndTime: Date

  @Prop()
  appointmentNumber: string

  @Prop()
  reminderSent: boolean

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment)

// Add indexes for better performance
AppointmentSchema.index({ clientId: 1 })
AppointmentSchema.index({ selectedDate: 1, selectedTime: 1 })
AppointmentSchema.index({ status: 1 })
AppointmentSchema.index({ assignedStaff: 1 })
AppointmentSchema.index({ createdAt: -1 })
AppointmentSchema.index({ "businessInfo.businessId": 1 })
