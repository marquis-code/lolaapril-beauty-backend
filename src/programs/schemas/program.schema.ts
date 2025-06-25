import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"
import { ProgramStatus, FormFieldType } from "../../common/enums"
import { BaseSchema } from "../../common/schemas/base.schema"

export type ProgramDocument = Program & Document

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
}

@Schema({ timestamps: true })
export class Program extends BaseSchema {
  @Prop({ required: true })
  title: string

  @Prop({ required: true, unique: true })
  slug: string

  @Prop({ required: true })
  category: string

  @Prop({ required: true })
  description: string

  @Prop()
  duration?: string

  @Prop([String])
  focusAreas?: string[]

  @Prop([String])
  outcomes?: string[]

  @Prop([String])
  keyResponsibilities?: string[]

  @Prop()
  image?: string

  @Prop([
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
  ])
  highlights?: Array<{
    title: string
    description: string
  }>

  @Prop({ enum: ProgramStatus, default: ProgramStatus.DRAFT })
  status: ProgramStatus

  @Prop({ required: true, unique: true })
  registrationToken: string

  @Prop([FormField])
  formFields: FormField[]

  @Prop()
  formTitle?: string

  @Prop()
  formInstructions?: string

  @Prop({ default: 0 })
  applicationsCount: number
}

export const ProgramSchema = SchemaFactory.createForClass(Program)
