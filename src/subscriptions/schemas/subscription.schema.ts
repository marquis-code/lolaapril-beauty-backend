import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"
import { BaseSchema } from "../../common/schemas/base.schema"

export type SubscriptionDocument = Subscription & Document

@Schema({ timestamps: true })
export class Subscription extends BaseSchema {
  @Prop({ required: true, unique: true })
  email: string

  @Prop({ default: true })
  isActive: boolean

  @Prop()
  unsubscribedAt?: Date
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription)
