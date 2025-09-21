import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type ServiceCategoryDocument = ServiceCategory & Document

@Schema({ timestamps: true })
export class ServiceCategory {
  @Prop({ required: true, unique: true })
  categoryName: string

  @Prop({ required: true })
  appointmentColor: string

  @Prop({ required: true })
  description: string

  @Prop({ default: true })
  isActive: boolean

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const ServiceCategorySchema = SchemaFactory.createForClass(ServiceCategory)

// Add indexes
ServiceCategorySchema.index({ categoryName: 1 })
ServiceCategorySchema.index({ isActive: 1 })
