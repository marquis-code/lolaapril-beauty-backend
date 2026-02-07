import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, BadRequestException } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { ChatService } from '../services/chat.service'
import { BusinessService } from '../../business/business.service'
import { BusinessId, OptionalBusinessId, Public, CurrentUser } from '../../auth'
import { Roles } from '../../auth/decorators/roles.decorator'
import { UserRole } from '../../auth/schemas/user.schema'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../../auth/guards/roles.guard'
import { OptionalAuthGuard } from '../../auth/guards/optional-auth.guard'

@ApiTags('Chat')
@Controller('chat')
@ApiBearerAuth()
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly businessService: BusinessService,
  ) {}

  // ================== CHAT ROOMS ==================

  @Post('rooms/create')
  @Public()
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: 'Create or get customer chat room' })
  @ApiResponse({ status: 201, description: 'Chat room created or retrieved' })
  async createChatRoom(
    @Body() body: {
      userId: string
      userName: string
      userEmail?: string
      userPhone?: string
      businessId?: string
      subdomain?: string
      isGuest?: boolean
      guestInfo?: any
    },
    @OptionalBusinessId() authBusinessId?: string,
    @CurrentUser() user?: any
  ) {
    const resolvedUserId = body.userId || user?.sub || user?.userId || user?.id
    const resolvedUserName = body.userName || (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.name)
    const resolvedUserEmail = body.userEmail || user?.email
    const resolvedUserPhone = body.userPhone || user?.phone

    if (!resolvedUserId || !resolvedUserName) {
      throw new BadRequestException('userId and userName are required')
    }

    const resolvedBusinessId = await this.resolveBusinessId(
      authBusinessId,
      body.businessId,
      body.subdomain,
    )

    return this.chatService.createOrGetCustomerChatRoom(
      resolvedBusinessId,
      resolvedUserId,
      {
        name: resolvedUserName,
        email: resolvedUserEmail,
        phone: resolvedUserPhone,
        isGuest: body.isGuest ?? !user,
        guestInfo: body.guestInfo,
      }
    )
  }

  // ================== BUSINESS OWNER/TEAM CHAT ==================

  @Post('rooms/team')
  @Roles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create or get team chat with a team member' })
  @ApiResponse({ status: 201, description: 'Team chat room created or retrieved' })
  async createTeamChatRoom(
    @BusinessId() businessId: string,
    @CurrentUser() user: any,
    @Body() body: { memberId: string; memberName?: string; memberEmail?: string }
  ) {
    const ownerId = user?.sub || user?.userId || user?.id

    if (!ownerId) {
      throw new BadRequestException('Authenticated user is required')
    }

    const business = await this.businessService.getById(businessId)
    const memberIds = [
      business?.ownerId?._id?.toString(),
      ...(business?.adminIds || []).map((admin: any) => admin?._id?.toString()),
      ...(business?.staffIds || []).map((staff: any) => staff?._id?.toString()),
    ].filter(Boolean)

    if (!memberIds.includes(body.memberId)) {
      throw new BadRequestException('Member does not belong to this business')
    }

    return this.chatService.createOrGetTeamChatRoom(
      businessId,
      ownerId,
      body.memberId,
      { name: body.memberName, email: body.memberEmail }
    )
  }

  // ================== BUSINESS OWNER/SUPER ADMIN SUPPORT CHAT ==================

  @Post('rooms/support')
  @Roles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create or get business support chat with super admin' })
  @ApiResponse({ status: 201, description: 'Support chat room created or retrieved' })
  async createBusinessSupportRoom(
    @BusinessId() businessId: string,
    @CurrentUser() user: any,
    @Body() body: { superAdminId?: string }
  ) {
    const ownerId = user?.sub || user?.userId || user?.id
    if (!ownerId) {
      throw new BadRequestException('Authenticated user is required')
    }

    const ownerInfo = {
      name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.name,
      email: user?.email,
    }

    return this.chatService.createOrGetBusinessSupportRoom(
      businessId,
      ownerId,
      ownerInfo,
      body?.superAdminId
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

  @Get('unread-counts')
  @ApiOperation({ summary: 'Get unread message counts for business' })
  @ApiResponse({ status: 200, description: 'Unread counts retrieved' })
  async getUnreadCounts(@BusinessId() businessId: string) {
    return this.chatService.getBusinessUnreadCounts(businessId)
  }

  @Get('rooms/:roomId')
  @Public()
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: 'Get a specific chat room' })
  @ApiResponse({ status: 200, description: 'Chat room retrieved' })
  async getChatRoom(
    @Param('roomId') roomId: string,
    @Query('userId') userId?: string,
    @CurrentUser() user?: any,
  ) {
    const room = await this.chatService.getRoomById(roomId)
    if (!room) {
      throw new BadRequestException('Chat room not found')
    }
    await this.assertRoomAccess(room, user, userId)
    return room
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
  @Public()
  @UseGuards(OptionalAuthGuard)
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
    },
    @CurrentUser() user?: any,
  ) {
    const room = await this.chatService.getRoomById(roomId)
    if (!room) {
      throw new BadRequestException('Chat room not found')
    }

    await this.assertRoomAccess(room, user, body.senderId)
    this.assertSenderType(room, user, body.senderType)

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
  @Public()
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: 'Get messages for a room' })
  @ApiResponse({ status: 200, description: 'Messages retrieved' })
  async getRoomMessages(
    @Param('roomId') roomId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('beforeMessageId') beforeMessageId?: string,
    @Query('userId') userId?: string,
    @Query('guestId') guestId?: string,
    @CurrentUser() user?: any,
  ) {
    const room = await this.chatService.getRoomById(roomId)
    if (!room) {
      throw new BadRequestException('Chat room not found')
    }

    // Use userId or guestId for access check
    await this.assertRoomAccess(room, user, userId || guestId)

    return this.chatService.getRoomMessages(roomId, {
      page,
      limit,
      beforeMessageId,
    })
  }

  @Put('rooms/:roomId/messages/read')
  @Public()
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: 'Mark messages as read' })
  @ApiResponse({ status: 200, description: 'Messages marked as read' })
  async markMessagesAsRead(
    @Param('roomId') roomId: string,
    @Body('userId') userId: string,
    @CurrentUser() user?: any,
  ) {
    const room = await this.chatService.getRoomById(roomId)
    if (!room) {
      throw new BadRequestException('Chat room not found')
    }

    const actorId = user?.sub || user?.userId || user?.id || userId
    await this.assertRoomAccess(room, user, actorId)

    await this.chatService.markMessagesAsRead(roomId, userId)
    return { success: true, message: 'Messages marked as read' }
  }

  private async resolveBusinessId(
    authBusinessId?: string,
    bodyBusinessId?: string,
    subdomain?: string,
  ): Promise<string> {
    if (authBusinessId) return authBusinessId
    if (bodyBusinessId) return bodyBusinessId

    if (!subdomain) {
      throw new BadRequestException('businessId or subdomain is required')
    }

    const business = await this.businessService.getBySubdomain(subdomain.toLowerCase())
    return business._id.toString()
  }

  private async assertRoomAccess(room: any, user?: any, guestOrUserId?: string) {
    const roomType = room?.roomType
    const userId = user?.sub || user?.userId || user?.id

    if (roomType === 'customer-support') {
      // Check for super admin first
      if (userId && user?.role === UserRole.SUPER_ADMIN) return

      // Check if authenticated user is a business member
      if (userId) {
        const business = await this.businessService.getById(room.businessId.toString())
        const memberIds = [
          business?.ownerId?._id?.toString(),
          ...(business?.adminIds || []).map((admin: any) => admin?._id?.toString()),
          ...(business?.staffIds || []).map((staff: any) => staff?._id?.toString()),
        ].filter(Boolean)

        if (memberIds.includes(userId)) return
      }

      // Check if authenticated user is the room owner (customer)
      if (userId && room?.metadata?.userId && room.metadata.userId === userId) return

      // Check if guestOrUserId matches the room's userId
      if (guestOrUserId && room?.metadata?.userId && room.metadata.userId === guestOrUserId) return

      // Check if guestOrUserId matches clientId (for booking-created rooms)
      if (guestOrUserId && room?.metadata?.clientId && room.metadata.clientId === guestOrUserId) return

      // Check if user email matches room email
      const userEmail = user?.email
      if (userEmail && room?.metadata?.email && room.metadata.email === userEmail) return
      if (userEmail && room?.metadata?.userEmail && room.metadata.userEmail === userEmail) return

      // Check for guest session/booking ID match
      const guestMatch = guestOrUserId && (
        guestOrUserId === room?.metadata?.guestInfo?.sessionId ||
        guestOrUserId === room?.metadata?.guestInfo?.bookingId ||
        guestOrUserId === room?.metadata?.guestInfo?.email ||
        guestOrUserId === room?.metadata?.email
      )

      if (guestMatch) return

      // If we have an authenticated customer but they don't own this room
      if (userId) {
        throw new BadRequestException('Access denied for this chat room')
      }

      // Guest access denied
      throw new BadRequestException('Guest access denied for this chat room. Please provide a valid userId or guestId.')
    }

    if (roomType === 'team-chat') {
      if (!userId) throw new BadRequestException('Authentication required')
      if (user?.role === UserRole.SUPER_ADMIN) return
      if (room?.metadata?.ownerId === userId || room?.metadata?.memberId === userId) return
      throw new BadRequestException('Access denied for this chat room')
    }

    if (roomType === 'admin-support') {
      if (!userId) throw new BadRequestException('Authentication required')
      if (user?.role === UserRole.SUPER_ADMIN) return
      if (room?.metadata?.ownerId === userId || room?.metadata?.superAdminId === userId) return
      throw new BadRequestException('Access denied for this chat room')
    }
  }

  private assertSenderType(room: any, user: any, senderType: string) {
    const roomType = room?.roomType
    const userRole = user?.role

    if (roomType === 'customer-support') {
      if (!userRole && senderType !== 'customer') {
        throw new BadRequestException('Only customers can send messages without authentication')
      }
      if (userRole && [UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN, UserRole.STAFF, UserRole.SUPER_ADMIN].includes(userRole)) {
        if (senderType === 'customer') {
          throw new BadRequestException('Business users cannot send customer messages')
        }
      }
      return
    }

    if (roomType === 'team-chat' || roomType === 'admin-support') {
      if (!userRole) {
        throw new BadRequestException('Authentication required')
      }
    }
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

  @Get('faqs')
  @Public()
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: 'Get all FAQs for business' })
  @ApiResponse({ status: 200, description: 'FAQs retrieved' })
  async getFAQs(
    @OptionalBusinessId() authBusinessId: string,
    @Query('businessId') queryBusinessId?: string,
    @Query('category') category?: string,
    @Query('isActive') isActive?: boolean
  ) {
    const businessId = authBusinessId || queryBusinessId
    if (!businessId) {
      throw new BadRequestException('businessId is required')
    }
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

  @Get('auto-responses')
  @Public()
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: 'Get all auto-responses for business' })
  @ApiResponse({ status: 200, description: 'Auto-responses retrieved' })
  async getAutoResponses(
    @OptionalBusinessId() authBusinessId: string,
    @Query('businessId') queryBusinessId?: string
  ) {
    const businessId = authBusinessId || queryBusinessId
    if (!businessId) {
      throw new BadRequestException('businessId is required')
    }
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

  @Post('rooms/:roomId/trigger-auto-response')
  @Public()
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: 'Manually trigger an auto-response in a chat room' })
  @ApiResponse({ status: 200, description: 'Auto-response triggered' })
  async triggerAutoResponse(
    @Param('roomId') roomId: string,
    @Body() body: { responseType: string; businessId?: string },
    @OptionalBusinessId() authBusinessId?: string
  ) {
    const room = await this.chatService.getRoomById(roomId)
    if (!room) {
      throw new BadRequestException('Chat room not found')
    }

    const businessId = authBusinessId || body.businessId || room?.businessId?.toString()
    if (!businessId) {
      throw new BadRequestException('businessId is required')
    }

    return this.chatService.triggerAutoResponse(roomId, businessId, body.responseType)
  }
}
