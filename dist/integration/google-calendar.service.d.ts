export declare class GoogleCalendarService {
    private readonly logger;
    private get isConfigured();
    private get oauth2Client();
    createCalendarEvent(data: {
        summary: string;
        description?: string;
        startDateTime: Date;
        endDateTime: Date;
        attendeeEmail?: string;
        location?: string;
        calendarId?: string;
        refreshToken: string;
    }): Promise<{
        eventId: string | null;
        htmlLink: string | null;
    }>;
    updateCalendarEvent(eventId: string, data: {
        summary?: string;
        startDateTime?: Date;
        endDateTime?: Date;
        description?: string;
        refreshToken: string;
        calendarId?: string;
    }): Promise<boolean>;
    deleteCalendarEvent(eventId: string, refreshToken: string, calendarId?: string): Promise<boolean>;
    getAuthUrl(businessId: string): string;
    getTokens(code: string): Promise<{
        refresh_token: string | null | undefined;
        access_token: string | null | undefined;
    }>;
}
