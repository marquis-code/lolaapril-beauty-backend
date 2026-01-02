
// schemas/ticket.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TicketDocument = Ticket & Document;

@Schema({ timestamps: true })
export class Ticket {
  @Prop({ required: true, unique: true })
  ticketNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'Client', required: true })
  clientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Tenant' })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Booking' })
  bookingId: Types.ObjectId;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  priority: string; // 'low', 'medium', 'high', 'urgent'

  @Prop({ required: true })
  status: string; // 'open', 'in_progress', 'pending', 'resolved', 'closed'

  @Prop({ required: true })
  channel: string; // 'email', 'phone', 'chat', 'whatsapp'

  @Prop({ required: true })
  category: string; // 'booking_issue', 'payment', 'technical', 'complaint', 'inquiry'

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedTo: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  ccUsers: Types.ObjectId[];

  @Prop({ type: [String] })
  tags: string[];

  @Prop()
  firstResponseAt: Date;

  @Prop()
  resolvedAt: Date;

  @Prop()
  closedAt: Date;

  @Prop({ type: Object })
  sla: {
    responseDeadline: Date;
    resolutionDeadline: Date;
    breached: boolean;
  };

  @Prop({ type: Object })
  metadata: {
    clientEmail: string;
    clientPhone: string;
    source: string;
    ipAddress: string;
    userAgent: string;
  };
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);