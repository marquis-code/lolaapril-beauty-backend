
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { Ticket, TicketSchema } from './schemas/ticket.schema';
import { TicketMessage, TicketMessageSchema } from './schemas/ticket-message.schema';
import { SLAConfig, SLAConfigSchema } from './schemas/sla-config.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ticket.name, schema: TicketSchema },
      { name: TicketMessage.name, schema: TicketMessageSchema },
      { name: SLAConfig.name, schema: SLAConfigSchema },
    ]),
    ConfigModule,
  ],
  controllers: [SupportController],
  providers: [SupportService],
  exports: [SupportService],
})
export class SupportModule {}