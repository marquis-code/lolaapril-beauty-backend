import { ChatService } from '../services/chat.service';
import { BusinessService } from '../../business/business.service';
export declare class ChatController {
    private readonly chatService;
    private readonly businessService;
    constructor(chatService: ChatService, businessService: BusinessService);
    createChatRoom(body: {
        userId: string;
        userName: string;
        userEmail?: string;
        userPhone?: string;
        businessId?: string;
        subdomain?: string;
        isGuest?: boolean;
        guestInfo?: any;
    }, authBusinessId?: string, user?: any): Promise<any>;
    createTeamChatRoom(businessId: string, user: any, body: {
        memberId: string;
        memberName?: string;
        memberEmail?: string;
    }): Promise<any>;
    createBusinessSupportRoom(businessId: string, user: any, body: {
        superAdminId?: string;
    }): Promise<any>;
    getChatRooms(businessId: string, roomType?: string, isActive?: boolean, priority?: string, page?: number, limit?: number): Promise<{
        rooms: import("../schemas/chat.schema").ChatRoom[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getUnreadCounts(businessId: string): Promise<{
        totalUnread: number;
        roomsWithUnread: number;
        rooms: {
            roomId: string;
            unreadCount: number;
            lastMessageAt: Date;
            customerName: string;
        }[];
    }>;
    getChatRoom(roomId: string, userId?: string, user?: any): Promise<any>;
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
    }, user?: any): Promise<import("../schemas/chat.schema").ChatMessage>;
    getRoomMessages(roomId: string, page?: number, limit?: number, beforeMessageId?: string, userId?: string, guestId?: string, user?: any): Promise<{
        messages: import("../schemas/chat.schema").ChatMessage[];
        hasMore: boolean;
    }>;
    markMessagesAsRead(roomId: string, userId: string, user?: any): Promise<{
        success: boolean;
        message: string;
    }>;
    private resolveBusinessId;
    private assertRoomAccess;
    private assertSenderType;
    createFAQ(body: {
        question: string;
        answer: string;
        keywords: string[];
        alternativeQuestions?: string[];
        category?: string;
        confidenceThreshold?: number;
        priority?: number;
    }, businessId: string): Promise<import("../schemas/chat.schema").FAQ>;
    getFAQs(authBusinessId: string, queryBusinessId?: string, category?: string, isActive?: boolean): Promise<import("../schemas/chat.schema").FAQ[]>;
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
    getAutoResponses(authBusinessId: string, queryBusinessId?: string): Promise<import("../schemas/chat.schema").AutoResponse[]>;
    updateAutoResponse(responseId: string, updates: any): Promise<import("../schemas/chat.schema").AutoResponse>;
    triggerAutoResponse(roomId: string, body: {
        responseType: string;
        businessId?: string;
    }, authBusinessId?: string): Promise<any>;
}
