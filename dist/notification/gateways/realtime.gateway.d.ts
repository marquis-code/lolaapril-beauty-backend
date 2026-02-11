import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ModuleRef } from '@nestjs/core';
export declare class RealtimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private configService;
    private moduleRef;
    server: Server;
    private readonly logger;
    private connectedClients;
    constructor(jwtService: JwtService, configService: ConfigService, moduleRef: ModuleRef);
    afterInit(server: Server): Promise<void>;
    handleConnection(client: Socket): Promise<void>;
    private setupAnonymousUser;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(data: {
        roomId?: string;
        businessId?: string;
        userName?: string;
        email?: string;
    }, client: Socket): Promise<{
        success: boolean;
        message: string;
        roomId: string;
        messages: {
            id: any;
            roomId: any;
            businessId: any;
            senderId: any;
            senderType: any;
            senderName: any;
            messageType: any;
            content: any;
            attachments: any;
            isRead: any;
            readAt: any;
            isAutomated: any;
            isFAQ: any;
            createdAt: any;
            updatedAt: any;
            metadata: any;
        }[];
        error?: undefined;
        requireEmail?: undefined;
        isGuest?: undefined;
        guestId?: undefined;
    } | {
        success: boolean;
        error: string;
        requireEmail: boolean;
        message?: undefined;
        roomId?: undefined;
        messages?: undefined;
        isGuest?: undefined;
        guestId?: undefined;
    } | {
        success: boolean;
        message: string;
        roomId: any;
        messages: {
            id: any;
            roomId: any;
            businessId: any;
            senderId: any;
            senderType: any;
            senderName: any;
            messageType: any;
            content: any;
            attachments: any;
            isRead: any;
            readAt: any;
            isAutomated: any;
            isFAQ: any;
            createdAt: any;
            updatedAt: any;
            metadata: any;
        }[];
        isGuest: any;
        guestId: any;
        error?: undefined;
        requireEmail?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
        roomId?: undefined;
        messages?: undefined;
        requireEmail?: undefined;
        isGuest?: undefined;
        guestId?: undefined;
    }>;
    handleLeaveRoom(data: {
        roomId: string;
    }, client: Socket): Promise<{
        success: boolean;
        message: string;
    }>;
    handleSendMessage(data: {
        roomId: string;
        content: string;
        attachments?: any[];
        senderType?: 'customer' | 'staff' | 'system' | 'bot';
        senderId?: string;
        senderName?: string;
    }, client: Socket): Promise<{
        success: boolean;
        messageId: any;
        timestamp: Date;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        messageId?: undefined;
        timestamp?: undefined;
    }>;
    handleTyping(data: {
        roomId: string;
        isTyping: boolean;
    }, client: Socket): Promise<void>;
    handleReadMessages(data: {
        roomId: string;
        messageIds: string[];
    }, client: Socket): Promise<{
        success: boolean;
    }>;
    private serializeMessage;
    emitChatMessage(roomId: string, message: any): void;
    emitAutoResponse(roomId: string, autoResponse: any): void;
    emitFAQResponse(roomId: string, faqResponse: any): void;
    notifyBusinessNewChat(businessId: string, chatInfo: any): void;
    getConnectedClientsCount(): number;
    getBusinessConnections(businessId: string): number;
    isUserOnline(userId: string): boolean;
    emitNotificationToBusiness(businessId: string, notification: any): void;
    emitNotificationToUser(userId: string, notification: any): void;
    emitAuditNotification(businessId: string, auditLog: any): void;
}
