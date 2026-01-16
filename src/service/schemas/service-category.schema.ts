// import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
// import type { Document } from "mongoose"

// export type ServiceCategoryDocument = ServiceCategory & Document

// @Schema({ timestamps: true })
// export class ServiceCategory {
//   @Prop({ required: true, unique: true })
//   categoryName: string

//   @Prop({ required: true })
//   appointmentColor: string

//   @Prop({ required: true })
//   description: string

//   @Prop({ default: true })
//   isActive: boolean

//   @Prop({ default: Date.now })
//   createdAt: Date

//   @Prop({ default: Date.now })
//   updatedAt: Date
// }

// export const ServiceCategorySchema = SchemaFactory.createForClass(ServiceCategory)

// // Add indexes
// ServiceCategorySchema.index({ categoryName: 1 })
// ServiceCategorySchema.index({ isActive: 1 })


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'

export type ServiceCategoryDocument = ServiceCategory & Document

@Schema({ timestamps: true })
export class ServiceCategory {
  @ApiProperty({ example: 'Hair Services' })
  @Prop({ required: true, trim: true })
  categoryName: string

  @ApiProperty({ example: '#3B82F6' })
  @Prop({ required: true })
  appointmentColor: string

  @ApiProperty({ 
    example: 'Professional hair styling, cutting, and treatment services for all hair types.' 
  })
  @Prop({ required: true })
  description: string

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @Prop({ type: Types.ObjectId, ref: 'Business', required: true, index: true })
  businessId: Types.ObjectId

  @ApiProperty({ example: true })
  @Prop({ default: true })
  isActive: boolean

  @ApiProperty()
  @Prop()
  createdAt?: Date

  @ApiProperty()
  @Prop()
  updatedAt?: Date
}

export const ServiceCategorySchema = SchemaFactory.createForClass(ServiceCategory)

// Add compound index for better query performance
ServiceCategorySchema.index({ businessId: 1, categoryName: 1 }, { unique: true })
ServiceCategorySchema.index({ businessId: 1, isActive: 1 })