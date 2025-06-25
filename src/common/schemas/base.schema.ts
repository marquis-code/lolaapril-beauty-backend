import { Prop, Schema } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema({ timestamps: true })
export class BaseSchema extends Document {
  @Prop({ default: false })
  isDeleted: boolean

  @Prop()
  deletedAt?: Date

  @Prop()
  deletedBy?: string

  createdAt: Date
  updatedAt: Date
}
