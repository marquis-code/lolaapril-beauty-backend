import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type ServiceDocument = Service & Document

export enum ServiceCategory {
  HAIRCUT = "haircut",
  COLORING = "coloring",
  STYLING = "styling",
  TREATMENT = "treatment",
  NAILS = "nails",
  FACIAL = "facial",
  MASSAGE = "massage",
  WAXING = "waxing",
}

@Schema({ timestamps: true })
export class Service {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true })
  price: number

  @Prop({ required: true })
  duration: number // in minutes

  @Prop({ type: String, enum: ServiceCategory, required: true })
  category: ServiceCategory

  @Prop()
  image?: string

  @Prop({ default: true })
  isActive: boolean

  @Prop({ type: [String] })
  tags: string[]

  @Prop()
  preparationTime?: number // in minutes

  @Prop()
  cleanupTime?: number // in minutes

  @Prop({ default: 0 })
  popularity: number

  @Prop()
  requirements?: string

  @Prop()
  aftercareInstructions?: string
}

export const ServiceSchema = SchemaFactory.createForClass(Service)
