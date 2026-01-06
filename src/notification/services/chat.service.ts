import { Injectable, Logger, NotFoundException } from '@nestjs/common'
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

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name)

  constructor(
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoomDocument>,
    @InjectModel(ChatMessage.name) private chatMessageModel: Model<ChatMessageDocument>,
    @InjectModel(ChatParticipant.name) private chatParticipantModel: Model<ChatParticipantDocument>,
    @InjectModel(FAQ.name) private faqModel: Model<FAQDocument>,
    @InjectModel(AutoResponse.name) private autoResponseModel: Model<AutoResponseDocument>,
    private realtimeGateway: RealtimeGateway,
  ) {}

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
    
    // For guests, try to find room by sessionId if provided
    let query: any = {
      businessId: new Types.ObjectId(businessId),
      roomType: 'customer-support',
      isActive: true,
    }

    if (isGuest && userInfo.guestInfo?.sessionId) {
      // Look for existing guest session
      query['metadata.guestInfo.sessionId'] = userInfo.guestInfo.sessionId
    } else if (!isGuest) {
      // Look for authenticated user's room
      query['metadata.userId'] = userId
    }

    let room: any = await this.chatRoomModel.findOne(query).exec()

    if (!room) {
      // Create new room
      const metadata: any = {
        userType: isGuest ? 'guest' : 'customer',
        userName: userInfo.name,
        userEmail: userInfo.email,
        userPhone: userInfo.phone,
        priority: 'medium',
        tags: isGuest ? ['new-guest', 'anonymous'] : ['new-customer'],
        isGuest,
      }

      if (!isGuest) {
        metadata.userId = userId
      }

      if (isGuest && userInfo.guestInfo) {
        metadata.guestInfo = userInfo.guestInfo
      }

      room = await this.chatRoomModel.create({
        businessId: new Types.ObjectId(businessId),
        roomType: 'customer-support',
        roomName: `Chat with ${userInfo.name}${isGuest ? ' (Guest)' : ''}`,
        isActive: true,
        metadata,
      })

      // Send welcome message
      await this.sendWelcomeMessage(room._id.toString(), businessId)

      // Notify business of new chat
      this.realtimeGateway.notifyBusinessNewChat(businessId, {
        roomId: room._id,
        userName: userInfo.name,
        userEmail: userInfo.email,
        isGuest,
        timestamp: new Date(),
      })

      this.logger.log(`✅ Created new ${isGuest ? 'guest' : 'customer'} chat room ${room._id} for ${userId}`)
    }

    return room
  }

  /**
   * Get all chat rooms for a business
   */
//   async getBusinessChatRooms(businessId: string, filters?: {
//     roomType?: string
//     isActive?: boolean
//     priority?: string
//     page?: number
//     limit?: number
//   }): Promise<{ rooms: ChatRoom[]; total: number; page: number; totalPages: number }> {
//     const { roomType, isActive, priority, page = 1, limit = 20 } = filters || {}

//     const query: any = { businessId: new Types.ObjectId(businessId) }
//     if (roomType) query.roomType = roomType
//     if (isActive !== undefined) query.isActive = isActive
//     if (priority) query['metadata.priority'] = priority

//     const skip = (page - 1) * limit

//     const [rooms, total] = await Promise.all([
//       this.chatRoomModel
//         .find(query)
//         .sort({ lastMessageAt: -1, createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .exec(),
//       this.chatRoomModel.countDocuments(query).exec(),
//     ])

//     return {
//       rooms,
//       total,
//       page,
//       totalPages: Math.ceil(total / limit),
//     }
//   }

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

  // 🔥 NUCLEAR FIX: Explicit type annotations to break complex union type
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

    // Create message
    const message = new this.chatMessageModel({
      roomId: new Types.ObjectId(roomId),
      businessId: room.businessId,
      senderId: senderId ? new Types.ObjectId(senderId) : null,
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
      },
    })

    await message.save()

    // Update room's last message
    await this.chatRoomModel.findByIdAndUpdate(roomId, {
      lastMessageId: message._id,
      lastMessageAt: new Date(),
      $inc: { unreadCount: senderType === 'customer' ? 1 : 0 },
    }).exec()

    // Emit message via WebSocket
    this.realtimeGateway.emitChatMessage(roomId, message)

    // Check if this is a customer message and needs automated response
    if (senderType === 'customer' && !options?.isAutomated) {
      await this.handleIncomingCustomerMessage(roomId, content, room.businessId.toString())
    }

    this.logger.log(`💬 Message sent in room ${roomId} by ${senderType}`)

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
    await this.chatRoomModel.findByIdAndUpdate(roomId, {
      unreadCount: 0,
    }).exec()

    this.logger.log(`✅ Messages marked as read in room ${roomId}`)
  }

  // ================== FAQ & AUTOMATION ==================

  /**
   * Handle incoming customer message with automation
   */
  private async handleIncomingCustomerMessage(roomId: string, message: string, businessId: string): Promise<void> {
    try {
      // 1. Check if business is available
      const isBusinessAvailable = await this.isBusinessAvailable(businessId)

      if (!isBusinessAvailable) {
        // Send offline auto-response
        await this.sendOfflineAutoResponse(roomId, businessId)
        return
      }

      // 2. Try to match with FAQ
      const faqMatch = await this.findMatchingFAQ(message, businessId)

      if (faqMatch && faqMatch.confidence > 70) {
        // High confidence FAQ match - send automated response
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

        // Ask if the answer was helpful
        setTimeout(() => {
          this.sendMessage(
            roomId,
            null,
            'bot',
            'Was this answer helpful? If you need more assistance, please let me know!',
            {
              senderName: 'Auto Assistant',
              isAutomated: true,
            }
          )
        }, 2000)

        this.logger.log(`🤖 Sent FAQ auto-response for room ${roomId}`)
      } else {
        // No FAQ match - notify staff and send acknowledgment
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

        // Notify business staff
        this.realtimeGateway.notifyBusinessNewChat(businessId, {
          roomId,
          message,
          requiresAttention: true,
          timestamp: new Date(),
        })
      }
    } catch (error) {
      this.logger.error(`Error handling automated response: ${error.message}`)
    }
  }

  /**
   * Find matching FAQ for a message
   */
  private async findMatchingFAQ(message: string, businessId: string): Promise<{ faq: FAQ; confidence: number } | null> {
    const messageLower = message.toLowerCase()
    const messageWords = messageLower.split(/\s+/)

    // Get all active FAQs for business
    const faqs = await this.faqModel.find({
      businessId: new Types.ObjectId(businessId),
      isActive: true,
    }).sort({ priority: -1 }).exec()

    let bestMatch: { faq: FAQ; confidence: number } | null = null
    let highestConfidence = 0

    for (const faq of faqs) {
      let matchScore = 0
      let totalKeywords = faq.keywords.length

      // Check keywords match
      for (const keyword of faq.keywords) {
        if (messageLower.includes(keyword.toLowerCase())) {
          matchScore += 1
        }
      }

      // Check alternative questions
      for (const altQuestion of faq.alternativeQuestions) {
        const similarity = this.calculateSimilarity(messageLower, altQuestion.toLowerCase())
        if (similarity > 0.7) {
          matchScore += 2 // Higher weight for alternative questions
          totalKeywords += 2
        }
      }

      // Calculate confidence percentage
      const confidence = totalKeywords > 0 ? (matchScore / totalKeywords) * 100 : 0

      if (confidence > highestConfidence && confidence >= faq.confidenceThreshold) {
        highestConfidence = confidence
        bestMatch = { faq, confidence }
      }
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

    await this.autoResponseModel.findByIdAndUpdate(offlineResponse?._id, {
      $inc: { usageCount: 1 },
    }).exec()
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
}
