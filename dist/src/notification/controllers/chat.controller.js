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
const auth_1 = require("../../auth");
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async createChatRoom(body, businessId) {
        return this.chatService.createOrGetCustomerChatRoom(businessId, body.userId, {
            name: body.userName,
            email: body.userEmail,
            phone: body.userPhone,
        });
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
    async archiveChatRoom(roomId) {
        await this.chatService.archiveChatRoom(roomId);
        return { success: true, message: 'Chat room archived' };
    }
    async sendMessage(roomId, body) {
        return this.chatService.sendMessage(roomId, body.senderId, body.senderType, body.content, {
            senderName: body.senderName,
            messageType: body.messageType,
            attachments: body.attachments,
            replyToMessageId: body.replyToMessageId,
        });
    }
    async getRoomMessages(roomId, page, limit, beforeMessageId) {
        return this.chatService.getRoomMessages(roomId, {
            page,
            limit,
            beforeMessageId,
        });
    }
    async markMessagesAsRead(roomId, userId) {
        await this.chatService.markMessagesAsRead(roomId, userId);
        return { success: true, message: 'Messages marked as read' };
    }
    async createFAQ(body, businessId) {
        return this.chatService.createFAQ({
            businessId,
            ...body,
        });
    }
    async getFAQs(businessId, category, isActive) {
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
    async getAutoResponses(businessId) {
        return this.chatService.getBusinessAutoResponses(businessId);
    }
    async updateAutoResponse(responseId, updates) {
        return this.chatService.updateAutoResponse(responseId, updates);
    }
};
__decorate([
    (0, common_1.Post)('rooms/create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create or get customer chat room' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Chat room created or retrieved' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createChatRoom", null);
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
    (0, swagger_1.ApiOperation)({ summary: 'Send a message in chat room' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Message sent' }),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('rooms/:roomId/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Get messages for a room' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Messages retrieved' }),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('beforeMessageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getRoomMessages", null);
__decorate([
    (0, common_1.Put)('rooms/:roomId/messages/read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark messages as read' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Messages marked as read' }),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
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
    (0, auth_1.Public)(),
    (0, common_1.Get)('faqs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all FAQs for business' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'FAQs retrieved' }),
    __param(0, (0, auth_1.BusinessId)()),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean]),
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
    (0, auth_1.Public)(),
    (0, common_1.Get)('auto-responses'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all auto-responses for business' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Auto-responses retrieved' }),
    __param(0, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
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
ChatController = __decorate([
    (0, swagger_1.ApiTags)('Chat'),
    (0, common_1.Controller)('chat'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
exports.ChatController = ChatController;
//# sourceMappingURL=chat.controller.js.map