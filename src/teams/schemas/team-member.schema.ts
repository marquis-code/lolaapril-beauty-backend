import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"
import { BaseSchema } from "../../common/schemas/base.schema"

export type TeamMemberDocument = TeamMember & Document

@Schema({ timestamps: true })
export class TeamMember extends BaseSchema {
  @Prop({ required: true, unique: true })
  id: string

  @Prop()
  image?: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  initials: string

  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  position: number

  @Prop([
    {
      type: { type: String, required: true },
      url: { type: String, required: true },
    },
  ])
  profiles: Array<{
    type: string
    url: string
  }>

  @Prop({ required: true })
  bio: string

  @Prop([String])
  methods: string[]

  @Prop([
    {
      title: { type: String, required: true },
      authors: { type: String, required: true },
      year: { type: Number, required: true },
      journal: { type: String, required: true },
      doi: String,
      pubLink: String,
      doiLink: String,
    },
  ])
  publications: Array<{
    title: string
    authors: string
    year: number
    journal: string
    doi?: string
    pubLink?: string
    doiLink?: string
  }>
}

export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember)
