import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"
import { FormFieldType } from "../../common/enums"
import { BaseSchema } from "../../common/schemas/base.schema"

export type FormDocument = Form & Document

@Schema()
class FormField {
  @Prop({ required: true })
  id: string

  @Prop({ required: true })
  label: string

  @Prop({ enum: FormFieldType, required: true })
  type: FormFieldType

  @Prop({ default: false })
  required: boolean

  @Prop([String])
  options?: string[]

  @Prop()
  placeholder?: string

  @Prop()
  description?: string

  @Prop()
  validation?: string
}

@Schema({ timestamps: true })
export class Form extends BaseSchema {
  @Prop({ required: true })
  title: string

  @Prop({ required: true, unique: true })
  slug: string

  @Prop()
  description?: string

  @Prop()
  instructions?: string

  @Prop([FormField])
  fields: FormField[]

  @Prop({ default: true })
  isActive: boolean

  @Prop({ default: 0 })
  submissionsCount: number

  @Prop()
  successMessage?: string

  @Prop()
  redirectUrl?: string
}

export const FormSchema = SchemaFactory.createForClass(Form)
