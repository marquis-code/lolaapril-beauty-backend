import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger, UseGuards, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { ModuleRef } from '@nestjs/core'
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'

@WebSocketGateway({
  cors: {
    origin: '*', // Configure based on your frontend URL
    credentials: true,
  },
  namespace: 'realtime',
  transports: ['websocket', 'polling'],
  path: '/socket.io/',
})
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private readonly logger = new Logger(RealtimeGateway.name)
  private connectedClients: Map<string, any> = new Map()

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private moduleRef: ModuleRef,
  ) {}

  async afterInit(server: Server) {
    this.logger.log('🚀 WebSocket Gateway Initialized')

    // Setup Redis adapter for horizontal scaling
    try {
      const redisHost = this.configService.get<string>('REDIS_HOST')
      const redisPort = this.configService.get<number>('REDIS_PORT')
      const redisPassword = this.configService.get<string>('REDIS_PASSWORD')

      if (redisHost && redisPort) {
        const pubClient = createClient({
          url: `redis://${redisHost}:${redisPort}`,
          password: redisPassword,
        })
        const subClient = pubClient.duplicate()

        await Promise.all([pubClient.connect(), subClient.connect()])

        server.adapter(createAdapter(pubClient, subClient))
        this.logger.log('✅ Redis adapter configured for WebSocket scaling')
      }
    } catch (error) {
      this.logger.warn('⚠️ Redis adapter not configured, running in single-instance mode:', error.message)
    }
  }

  async handleConnection(client: Socket) {
    try {
      // Extract token from handshake
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1]

      if (!token) {
        // ✅ ALLOW ANONYMOUS USERS - No token needed for chat
        this.logger.log(`🔓 Anonymous user connecting: ${client.id}`)
        this.setupAnonymousUser(client)
        return
      }

      try {
        // Verify JWT token for authenticated users
        const decoded = this.jwtService.verify(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        })

        const businessId = decoded.businessId || decoded.sub
        const userId = decoded.userId || decoded.id

        // Store connection info for authenticated user, including role
        const userRole = decoded.role || decoded.userRole || decoded.type || 'CUSTOMER'
        this.connectedClients.set(client.id, {
          socket: client,
          businessId,
          userId,
          isGuest: false,
          role: userRole,
        })

        // Join business room for business-specific broadcasts
        client.join(`business:${businessId}`)
        client.join(`user:${userId}`)

        this.logger.log(`✅ Authenticated client connected: ${client.id} | Business: ${businessId} | User: ${userId}`)
        this.logger.log(`📊 Total connected clients: ${this.connectedClients.size}`)

        // Notify user of successful connection
        client.emit('connected', {
          message: 'Connected to real-time server',
          clientId: client.id,
          isAuthenticated: true,
          timestamp: new Date(),
        })
      } catch (error) {
        // Invalid token - treat as anonymous
        this.logger.warn(`⚠️ Invalid token for client ${client.id}, treating as anonymous`)
        this.setupAnonymousUser(client)
      }
    } catch (error) {
      this.logger.error(`❌ Connection error for client ${client.id}:`, error.message)
      client.emit('error', { message: 'Connection failed' })
      client.disconnect()
    }
  }

  /**
   * Setup anonymous/guest user without authentication
   */
  private setupAnonymousUser(client: Socket) {
    // Generate unique guest ID
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const sessionId = client.handshake.auth?.sessionId || client.id
    
    // Store guest connection info
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
    })

    // Join guest's personal room
    client.join(`user:${guestId}`)

    this.logger.log(`✅ Anonymous guest connected: ${client.id} | Guest ID: ${guestId}`)
    this.logger.log(`📊 Total connected clients: ${this.connectedClients.size}`)

    // Send guest registration info to client
    client.emit('guest:registered', {
      guestId,
      sessionId,
      message: 'Connected as guest',
      timestamp: new Date(),
    })

    // Also send standard connection event
    client.emit('connected', {
      message: 'Connected to real-time server',
      clientId: client.id,
      isAuthenticated: false,
      isGuest: true,
      guestId,
      timestamp: new Date(),
    })
  }

  handleDisconnect(client: Socket) {
    const clientInfo = this.connectedClients.get(client.id)
    this.connectedClients.delete(client.id)

    this.logger.log(`🔌 Client disconnected: ${client.id}`)
    this.logger.log(`📊 Total connected clients: ${this.connectedClients.size}`)

    if (clientInfo && clientInfo.businessId) {
      // Notify business that user went offline
      this.server.to(`business:${clientInfo.businessId}`).emit('user:offline', {
        userId: clientInfo.userId,
        timestamp: new Date(),
      })
    }
  }

  // ================== CHAT EVENTS ==================

  @SubscribeMessage('chat:join-room')
  async handleJoinRoom(
    @MessageBody() data: { roomId?: string; businessId?: string; userName?: string; email?: string },
    @ConnectedSocket() client: Socket
  ) {
    const clientInfo = this.connectedClients.get(client.id)
    if (!clientInfo) {
      return { success: false, error: 'Not connected' }
    }

    try {
      this.logger.log(`💬 Join room request:`, { clientId: client.id, data })

      // If roomId is provided, just join existing room
      if (data.roomId) {
        client.join(`room:${data.roomId}`)
        this.logger.log(`💬 User ${clientInfo.userId} joined room ${data.roomId}`)

        // Notify others in the room
        client.to(`room:${data.roomId}`).emit('chat:user-joined', {
          userId: clientInfo.userId,
          isGuest: clientInfo.isGuest,
          roomId: data.roomId,
          timestamp: new Date(),
        })

        // Fetch and return messages
        const { ChatService } = await import('../services/chat.service')
        const chatService = this.moduleRef.get(ChatService, { strict: false })
        const { messages } = await chatService.getRoomMessages(data.roomId, { limit: 50 })

        // Serialize messages
        const serializedMessages = messages.map(msg => this.serializeMessage(msg))

        return { 
          success: true, 
          message: 'Joined room successfully', 
          roomId: data.roomId,
          messages: serializedMessages,
        }
      }

      // If businessId is provided, create/get room (supports anonymous users)
      if (data.businessId && data.userName) {
        // ✅ REQUIRE EMAIL FOR ANONYMOUS USERS
        if (clientInfo.isGuest && !data.email) {
          return { 
            success: false, 
            error: 'Email is required for anonymous users',
            requireEmail: true 
          }
        }

        // Validate email format if provided
        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
          return { 
            success: false, 
            error: 'Please provide a valid email address',
            requireEmail: true 
          }
        }

        // Import chat service
        const { ChatService } = await import('../services/chat.service')
        const chatService = this.moduleRef.get(ChatService, { strict: false })

        const userInfo: any = {
          name: data.userName,
          email: data.email,
          isGuest: clientInfo.isGuest || false,
        }

        if (clientInfo.isGuest) {
          userInfo.guestInfo = {
            ...clientInfo.guestInfo,
            userName: data.userName,
            email: data.email,
          }
        }

        const room = await chatService.createOrGetCustomerChatRoom(
          data.businessId,
          clientInfo.userId,
          userInfo
        )

        const roomId = room._id.toString()
        client.join(`room:${roomId}`)
        
        // Also join business room
        client.join(`business:${data.businessId}`)

        this.logger.log(`💬 ${clientInfo.isGuest ? 'Guest' : 'User'} ${clientInfo.userId} created/joined room ${roomId}`)

        // Fetch messages for the room
        const { messages } = await chatService.getRoomMessages(roomId, { limit: 50 })
        const serializedMessages = messages.map(msg => this.serializeMessage(msg))

        return { 
          success: true, 
          message: 'Room created/joined successfully', 
          roomId,
          messages: serializedMessages,
          isGuest: clientInfo.isGuest,
          guestId: clientInfo.isGuest ? clientInfo.userId : undefined
        }
      }

      return { success: false, error: 'Either roomId or businessId+userName required' }
    } catch (error) {
      this.logger.error(`❌ Error joining room:`, error.message)
      return { success: false, error: error.message }
    }
  }

  @SubscribeMessage('chat:leave-room')
  async handleLeaveRoom(@MessageBody() data: { roomId: string }, @ConnectedSocket() client: Socket) {
    const clientInfo = this.connectedClients.get(client.id)
    if (!clientInfo) return

    client.leave(`room:${data.roomId}`)
    this.logger.log(`👋 User ${clientInfo.userId} left room ${data.roomId}`)

    // Notify others in the room
    client.to(`room:${data.roomId}`).emit('chat:user-left', {
      userId: clientInfo.userId,
      roomId: data.roomId,
      timestamp: new Date(),
    })

    return { success: true, message: 'Left room successfully' }
  }

  // @SubscribeMessage('chat:send-message')
  // async handleSendMessage(
  //   @MessageBody() data: { roomId: string; content: string; attachments?: any[] },
  //   @ConnectedSocket() client: Socket
  // ) {
  //   const clientInfo = this.connectedClients.get(client.id)
  //   if (!clientInfo) {
  //     return { success: false, error: 'Not connected' }
  //   }

  //   try {
  //     this.logger.log(`📤 Send message request:`, { 
  //       clientId: client.id, 
  //       roomId: data.roomId,
  //       content: data.content.substring(0, 50) + '...'
  //     })

  //     // Import chat service
  //     const { ChatService } = await import('../services/chat.service')
  //     const chatService = this.moduleRef.get(ChatService, { strict: false })

  //     // Determine sender type and name
  //     const senderType = clientInfo.isGuest ? 'customer' : 'staff'
  //     const senderName = clientInfo.isGuest 
  //       ? (clientInfo.guestInfo?.userName || 'Guest') 
  //       : 'Staff Member'

  //     // Send message via service (this will also emit via WebSocket)
  //     const message = await chatService.sendMessage(
  //       data.roomId,
  //       clientInfo.userId,
  //       senderType,
  //       data.content,
  //       {
  //         senderName,
  //         attachments: data.attachments,
  //       }
  //     ) as any

  //     this.logger.log(`✅ Message sent successfully to room ${data.roomId}`)

  //     return { 
  //       success: true, 
  //       messageId: message._id.toString(),
  //       timestamp: new Date() 
  //     }
  //   } catch (error) {
  //     this.logger.error(`❌ Error sending message:`, error.message)
  //     return { success: false, error: error.message }
  //   }
  // }
  
  @SubscribeMessage('chat:send-message')
async handleSendMessage(
  @MessageBody() data: { roomId: string; content: string; attachments?: any[]; senderType?: 'customer' | 'staff' | 'system' | 'bot'; senderId?: string; senderName?: string },
  @ConnectedSocket() client: Socket
) {
  const clientInfo = this.connectedClients.get(client.id)
  if (!clientInfo) {
    return { success: false, error: 'Not connected' }
  }

  try {
    this.logger.log(`📤 Send message request:`, { 
      clientId: client.id, 
      roomId: data.roomId,
      content: data.content.substring(0, 50) + '...',
      isGuest: clientInfo.isGuest,
      userId: clientInfo.userId
    })

    // Import chat service
    const { ChatService } = await import('../services/chat.service')
    const chatService = this.moduleRef.get(ChatService, { strict: false })


    // Enforce and validate senderType
    const staffRoles = ['BUSINESS_OWNER', 'BUSINESS_ADMIN', 'STAFF', 'SUPER_ADMIN']
    const normalizedRole = typeof clientInfo.role === 'string' ? clientInfo.role.toUpperCase() : clientInfo.role;
    let senderType = data.senderType;
    let senderId = data.senderId || clientInfo.userId;
    let senderName = data.senderName;

    // Validate senderType
    if (clientInfo.isGuest && senderType !== 'customer') {
      return { success: false, error: 'Guests can only send as customer' };
    }
    if (!clientInfo.isGuest && staffRoles.includes(normalizedRole) && senderType !== 'staff') {
      return { success: false, error: 'Staff can only send as staff' };
    }
    if (!clientInfo.isGuest && !staffRoles.includes(normalizedRole) && senderType !== 'customer') {
      return { success: false, error: 'Customers can only send as customer' };
    }


    // Enforce senderName matches senderType
    if (senderType === 'customer') {
      // Always use guest name, customer name, or fallback
      if (!senderName) {
        if (clientInfo.isGuest) {
          senderName = clientInfo.guestInfo?.userName || 'Guest';
        } else if (clientInfo.role === 'CUSTOMER' && clientInfo.userName) {
          senderName = clientInfo.userName;
        } else {
          senderName = 'Customer';
        }
      }
      // Prevent staff name for customer
      if (senderName === 'Staff Member') {
        senderName = 'Customer';
      }
    } else if (senderType === 'staff') {
      // Always use staff name or fallback
      if (!senderName) {
        senderName = clientInfo.userName || 'Staff Member';
      }
      // Prevent customer/guest name for staff
      if (senderName === 'Customer' || senderName === 'Guest') {
        senderName = 'Staff Member';
      }
    }

    // Send message via service (this will also emit via WebSocket)
    const message = await chatService.sendMessage(
      data.roomId,
      senderId,
      senderType,
      data.content,
      {
        senderName,
        attachments: data.attachments,
      }
    ) as any

    this.logger.log(`✅ Message sent successfully to room ${data.roomId}`)

    return { 
      success: true, 
      messageId: message._id.toString(),
      timestamp: new Date() 
    }
  } catch (error) {
    this.logger.error(`❌ Error sending message:`, error.message)
    return { success: false, error: error.message }
  }
}

  @SubscribeMessage('chat:typing')
  async handleTyping(
    @MessageBody() data: { roomId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket
  ) {
    const clientInfo = this.connectedClients.get(client.id)
    if (!clientInfo) return

    // Broadcast typing indicator to room (excluding sender)
    client.to(`room:${data.roomId}`).emit('chat:user-typing', {
      userId: clientInfo.userId,
      userName: clientInfo.guestInfo?.userName || 'User',
      roomId: data.roomId,
      isTyping: data.isTyping,
      timestamp: new Date(),
    })
  }

  @SubscribeMessage('chat:read-messages')
  async handleReadMessages(
    @MessageBody() data: { roomId: string; messageIds: string[] },
    @ConnectedSocket() client: Socket
  ) {
    const clientInfo = this.connectedClients.get(client.id)
    if (!clientInfo) return

    // Broadcast read receipt to room
    client.to(`room:${data.roomId}`).emit('chat:messages-read', {
      userId: clientInfo.userId,
      roomId: data.roomId,
      messageIds: data.messageIds,
      timestamp: new Date(),
    })

    return { success: true }
  }

  // ================== HELPER METHODS ==================

  /**
   * Serialize MongoDB message to plain object with id
   */
  private serializeMessage(message: any) {
    const obj = message.toObject ? message.toObject() : message
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
    }
  }

  /**
   * Emit chat message to room
   */
  emitChatMessage(roomId: string, message: any) {
    this.server.to(`room:${roomId}`).emit('chat:new-message', message)
    this.logger.log(`💬 Message broadcasted to room ${roomId}`)
  }

  /**
   * Emit auto-response
   */
  emitAutoResponse(roomId: string, autoResponse: any) {
    this.server.to(`room:${roomId}`).emit('chat:auto-response', autoResponse)
    this.logger.log(`🤖 Auto-response sent to room ${roomId}`)
  }

  /**
   * Emit FAQ response
   */
  emitFAQResponse(roomId: string, faqResponse: any) {
    this.server.to(`room:${roomId}`).emit('chat:faq-response', faqResponse)
    this.logger.log(`❓ FAQ response sent to room ${roomId}`)
  }

  /**
   * Notify business of new chat
   */
  notifyBusinessNewChat(businessId: string, chatInfo: any) {
    this.server.to(`business:${businessId}`).emit('chat:new-conversation', chatInfo)
    this.logger.log(`🔔 New chat notification sent to business ${businessId}`)
  }

  /**
   * Get connected clients count
   */
  getConnectedClientsCount(): number {
    return this.connectedClients.size
  }

  /**
   * Get connected clients for a business
   */
  getBusinessConnections(businessId: string): number {
    try {
      return this.server?.sockets?.adapter?.rooms?.get(`business:${businessId}`)?.size || 0
    } catch (error) {
      return 0
    }
  }

  /**
   * Check if user is online
   */
  isUserOnline(userId: string): boolean {
    try {
      return this.server?.sockets?.adapter?.rooms?.has(`user:${userId}`) || false
    } catch (error) {
      return false
    }
  }

  // ================== NOTIFICATION EVENTS ==================
  
  /**
   * Emit notification to specific business
   */
  emitNotificationToBusiness(businessId: string, notification: any) {
    this.server.to(`business:${businessId}`).emit('notification:new', notification)
    this.logger.log(`📢 Notification sent to business ${businessId}`)
  }

  /**
   * Emit notification to specific user
   */
  emitNotificationToUser(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification:new', notification)
    this.logger.log(`📧 Notification sent to user ${userId}`)
  }

  /**
   * Emit audit log as notification
   */
  emitAuditNotification(businessId: string, auditLog: any) {
    const notification = {
      type: 'audit',
      action: auditLog.action,
      entity: auditLog.entity,
      description: auditLog.description,
      timestamp: auditLog.createdAt,
      metadata: auditLog.metadata,
    }

    this.server.to(`business:${businessId}`).emit('audit:log', notification)
    this.logger.log(`🔍 Audit log sent to business ${businessId}: ${auditLog.action} on ${auditLog.entity}`)
  }
}