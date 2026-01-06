import { Model } from 'mongoose';
import { ChatRoom, ChatRoomDocument, ChatMessage, ChatMessageDocument, ChatParticipantDocument, FAQ, FAQDocument, AutoResponse, AutoResponseDocument } from '../schemas/chat.schema';
import { RealtimeGateway } from '../gateways/realtime.gateway';
export declare class ChatService {
    private chatRoomModel;
    private chatMessageModel;
    private chatParticipantModel;
    private faqModel;
    private autoResponseModel;
    private realtimeGateway;
    private readonly logger;
    constructor(chatRoomModel: Model<ChatRoomDocument>, chatMessageModel: Model<ChatMessageDocument>, chatParticipantModel: Model<ChatParticipantDocument>, faqModel: Model<FAQDocument>, autoResponseModel: Model<AutoResponseDocument>, realtimeGateway: RealtimeGateway);
    private serializeMessage;
    createOrGetCustomerChatRoom(businessId: string, userId: string, userInfo: {
        name: string;
        email?: string;
        phone?: string;
        isGuest?: boolean;
        guestInfo?: any;
    }): Promise<any>;
    getBusinessChatRooms(businessId: string, filters?: {
        roomType?: string;
        isActive?: boolean;
        priority?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        rooms: ChatRoom[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    archiveChatRoom(roomId: string): Promise<void>;
    sendMessage(roomId: string, senderId: string, senderType: 'customer' | 'staff' | 'system' | 'bot', content: string, options?: {
        senderName?: string;
        messageType?: string;
        attachments?: string[];
        isAutomated?: boolean;
        isFAQ?: boolean;
        faqId?: string;
        replyToMessageId?: string;
    }): Promise<ChatMessage>;
    getRoomMessages(roomId: string, options?: {
        page?: number;
        limit?: number;
        beforeMessageId?: string;
    }): Promise<{
        messages: ChatMessage[];
        hasMore: boolean;
    }>;
    markMessagesAsRead(roomId: string, userId: string): Promise<void>;
    private handleIncomingCustomerMessage;
    private findMatchingFAQ;
    private calculateSimilarity;
    private sendWelcomeMessage;
    private sendOfflineAutoResponse;
    private isBusinessAvailable;
    createFAQ(faqData: {
        businessId: string;
        question: string;
        answer: string;
        keywords: string[];
        alternativeQuestions?: string[];
        category?: string;
        confidenceThreshold?: number;
        priority?: number;
    }): Promise<FAQ>;
    getBusinessFAQs(businessId: string, options?: {
        category?: string;
        isActive?: boolean;
    }): Promise<FAQ[]>;
    updateFAQ(faqId: string, updates: Partial<FAQ>): Promise<FAQ>;
    deleteFAQ(faqId: string): Promise<void>;
    createAutoResponse(responseData: {
        businessId: string;
        name: string;
        responseType: string;
        message: string;
        trigger?: any;
        quickReplies?: string[];
    }): Promise<AutoResponse>;
    getBusinessAutoResponses(businessId: string): Promise<AutoResponse[]>;
    updateAutoResponse(responseId: string, updates: Partial<AutoResponse>): Promise<AutoResponse>;
}
