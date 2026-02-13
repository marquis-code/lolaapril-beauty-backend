import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import {
  ChatRoom,
  ChatRoomDocument,
  ChatMessage,
  ChatMessageDocument,
  ChatParticipant,
  ChatParticipantDocument,
  FAQ,
  FAQDocument,
  AutoResponse,
  AutoResponseDocument,
} from '../schemas/chat.schema'
import { RealtimeGateway } from '../gateways/realtime.gateway'
import { CacheService } from '../../cache/cache.service'
import { User, UserDocument, UserRole } from '../../auth/schemas/user.schema'

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name)

  constructor(
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoomDocument>,
    @InjectModel(ChatMessage.name) private chatMessageModel: Model<ChatMessageDocument>,
    @InjectModel(ChatParticipant.name) private chatParticipantModel: Model<ChatParticipantDocument>,
    @InjectModel(FAQ.name) private faqModel: Model<FAQDocument>,
    @InjectModel(AutoResponse.name) private autoResponseModel: Model<AutoResponseDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private realtimeGateway: RealtimeGateway,
    private cacheService: CacheService,
  ) { }

  // ================== CACHE KEYS ==================
  private getUnreadCountsKey(businessId: string): string {
    return `chat:unread-counts:${businessId}`
  }

  private async invalidateUnreadCache(businessId: string): Promise<void> {
    await this.cacheService.delete(this.getUnreadCountsKey(businessId))
  }

  // ================== HELPER METHODS ==================

  /**
   * Serialize message for WebSocket transmission
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
      faqId: obj.faqId?.toString(),
      replyToMessageId: obj.replyToMessageId?.toString(),
      isEdited: obj.isEdited,
      isDeleted: obj.isDeleted,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
      metadata: obj.metadata,
    }
  }

  // ================== CHAT ROOM MANAGEMENT ==================

  /**
   * Create or get existing chat room for a customer (including anonymous guests)
   * EMAIL IS REQUIRED for anonymous users for identification and follow-up
   */
  async createOrGetCustomerChatRoom(
    businessId: string,
    userId: string,
    userInfo: { name: string; email?: string; phone?: string; isGuest?: boolean; guestInfo?: any }
  ): Promise<any> {
    const isGuest = userInfo.isGuest || false

    // ✅ VALIDATE: Email is REQUIRED for anonymous users
    if (isGuest && !userInfo.email) {
      throw new Error('Email address is required for anonymous users')
    }

    // Validate email format
    if (userInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
      throw new Error('Please provide a valid email address')
    }

    // Try multiple queries to find existing room
    let room: any = null
    const businessObjectId = new Types.ObjectId(businessId)

    // 1. Look for room by userId first
    if (userId && !userId.startsWith('guest_')) {
      room = await this.chatRoomModel.findOne({
        businessId: businessObjectId,
        roomType: 'customer-support',
        isActive: true,
        'metadata.userId': userId,
      }).exec()
    }

    // 2. Look for room by email if not found
    if (!room && userInfo.email) {
      room = await this.chatRoomModel.findOne({
        businessId: businessObjectId,
        roomType: 'customer-support',
        isActive: true,
        $or: [
          { 'metadata.email': userInfo.email },
          { 'metadata.userEmail': userInfo.email },
          { 'metadata.guestInfo.email': userInfo.email },
        ]
      }).exec()

      // If found by email, update the userId to link the account
      if (room && userId && !userId.startsWith('guest_') && !room.metadata?.userId) {
        await this.chatRoomModel.findByIdAndUpdate(room._id, {
          'metadata.userId': userId,
          'metadata.userType': 'customer',
          'metadata.isGuest': false,
        }).exec()
        this.logger.log(`🔗 Linked existing room ${room._id} to user ${userId}`)
      }
    }

    // 3. Look for room by guestInfo.sessionId
    if (!room && isGuest && userInfo.guestInfo?.sessionId) {
      room = await this.chatRoomModel.findOne({
        businessId: businessObjectId,
        roomType: 'customer-support',
        isActive: true,
        'metadata.guestInfo.sessionId': userInfo.guestInfo.sessionId,
      }).exec()
    }

    if (!room) {
      // Create new room
      const metadata: any = {
        userType: isGuest ? 'guest' : 'customer',
        userName: userInfo.name,
        userEmail: userInfo.email,
        email: userInfo.email, // Store email at root level too for easier lookup
        userPhone: userInfo.phone,
        priority: 'medium',
        tags: isGuest ? ['new-guest', 'anonymous'] : ['new-customer'],
        isGuest,
      }

      if (!isGuest && userId) {
        metadata.userId = userId
      }

      if (isGuest && userInfo.guestInfo) {
        metadata.guestInfo = {
          ...userInfo.guestInfo,
          email: userInfo.email, // Also store email in guestInfo
        }
      }

      room = await this.chatRoomModel.create({
        businessId: businessObjectId,
        roomType: 'customer-support',
        roomName: `Chat with ${userInfo.name}${isGuest ? ' (Guest)' : ''}`,
        isActive: true,
        metadata,
      })

      // Send welcome message
      await this.sendWelcomeMessage(room._id.toString(), businessId)

      // Notify business team inside the chat (system message)
      await this.sendMessage(room._id.toString(), '', 'system',
        `New customer chat started by ${userInfo.name}${userInfo.email ? ` (${userInfo.email})` : ''}.`,
        {
          senderName: 'System',
          messageType: 'system',
          isAutomated: true,
        }
      )

      // Notify business of new chat
      this.realtimeGateway.notifyBusinessNewChat(businessId, {
        roomId: room._id.toString(),
        userName: userInfo.name,
        userEmail: userInfo.email,
        isGuest,
        timestamp: new Date(),
      })

      this.logger.log(`✅ Created new ${isGuest ? 'guest' : 'customer'} chat room ${room._id} for ${userId}`)
    } else {
      this.logger.log(`♻️ Found existing room ${room._id} for ${userId}`)
    }

    return room
  }

  /**
   * Get chat room by id
   */
  async getRoomById(roomId: string): Promise<any> {
    return this.chatRoomModel.findById(roomId).lean<any>().exec()
  }

  /**
   * Create or get a 1:1 team chat between business owner/admin and a team member
   */
  async createOrGetTeamChatRoom(
    businessId: string,
    ownerId: string,
    memberId: string,
    memberInfo?: { name?: string; email?: string }
  ): Promise<any> {
    if (!ownerId || !memberId) {
      throw new BadRequestException('ownerId and memberId are required')
    }

    const query: any = {
      businessId: new Types.ObjectId(businessId),
      roomType: 'team-chat',
      isActive: true,
      'metadata.ownerId': ownerId,
      'metadata.memberId': memberId,
    }

    let room: any = await this.chatRoomModel.findOne(query).exec()

    if (!room) {
      room = await this.chatRoomModel.create({
        businessId: new Types.ObjectId(businessId),
        roomType: 'team-chat',
        roomName: `Team chat`,
        isActive: true,
        metadata: {
          userType: 'team',
          ownerId,
          memberId,
          userName: memberInfo?.name,
          userEmail: memberInfo?.email,
          priority: 'medium',
        },
      })
    }

    return room
  }

  /**
   * Create or get a support chat between business owner/admin and super admin
   */
  async createOrGetBusinessSupportRoom(
    businessId: string,
    ownerId: string,
    ownerInfo?: { name?: string; email?: string },
    superAdminId?: string
  ): Promise<any> {
    if (!ownerId) {
      throw new BadRequestException('ownerId is required')
    }

    let resolvedSuperAdminId = superAdminId
    if (!resolvedSuperAdminId) {
      const superAdmin = await this.userModel.findOne({ role: UserRole.SUPER_ADMIN }).lean<any>().exec()
      if (!superAdmin) {
        throw new NotFoundException('No super admin found')
      }
      resolvedSuperAdminId = superAdmin._id.toString()
    }

    const query: any = {
      businessId: new Types.ObjectId(businessId),
      roomType: 'admin-support',
      isActive: true,
      'metadata.ownerId': ownerId,
      'metadata.superAdminId': resolvedSuperAdminId,
    }

    let room: any = await this.chatRoomModel.findOne(query).exec()

    if (!room) {
      room = await this.chatRoomModel.create({
        businessId: new Types.ObjectId(businessId),
        roomType: 'admin-support',
        roomName: `Business support chat`,
        isActive: true,
        metadata: {
          userType: 'admin',
          ownerId,
          superAdminId: resolvedSuperAdminId,
          userName: ownerInfo?.name,
          userEmail: ownerInfo?.email,
          priority: 'medium',
        },
      })
    }

    return room
  }

  /**
   * Get all chat rooms for a business
   */
  async getBusinessChatRooms(businessId: string, filters?: {
    roomType?: string
    isActive?: boolean
    priority?: string
    page?: number
    limit?: number
  }): Promise<{ rooms: ChatRoom[]; total: number; page: number; totalPages: number }> {
    const { roomType, isActive, priority, page = 1, limit = 20 } = filters || {}

    const query: any = { businessId: new Types.ObjectId(businessId) }
    if (roomType) query.roomType = roomType
    if (isActive !== undefined) query.isActive = isActive
    if (priority) query['metadata.priority'] = priority

    const skip = (page - 1) * limit

    const roomsPromise: Promise<any> = this.chatRoomModel
      .find(query)
      .sort({ lastMessageAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec()

    const totalPromise: Promise<any> = this.chatRoomModel.countDocuments(query).exec()

    const [rooms, total] = await Promise.all([roomsPromise, totalPromise])

    return {
      rooms,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * Get unread message counts for a business
   * Returns total unread count and per-room breakdown
   */
  async getBusinessUnreadCounts(businessId: string): Promise<{
    totalUnread: number
    roomsWithUnread: number
    rooms: Array<{ roomId: string; unreadCount: number; lastMessageAt: Date; customerName: string }>
  }> {
    const cacheKey = this.getUnreadCountsKey(businessId)
    const cached = await this.cacheService.get<any>(cacheKey)
    if (cached) return cached

    const rooms = await this.chatRoomModel.find({
      businessId: new Types.ObjectId(businessId),
      isActive: true,
      unreadCount: { $gt: 0 },
    })
      .select('_id unreadCount lastMessageAt metadata')
      .sort({ lastMessageAt: -1 })
      .limit(50)
      .lean<any>()
      .exec()

    const totalUnread = rooms.reduce((sum: number, room: any) => sum + (room.unreadCount || 0), 0)

    const result = {
      totalUnread,
      roomsWithUnread: rooms.length,
      rooms: rooms.map((room: any) => ({
        roomId: room._id.toString(),
        unreadCount: room.unreadCount || 0,
        lastMessageAt: room.lastMessageAt,
        customerName: room.metadata?.userName || room.metadata?.name || 'Unknown',
      })),
    }

    await this.cacheService.set(cacheKey, result, 300) // 5 mins
    return result
  }

  /**
   * Archive a chat room
   */
  async archiveChatRoom(roomId: string): Promise<void> {
    await this.chatRoomModel.findByIdAndUpdate(roomId, {
      isArchived: true,
      isActive: false,
    }).exec()

    this.logger.log(`📁 Archived chat room ${roomId}`)
  }

  // ================== MESSAGE MANAGEMENT ==================

  /**
   * Send a chat message
   */
  async sendMessage(
    roomId: string,
    senderId: string,
    senderType: 'customer' | 'staff' | 'system' | 'bot',
    content: string,
    options?: {
      senderName?: string
      messageType?: string
      attachments?: string[]
      isAutomated?: boolean
      isFAQ?: boolean
      faqId?: string
      replyToMessageId?: string
    }
  ): Promise<ChatMessage> {
    const room = await this.chatRoomModel.findById(roomId).exec()
    if (!room) {
      throw new NotFoundException('Chat room not found')
    }

    // ✅ FIX: Handle guest users - don't convert guest IDs to ObjectId
    const isGuestUser = senderId?.startsWith('guest_') || senderType === 'customer'

    // Create message
    const message = new this.chatMessageModel({
      roomId: new Types.ObjectId(roomId),
      businessId: room.businessId,
      // ✅ Only convert to ObjectId if it's a valid MongoDB ID (not guest ID)
      senderId: senderId && !isGuestUser && Types.ObjectId.isValid(senderId)
        ? new Types.ObjectId(senderId)
        : null,
      senderType,
      senderName: options?.senderName || 'User',
      messageType: options?.messageType || 'text',
      content,
      attachments: options?.attachments || [],
      isAutomated: options?.isAutomated || false,
      isFAQ: options?.isFAQ || false,
      faqId: options?.faqId ? new Types.ObjectId(options.faqId) : null,
      replyToMessageId: options?.replyToMessageId ? new Types.ObjectId(options.replyToMessageId) : null,
      metadata: {
        deliveryStatus: 'sent',
        language: 'en',
        // ✅ Store guest ID in metadata if it's a guest
        ...(isGuestUser && senderId ? { guestId: senderId } : {}),
      },
    })

    await message.save()

    // Update room's last message
    await this.chatRoomModel.findByIdAndUpdate(roomId, {
      lastMessageId: message._id,
      lastMessageAt: new Date(),
      $inc: { unreadCount: senderType === 'customer' ? 1 : 0 },
    }).exec()

    // Serialize message for WebSocket
    const serializedMessage = this.serializeMessage(message)

    // Emit message via WebSocket
    this.realtimeGateway.emitChatMessage(roomId, serializedMessage)

    // Check if this is a customer message and needs automated response
    if (senderType === 'customer' && !options?.isAutomated) {
      // Run automation in background (don't await)
      this.handleIncomingCustomerMessage(roomId, content, room.businessId.toString())
        .catch(error => this.logger.error('Automation error:', error))
    }

    // Invalidate unread counts cache
    await this.invalidateUnreadCache(room.businessId.toString())

    this.logger.log(`💬 Message sent in room ${roomId} by ${senderType}${isGuestUser ? ' (guest)' : ''}`)

    return message
  }

  /**
   * Get messages for a room
   */
  async getRoomMessages(roomId: string, options?: {
    page?: number
    limit?: number
    beforeMessageId?: string
  }): Promise<{ messages: ChatMessage[]; hasMore: boolean }> {
    const { page = 1, limit = 50, beforeMessageId } = options || {}

    const query: any = { roomId: new Types.ObjectId(roomId) }
    if (beforeMessageId) {
      query._id = { $lt: new Types.ObjectId(beforeMessageId) }
    }

    const messages = await this.chatMessageModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .exec()

    const hasMore = messages.length > limit
    if (hasMore) messages.pop()

    return {
      messages: messages.reverse(),
      hasMore,
    }
  }

  /**
   * Mark messages as read
   */
  async markMessagesAsRead(roomId: string, userId: string): Promise<void> {
    await this.chatMessageModel.updateMany(
      {
        roomId: new Types.ObjectId(roomId),
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    ).exec()

    // Reset unread count for room
    const room = await this.chatRoomModel.findByIdAndUpdate(roomId, {
      unreadCount: 0,
    }).exec()

    if (room) {
      await this.invalidateUnreadCache(room.businessId.toString())
    }

    this.logger.log(`✅ Messages marked as read in room ${roomId}`)
  }

  // ================== FAQ & AUTOMATION ==================

  /**
   * Handle incoming customer message with automation
   * This will automatically respond with FAQ answers or auto-responses
   */
  private async handleIncomingCustomerMessage(roomId: string, message: string, businessId: string): Promise<void> {
    try {
      this.logger.log(`🤖 Processing automation for message: "${message.substring(0, 50)}..."`)

      // 1. Try to match with FAQ first (highest priority)
      const faqMatch = await this.findMatchingFAQ(message, businessId)

      if (faqMatch && faqMatch.confidence >= 50) {
        // FAQ match found - send automated response immediately
        await this.sendMessage(
          roomId,
          null,
          'bot',
          faqMatch.faq.answer,
          {
            senderName: 'Auto Assistant',
            isAutomated: true,
            isFAQ: true,
            faqId: (faqMatch.faq as any)._id.toString(),
          }
        )

        // Update FAQ usage count
        await this.faqModel.findByIdAndUpdate((faqMatch.faq as any)._id, {
          $inc: { usageCount: 1 },
        }).exec()

        this.logger.log(`🤖 FAQ auto-response sent (confidence: ${faqMatch.confidence.toFixed(1)}%)`)

        // Ask if the answer was helpful after a short delay
        setTimeout(async () => {
          try {
            await this.sendMessage(
              roomId,
              null,
              'bot',
              'Was this answer helpful? If you need more assistance, a team member will be happy to help!',
              {
                senderName: 'Auto Assistant',
                isAutomated: true,
              }
            )
          } catch (err) {
            this.logger.error('Error sending follow-up message:', err)
          }
        }, 2000)

        return
      }

      // 2. Check if business is available (staff online)
      const isBusinessAvailable = await this.isBusinessAvailable(businessId)

      if (!isBusinessAvailable) {
        // Send offline auto-response
        await this.sendOfflineAutoResponse(roomId, businessId)
        return
      }

      // 3. No FAQ match and business is online - send acknowledgment
      await this.sendMessage(
        roomId,
        null,
        'bot',
        'Thank you for your message! A team member will respond shortly. ⏰',
        {
          senderName: 'Auto Assistant',
          isAutomated: true,
        }
      )

      // 4. Notify business staff (safely)
      try {
        this.realtimeGateway.notifyBusinessNewChat(businessId, {
          roomId,
          message,
          requiresAttention: true,
          timestamp: new Date(),
        })
      } catch (notifyError) {
        this.logger.warn('Could not notify business staff:', notifyError.message)
      }

    } catch (error) {
      this.logger.error(`Error handling automated response: ${error.message}`)
    }
  }

  /**
   * Find matching FAQ for a message
   * Uses keyword matching and similarity scoring
   */
  private async findMatchingFAQ(message: string, businessId: string): Promise<{ faq: FAQ; confidence: number } | null> {
    const messageLower = message.toLowerCase().trim()
    const messageWords = messageLower.split(/\s+/).filter(w => w.length > 2) // Filter short words

    // Get all active FAQs for business
    const faqs = await this.faqModel.find({
      businessId: new Types.ObjectId(businessId),
      isActive: true,
    }).sort({ priority: -1 }).exec()

    if (faqs.length === 0) {
      this.logger.log('📋 No FAQs configured for this business')
      return null
    }

    let bestMatch: { faq: FAQ; confidence: number } | null = null
    let highestConfidence = 0

    for (const faq of faqs) {
      let matchScore = 0
      let maxPossibleScore = 0

      // 1. Check keyword matches (each keyword can contribute up to 1 point)
      if (faq.keywords && faq.keywords.length > 0) {
        maxPossibleScore += faq.keywords.length
        for (const keyword of faq.keywords) {
          const keywordLower = keyword.toLowerCase()
          if (messageLower.includes(keywordLower)) {
            matchScore += 1
          }
        }
      }

      // 2. Check direct question similarity
      const questionSimilarity = this.calculateSimilarity(messageLower, faq.question.toLowerCase())
      if (questionSimilarity > 0.5) {
        matchScore += questionSimilarity * 3 // Weight question match heavily
        maxPossibleScore += 3
      } else {
        maxPossibleScore += 3
      }

      // 3. Check alternative questions
      if (faq.alternativeQuestions && faq.alternativeQuestions.length > 0) {
        for (const altQuestion of faq.alternativeQuestions) {
          const similarity = this.calculateSimilarity(messageLower, altQuestion.toLowerCase())
          if (similarity > 0.6) {
            matchScore += similarity * 2 // Good match on alternative question
          }
        }
        maxPossibleScore += 2 // Only count once for alternatives
      }

      // Calculate confidence percentage
      const confidence = maxPossibleScore > 0 ? (matchScore / maxPossibleScore) * 100 : 0

      this.logger.debug(`FAQ "${faq.question.substring(0, 30)}..." - Score: ${matchScore.toFixed(2)}/${maxPossibleScore}, Confidence: ${confidence.toFixed(1)}%`)

      // Check if this is the best match and meets threshold
      const threshold = faq.confidenceThreshold || 50
      if (confidence > highestConfidence && confidence >= threshold) {
        highestConfidence = confidence
        bestMatch = { faq, confidence }
      }
    }

    if (bestMatch) {
      this.logger.log(`✅ FAQ Match found: "${bestMatch.faq.question.substring(0, 40)}..." with ${bestMatch.confidence.toFixed(1)}% confidence`)
    } else {
      this.logger.log(`❌ No FAQ match found for: "${messageLower.substring(0, 40)}..."`)
    }

    return bestMatch
  }

  /**
   * Calculate string similarity (simple implementation)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const words1 = str1.split(/\s+/)
    const words2 = str2.split(/\s+/)

    const commonWords = words1.filter(word => words2.includes(word))
    const similarity = (2 * commonWords.length) / (words1.length + words2.length)

    return similarity
  }

  /**
   * Send welcome message
   */
  private async sendWelcomeMessage(roomId: string, businessId: string): Promise<void> {
    const welcomeResponse = await this.autoResponseModel.findOne({
      businessId: new Types.ObjectId(businessId),
      responseType: 'welcome',
      isActive: true,
    }).exec()

    const message = welcomeResponse?.message ||
      'Hello! 👋 Welcome to our chat support. How can I help you today?'

    await this.sendMessage(roomId, null, 'bot', message, {
      senderName: 'Auto Assistant',
      isAutomated: true,
    })
  }

  /**
   * Send offline auto-response
   */
  private async sendOfflineAutoResponse(roomId: string, businessId: string): Promise<void> {
    const offlineResponse = await this.autoResponseModel.findOne({
      businessId: new Types.ObjectId(businessId),
      responseType: 'offline',
      isActive: true,
    }).exec()

    const message = offlineResponse?.message ||
      "Thank you for reaching out! We're currently offline but will respond as soon as we're back online. ⏰"

    await this.sendMessage(roomId, null, 'bot', message, {
      senderName: 'Auto Assistant',
      isAutomated: true,
    })

    if (offlineResponse) {
      await this.autoResponseModel.findByIdAndUpdate(offlineResponse._id, {
        $inc: { usageCount: 1 },
      }).exec()
    }
  }

  /**
   * Check if business is available
   */
  private async isBusinessAvailable(businessId: string): Promise<boolean> {
    // Check if any staff members are online
    const onlineStaffCount = this.realtimeGateway.getBusinessConnections(businessId)

    // You can add more sophisticated logic here like:
    // - Check business hours
    // - Check if staff are in "available" status
    // - Check workload/queue size

    return onlineStaffCount > 0
  }

  // ================== FAQ MANAGEMENT ==================

  /**
   * Create FAQ
   */
  async createFAQ(faqData: {
    businessId: string
    question: string
    answer: string
    keywords: string[]
    alternativeQuestions?: string[]
    category?: string
    confidenceThreshold?: number
    priority?: number
  }): Promise<FAQ> {
    const faq = new this.faqModel({
      ...faqData,
      businessId: new Types.ObjectId(faqData.businessId),
      alternativeQuestions: faqData.alternativeQuestions || [],
      confidenceThreshold: faqData.confidenceThreshold || 70,
      priority: faqData.priority || 0,
    })

    await faq.save()
    this.logger.log(`✅ Created FAQ: ${faq.question}`)

    return faq
  }

  /**
   * Get all FAQs for a business
   */
  async getBusinessFAQs(businessId: string, options?: {
    category?: string
    isActive?: boolean
  }): Promise<FAQ[]> {
    const query: any = { businessId: new Types.ObjectId(businessId) }

    if (options?.category) query.category = options.category
    if (options?.isActive !== undefined) query.isActive = options.isActive

    return this.faqModel.find(query).sort({ priority: -1, usageCount: -1 }).exec()
  }

  /**
   * Update FAQ
   */
  async updateFAQ(faqId: string, updates: Partial<FAQ>): Promise<FAQ> {
    return this.faqModel.findByIdAndUpdate(faqId, updates, { new: true }).exec()
  }

  /**
   * Delete FAQ
   */
  async deleteFAQ(faqId: string): Promise<void> {
    await this.faqModel.findByIdAndUpdate(faqId, { isActive: false }).exec()
  }

  // ================== AUTO RESPONSE MANAGEMENT ==================

  /**
   * Create auto-response
   */
  async createAutoResponse(responseData: {
    businessId: string
    name: string
    responseType: string
    message: string
    trigger?: any
    quickReplies?: string[]
  }): Promise<AutoResponse> {
    const autoResponse = new this.autoResponseModel({
      ...responseData,
      businessId: new Types.ObjectId(responseData.businessId),
    })

    await autoResponse.save()
    this.logger.log(`✅ Created auto-response: ${autoResponse.name}`)

    return autoResponse
  }

  /**
   * Get auto-responses for a business
   */
  async getBusinessAutoResponses(businessId: string): Promise<AutoResponse[]> {
    return this.autoResponseModel.find({
      businessId: new Types.ObjectId(businessId),
      isActive: true,
    }).exec()
  }

  /**
   * Update auto-response
   */
  async updateAutoResponse(responseId: string, updates: Partial<AutoResponse>): Promise<AutoResponse> {
    return this.autoResponseModel.findByIdAndUpdate(responseId, updates, { new: true }).exec()
  }

  /**
   * Manually trigger an auto-response by type
   */
  async triggerAutoResponse(roomId: string, businessId: string, responseType: string): Promise<any> {
    const autoResponse = await this.autoResponseModel.findOne({
      businessId: new Types.ObjectId(businessId),
      responseType: responseType,
      isActive: true,
    }).exec()

    if (!autoResponse) {
      return {
        success: false,
        message: `No active auto-response found for type: ${responseType}`,
        availableTypes: ['welcome', 'offline', 'busy', 'away', 'closing-soon', 'holiday', 'custom'],
      }
    }

    // Send the auto-response message
    const message = await this.sendMessage(roomId, null, 'bot', autoResponse.message, {
      senderName: 'Auto Assistant',
      isAutomated: true,
    })

    // Increment usage count
    await this.autoResponseModel.findByIdAndUpdate(autoResponse._id, {
      $inc: { usageCount: 1 },
    }).exec()

    this.logger.log(`✅ Triggered auto-response: ${autoResponse.name} (${responseType})`)

    return {
      success: true,
      message: 'Auto-response triggered successfully',
      autoResponse: {
        id: autoResponse._id,
        name: autoResponse.name,
        responseType: autoResponse.responseType,
        quickReplies: autoResponse.quickReplies,
      },
      sentMessage: message,
    }
  }
}