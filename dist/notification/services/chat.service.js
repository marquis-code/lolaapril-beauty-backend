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
const user_schema_1 = require("../../auth/schemas/user.schema");
let ChatService = ChatService_1 = class ChatService {
    constructor(chatRoomModel, chatMessageModel, chatParticipantModel, faqModel, autoResponseModel, userModel, realtimeGateway) {
        this.chatRoomModel = chatRoomModel;
        this.chatMessageModel = chatMessageModel;
        this.chatParticipantModel = chatParticipantModel;
        this.faqModel = faqModel;
        this.autoResponseModel = autoResponseModel;
        this.userModel = userModel;
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
        let room = null;
        const businessObjectId = new mongoose_2.Types.ObjectId(businessId);
        if (userId && !userId.startsWith('guest_')) {
            room = await this.chatRoomModel.findOne({
                businessId: businessObjectId,
                roomType: 'customer-support',
                isActive: true,
                'metadata.userId': userId,
            }).exec();
        }
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
            }).exec();
            if (room && userId && !userId.startsWith('guest_') && !room.metadata?.userId) {
                await this.chatRoomModel.findByIdAndUpdate(room._id, {
                    'metadata.userId': userId,
                    'metadata.userType': 'customer',
                    'metadata.isGuest': false,
                }).exec();
                this.logger.log(`🔗 Linked existing room ${room._id} to user ${userId}`);
            }
        }
        if (!room && isGuest && userInfo.guestInfo?.sessionId) {
            room = await this.chatRoomModel.findOne({
                businessId: businessObjectId,
                roomType: 'customer-support',
                isActive: true,
                'metadata.guestInfo.sessionId': userInfo.guestInfo.sessionId,
            }).exec();
        }
        if (!room) {
            const metadata = {
                userType: isGuest ? 'guest' : 'customer',
                userName: userInfo.name,
                userEmail: userInfo.email,
                email: userInfo.email,
                userPhone: userInfo.phone,
                priority: 'medium',
                tags: isGuest ? ['new-guest', 'anonymous'] : ['new-customer'],
                isGuest,
            };
            if (!isGuest && userId) {
                metadata.userId = userId;
            }
            if (isGuest && userInfo.guestInfo) {
                metadata.guestInfo = {
                    ...userInfo.guestInfo,
                    email: userInfo.email,
                };
            }
            room = await this.chatRoomModel.create({
                businessId: businessObjectId,
                roomType: 'customer-support',
                roomName: `Chat with ${userInfo.name}${isGuest ? ' (Guest)' : ''}`,
                isActive: true,
                metadata,
            });
            await this.sendWelcomeMessage(room._id.toString(), businessId);
            await this.sendMessage(room._id.toString(), '', 'system', `New customer chat started by ${userInfo.name}${userInfo.email ? ` (${userInfo.email})` : ''}.`, {
                senderName: 'System',
                messageType: 'system',
                isAutomated: true,
            });
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
    async getRoomById(roomId) {
        return this.chatRoomModel.findById(roomId).lean().exec();
    }
    async createOrGetTeamChatRoom(businessId, ownerId, memberId, memberInfo) {
        if (!ownerId || !memberId) {
            throw new common_1.BadRequestException('ownerId and memberId are required');
        }
        const query = {
            businessId: new mongoose_2.Types.ObjectId(businessId),
            roomType: 'team-chat',
            isActive: true,
            'metadata.ownerId': ownerId,
            'metadata.memberId': memberId,
        };
        let room = await this.chatRoomModel.findOne(query).exec();
        if (!room) {
            room = await this.chatRoomModel.create({
                businessId: new mongoose_2.Types.ObjectId(businessId),
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
            });
        }
        return room;
    }
    async createOrGetBusinessSupportRoom(businessId, ownerId, ownerInfo, superAdminId) {
        if (!ownerId) {
            throw new common_1.BadRequestException('ownerId is required');
        }
        let resolvedSuperAdminId = superAdminId;
        if (!resolvedSuperAdminId) {
            const superAdmin = await this.userModel.findOne({ role: user_schema_1.UserRole.SUPER_ADMIN }).lean().exec();
            if (!superAdmin) {
                throw new common_1.NotFoundException('No super admin found');
            }
            resolvedSuperAdminId = superAdmin._id.toString();
        }
        const query = {
            businessId: new mongoose_2.Types.ObjectId(businessId),
            roomType: 'admin-support',
            isActive: true,
            'metadata.ownerId': ownerId,
            'metadata.superAdminId': resolvedSuperAdminId,
        };
        let room = await this.chatRoomModel.findOne(query).exec();
        if (!room) {
            room = await this.chatRoomModel.create({
                businessId: new mongoose_2.Types.ObjectId(businessId),
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
            });
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
    async getBusinessUnreadCounts(businessId) {
        const rooms = await this.chatRoomModel.find({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            isActive: true,
            unreadCount: { $gt: 0 },
        })
            .select('_id unreadCount lastMessageAt metadata')
            .sort({ lastMessageAt: -1 })
            .limit(50)
            .lean()
            .exec();
        const totalUnread = rooms.reduce((sum, room) => sum + (room.unreadCount || 0), 0);
        return {
            totalUnread,
            roomsWithUnread: rooms.length,
            rooms: rooms.map((room) => ({
                roomId: room._id.toString(),
                unreadCount: room.unreadCount || 0,
                lastMessageAt: room.lastMessageAt,
                customerName: room.metadata?.userName || room.metadata?.name || 'Unknown',
            })),
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
            this.logger.log(`🤖 Processing automation for message: "${message.substring(0, 50)}..."`);
            const faqMatch = await this.findMatchingFAQ(message, businessId);
            if (faqMatch && faqMatch.confidence >= 50) {
                await this.sendMessage(roomId, null, 'bot', faqMatch.faq.answer, {
                    senderName: 'Auto Assistant',
                    isAutomated: true,
                    isFAQ: true,
                    faqId: faqMatch.faq._id.toString(),
                });
                await this.faqModel.findByIdAndUpdate(faqMatch.faq._id, {
                    $inc: { usageCount: 1 },
                }).exec();
                this.logger.log(`🤖 FAQ auto-response sent (confidence: ${faqMatch.confidence.toFixed(1)}%)`);
                setTimeout(async () => {
                    try {
                        await this.sendMessage(roomId, null, 'bot', 'Was this answer helpful? If you need more assistance, a team member will be happy to help!', {
                            senderName: 'Auto Assistant',
                            isAutomated: true,
                        });
                    }
                    catch (err) {
                        this.logger.error('Error sending follow-up message:', err);
                    }
                }, 2000);
                return;
            }
            const isBusinessAvailable = await this.isBusinessAvailable(businessId);
            if (!isBusinessAvailable) {
                await this.sendOfflineAutoResponse(roomId, businessId);
                return;
            }
            await this.sendMessage(roomId, null, 'bot', 'Thank you for your message! A team member will respond shortly. ⏰', {
                senderName: 'Auto Assistant',
                isAutomated: true,
            });
            try {
                this.realtimeGateway.notifyBusinessNewChat(businessId, {
                    roomId,
                    message,
                    requiresAttention: true,
                    timestamp: new Date(),
                });
            }
            catch (notifyError) {
                this.logger.warn('Could not notify business staff:', notifyError.message);
            }
        }
        catch (error) {
            this.logger.error(`Error handling automated response: ${error.message}`);
        }
    }
    async findMatchingFAQ(message, businessId) {
        const messageLower = message.toLowerCase().trim();
        const messageWords = messageLower.split(/\s+/).filter(w => w.length > 2);
        const faqs = await this.faqModel.find({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            isActive: true,
        }).sort({ priority: -1 }).exec();
        if (faqs.length === 0) {
            this.logger.log('📋 No FAQs configured for this business');
            return null;
        }
        let bestMatch = null;
        let highestConfidence = 0;
        for (const faq of faqs) {
            let matchScore = 0;
            let maxPossibleScore = 0;
            if (faq.keywords && faq.keywords.length > 0) {
                maxPossibleScore += faq.keywords.length;
                for (const keyword of faq.keywords) {
                    const keywordLower = keyword.toLowerCase();
                    if (messageLower.includes(keywordLower)) {
                        matchScore += 1;
                    }
                }
            }
            const questionSimilarity = this.calculateSimilarity(messageLower, faq.question.toLowerCase());
            if (questionSimilarity > 0.5) {
                matchScore += questionSimilarity * 3;
                maxPossibleScore += 3;
            }
            else {
                maxPossibleScore += 3;
            }
            if (faq.alternativeQuestions && faq.alternativeQuestions.length > 0) {
                for (const altQuestion of faq.alternativeQuestions) {
                    const similarity = this.calculateSimilarity(messageLower, altQuestion.toLowerCase());
                    if (similarity > 0.6) {
                        matchScore += similarity * 2;
                    }
                }
                maxPossibleScore += 2;
            }
            const confidence = maxPossibleScore > 0 ? (matchScore / maxPossibleScore) * 100 : 0;
            this.logger.debug(`FAQ "${faq.question.substring(0, 30)}..." - Score: ${matchScore.toFixed(2)}/${maxPossibleScore}, Confidence: ${confidence.toFixed(1)}%`);
            const threshold = faq.confidenceThreshold || 50;
            if (confidence > highestConfidence && confidence >= threshold) {
                highestConfidence = confidence;
                bestMatch = { faq, confidence };
            }
        }
        if (bestMatch) {
            this.logger.log(`✅ FAQ Match found: "${bestMatch.faq.question.substring(0, 40)}..." with ${bestMatch.confidence.toFixed(1)}% confidence`);
        }
        else {
            this.logger.log(`❌ No FAQ match found for: "${messageLower.substring(0, 40)}..."`);
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
        const query = { businessId: new mongoose_2.Types.ObjectId(businessId) };
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
            businessId: new mongoose_2.Types.ObjectId(businessId),
            isActive: true,
        }).exec();
    }
    async updateAutoResponse(responseId, updates) {
        return this.autoResponseModel.findByIdAndUpdate(responseId, updates, { new: true }).exec();
    }
    async triggerAutoResponse(roomId, businessId, responseType) {
        const autoResponse = await this.autoResponseModel.findOne({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            responseType: responseType,
            isActive: true,
        }).exec();
        if (!autoResponse) {
            return {
                success: false,
                message: `No active auto-response found for type: ${responseType}`,
                availableTypes: ['welcome', 'offline', 'busy', 'away', 'closing-soon', 'holiday', 'custom'],
            };
        }
        const message = await this.sendMessage(roomId, null, 'bot', autoResponse.message, {
            senderName: 'Auto Assistant',
            isAutomated: true,
        });
        await this.autoResponseModel.findByIdAndUpdate(autoResponse._id, {
            $inc: { usageCount: 1 },
        }).exec();
        this.logger.log(`✅ Triggered auto-response: ${autoResponse.name} (${responseType})`);
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
        };
    }
};
ChatService = ChatService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chat_schema_1.ChatRoom.name)),
    __param(1, (0, mongoose_1.InjectModel)(chat_schema_1.ChatMessage.name)),
    __param(2, (0, mongoose_1.InjectModel)(chat_schema_1.ChatParticipant.name)),
    __param(3, (0, mongoose_1.InjectModel)(chat_schema_1.FAQ.name)),
    __param(4, (0, mongoose_1.InjectModel)(chat_schema_1.AutoResponse.name)),
    __param(5, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        realtime_gateway_1.RealtimeGateway])
], ChatService);
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map