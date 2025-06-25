import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"
import { BaseSchema } from "../../common/schemas/base.schema"

export type ProgramApplicationDocument = ProgramApplication & Document

@Schema()
class FormResponse {
  @Prop({ required: true })
  fieldId: string

  @Prop({ required: true })
  fieldLabel: string

  @Prop({ required: true })
  value: string
}

@Schema({ timestamps: true })
export class ProgramApplication extends BaseSchema {
  @Prop({ type: Types.ObjectId, required: true, ref: "Program" })
  programId: Types.ObjectId

  @Prop({ required: true })
  programTitle: string

  @Prop({ required: true })
  applicantEmail: string

  @Prop([FormResponse])
  responses: FormResponse[]

  @Prop({ default: "pending" })
  status: string

  @Prop()
  reviewedBy?: string

  @Prop()
  reviewedAt?: Date

  @Prop()
  notes?: string
}

export const ProgramApplicationSchema = SchemaFactory.createForClass(ProgramApplication)
