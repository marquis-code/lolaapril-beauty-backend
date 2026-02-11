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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const chat_service_1 = require("../services/chat.service");
const business_service_1 = require("../../business/business.service");
const auth_1 = require("../../auth");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_schema_1 = require("../../auth/schemas/user.schema");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const optional_auth_guard_1 = require("../../auth/guards/optional-auth.guard");
let ChatController = class ChatController {
    constructor(chatService, businessService) {
        this.chatService = chatService;
        this.businessService = businessService;
    }
    async createChatRoom(body, authBusinessId, user) {
        const resolvedUserId = body.userId || user?.sub || user?.userId || user?.id;
        const resolvedUserName = body.userName || (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.name);
        const resolvedUserEmail = body.userEmail || user?.email;
        const resolvedUserPhone = body.userPhone || user?.phone;
        if (!resolvedUserId || !resolvedUserName) {
            throw new common_1.BadRequestException('userId and userName are required');
        }
        const resolvedBusinessId = await this.resolveBusinessId(authBusinessId, body.businessId, body.subdomain);
        return this.chatService.createOrGetCustomerChatRoom(resolvedBusinessId, resolvedUserId, {
            name: resolvedUserName,
            email: resolvedUserEmail,
            phone: resolvedUserPhone,
            isGuest: body.isGuest ?? !user,
            guestInfo: body.guestInfo,
        });
    }
    async createTeamChatRoom(businessId, user, body) {
        const ownerId = user?.sub || user?.userId || user?.id;
        if (!ownerId) {
            throw new common_1.BadRequestException('Authenticated user is required');
        }
        const business = await this.businessService.getById(businessId);
        const memberIds = [
            business?.ownerId?._id?.toString(),
            ...(business?.adminIds || []).map((admin) => admin?._id?.toString()),
            ...(business?.staffIds || []).map((staff) => staff?._id?.toString()),
        ].filter(Boolean);
        if (!memberIds.includes(body.memberId)) {
            throw new common_1.BadRequestException('Member does not belong to this business');
        }
        return this.chatService.createOrGetTeamChatRoom(businessId, ownerId, body.memberId, { name: body.memberName, email: body.memberEmail });
    }
    async createBusinessSupportRoom(businessId, user, body) {
        const ownerId = user?.sub || user?.userId || user?.id;
        if (!ownerId) {
            throw new common_1.BadRequestException('Authenticated user is required');
        }
        const ownerInfo = {
            name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.name,
            email: user?.email,
        };
        return this.chatService.createOrGetBusinessSupportRoom(businessId, ownerId, ownerInfo, body?.superAdminId);
    }
    async getChatRooms(businessId, roomType, isActive, priority, page, limit) {
        return this.chatService.getBusinessChatRooms(businessId, {
            roomType,
            isActive,
            priority,
            page,
            limit,
        });
    }
    async getUnreadCounts(businessId) {
        return this.chatService.getBusinessUnreadCounts(businessId);
    }
    async getChatRoom(roomId, userId, user) {
        const room = await this.chatService.getRoomById(roomId);
        if (!room) {
            throw new common_1.BadRequestException('Chat room not found');
        }
        await this.assertRoomAccess(room, user, userId);
        return room;
    }
    async archiveChatRoom(roomId) {
        await this.chatService.archiveChatRoom(roomId);
        return { success: true, message: 'Chat room archived' };
    }
    async sendMessage(roomId, body, user) {
        const room = await this.chatService.getRoomById(roomId);
        if (!room) {
            throw new common_1.BadRequestException('Chat room not found');
        }
        await this.assertRoomAccess(room, user, body.senderId);
        this.assertSenderType(room, user, body.senderType);
        return this.chatService.sendMessage(roomId, body.senderId, body.senderType, body.content, {
            senderName: body.senderName,
            messageType: body.messageType,
            attachments: body.attachments,
            replyToMessageId: body.replyToMessageId,
        });
    }
    async getRoomMessages(roomId, page, limit, beforeMessageId, userId, guestId, user) {
        const room = await this.chatService.getRoomById(roomId);
        if (!room) {
            throw new common_1.BadRequestException('Chat room not found');
        }
        await this.assertRoomAccess(room, user, userId || guestId);
        return this.chatService.getRoomMessages(roomId, {
            page,
            limit,
            beforeMessageId,
        });
    }
    async markMessagesAsRead(roomId, userId, user) {
        const room = await this.chatService.getRoomById(roomId);
        if (!room) {
            throw new common_1.BadRequestException('Chat room not found');
        }
        const actorId = user?.sub || user?.userId || user?.id || userId;
        await this.assertRoomAccess(room, user, actorId);
        await this.chatService.markMessagesAsRead(roomId, userId);
        return { success: true, message: 'Messages marked as read' };
    }
    async resolveBusinessId(authBusinessId, bodyBusinessId, subdomain) {
        if (authBusinessId)
            return authBusinessId;
        if (bodyBusinessId)
            return bodyBusinessId;
        if (!subdomain) {
            throw new common_1.BadRequestException('businessId or subdomain is required');
        }
        const business = await this.businessService.getBySubdomain(subdomain.toLowerCase());
        return business._id.toString();
    }
    async assertRoomAccess(room, user, guestOrUserId) {
        const roomType = room?.roomType;
        const userId = user?.sub || user?.userId || user?.id;
        if (roomType === 'customer-support') {
            if (userId && user?.role === user_schema_1.UserRole.SUPER_ADMIN)
                return;
            if (userId) {
                const business = await this.businessService.getById(room.businessId.toString());
                const memberIds = [
                    business?.ownerId?._id?.toString(),
                    ...(business?.adminIds || []).map((admin) => admin?._id?.toString()),
                    ...(business?.staffIds || []).map((staff) => staff?._id?.toString()),
                ].filter(Boolean);
                if (memberIds.includes(userId))
                    return;
            }
            if (userId && room?.metadata?.userId && room.metadata.userId === userId)
                return;
            if (guestOrUserId && room?.metadata?.userId && room.metadata.userId === guestOrUserId)
                return;
            if (guestOrUserId && room?.metadata?.clientId && room.metadata.clientId === guestOrUserId)
                return;
            const userEmail = user?.email;
            if (userEmail && room?.metadata?.email && room.metadata.email === userEmail)
                return;
            if (userEmail && room?.metadata?.userEmail && room.metadata.userEmail === userEmail)
                return;
            const guestMatch = guestOrUserId && (guestOrUserId === room?.metadata?.guestInfo?.sessionId ||
                guestOrUserId === room?.metadata?.guestInfo?.bookingId ||
                guestOrUserId === room?.metadata?.guestInfo?.email ||
                guestOrUserId === room?.metadata?.email);
            if (guestMatch)
                return;
            if (userId) {
                throw new common_1.BadRequestException('Access denied for this chat room');
            }
            throw new common_1.BadRequestException('Guest access denied for this chat room. Please provide a valid userId or guestId.');
        }
        if (roomType === 'team-chat') {
            if (!userId)
                throw new common_1.BadRequestException('Authentication required');
            if (user?.role === user_schema_1.UserRole.SUPER_ADMIN)
                return;
            if (room?.metadata?.ownerId === userId || room?.metadata?.memberId === userId)
                return;
            throw new common_1.BadRequestException('Access denied for this chat room');
        }
        if (roomType === 'admin-support') {
            if (!userId)
                throw new common_1.BadRequestException('Authentication required');
            if (user?.role === user_schema_1.UserRole.SUPER_ADMIN)
                return;
            if (room?.metadata?.ownerId === userId || room?.metadata?.superAdminId === userId)
                return;
            throw new common_1.BadRequestException('Access denied for this chat room');
        }
    }
    assertSenderType(room, user, senderType) {
        const roomType = room?.roomType;
        const userRole = user?.role;
        if (roomType === 'customer-support') {
            if (!userRole && senderType !== 'customer') {
                throw new common_1.BadRequestException('Only customers can send messages without authentication');
            }
            if (userRole && [user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.STAFF, user_schema_1.UserRole.SUPER_ADMIN].includes(userRole)) {
                if (senderType === 'customer') {
                    throw new common_1.BadRequestException('Business users cannot send customer messages');
                }
            }
            return;
        }
        if (roomType === 'team-chat' || roomType === 'admin-support') {
            if (!userRole) {
                throw new common_1.BadRequestException('Authentication required');
            }
        }
    }
    async createFAQ(body, businessId) {
        return this.chatService.createFAQ({
            businessId,
            ...body,
        });
    }
    async getFAQs(authBusinessId, queryBusinessId, category, isActive) {
        const businessId = authBusinessId || queryBusinessId;
        if (!businessId) {
            throw new common_1.BadRequestException('businessId is required');
        }
        return this.chatService.getBusinessFAQs(businessId, {
            category,
            isActive,
        });
    }
    async updateFAQ(faqId, updates) {
        return this.chatService.updateFAQ(faqId, updates);
    }
    async deleteFAQ(faqId) {
        await this.chatService.deleteFAQ(faqId);
        return { success: true, message: 'FAQ deleted' };
    }
    async createAutoResponse(body, businessId) {
        return this.chatService.createAutoResponse({
            businessId,
            ...body,
        });
    }
    async getAutoResponses(authBusinessId, queryBusinessId) {
        const businessId = authBusinessId || queryBusinessId;
        if (!businessId) {
            throw new common_1.BadRequestException('businessId is required');
        }
        return this.chatService.getBusinessAutoResponses(businessId);
    }
    async updateAutoResponse(responseId, updates) {
        return this.chatService.updateAutoResponse(responseId, updates);
    }
    async triggerAutoResponse(roomId, body, authBusinessId) {
        const room = await this.chatService.getRoomById(roomId);
        if (!room) {
            throw new common_1.BadRequestException('Chat room not found');
        }
        const businessId = authBusinessId || body.businessId || room?.businessId?.toString();
        if (!businessId) {
            throw new common_1.BadRequestException('businessId is required');
        }
        return this.chatService.triggerAutoResponse(roomId, businessId, body.responseType);
    }
};
__decorate([
    (0, common_1.Post)('rooms/create'),
    (0, auth_1.Public)(),
    (0, common_1.UseGuards)(optional_auth_guard_1.OptionalAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create or get customer chat room' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Chat room created or retrieved' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_1.OptionalBusinessId)()),
    __param(2, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createChatRoom", null);
__decorate([
    (0, common_1.Post)('rooms/team'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.BUSINESS_ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create or get team chat with a team member' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Team chat room created or retrieved' }),
    __param(0, (0, auth_1.BusinessId)()),
    __param(1, (0, auth_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createTeamChatRoom", null);
__decorate([
    (0, common_1.Post)('rooms/support'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.BUSINESS_ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create or get business support chat with super admin' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Support chat room created or retrieved' }),
    __param(0, (0, auth_1.BusinessId)()),
    __param(1, (0, auth_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createBusinessSupportRoom", null);
__decorate([
    (0, common_1.Get)('rooms'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all chat rooms for business' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Chat rooms retrieved' }),
    __param(0, (0, auth_1.BusinessId)()),
    __param(1, (0, common_1.Query)('roomType')),
    __param(2, (0, common_1.Query)('isActive')),
    __param(3, (0, common_1.Query)('priority')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean, String, Number, Number]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChatRooms", null);
__decorate([
    (0, common_1.Get)('unread-counts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get unread message counts for business' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Unread counts retrieved' }),
    __param(0, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getUnreadCounts", null);
__decorate([
    (0, common_1.Get)('rooms/:roomId'),
    (0, auth_1.Public)(),
    (0, common_1.UseGuards)(optional_auth_guard_1.OptionalAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific chat room' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Chat room retrieved' }),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Query)('userId')),
    __param(2, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChatRoom", null);
__decorate([
    (0, common_1.Put)('rooms/:roomId/archive'),
    (0, swagger_1.ApiOperation)({ summary: 'Archive a chat room' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Chat room archived' }),
    __param(0, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "archiveChatRoom", null);
__decorate([
    (0, common_1.Post)('rooms/:roomId/messages'),
    (0, auth_1.Public)(),
    (0, common_1.UseGuards)(optional_auth_guard_1.OptionalAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Send a message in chat room' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Message sent' }),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('rooms/:roomId/messages'),
    (0, auth_1.Public)(),
    (0, common_1.UseGuards)(optional_auth_guard_1.OptionalAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get messages for a room' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Messages retrieved' }),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('beforeMessageId')),
    __param(4, (0, common_1.Query)('userId')),
    __param(5, (0, common_1.Query)('guestId')),
    __param(6, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getRoomMessages", null);
__decorate([
    (0, common_1.Put)('rooms/:roomId/messages/read'),
    (0, auth_1.Public)(),
    (0, common_1.UseGuards)(optional_auth_guard_1.OptionalAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Mark messages as read' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Messages marked as read' }),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Body)('userId')),
    __param(2, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "markMessagesAsRead", null);
__decorate([
    (0, common_1.Post)('faqs'),
    (0, swagger_1.ApiOperation)({ summary: 'Create FAQ' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'FAQ created' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createFAQ", null);
__decorate([
    (0, common_1.Get)('faqs'),
    (0, auth_1.Public)(),
    (0, common_1.UseGuards)(optional_auth_guard_1.OptionalAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get all FAQs for business' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'FAQs retrieved' }),
    __param(0, (0, auth_1.OptionalBusinessId)()),
    __param(1, (0, common_1.Query)('businessId')),
    __param(2, (0, common_1.Query)('category')),
    __param(3, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getFAQs", null);
__decorate([
    (0, common_1.Put)('faqs/:faqId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update FAQ' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'FAQ updated' }),
    __param(0, (0, common_1.Param)('faqId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "updateFAQ", null);
__decorate([
    (0, common_1.Delete)('faqs/:faqId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete FAQ' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'FAQ deleted' }),
    __param(0, (0, common_1.Param)('faqId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "deleteFAQ", null);
__decorate([
    (0, common_1.Post)('auto-responses'),
    (0, swagger_1.ApiOperation)({ summary: 'Create auto-response' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Auto-response created' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createAutoResponse", null);
__decorate([
    (0, common_1.Get)('auto-responses'),
    (0, auth_1.Public)(),
    (0, common_1.UseGuards)(optional_auth_guard_1.OptionalAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get all auto-responses for business' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Auto-responses retrieved' }),
    __param(0, (0, auth_1.OptionalBusinessId)()),
    __param(1, (0, common_1.Query)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getAutoResponses", null);
__decorate([
    (0, common_1.Put)('auto-responses/:responseId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update auto-response' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Auto-response updated' }),
    __param(0, (0, common_1.Param)('responseId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "updateAutoResponse", null);
__decorate([
    (0, common_1.Post)('rooms/:roomId/trigger-auto-response'),
    (0, auth_1.Public)(),
    (0, common_1.UseGuards)(optional_auth_guard_1.OptionalAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Manually trigger an auto-response in a chat room' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Auto-response triggered' }),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, auth_1.OptionalBusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "triggerAutoResponse", null);
ChatController = __decorate([
    (0, swagger_1.ApiTags)('Chat'),
    (0, common_1.Controller)('chat'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        business_service_1.BusinessService])
], ChatController);
exports.ChatController = ChatController;
//# sourceMappingURL=chat.controller.js.map