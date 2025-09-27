// import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
// import { type Document, Types } from "mongoose"

// export type VoucherDocument = Voucher & Document

// @Schema()
// export class VoucherRestrictions {
//   @Prop({ type: [String], default: [] })
//   applicableServices: string[]

//   @Prop({ type: [String], default: [] })
//   applicableCategories: string[]

//   @Prop()
//   minimumSpend: number

//   @Prop()
//   maximumDiscount: number

//   @Prop({ type: [String], default: [] })
//   excludedServices: string[]

//   @Prop({ default: false })
//   firstTimeClientsOnly: boolean

//   @Prop({ type: [String], default: [] })
//   applicableDays: string[]
// }

// @Schema({ timestamps: true })
// export class Voucher {
//   @Prop({ required: true, unique: true })
//   voucherCode: string

//   @Prop({ required: true })
//   voucherName: string

//   @Prop({ required: true })
//   description: string

//   @Prop({
//     required: true,
//     enum: ["percentage", "fixed_amount", "service_discount", "buy_one_get_one"],
//   })
//   discountType: string

//   @Prop({ required: true })
//   discountValue: number

//   @Prop({ required: true })
//   validFrom: Date

//   @Prop({ required: true })
//   validUntil: Date

//   @Prop()
//   usageLimit: number

//   @Prop({ default: 0 })
//   usedCount: number

//   @Prop({ default: 1 })
//   usagePerClient: number

//   @Prop({ type: VoucherRestrictions, default: {} })
//   restrictions: VoucherRestrictions

//   @Prop({
//     required: true,
//     enum: ["active", "inactive", "expired", "used_up"],
//     default: "active",
//   })
//   status: string

//   @Prop({ type: Types.ObjectId, ref: "User", required: true })
//   createdBy: Types.ObjectId

//   @Prop({ default: Date.now })
//   createdAt: Date

//   @Prop({ default: Date.now })
//   updatedAt: Date
// }

// export const VoucherSchema = SchemaFactory.createForClass(Voucher)

// // Add indexes
// VoucherSchema.index({ voucherCode: 1 })
// VoucherSchema.index({ status: 1 })
// VoucherSchema.index({ validFrom: 1, validUntil: 1 })
// VoucherSchema.index({ createdAt: -1 })


import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"

export type VoucherDocument = Voucher & Document

@Schema()
export class VoucherRestrictions {
  @Prop({ type: [{ type: Types.ObjectId, ref: "Service" }], default: [] })
  applicableServices: Types.ObjectId[]

  @Prop({ type: [{ type: Types.ObjectId, ref: "Category" }], default: [] })
  applicableCategories: Types.ObjectId[]

  @Prop()
  minimumSpend: number

  @Prop()
  maximumDiscount: number

  @Prop({ type: [{ type: Types.ObjectId, ref: "Service" }], default: [] })
  excludedServices: Types.ObjectId[]

  @Prop({ default: false })
  firstTimeClientsOnly: boolean

  @Prop({ type: [String], default: [] })
  applicableDays: string[]
}

@Schema({ timestamps: true })
export class Voucher {
  @Prop({ required: true, unique: true })
  voucherCode: string

  @Prop({ required: true })
  voucherName: string

  @Prop({ required: true })
  description: string

  @Prop({
    required: true,
    enum: ["percentage", "fixed_amount", "service_discount", "buy_one_get_one"],
  })
  discountType: string

  @Prop({ required: true })
  discountValue: number

  @Prop({ required: true })
  validFrom: Date

  @Prop({ required: true })
  validUntil: Date

  @Prop()
  usageLimit: number

  @Prop({ default: 0 })
  usedCount: number

  @Prop({ default: 1 })
  usagePerClient: number

  @Prop({ type: VoucherRestrictions, default: {} })
  restrictions: VoucherRestrictions

  @Prop({
    required: true,
    enum: ["active", "inactive", "expired", "used_up"],
    default: "active",
  })
  status: string

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  createdBy: Types.ObjectId
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher)

// indexes remain unchanged
VoucherSchema.index({ voucherCode: 1 })
VoucherSchema.index({ status: 1 })
VoucherSchema.index({ validFrom: 1, validUntil: 1 })
VoucherSchema.index({ createdAt: -1 })
