import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import{ Document } from "mongoose"
import { BaseSchema } from "../../common/schemas/base.schema"

export type EnquiryDocument = Enquiry & Document

@Schema({ timestamps: true })
export class Enquiry extends BaseSchema {
  @Prop({ required: true })
  firstName: string

  @Prop({ required: true })
  lastName: string

  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  phoneNumber: string

  @Prop({ required: true })
  message: string

  @Prop({ default: false })
  isRead: boolean

  @Prop({ default: false })
  isReplied: boolean
}

export const EnquirySchema = SchemaFactory.createForClass(Enquiry)
