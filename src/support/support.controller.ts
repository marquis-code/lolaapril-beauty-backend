// support.controller.ts
import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('tickets')
  createTicket(@Body() createDto: CreateTicketDto) {
    return this.supportService.createTicket(createDto);
  }

  @Get('tickets/:id')
  getTicket(@Param('id') id: string) {
    return this.supportService.getTicket(id);
  }

  @Get('tickets')
  getTickets(@Query() filter: any) {
    return this.supportService.getTickets(filter);
  }

  @Put('tickets/:id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string; userId: string }) {
    return this.supportService.updateTicketStatus(id, body.status, body.userId);
  }

  @Put('tickets/:id/assign')
  assignTicket(@Param('id') id: string, @Body('agentId') agentId: string) {
    return this.supportService.assignTicket(id, agentId);
  }

  @Post('tickets/:id/messages')
  addMessage(@Param('id') id: string, @Body() messageData: any) {
    return this.supportService.addMessage(id, messageData);
  }

  @Get('tickets/:id/messages')
  getMessages(@Param('id') id: string, @Query('includeInternal') includeInternal: boolean) {
    return this.supportService.getMessages(id, includeInternal);
  }

  @Get('stats')
  getStats(@Query('tenantId') tenantId?: string) {
    return this.supportService.getTicketStats(tenantId);
  }

  @Post('tickets/:id/call')
  makeCall(@Param('id') id: string, @Body() body: { phoneNumber: string; agentId: string }) {
    return this.supportService.makeCall(id, body.phoneNumber, body.agentId);
  }

  @Post('tickets/:id/sms')
  sendSMS(@Param('id') id: string, @Body() body: { phoneNumber: string; message: string }) {
    return this.supportService.sendSMS(id, body.phoneNumber, body.message);
  }
}
