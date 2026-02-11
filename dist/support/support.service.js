"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const ticket_schema_1 = require("./schemas/ticket.schema");
const ticket_message_schema_1 = require("./schemas/ticket-message.schema");
const sla_config_schema_1 = require("./schemas/sla-config.schema");
const config_1 = require("@nestjs/config");
let SupportService = class SupportService {
    constructor(ticketModel, ticketMessageModel, slaConfigModel, configService) {
        this.ticketModel = ticketModel;
        this.ticketMessageModel = ticketMessageModel;
        this.slaConfigModel = slaConfigModel;
        this.configService = configService;
    }
    async createTicket(createDto) {
        const ticketNumber = await this.generateTicketNumber();
        const slaConfig = await this.getSLAConfig(createDto.businessId, createDto.priority);
        const now = new Date();
        const sla = slaConfig ? {
            responseDeadline: new Date(now.getTime() + slaConfig.firstResponseTime * 60000),
            resolutionDeadline: new Date(now.getTime() + slaConfig.resolutionTime * 60000),
            breached: false,
        } : null;
        const ticket = new this.ticketModel({
            ticketNumber,
            clientId: new mongoose_2.Types.ObjectId(createDto.clientId),
            businessId: createDto.businessId ? createDto.businessId : null,
            bookingId: createDto.bookingId ? new mongoose_2.Types.ObjectId(createDto.bookingId) : null,
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
        await this.addMessage(savedTicket._id.toString(), {
            senderId: createDto.clientId,
            senderType: 'client',
            content: createDto.description,
            attachments: [],
        });
        return savedTicket;
    }
    async getTicket(ticketId) {
        const ticket = await this.ticketModel
            .findById(ticketId)
            .populate('clientId', 'firstName lastName email phone')
            .populate('assignedTo', 'firstName lastName email')
            .populate('businessId', 'businessName')
            .exec();
        if (!ticket) {
            throw new common_1.NotFoundException('Ticket not found');
        }
        return ticket;
    }
    async getTickets(filter) {
        const query = {};
        if (filter.status)
            query.status = filter.status;
        if (filter.priority)
            query.priority = filter.priority;
        if (filter.assignedTo)
            query.assignedTo = new mongoose_2.Types.ObjectId(filter.assignedTo);
        if (filter.businessId)
            query.businessId = new mongoose_2.Types.ObjectId(filter.businessId);
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
    async updateTicketStatus(ticketId, status, userId) {
        const ticket = await this.ticketModel.findById(ticketId);
        if (!ticket) {
            throw new common_1.NotFoundException('Ticket not found');
        }
        ticket.status = status;
        if (status === 'resolved' && !ticket.resolvedAt) {
            ticket.resolvedAt = new Date();
        }
        if (status === 'closed' && !ticket.closedAt) {
            ticket.closedAt = new Date();
        }
        await ticket.save();
        await this.addMessage(ticketId, {
            senderId: userId,
            senderType: 'system',
            content: `Ticket status changed to ${status}`,
            isAutomated: true,
        });
        return ticket;
    }
    async assignTicket(ticketId, agentId) {
        const ticket = await this.ticketModel.findById(ticketId);
        if (!ticket) {
            throw new common_1.NotFoundException('Ticket not found');
        }
        ticket.assignedTo = new mongoose_2.Types.ObjectId(agentId);
        ticket.status = 'in_progress';
        await ticket.save();
        await this.addMessage(ticketId, {
            senderId: agentId,
            senderType: 'system',
            content: `Ticket assigned to agent`,
            isAutomated: true,
        });
        return ticket;
    }
    async addMessage(ticketId, messageData) {
        const ticket = await this.ticketModel.findById(ticketId);
        if (!ticket) {
            throw new common_1.NotFoundException('Ticket not found');
        }
        const message = new this.ticketMessageModel({
            ticketId: new mongoose_2.Types.ObjectId(ticketId),
            senderId: new mongoose_2.Types.ObjectId(messageData.senderId),
            senderType: messageData.senderType,
            content: messageData.content,
            attachments: messageData.attachments || [],
            isInternal: messageData.isInternal || false,
            isAutomated: messageData.isAutomated || false,
        });
        await message.save();
        if (!ticket.firstResponseAt && messageData.senderType === 'agent') {
            ticket.firstResponseAt = new Date();
            await ticket.save();
        }
        return message;
    }
    async getMessages(ticketId, includeInternal = false) {
        const query = { ticketId: new mongoose_2.Types.ObjectId(ticketId) };
        if (!includeInternal) {
            query.isInternal = false;
        }
        return this.ticketMessageModel
            .find(query)
            .populate('senderId', 'firstName lastName email')
            .sort({ createdAt: 1 })
            .exec();
    }
    async createSLAConfig(businessId, config) {
        const slaConfig = new this.slaConfigModel({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            ...config,
        });
        return slaConfig.save();
    }
    async getSLAConfig(businessId, priority) {
        return this.slaConfigModel.findOne({
            businessId: businessId ? new mongoose_2.Types.ObjectId(businessId) : null,
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
        }
        return breachedTickets.length;
    }
    async getTicketStats(businessId) {
        const match = {};
        if (businessId)
            match.businessId = new mongoose_2.Types.ObjectId(businessId);
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
    async makeCall(ticketId, phoneNumber, agentId) {
        console.log(`Initiating call for ticket ${ticketId} to ${phoneNumber}`);
        await this.addMessage(ticketId, {
            senderId: agentId,
            senderType: 'agent',
            content: `Phone call initiated to ${phoneNumber}`,
            isAutomated: true,
        });
        return { success: true, message: 'Call initiated' };
    }
    async sendSMS(ticketId, phoneNumber, message) {
        console.log(`Sending SMS for ticket ${ticketId} to ${phoneNumber}`);
        return { success: true, message: 'SMS sent' };
    }
    async generateTicketNumber() {
        const prefix = 'TKT';
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}-${timestamp}-${random}`;
    }
};
SupportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(ticket_schema_1.Ticket.name)),
    __param(1, (0, mongoose_1.InjectModel)(ticket_message_schema_1.TicketMessage.name)),
    __param(2, (0, mongoose_1.InjectModel)(sla_config_schema_1.SLAConfig.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        config_1.ConfigService])
], SupportService);
exports.SupportService = SupportService;
//# sourceMappingURL=support.service.js.map