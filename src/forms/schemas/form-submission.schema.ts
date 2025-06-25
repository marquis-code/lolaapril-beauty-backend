import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"
import { BaseSchema } from "../../common/schemas/base.schema"

export type FormSubmissionDocument = FormSubmission & Document

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
export class FormSubmission extends BaseSchema {
  @Prop({ type: Types.ObjectId, required: true, ref: "Form" })
  formId: Types.ObjectId

  @Prop({ required: true })
  formTitle: string

  @Prop()
  submitterEmail?: string

  @Prop([FormResponse])
  responses: FormResponse[]

  @Prop()
  submitterIp?: string

  @Prop()
  userAgent?: string
}

export const FormSubmissionSchema = SchemaFactory.createForClass(FormSubmission)
