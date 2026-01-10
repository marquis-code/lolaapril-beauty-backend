// support.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Ticket, TicketDocument } from './schemas/ticket.schema';
import { TicketMessage, TicketMessageDocument } from './schemas/ticket-message.schema';
import { SLAConfig, SLAConfigDocument } from './schemas/sla-config.schema';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupportService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
    @InjectModel(TicketMessage.name) private ticketMessageModel: Model<TicketMessageDocument>,
    @InjectModel(SLAConfig.name) private slaConfigModel: Model<SLAConfigDocument>,
    private configService: ConfigService,
  ) {}

  // ========== TICKET MANAGEMENT ==========
  async createTicket(createDto: CreateTicketDto) {
    const ticketNumber = await this.generateTicketNumber();
    
    // Get SLA config for priority
    const slaConfig = await this.getSLAConfig(createDto.businessId, createDto.priority);
    
    const now = new Date();
    const sla = slaConfig ? {
      responseDeadline: new Date(now.getTime() + slaConfig.firstResponseTime * 60000),
      resolutionDeadline: new Date(now.getTime() + slaConfig.resolutionTime * 60000),
      breached: false,
    } : null;

    const ticket = new this.ticketModel({
      ticketNumber,
      clientId: new Types.ObjectId(createDto.clientId),
      // businessId: createDto.businessId ? new Types.ObjectId(createDto.businessId) : null,
      businessId: createDto.businessId ? createDto.businessId : null,
      bookingId: createDto.bookingId ? new Types.ObjectId(createDto.bookingId) : null,
      subject: createDto.subject,
      description: createDto.description,
      priority: createDto.priority,
      status: 'open',
      channel: createDto.channel,
      category: createDto.category,
      tags: createDto.tags || [],
      sla,
      metadata: createDto.metadata,
    });

    const savedTicket = await ticket.save();

    // Create initial message
    await this.addMessage(savedTicket._id.toString(), {
      senderId: createDto.clientId,
      senderType: 'client',
      content: createDto.description,
      attachments: [],
    });

    return savedTicket;
  }

  async getTicket(ticketId: string) {
    const ticket = await this.ticketModel
      .findById(ticketId)
      .populate('clientId', 'firstName lastName email phone')
      .populate('assignedTo', 'firstName lastName email')
      .populate('businessId', 'businessName')
      .exec();

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }

  async getTickets(filter: {
    status?: string;
    priority?: string;
    assignedTo?: string;
    businessId?: string;
    page?: number;
    limit?: number;
  }) {
    const query: any = {};
    
    if (filter.status) query.status = filter.status;
    if (filter.priority) query.priority = filter.priority;
    if (filter.assignedTo) query.assignedTo = new Types.ObjectId(filter.assignedTo);
    if (filter.businessId) query.businessId = new Types.ObjectId(filter.businessId);

    const page = filter.page || 1;
    const limit = filter.limit || 20;
    const skip = (page - 1) * limit;

    const [tickets, total] = await Promise.all([
      this.ticketModel
        .find(query)
        .populate('clientId', 'firstName lastName email')
        .populate('assignedTo', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.ticketModel.countDocuments(query),
    ]);

    return {
      tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async updateTicketStatus(ticketId: string, status: string, userId: string) {
    const ticket = await this.ticketModel.findById(ticketId);
    
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    ticket.status = status;

    if (status === 'resolved' && !ticket.resolvedAt) {
      ticket.resolvedAt = new Date();
    }

    if (status === 'closed' && !ticket.closedAt) {
      ticket.closedAt = new Date();
    }

    await ticket.save();

    // Add system message
    await this.addMessage(ticketId, {
      senderId: userId,
      senderType: 'system',
      content: `Ticket status changed to ${status}`,
      isAutomated: true,
    });

    return ticket;
  }

  async assignTicket(ticketId: string, agentId: string) {
    const ticket = await this.ticketModel.findById(ticketId);
    
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    ticket.assignedTo = new Types.ObjectId(agentId);
    ticket.status = 'in_progress';

    await ticket.save();

    // Add system message
    await this.addMessage(ticketId, {
      senderId: agentId,
      senderType: 'system',
      content: `Ticket assigned to agent`,
      isAutomated: true,
    });

    return ticket;
  }

  // ========== MESSAGE MANAGEMENT ==========
  async addMessage(
    ticketId: string,
    messageData: {
      senderId: string;
      senderType: string;
      content: string;
      attachments?: string[];
      isInternal?: boolean;
      isAutomated?: boolean;
    },
  ) {
    const ticket = await this.ticketModel.findById(ticketId);
    
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const message = new this.ticketMessageModel({
      ticketId: new Types.ObjectId(ticketId),
      senderId: new Types.ObjectId(messageData.senderId),
      senderType: messageData.senderType,
      content: messageData.content,
      attachments: messageData.attachments || [],
      isInternal: messageData.isInternal || false,
      isAutomated: messageData.isAutomated || false,
    });

    await message.save();

    // Update first response time
    if (!ticket.firstResponseAt && messageData.senderType === 'agent') {
      ticket.firstResponseAt = new Date();
      await ticket.save();
    }

    return message;
  }

  async getMessages(ticketId: string, includeInternal = false) {
    const query: any = { ticketId: new Types.ObjectId(ticketId) };
    
    if (!includeInternal) {
      query.isInternal = false;
    }

    return this.ticketMessageModel
      .find(query)
      .populate('senderId', 'firstName lastName email')
      .sort({ createdAt: 1 })
      .exec();
  }

  // ========== SLA MANAGEMENT ==========
  async createSLAConfig(businessId: string, config: any) {
    const slaConfig = new this.slaConfigModel({
      businessId: new Types.ObjectId(businessId),
      ...config,
    });

    return slaConfig.save();
  }

  async getSLAConfig(businessId: string, priority: string) {
    return this.slaConfigModel.findOne({
      businessId: businessId ? new Types.ObjectId(businessId) : null,
      priority,
      isActive: true,
    });
  }

  async checkSLABreaches() {
    const now = new Date();
    
    const breachedTickets = await this.ticketModel.find({
      status: { $in: ['open', 'in_progress'] },
      $or: [
        { 'sla.responseDeadline': { $lt: now }, firstResponseAt: null },
        { 'sla.resolutionDeadline': { $lt: now }, resolvedAt: null },
      ],
      'sla.breached': false,
    });

    for (const ticket of breachedTickets) {
      ticket.sla.breached = true;
      await ticket.save();

      // Send escalation notification
      console.log(`SLA breached for ticket ${ticket.ticketNumber}`);
      // Implement notification logic here
    }

    return breachedTickets.length;
  }

  // ========== ANALYTICS ==========
  async getTicketStats(businessId?: string) {
    const match: any = {};
    if (businessId) match.businessId = new Types.ObjectId(businessId);

    const [statusStats, priorityStats, avgResolutionTime] = await Promise.all([
      this.ticketModel.aggregate([
        { $match: match },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      this.ticketModel.aggregate([
        { $match: match },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
      this.ticketModel.aggregate([
        { $match: { ...match, resolvedAt: { $exists: true } } },
        {
          $project: {
            resolutionTime: {
              $subtract: ['$resolvedAt', '$createdAt'],
            },
          },
        },
        {
          $group: {
            _id: null,
            avgTime: { $avg: '$resolutionTime' },
          },
        },
      ]),
    ]);

    return {
      statusStats,
      priorityStats,
      avgResolutionTimeMinutes: avgResolutionTime[0]?.avgTime
        ? Math.round(avgResolutionTime[0].avgTime / 60000)
        : 0,
    };
  }

  // ========== TELEPHONY INTEGRATION (Twilio) ==========
  async makeCall(ticketId: string, phoneNumber: string, agentId: string) {
    // Implement Twilio call logic
    console.log(`Initiating call for ticket ${ticketId} to ${phoneNumber}`);
    
    // Add call log message
    await this.addMessage(ticketId, {
      senderId: agentId,
      senderType: 'agent',
      content: `Phone call initiated to ${phoneNumber}`,
      isAutomated: true,
    });

    return { success: true, message: 'Call initiated' };
  }

  async sendSMS(ticketId: string, phoneNumber: string, message: string) {
    // Implement Twilio SMS logic
    console.log(`Sending SMS for ticket ${ticketId} to ${phoneNumber}`);
    
    return { success: true, message: 'SMS sent' };
  }

  // ========== HELPER METHODS ==========
  private async generateTicketNumber(): Promise<string> {
    const prefix = 'TKT';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  }
}
