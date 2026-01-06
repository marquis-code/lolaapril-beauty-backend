import { ChatService } from '../services/chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    createChatRoom(body: {
        userId: string;
        userName: string;
        userEmail?: string;
        userPhone?: string;
    }, businessId: string): Promise<any>;
    getChatRooms(businessId: string, roomType?: string, isActive?: boolean, priority?: string, page?: number, limit?: number): Promise<{
        rooms: import("../schemas/chat.schema").ChatRoom[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    archiveChatRoom(roomId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    sendMessage(roomId: string, body: {
        senderId: string;
        senderType: 'customer' | 'staff' | 'system' | 'bot';
        senderName: string;
        content: string;
        messageType?: string;
        attachments?: string[];
        replyToMessageId?: string;
    }): Promise<import("../schemas/chat.schema").ChatMessage>;
    getRoomMessages(roomId: string, page?: number, limit?: number, beforeMessageId?: string): Promise<{
        messages: import("../schemas/chat.schema").ChatMessage[];
        hasMore: boolean;
    }>;
    markMessagesAsRead(roomId: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createFAQ(body: {
        question: string;
        answer: string;
        keywords: string[];
        alternativeQuestions?: string[];
        category?: string;
        confidenceThreshold?: number;
        priority?: number;
    }, businessId: string): Promise<import("../schemas/chat.schema").FAQ>;
    getFAQs(businessId: string, category?: string, isActive?: boolean): Promise<import("../schemas/chat.schema").FAQ[]>;
    updateFAQ(faqId: string, updates: any): Promise<import("../schemas/chat.schema").FAQ>;
    deleteFAQ(faqId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createAutoResponse(body: {
        name: string;
        responseType: string;
        message: string;
        trigger?: any;
        quickReplies?: string[];
    }, businessId: string): Promise<import("../schemas/chat.schema").AutoResponse>;
    getAutoResponses(businessId: string): Promise<import("../schemas/chat.schema").AutoResponse[]>;
    updateAutoResponse(responseId: string, updates: any): Promise<import("../schemas/chat.schema").AutoResponse>;
}
