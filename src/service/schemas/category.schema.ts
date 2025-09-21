import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type CategoryDocument = Category & Document

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, unique: true })
  categoryName: string

  @Prop({ required: true })
  appointmentColor: string

  @Prop({ required: true })
  description: string

  @Prop({ default: true })
  isActive: boolean

  @Prop({ default: 0 })
  serviceCount: number
}

export const CategorySchema = SchemaFactory.createForClass(Category)

// Create indexes
CategorySchema.index({ categoryName: 1 })
CategorySchema.index({ isActive: 1 })
