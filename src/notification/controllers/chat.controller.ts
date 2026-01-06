import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { ChatService } from '../services/chat.service'
import { BusinessId, Public } from '../../auth'

@ApiTags('Chat')
@Controller('chat')
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // ================== CHAT ROOMS ==================

  @Post('rooms/create')
  @ApiOperation({ summary: 'Create or get customer chat room' })
  @ApiResponse({ status: 201, description: 'Chat room created or retrieved' })
  async createChatRoom(
    @Body() body: {
      userId: string
      userName: string
      userEmail?: string
      userPhone?: string
    },
    @BusinessId() businessId: string
  ) {
    return this.chatService.createOrGetCustomerChatRoom(
      businessId,
      body.userId,
      {
        name: body.userName,
        email: body.userEmail,
        phone: body.userPhone,
      }
    )
  }

  @Get('rooms')
  @ApiOperation({ summary: 'Get all chat rooms for business' })
  @ApiResponse({ status: 200, description: 'Chat rooms retrieved' })
  async getChatRooms(
    @BusinessId() businessId: string,
    @Query('roomType') roomType?: string,
    @Query('isActive') isActive?: boolean,
    @Query('priority') priority?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return this.chatService.getBusinessChatRooms(businessId, {
      roomType,
      isActive,
      priority,
      page,
      limit,
    })
  }

  @Put('rooms/:roomId/archive')
  @ApiOperation({ summary: 'Archive a chat room' })
  @ApiResponse({ status: 200, description: 'Chat room archived' })
  async archiveChatRoom(@Param('roomId') roomId: string) {
    await this.chatService.archiveChatRoom(roomId)
    return { success: true, message: 'Chat room archived' }
  }

  // ================== MESSAGES ==================

  @Post('rooms/:roomId/messages')
  @ApiOperation({ summary: 'Send a message in chat room' })
  @ApiResponse({ status: 201, description: 'Message sent' })
  async sendMessage(
    @Param('roomId') roomId: string,
    @Body() body: {
      senderId: string
      senderType: 'customer' | 'staff' | 'system' | 'bot'
      senderName: string
      content: string
      messageType?: string
      attachments?: string[]
      replyToMessageId?: string
    }
  ) {
    return this.chatService.sendMessage(
      roomId,
      body.senderId,
      body.senderType,
      body.content,
      {
        senderName: body.senderName,
        messageType: body.messageType,
        attachments: body.attachments,
        replyToMessageId: body.replyToMessageId,
      }
    )
  }

  @Get('rooms/:roomId/messages')
  @ApiOperation({ summary: 'Get messages for a room' })
  @ApiResponse({ status: 200, description: 'Messages retrieved' })
  async getRoomMessages(
    @Param('roomId') roomId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('beforeMessageId') beforeMessageId?: string
  ) {
    return this.chatService.getRoomMessages(roomId, {
      page,
      limit,
      beforeMessageId,
    })
  }

  @Put('rooms/:roomId/messages/read')
  @ApiOperation({ summary: 'Mark messages as read' })
  @ApiResponse({ status: 200, description: 'Messages marked as read' })
  async markMessagesAsRead(
    @Param('roomId') roomId: string,
    @Body('userId') userId: string
  ) {
    await this.chatService.markMessagesAsRead(roomId, userId)
    return { success: true, message: 'Messages marked as read' }
  }

  // ================== FAQ MANAGEMENT ==================

  @Post('faqs')
  @ApiOperation({ summary: 'Create FAQ' })
  @ApiResponse({ status: 201, description: 'FAQ created' })
  async createFAQ(
    @Body() body: {
      question: string
      answer: string
      keywords: string[]
      alternativeQuestions?: string[]
      category?: string
      confidenceThreshold?: number
      priority?: number
    },
    @BusinessId() businessId: string
  ) {
    return this.chatService.createFAQ({
      businessId,
      ...body,
    })
  }

  @Public()
  @Get('faqs')
  @ApiOperation({ summary: 'Get all FAQs for business' })
  @ApiResponse({ status: 200, description: 'FAQs retrieved' })
  async getFAQs(
    @BusinessId() businessId: string,
    @Query('category') category?: string,
    @Query('isActive') isActive?: boolean
  ) {
    return this.chatService.getBusinessFAQs(businessId, {
      category,
      isActive,
    })
  }

  @Put('faqs/:faqId')
  @ApiOperation({ summary: 'Update FAQ' })
  @ApiResponse({ status: 200, description: 'FAQ updated' })
  async updateFAQ(
    @Param('faqId') faqId: string,
    @Body() updates: any
  ) {
    return this.chatService.updateFAQ(faqId, updates)
  }

  @Delete('faqs/:faqId')
  @ApiOperation({ summary: 'Delete FAQ' })
  @ApiResponse({ status: 200, description: 'FAQ deleted' })
  async deleteFAQ(@Param('faqId') faqId: string) {
    await this.chatService.deleteFAQ(faqId)
    return { success: true, message: 'FAQ deleted' }
  }

  // ================== AUTO RESPONSES ==================

  @Post('auto-responses')
  @ApiOperation({ summary: 'Create auto-response' })
  @ApiResponse({ status: 201, description: 'Auto-response created' })
  async createAutoResponse(
    @Body() body: {
      name: string
      responseType: string
      message: string
      trigger?: any
      quickReplies?: string[]
    },
    @BusinessId() businessId: string
  ) {
    return this.chatService.createAutoResponse({
      businessId,
      ...body,
    })
  }

  @Public()
  @Get('auto-responses')
  @ApiOperation({ summary: 'Get all auto-responses for business' })
  @ApiResponse({ status: 200, description: 'Auto-responses retrieved' })
  async getAutoResponses(@BusinessId() businessId: string) {
    return this.chatService.getBusinessAutoResponses(businessId)
  }

  @Put('auto-responses/:responseId')
  @ApiOperation({ summary: 'Update auto-response' })
  @ApiResponse({ status: 200, description: 'Auto-response updated' })
  async updateAutoResponse(
    @Param('responseId') responseId: string,
    @Body() updates: any
  ) {
    return this.chatService.updateAutoResponse(responseId, updates)
  }
}
