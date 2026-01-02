import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"

export type TicketMessageDocument = TicketMessage & Document;

@Schema({ timestamps: true })
export class TicketMessage {
  @Prop({ type: Types.ObjectId, ref: 'Ticket', required: true })
  ticketId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  senderId: Types.ObjectId;

  @Prop({ required: true })
  senderType: string; // 'client', 'agent', 'system'

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String] })
  attachments: string[];

  @Prop({ default: false })
  isInternal: boolean; // Internal notes not visible to client

  @Prop({ default: false })
  isAutomated: boolean;

  @Prop()
  readAt: Date;
}

export const TicketMessageSchema = SchemaFactory.createForClass(TicketMessage);