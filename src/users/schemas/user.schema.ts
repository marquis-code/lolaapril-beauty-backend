import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"
import { UserRole } from "../../common/enums"
import { BaseSchema } from "../../common/schemas/base.schema"

export type UserDocument = User & Document

@Schema({ timestamps: true })
export class User extends BaseSchema {
  @Prop({ required: true })
  firstName: string

  @Prop({ required: true })
  lastName: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ enum: UserRole, default: UserRole.ADMIN })
  role: UserRole

  @Prop({ default: true })
  isActive: boolean
}

export const UserSchema = SchemaFactory.createForClass(User)
