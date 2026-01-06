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
var RealtimeGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const core_1 = require("@nestjs/core");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redis_1 = require("redis");
let RealtimeGateway = RealtimeGateway_1 = class RealtimeGateway {
    constructor(jwtService, configService, moduleRef) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.moduleRef = moduleRef;
        this.logger = new common_1.Logger(RealtimeGateway_1.name);
        this.connectedClients = new Map();
    }
    async afterInit(server) {
        this.logger.log('🚀 WebSocket Gateway Initialized');
        try {
            const redisHost = this.configService.get('REDIS_HOST');
            const redisPort = this.configService.get('REDIS_PORT');
            const redisPassword = this.configService.get('REDIS_PASSWORD');
            if (redisHost && redisPort) {
                const pubClient = (0, redis_1.createClient)({
                    url: `redis://${redisHost}:${redisPort}`,
                    password: redisPassword,
                });
                const subClient = pubClient.duplicate();
                await Promise.all([pubClient.connect(), subClient.connect()]);
                server.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
                this.logger.log('✅ Redis adapter configured for WebSocket scaling');
            }
        }
        catch (error) {
            this.logger.warn('⚠️ Redis adapter not configured, running in single-instance mode:', error.message);
        }
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
            if (!token) {
                this.logger.log(`🔓 Anonymous user connecting: ${client.id}`);
                this.setupAnonymousUser(client);
                return;
            }
            try {
                const decoded = this.jwtService.verify(token, {
                    secret: this.configService.get('JWT_SECRET'),
                });
                const businessId = decoded.businessId || decoded.sub;
                const userId = decoded.userId || decoded.id;
                this.connectedClients.set(client.id, {
                    socket: client,
                    businessId,
                    userId,
                    isGuest: false,
                });
                client.join(`business:${businessId}`);
                client.join(`user:${userId}`);
                this.logger.log(`✅ Authenticated client connected: ${client.id} | Business: ${businessId} | User: ${userId}`);
                this.logger.log(`📊 Total connected clients: ${this.connectedClients.size}`);
                client.emit('connected', {
                    message: 'Connected to real-time server',
                    clientId: client.id,
                    isAuthenticated: true,
                    timestamp: new Date(),
                });
            }
            catch (error) {
                this.logger.warn(`⚠️ Invalid token for client ${client.id}, treating as anonymous`);
                this.setupAnonymousUser(client);
            }
        }
        catch (error) {
            this.logger.error(`❌ Connection error for client ${client.id}:`, error.message);
            client.emit('error', { message: 'Connection failed' });
            client.disconnect();
        }
    }
    setupAnonymousUser(client) {
        const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const sessionId = client.handshake.auth?.sessionId || client.id;
        this.connectedClients.set(client.id, {
            socket: client,
            businessId: null,
            userId: guestId,
            isGuest: true,
            guestInfo: {
                guestId,
                sessionId,
                userAgent: client.handshake.headers['user-agent'],
                connectedAt: new Date(),
            },
        });
        client.join(`user:${guestId}`);
        this.logger.log(`✅ Anonymous guest connected: ${client.id} | Guest ID: ${guestId}`);
        this.logger.log(`📊 Total connected clients: ${this.connectedClients.size}`);
        client.emit('guest:registered', {
            guestId,
            sessionId,
            message: 'Connected as guest',
            timestamp: new Date(),
        });
        client.emit('connected', {
            message: 'Connected to real-time server',
            clientId: client.id,
            isAuthenticated: false,
            isGuest: true,
            guestId,
            timestamp: new Date(),
        });
    }
    handleDisconnect(client) {
        const clientInfo = this.connectedClients.get(client.id);
        this.connectedClients.delete(client.id);
        this.logger.log(`🔌 Client disconnected: ${client.id}`);
        this.logger.log(`📊 Total connected clients: ${this.connectedClients.size}`);
        if (clientInfo && clientInfo.businessId) {
            this.server.to(`business:${clientInfo.businessId}`).emit('user:offline', {
                userId: clientInfo.userId,
                timestamp: new Date(),
            });
        }
    }
    async handleJoinRoom(data, client) {
        const clientInfo = this.connectedClients.get(client.id);
        if (!clientInfo) {
            return { success: false, error: 'Not connected' };
        }
        try {
            this.logger.log(`💬 Join room request:`, { clientId: client.id, data });
            if (data.roomId) {
                client.join(`room:${data.roomId}`);
                this.logger.log(`💬 User ${clientInfo.userId} joined room ${data.roomId}`);
                client.to(`room:${data.roomId}`).emit('chat:user-joined', {
                    userId: clientInfo.userId,
                    isGuest: clientInfo.isGuest,
                    roomId: data.roomId,
                    timestamp: new Date(),
                });
                const { ChatService } = await Promise.resolve().then(() => require('../services/chat.service'));
                const chatService = this.moduleRef.get(ChatService, { strict: false });
                const { messages } = await chatService.getRoomMessages(data.roomId, { limit: 50 });
                const serializedMessages = messages.map(msg => this.serializeMessage(msg));
                return {
                    success: true,
                    message: 'Joined room successfully',
                    roomId: data.roomId,
                    messages: serializedMessages,
                };
            }
            if (data.businessId && data.userName) {
                if (clientInfo.isGuest && !data.email) {
                    return {
                        success: false,
                        error: 'Email is required for anonymous users',
                        requireEmail: true
                    };
                }
                if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                    return {
                        success: false,
                        error: 'Please provide a valid email address',
                        requireEmail: true
                    };
                }
                const { ChatService } = await Promise.resolve().then(() => require('../services/chat.service'));
                const chatService = this.moduleRef.get(ChatService, { strict: false });
                const userInfo = {
                    name: data.userName,
                    email: data.email,
                    isGuest: clientInfo.isGuest || false,
                };
                if (clientInfo.isGuest) {
                    userInfo.guestInfo = {
                        ...clientInfo.guestInfo,
                        userName: data.userName,
                        email: data.email,
                    };
                }
                const room = await chatService.createOrGetCustomerChatRoom(data.businessId, clientInfo.userId, userInfo);
                const roomId = room._id.toString();
                client.join(`room:${roomId}`);
                client.join(`business:${data.businessId}`);
                this.logger.log(`💬 ${clientInfo.isGuest ? 'Guest' : 'User'} ${clientInfo.userId} created/joined room ${roomId}`);
                const { messages } = await chatService.getRoomMessages(roomId, { limit: 50 });
                const serializedMessages = messages.map(msg => this.serializeMessage(msg));
                return {
                    success: true,
                    message: 'Room created/joined successfully',
                    roomId,
                    messages: serializedMessages,
                    isGuest: clientInfo.isGuest,
                    guestId: clientInfo.isGuest ? clientInfo.userId : undefined
                };
            }
            return { success: false, error: 'Either roomId or businessId+userName required' };
        }
        catch (error) {
            this.logger.error(`❌ Error joining room:`, error.message);
            return { success: false, error: error.message };
        }
    }
    async handleLeaveRoom(data, client) {
        const clientInfo = this.connectedClients.get(client.id);
        if (!clientInfo)
            return;
        client.leave(`room:${data.roomId}`);
        this.logger.log(`👋 User ${clientInfo.userId} left room ${data.roomId}`);
        client.to(`room:${data.roomId}`).emit('chat:user-left', {
            userId: clientInfo.userId,
            roomId: data.roomId,
            timestamp: new Date(),
        });
        return { success: true, message: 'Left room successfully' };
    }
    async handleSendMessage(data, client) {
        const clientInfo = this.connectedClients.get(client.id);
        if (!clientInfo) {
            return { success: false, error: 'Not connected' };
        }
        try {
            this.logger.log(`📤 Send message request:`, {
                clientId: client.id,
                roomId: data.roomId,
                content: data.content.substring(0, 50) + '...'
            });
            const { ChatService } = await Promise.resolve().then(() => require('../services/chat.service'));
            const chatService = this.moduleRef.get(ChatService, { strict: false });
            const senderType = clientInfo.isGuest ? 'customer' : 'staff';
            const senderName = clientInfo.isGuest
                ? (clientInfo.guestInfo?.userName || 'Guest')
                : 'Staff Member';
            const message = await chatService.sendMessage(data.roomId, clientInfo.userId, senderType, data.content, {
                senderName,
                attachments: data.attachments,
            });
            this.logger.log(`✅ Message sent successfully to room ${data.roomId}`);
            return {
                success: true,
                messageId: message._id.toString(),
                timestamp: new Date()
            };
        }
        catch (error) {
            this.logger.error(`❌ Error sending message:`, error.message);
            return { success: false, error: error.message };
        }
    }
    async handleTyping(data, client) {
        const clientInfo = this.connectedClients.get(client.id);
        if (!clientInfo)
            return;
        client.to(`room:${data.roomId}`).emit('chat:user-typing', {
            userId: clientInfo.userId,
            userName: clientInfo.guestInfo?.userName || 'User',
            roomId: data.roomId,
            isTyping: data.isTyping,
            timestamp: new Date(),
        });
    }
    async handleReadMessages(data, client) {
        const clientInfo = this.connectedClients.get(client.id);
        if (!clientInfo)
            return;
        client.to(`room:${data.roomId}`).emit('chat:messages-read', {
            userId: clientInfo.userId,
            roomId: data.roomId,
            messageIds: data.messageIds,
            timestamp: new Date(),
        });
        return { success: true };
    }
    serializeMessage(message) {
        const obj = message.toObject ? message.toObject() : message;
        return {
            id: obj._id.toString(),
            roomId: obj.roomId.toString(),
            businessId: obj.businessId.toString(),
            senderId: obj.senderId?.toString(),
            senderType: obj.senderType,
            senderName: obj.senderName,
            messageType: obj.messageType,
            content: obj.content,
            attachments: obj.attachments || [],
            isRead: obj.isRead,
            readAt: obj.readAt,
            isAutomated: obj.isAutomated,
            isFAQ: obj.isFAQ,
            createdAt: obj.createdAt,
            updatedAt: obj.updatedAt,
            metadata: obj.metadata,
        };
    }
    emitChatMessage(roomId, message) {
        this.server.to(`room:${roomId}`).emit('chat:new-message', message);
        this.logger.log(`💬 Message broadcasted to room ${roomId}`);
    }
    emitAutoResponse(roomId, autoResponse) {
        this.server.to(`room:${roomId}`).emit('chat:auto-response', autoResponse);
        this.logger.log(`🤖 Auto-response sent to room ${roomId}`);
    }
    emitFAQResponse(roomId, faqResponse) {
        this.server.to(`room:${roomId}`).emit('chat:faq-response', faqResponse);
        this.logger.log(`❓ FAQ response sent to room ${roomId}`);
    }
    notifyBusinessNewChat(businessId, chatInfo) {
        this.server.to(`business:${businessId}`).emit('chat:new-conversation', chatInfo);
        this.logger.log(`🔔 New chat notification sent to business ${businessId}`);
    }
    getConnectedClientsCount() {
        return this.connectedClients.size;
    }
    getBusinessConnections(businessId) {
        return this.server.sockets.adapter.rooms.get(`business:${businessId}`)?.size || 0;
    }
    isUserOnline(userId) {
        return this.server.sockets.adapter.rooms.has(`user:${userId}`);
    }
    emitNotificationToBusiness(businessId, notification) {
        this.server.to(`business:${businessId}`).emit('notification:new', notification);
        this.logger.log(`📢 Notification sent to business ${businessId}`);
    }
    emitNotificationToUser(userId, notification) {
        this.server.to(`user:${userId}`).emit('notification:new', notification);
        this.logger.log(`📧 Notification sent to user ${userId}`);
    }
    emitAuditNotification(businessId, auditLog) {
        const notification = {
            type: 'audit',
            action: auditLog.action,
            entity: auditLog.entity,
            description: auditLog.description,
            timestamp: auditLog.createdAt,
            metadata: auditLog.metadata,
        };
        this.server.to(`business:${businessId}`).emit('audit:log', notification);
        this.logger.log(`🔍 Audit log sent to business ${businessId}: ${auditLog.action} on ${auditLog.entity}`);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RealtimeGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:join-room'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], RealtimeGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:leave-room'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], RealtimeGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:send-message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], RealtimeGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:typing'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], RealtimeGateway.prototype, "handleTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:read-messages'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], RealtimeGateway.prototype, "handleReadMessages", null);
RealtimeGateway = RealtimeGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            credentials: true,
        },
        namespace: 'realtime',
        transports: ['websocket', 'polling'],
        path: '/socket.io/',
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        core_1.ModuleRef])
], RealtimeGateway);
exports.RealtimeGateway = RealtimeGateway;
//# sourceMappingURL=realtime.gateway.js.map