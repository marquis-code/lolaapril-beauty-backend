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
var ChatService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const chat_schema_1 = require("../schemas/chat.schema");
const realtime_gateway_1 = require("../gateways/realtime.gateway");
let ChatService = ChatService_1 = class ChatService {
    constructor(chatRoomModel, chatMessageModel, chatParticipantModel, faqModel, autoResponseModel, realtimeGateway) {
        this.chatRoomModel = chatRoomModel;
        this.chatMessageModel = chatMessageModel;
        this.chatParticipantModel = chatParticipantModel;
        this.faqModel = faqModel;
        this.autoResponseModel = autoResponseModel;
        this.realtimeGateway = realtimeGateway;
        this.logger = new common_1.Logger(ChatService_1.name);
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
            faqId: obj.faqId?.toString(),
            replyToMessageId: obj.replyToMessageId?.toString(),
            isEdited: obj.isEdited,
            isDeleted: obj.isDeleted,
            createdAt: obj.createdAt,
            updatedAt: obj.updatedAt,
            metadata: obj.metadata,
        };
    }
    async createOrGetCustomerChatRoom(businessId, userId, userInfo) {
        const isGuest = userInfo.isGuest || false;
        if (isGuest && !userInfo.email) {
            throw new Error('Email address is required for anonymous users');
        }
        if (userInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
            throw new Error('Please provide a valid email address');
        }
        let query = {
            businessId: new mongoose_2.Types.ObjectId(businessId),
            roomType: 'customer-support',
            isActive: true,
        };
        if (isGuest && userInfo.guestInfo?.sessionId) {
            query['metadata.guestInfo.sessionId'] = userInfo.guestInfo.sessionId;
        }
        else if (!isGuest) {
            query['metadata.userId'] = userId;
        }
        let room = await this.chatRoomModel.findOne(query).exec();
        if (!room) {
            const metadata = {
                userType: isGuest ? 'guest' : 'customer',
                userName: userInfo.name,
                userEmail: userInfo.email,
                userPhone: userInfo.phone,
                priority: 'medium',
                tags: isGuest ? ['new-guest', 'anonymous'] : ['new-customer'],
                isGuest,
            };
            if (!isGuest) {
                metadata.userId = userId;
            }
            if (isGuest && userInfo.guestInfo) {
                metadata.guestInfo = userInfo.guestInfo;
            }
            room = await this.chatRoomModel.create({
                businessId: new mongoose_2.Types.ObjectId(businessId),
                roomType: 'customer-support',
                roomName: `Chat with ${userInfo.name}${isGuest ? ' (Guest)' : ''}`,
                isActive: true,
                metadata,
            });
            await this.sendWelcomeMessage(room._id.toString(), businessId);
            this.realtimeGateway.notifyBusinessNewChat(businessId, {
                roomId: room._id.toString(),
                userName: userInfo.name,
                userEmail: userInfo.email,
                isGuest,
                timestamp: new Date(),
            });
            this.logger.log(`✅ Created new ${isGuest ? 'guest' : 'customer'} chat room ${room._id} for ${userId}`);
        }
        else {
            this.logger.log(`♻️ Found existing room ${room._id} for ${userId}`);
        }
        return room;
    }
    async getBusinessChatRooms(businessId, filters) {
        const { roomType, isActive, priority, page = 1, limit = 20 } = filters || {};
        const query = { businessId: new mongoose_2.Types.ObjectId(businessId) };
        if (roomType)
            query.roomType = roomType;
        if (isActive !== undefined)
            query.isActive = isActive;
        if (priority)
            query['metadata.priority'] = priority;
        const skip = (page - 1) * limit;
        const roomsPromise = this.chatRoomModel
            .find(query)
            .sort({ lastMessageAt: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        const totalPromise = this.chatRoomModel.countDocuments(query).exec();
        const [rooms, total] = await Promise.all([roomsPromise, totalPromise]);
        return {
            rooms,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async archiveChatRoom(roomId) {
        await this.chatRoomModel.findByIdAndUpdate(roomId, {
            isArchived: true,
            isActive: false,
        }).exec();
        this.logger.log(`📁 Archived chat room ${roomId}`);
    }
    async sendMessage(roomId, senderId, senderType, content, options) {
        const room = await this.chatRoomModel.findById(roomId).exec();
        if (!room) {
            throw new common_1.NotFoundException('Chat room not found');
        }
        const isGuestUser = senderId?.startsWith('guest_') || senderType === 'customer';
        const message = new this.chatMessageModel({
            roomId: new mongoose_2.Types.ObjectId(roomId),
            businessId: room.businessId,
            senderId: senderId && !isGuestUser && mongoose_2.Types.ObjectId.isValid(senderId)
                ? new mongoose_2.Types.ObjectId(senderId)
                : null,
            senderType,
            senderName: options?.senderName || 'User',
            messageType: options?.messageType || 'text',
            content,
            attachments: options?.attachments || [],
            isAutomated: options?.isAutomated || false,
            isFAQ: options?.isFAQ || false,
            faqId: options?.faqId ? new mongoose_2.Types.ObjectId(options.faqId) : null,
            replyToMessageId: options?.replyToMessageId ? new mongoose_2.Types.ObjectId(options.replyToMessageId) : null,
            metadata: {
                deliveryStatus: 'sent',
                language: 'en',
                ...(isGuestUser && senderId ? { guestId: senderId } : {}),
            },
        });
        await message.save();
        await this.chatRoomModel.findByIdAndUpdate(roomId, {
            lastMessageId: message._id,
            lastMessageAt: new Date(),
            $inc: { unreadCount: senderType === 'customer' ? 1 : 0 },
        }).exec();
        const serializedMessage = this.serializeMessage(message);
        this.realtimeGateway.emitChatMessage(roomId, serializedMessage);
        if (senderType === 'customer' && !options?.isAutomated) {
            this.handleIncomingCustomerMessage(roomId, content, room.businessId.toString())
                .catch(error => this.logger.error('Automation error:', error));
        }
        this.logger.log(`💬 Message sent in room ${roomId} by ${senderType}${isGuestUser ? ' (guest)' : ''}`);
        return message;
    }
    async getRoomMessages(roomId, options) {
        const { page = 1, limit = 50, beforeMessageId } = options || {};
        const query = { roomId: new mongoose_2.Types.ObjectId(roomId) };
        if (beforeMessageId) {
            query._id = { $lt: new mongoose_2.Types.ObjectId(beforeMessageId) };
        }
        const messages = await this.chatMessageModel
            .find(query)
            .sort({ createdAt: -1 })
            .limit(limit + 1)
            .exec();
        const hasMore = messages.length > limit;
        if (hasMore)
            messages.pop();
        return {
            messages: messages.reverse(),
            hasMore,
        };
    }
    async markMessagesAsRead(roomId, userId) {
        await this.chatMessageModel.updateMany({
            roomId: new mongoose_2.Types.ObjectId(roomId),
            isRead: false,
        }, {
            isRead: true,
            readAt: new Date(),
        }).exec();
        await this.chatRoomModel.findByIdAndUpdate(roomId, {
            unreadCount: 0,
        }).exec();
        this.logger.log(`✅ Messages marked as read in room ${roomId}`);
    }
    async handleIncomingCustomerMessage(roomId, message, businessId) {
        try {
            const isBusinessAvailable = await this.isBusinessAvailable(businessId);
            if (!isBusinessAvailable) {
                await this.sendOfflineAutoResponse(roomId, businessId);
                return;
            }
            const faqMatch = await this.findMatchingFAQ(message, businessId);
            if (faqMatch && faqMatch.confidence > 70) {
                await this.sendMessage(roomId, null, 'bot', faqMatch.faq.answer, {
                    senderName: 'Auto Assistant',
                    isAutomated: true,
                    isFAQ: true,
                    faqId: faqMatch.faq._id.toString(),
                });
                await this.faqModel.findByIdAndUpdate(faqMatch.faq._id, {
                    $inc: { usageCount: 1 },
                }).exec();
                setTimeout(() => {
                    this.sendMessage(roomId, null, 'bot', 'Was this answer helpful? If you need more assistance, please let me know!', {
                        senderName: 'Auto Assistant',
                        isAutomated: true,
                    });
                }, 2000);
                this.logger.log(`🤖 Sent FAQ auto-response for room ${roomId}`);
            }
            else {
                await this.sendMessage(roomId, null, 'bot', 'Thank you for your message! A team member will respond shortly. ⏰', {
                    senderName: 'Auto Assistant',
                    isAutomated: true,
                });
                this.realtimeGateway.notifyBusinessNewChat(businessId, {
                    roomId,
                    message,
                    requiresAttention: true,
                    timestamp: new Date(),
                });
            }
        }
        catch (error) {
            this.logger.error(`Error handling automated response: ${error.message}`);
        }
    }
    async findMatchingFAQ(message, businessId) {
        const messageLower = message.toLowerCase();
        const messageWords = messageLower.split(/\s+/);
        const faqs = await this.faqModel.find({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            isActive: true,
        }).sort({ priority: -1 }).exec();
        let bestMatch = null;
        let highestConfidence = 0;
        for (const faq of faqs) {
            let matchScore = 0;
            let totalKeywords = faq.keywords.length;
            for (const keyword of faq.keywords) {
                if (messageLower.includes(keyword.toLowerCase())) {
                    matchScore += 1;
                }
            }
            for (const altQuestion of faq.alternativeQuestions) {
                const similarity = this.calculateSimilarity(messageLower, altQuestion.toLowerCase());
                if (similarity > 0.7) {
                    matchScore += 2;
                    totalKeywords += 2;
                }
            }
            const confidence = totalKeywords > 0 ? (matchScore / totalKeywords) * 100 : 0;
            if (confidence > highestConfidence && confidence >= faq.confidenceThreshold) {
                highestConfidence = confidence;
                bestMatch = { faq, confidence };
            }
        }
        return bestMatch;
    }
    calculateSimilarity(str1, str2) {
        const words1 = str1.split(/\s+/);
        const words2 = str2.split(/\s+/);
        const commonWords = words1.filter(word => words2.includes(word));
        const similarity = (2 * commonWords.length) / (words1.length + words2.length);
        return similarity;
    }
    async sendWelcomeMessage(roomId, businessId) {
        const welcomeResponse = await this.autoResponseModel.findOne({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            responseType: 'welcome',
            isActive: true,
        }).exec();
        const message = welcomeResponse?.message ||
            'Hello! 👋 Welcome to our chat support. How can I help you today?';
        await this.sendMessage(roomId, null, 'bot', message, {
            senderName: 'Auto Assistant',
            isAutomated: true,
        });
    }
    async sendOfflineAutoResponse(roomId, businessId) {
        const offlineResponse = await this.autoResponseModel.findOne({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            responseType: 'offline',
            isActive: true,
        }).exec();
        const message = offlineResponse?.message ||
            "Thank you for reaching out! We're currently offline but will respond as soon as we're back online. ⏰";
        await this.sendMessage(roomId, null, 'bot', message, {
            senderName: 'Auto Assistant',
            isAutomated: true,
        });
        if (offlineResponse) {
            await this.autoResponseModel.findByIdAndUpdate(offlineResponse._id, {
                $inc: { usageCount: 1 },
            }).exec();
        }
    }
    async isBusinessAvailable(businessId) {
        const onlineStaffCount = this.realtimeGateway.getBusinessConnections(businessId);
        return onlineStaffCount > 0;
    }
    async createFAQ(faqData) {
        const faq = new this.faqModel({
            ...faqData,
            businessId: new mongoose_2.Types.ObjectId(faqData.businessId),
            alternativeQuestions: faqData.alternativeQuestions || [],
            confidenceThreshold: faqData.confidenceThreshold || 70,
            priority: faqData.priority || 0,
        });
        await faq.save();
        this.logger.log(`✅ Created FAQ: ${faq.question}`);
        return faq;
    }
    async getBusinessFAQs(businessId, options) {
        const query = { businessId: businessId };
        if (options?.category)
            query.category = options.category;
        if (options?.isActive !== undefined)
            query.isActive = options.isActive;
        return this.faqModel.find(query).sort({ priority: -1, usageCount: -1 }).exec();
    }
    async updateFAQ(faqId, updates) {
        return this.faqModel.findByIdAndUpdate(faqId, updates, { new: true }).exec();
    }
    async deleteFAQ(faqId) {
        await this.faqModel.findByIdAndUpdate(faqId, { isActive: false }).exec();
    }
    async createAutoResponse(responseData) {
        const autoResponse = new this.autoResponseModel({
            ...responseData,
            businessId: new mongoose_2.Types.ObjectId(responseData.businessId),
        });
        await autoResponse.save();
        this.logger.log(`✅ Created auto-response: ${autoResponse.name}`);
        return autoResponse;
    }
    async getBusinessAutoResponses(businessId) {
        return this.autoResponseModel.find({
            businessId: businessId,
            isActive: true,
        }).exec();
    }
    async updateAutoResponse(responseId, updates) {
        return this.autoResponseModel.findByIdAndUpdate(responseId, updates, { new: true }).exec();
    }
};
ChatService = ChatService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chat_schema_1.ChatRoom.name)),
    __param(1, (0, mongoose_1.InjectModel)(chat_schema_1.ChatMessage.name)),
    __param(2, (0, mongoose_1.InjectModel)(chat_schema_1.ChatParticipant.name)),
    __param(3, (0, mongoose_1.InjectModel)(chat_schema_1.FAQ.name)),
    __param(4, (0, mongoose_1.InjectModel)(chat_schema_1.AutoResponse.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        realtime_gateway_1.RealtimeGateway])
], ChatService);
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map