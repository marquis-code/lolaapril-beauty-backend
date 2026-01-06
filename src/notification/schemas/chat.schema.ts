import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type ChatRoomDocument = ChatRoom & Document
export type ChatMessageDocument = ChatMessage & Document
export type ChatParticipantDocument = ChatParticipant & Document
export type FAQDocument = FAQ & Document
export type AutoResponseDocument = AutoResponse & Document

// ================== CHAT ROOM SCHEMA ==================
@Schema({ timestamps: true })
export class ChatRoom {
  @Prop({ type: Types.ObjectId, ref: 'Business', required: true, index: true })
  businessId: Types.ObjectId

  @Prop({ type: String, required: true, enum: ['customer-support', 'team-chat', 'staff-chat'] })
  roomType: string

  @Prop({ type: String, required: true })
  roomName: string

  @Prop({ type: Boolean, default: true })
  isActive: boolean

  @Prop({ type: Boolean, default: false })
  isArchived: boolean

  @Prop({ type: Types.ObjectId })
  lastMessageId: Types.ObjectId

  @Prop({ type: Date })
  lastMessageAt: Date

  @Prop({ type: Number, default: 0 })
  unreadCount: number

  @Prop({ type: Object, default: {} })
  metadata: {
    userType?: string // 'customer', 'staff', 'team'
    userId?: string
    userName?: string
    userEmail?: string
    userPhone?: string
    assignedStaffId?: string
    assignedStaffName?: string
    priority?: 'low' | 'medium' | 'high' | 'urgent'
    tags?: string[]
    customerLocation?: string
    lastSeen?: Date
  }
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom)

// Indexes for chat rooms
ChatRoomSchema.index({ businessId: 1, roomType: 1 })
ChatRoomSchema.index({ businessId: 1, isActive: 1 })
ChatRoomSchema.index({ 'metadata.userId': 1 })
ChatRoomSchema.index({ lastMessageAt: -1 })

// ================== CHAT MESSAGE SCHEMA ==================
// @Schema({ timestamps: true })
// export class ChatMessage {
//   @Prop({ type: Types.ObjectId, ref: 'ChatRoom', required: true, index: true })
//   roomId: Types.ObjectId

//   @Prop({ type: Types.ObjectId, ref: 'Business', required: true, index: true })
//   businessId: Types.ObjectId

//   @Prop({ type: Types.ObjectId, ref: 'User' })
//   senderId: Types.ObjectId

//   @Prop({ type: String, required: true, enum: ['customer', 'staff', 'system', 'bot'] })
//   senderType: string

//   @Prop({ type: String })
//   senderName: string

//   @Prop({ type: String, required: true, enum: ['text', 'image', 'file', 'audio', 'video', 'system', 'faq-response'] })
//   messageType: string

//   @Prop({ type: String, required: true })
//   content: string

//   @Prop({ type: [String], default: [] })
//   attachments: string[]

//   @Prop({ type: Boolean, default: false })
//   isRead: boolean

//   @Prop({ type: Date })
//   readAt: Date

//   @Prop({ type: Boolean, default: false })
//   isAutomated: boolean

//   @Prop({ type: Boolean, default: false })
//   isFAQ: boolean

//   @Prop({ type: Types.ObjectId, ref: 'FAQ' })
//   faqId: Types.ObjectId

//   @Prop({ type: Types.ObjectId, ref: 'ChatMessage' })
//   replyToMessageId: Types.ObjectId

//   @Prop({ type: Boolean, default: false })
//   isEdited: boolean

//   @Prop({ type: Boolean, default: false })
//   isDeleted: boolean

//   @Prop({ type: Object })
//   metadata: {
//     deliveryStatus?: 'sent' | 'delivered' | 'read' | 'failed'
//     language?: string
//     sentiment?: 'positive' | 'negative' | 'neutral'
//     priority?: 'low' | 'medium' | 'high'
//     tags?: string[]
//   }
// }

// export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage)

// // Indexes for chat messages
// ChatMessageSchema.index({ roomId: 1, createdAt: -1 })
// ChatMessageSchema.index({ businessId: 1, createdAt: -1 })
// ChatMessageSchema.index({ senderId: 1 })
// ChatMessageSchema.index({ isRead: 1 })

// ================== CHAT MESSAGE SCHEMA ==================
@Schema({ timestamps: true })
export class ChatMessage {
  @Prop({ type: Types.ObjectId, ref: 'ChatRoom', required: true, index: true })
  roomId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Business', required: true, index: true })
  businessId: Types.ObjectId

  // ✅ FIX: Make senderId optional (null for guest users)
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  senderId: Types.ObjectId

  @Prop({ type: String, required: true, enum: ['customer', 'staff', 'system', 'bot'] })
  senderType: string

  @Prop({ type: String })
  senderName: string

  @Prop({ type: String, required: true, enum: ['text', 'image', 'file', 'audio', 'video', 'system', 'faq-response'] })
  messageType: string

  @Prop({ type: String, required: true })
  content: string

  @Prop({ type: [String], default: [] })
  attachments: string[]

  @Prop({ type: Boolean, default: false })
  isRead: boolean

  @Prop({ type: Date })
  readAt: Date

  @Prop({ type: Boolean, default: false })
  isAutomated: boolean

  @Prop({ type: Boolean, default: false })
  isFAQ: boolean

  @Prop({ type: Types.ObjectId, ref: 'FAQ' })
  faqId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'ChatMessage' })
  replyToMessageId: Types.ObjectId

  @Prop({ type: Boolean, default: false })
  isEdited: boolean

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean

  @Prop({ type: Object })
  metadata: {
    deliveryStatus?: 'sent' | 'delivered' | 'read' | 'failed'
    language?: string
    sentiment?: 'positive' | 'negative' | 'neutral'
    priority?: 'low' | 'medium' | 'high'
    tags?: string[]
    guestId?: string // ✅ Store guest ID here for guest users
  }
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage)

// Indexes for chat messages
ChatMessageSchema.index({ roomId: 1, createdAt: -1 })
ChatMessageSchema.index({ businessId: 1, createdAt: -1 })
ChatMessageSchema.index({ senderId: 1 })
ChatMessageSchema.index({ isRead: 1 })
// ✅ Add index for guest messages
ChatMessageSchema.index({ 'metadata.guestId': 1 })

// ================== CHAT PARTICIPANT SCHEMA ==================
@Schema({ timestamps: true })
export class ChatParticipant {
  @Prop({ type: Types.ObjectId, ref: 'ChatRoom', required: true, index: true })
  roomId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId

  @Prop({ type: String, required: true, enum: ['customer', 'staff', 'admin'] })
  participantType: string

  @Prop({ type: Boolean, default: true })
  isActive: boolean

  @Prop({ type: Date })
  lastSeenAt: Date

  @Prop({ type: Date })
  joinedAt: Date

  @Prop({ type: Date })
  leftAt: Date

  @Prop({ type: Number, default: 0 })
  unreadCount: number

  @Prop({ type: Boolean, default: true })
  notificationsEnabled: boolean
}

export const ChatParticipantSchema = SchemaFactory.createForClass(ChatParticipant)

// Indexes for participants
ChatParticipantSchema.index({ roomId: 1, userId: 1 }, { unique: true })
ChatParticipantSchema.index({ userId: 1, isActive: 1 })

// ================== FAQ SCHEMA ==================
@Schema({ timestamps: true })
export class FAQ {
  @Prop({ type: Types.ObjectId, ref: 'Business', required: true, index: true })
  businessId: Types.ObjectId

  @Prop({ type: String, required: true })
  question: string

  @Prop({ type: String, required: true })
  answer: string

  @Prop({ type: [String], default: [] })
  keywords: string[]

  @Prop({ type: [String], default: [] })
  alternativeQuestions: string[]

  @Prop({ type: String })
  category: string

  @Prop({ type: Number, default: 0 })
  usageCount: number

  @Prop({ type: Boolean, default: true })
  isActive: boolean

  @Prop({ type: Number, default: 0, min: 0, max: 100 })
  confidenceThreshold: number // Minimum match percentage to auto-respond

  @Prop({ type: Number, default: 0 })
  priority: number // Higher priority FAQs are checked first

  @Prop({ type: Object })
  metadata: {
    attachments?: string[]
    relatedLinks?: string[]
    tags?: string[]
    language?: string
  }
}

export const FAQSchema = SchemaFactory.createForClass(FAQ)

// Indexes for FAQs
FAQSchema.index({ businessId: 1, isActive: 1 })
FAQSchema.index({ keywords: 1 })
FAQSchema.index({ category: 1 })
FAQSchema.index({ priority: -1 })

// ================== AUTO RESPONSE SCHEMA ==================
@Schema({ timestamps: true })
export class AutoResponse {
  @Prop({ type: Types.ObjectId, ref: 'Business', required: true, index: true })
  businessId: Types.ObjectId

  @Prop({ type: String, required: true })
  name: string

  @Prop({ type: String, required: true, enum: ['welcome', 'offline', 'busy', 'away', 'closing-soon', 'holiday', 'custom'] })
  responseType: string

  @Prop({ type: String, required: true })
  message: string

  @Prop({ type: Object })
  trigger: {
    event?: 'user-joined' | 'after-hours' | 'no-staff-available' | 'high-load' | 'manual'
    conditions?: {
      dayOfWeek?: number[] // 0-6, where 0 is Sunday
      timeRange?: { start: string, end: string }
      maxWaitTime?: number // in seconds
      queueSize?: number
    }
  }

  @Prop({ type: Boolean, default: true })
  isActive: boolean

  @Prop({ type: Boolean, default: false })
  includeBusinessHours: boolean

  @Prop({ type: Boolean, default: false })
  includeEstimatedWaitTime: boolean

  @Prop({ type: [String], default: [] })
  quickReplies: string[]

  @Prop({ type: Number, default: 0 })
  usageCount: number

  @Prop({ type: Object })
  metadata: {
    language?: string
    tags?: string[]
    attachments?: string[]
  }
}

export const AutoResponseSchema = SchemaFactory.createForClass(AutoResponse)

// Indexes for auto responses
AutoResponseSchema.index({ businessId: 1, isActive: 1 })
AutoResponseSchema.index({ responseType: 1 })
