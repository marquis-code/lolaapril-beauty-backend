import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"
import { PublicationStatus } from "../../common/enums"
import { BaseSchema } from "../../common/schemas/base.schema"

export type PublicationDocument = Publication & Document

@Schema({ timestamps: true })
export class Publication extends BaseSchema {
  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  authors: string

  @Prop({ required: true })
  year: number

  @Prop({ required: true })
  journal: string

  @Prop({ required: true })
  category: string

  @Prop()
  link?: string

  @Prop()
  abstract?: string

  @Prop()
  doi?: string

  @Prop()
  pubLink?: string

  @Prop()
  doiLink?: string

  @Prop({ enum: PublicationStatus, default: PublicationStatus.DRAFT })
  status: PublicationStatus

  @Prop()
  reviewedBy?: string

  @Prop()
  reviewedAt?: Date

  @Prop()
  rejectionReason?: string

  @Prop()
  publishedAt?: Date
}

export const PublicationSchema = SchemaFactory.createForClass(Publication)
