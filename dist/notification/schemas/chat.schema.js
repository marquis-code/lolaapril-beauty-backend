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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoResponseSchema = exports.AutoResponse = exports.FAQSchema = exports.FAQ = exports.ChatParticipantSchema = exports.ChatParticipant = exports.ChatMessageSchema = exports.ChatMessage = exports.ChatRoomSchema = exports.ChatRoom = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ChatRoom = class ChatRoom {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ChatRoom.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, enum: ['customer-support', 'team-chat', 'staff-chat', 'admin-support'] }),
    __metadata("design:type", String)
], ChatRoom.prototype, "roomType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], ChatRoom.prototype, "roomName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], ChatRoom.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], ChatRoom.prototype, "isArchived", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ChatRoom.prototype, "lastMessageId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], ChatRoom.prototype, "lastMessageAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], ChatRoom.prototype, "unreadCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], ChatRoom.prototype, "metadata", void 0);
ChatRoom = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ChatRoom);
exports.ChatRoom = ChatRoom;
exports.ChatRoomSchema = mongoose_1.SchemaFactory.createForClass(ChatRoom);
exports.ChatRoomSchema.index({ businessId: 1, roomType: 1 });
exports.ChatRoomSchema.index({ businessId: 1, isActive: 1 });
exports.ChatRoomSchema.index({ 'metadata.userId': 1 });
exports.ChatRoomSchema.index({ lastMessageAt: -1 });
let ChatMessage = class ChatMessage {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'ChatRoom', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ChatMessage.prototype, "roomId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ChatMessage.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: false }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ChatMessage.prototype, "senderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, enum: ['customer', 'staff', 'system', 'bot'] }),
    __metadata("design:type", String)
], ChatMessage.prototype, "senderType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ChatMessage.prototype, "senderName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, enum: ['text', 'image', 'file', 'audio', 'video', 'system', 'faq-response'] }),
    __metadata("design:type", String)
], ChatMessage.prototype, "messageType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], ChatMessage.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], ChatMessage.prototype, "attachments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], ChatMessage.prototype, "isRead", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], ChatMessage.prototype, "readAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], ChatMessage.prototype, "isAutomated", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], ChatMessage.prototype, "isFAQ", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'FAQ' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ChatMessage.prototype, "faqId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'ChatMessage' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ChatMessage.prototype, "replyToMessageId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], ChatMessage.prototype, "isEdited", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], ChatMessage.prototype, "isDeleted", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], ChatMessage.prototype, "metadata", void 0);
ChatMessage = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ChatMessage);
exports.ChatMessage = ChatMessage;
exports.ChatMessageSchema = mongoose_1.SchemaFactory.createForClass(ChatMessage);
exports.ChatMessageSchema.index({ roomId: 1, createdAt: -1 });
exports.ChatMessageSchema.index({ businessId: 1, createdAt: -1 });
exports.ChatMessageSchema.index({ senderId: 1 });
exports.ChatMessageSchema.index({ isRead: 1 });
exports.ChatMessageSchema.index({ 'metadata.guestId': 1 });
let ChatParticipant = class ChatParticipant {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'ChatRoom', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ChatParticipant.prototype, "roomId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ChatParticipant.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, enum: ['customer', 'staff', 'admin'] }),
    __metadata("design:type", String)
], ChatParticipant.prototype, "participantType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], ChatParticipant.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], ChatParticipant.prototype, "lastSeenAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], ChatParticipant.prototype, "joinedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], ChatParticipant.prototype, "leftAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], ChatParticipant.prototype, "unreadCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], ChatParticipant.prototype, "notificationsEnabled", void 0);
ChatParticipant = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ChatParticipant);
exports.ChatParticipant = ChatParticipant;
exports.ChatParticipantSchema = mongoose_1.SchemaFactory.createForClass(ChatParticipant);
exports.ChatParticipantSchema.index({ roomId: 1, userId: 1 }, { unique: true });
exports.ChatParticipantSchema.index({ userId: 1, isActive: 1 });
let FAQ = class FAQ {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], FAQ.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], FAQ.prototype, "question", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], FAQ.prototype, "answer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], FAQ.prototype, "keywords", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], FAQ.prototype, "alternativeQuestions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], FAQ.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], FAQ.prototype, "usageCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], FAQ.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0, min: 0, max: 100 }),
    __metadata("design:type", Number)
], FAQ.prototype, "confidenceThreshold", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], FAQ.prototype, "priority", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], FAQ.prototype, "metadata", void 0);
FAQ = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], FAQ);
exports.FAQ = FAQ;
exports.FAQSchema = mongoose_1.SchemaFactory.createForClass(FAQ);
exports.FAQSchema.index({ businessId: 1, isActive: 1 });
exports.FAQSchema.index({ keywords: 1 });
exports.FAQSchema.index({ category: 1 });
exports.FAQSchema.index({ priority: -1 });
let AutoResponse = class AutoResponse {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AutoResponse.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], AutoResponse.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, enum: ['welcome', 'offline', 'busy', 'away', 'closing-soon', 'holiday', 'custom'] }),
    __metadata("design:type", String)
], AutoResponse.prototype, "responseType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], AutoResponse.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], AutoResponse.prototype, "trigger", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], AutoResponse.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], AutoResponse.prototype, "includeBusinessHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], AutoResponse.prototype, "includeEstimatedWaitTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], AutoResponse.prototype, "quickReplies", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], AutoResponse.prototype, "usageCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], AutoResponse.prototype, "metadata", void 0);
AutoResponse = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], AutoResponse);
exports.AutoResponse = AutoResponse;
exports.AutoResponseSchema = mongoose_1.SchemaFactory.createForClass(AutoResponse);
exports.AutoResponseSchema.index({ businessId: 1, isActive: 1 });
exports.AutoResponseSchema.index({ responseType: 1 });
//# sourceMappingURL=chat.schema.js.map