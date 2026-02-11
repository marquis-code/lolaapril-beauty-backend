import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';

/**
 * Google Calendar integration service.
 * 
 * Prerequisites:
 *   1. Enable Google Calendar API in Google Cloud Console
 *   2. Create OAuth2 credentials
 *   3. Set GOOGLE_CALENDAR_CLIENT_ID, GOOGLE_CALENDAR_CLIENT_SECRET,
 *      GOOGLE_CALENDAR_REDIRECT_URI in .env
 * 
 * This is a stub implementation that logs operations.
 * To fully enable, install `googleapis` and configure OAuth2 flow.
 */
@Injectable()
export class GoogleCalendarService {
    private readonly logger = new Logger(GoogleCalendarService.name);

    private get isConfigured(): boolean {
        return !!(
            process.env.GOOGLE_CALENDAR_CLIENT_ID &&
            process.env.GOOGLE_CALENDAR_CLIENT_SECRET
        );
    }

    private get oauth2Client() {
        if (!this.isConfigured) {
            throw new Error('Google Calendar is not configured with environment variables');
        }
        return new google.auth.OAuth2(
            process.env.GOOGLE_CALENDAR_CLIENT_ID,
            process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
            process.env.GOOGLE_CALENDAR_REDIRECT_URI || `${process.env.FRONTEND_URL}/settings/integrations/google-callback`,
        );
    }

    /**
     * Create a calendar event for an appointment.
     */
    async createCalendarEvent(data: {
        summary: string;
        description?: string;
        startDateTime: Date;
        endDateTime: Date;
        attendeeEmail?: string;
        location?: string;
        calendarId?: string;
        refreshToken: string; // Required for production
    }): Promise<{ eventId: string | null; htmlLink: string | null }> {
        if (!this.isConfigured) {
            this.logger.warn('Google Calendar not configured. Skipping event creation.');
            return { eventId: null, htmlLink: null };
        }

        try {
            const client = this.oauth2Client;
            client.setCredentials({ refresh_token: data.refreshToken });

            const calendar = google.calendar({ version: 'v3', auth: client });

            const event = await calendar.events.insert({
                calendarId: data.calendarId || 'primary',
                requestBody: {
                    summary: data.summary,
                    description: data.description,
                    start: { dateTime: data.startDateTime.toISOString() },
                    end: { dateTime: data.endDateTime.toISOString() },
                    attendees: data.attendeeEmail ? [{ email: data.attendeeEmail }] : [],
                    location: data.location,
                    reminders: {
                        useDefault: false,
                        overrides: [
                            { method: 'email', minutes: 60 },
                            { method: 'popup', minutes: 30 },
                        ],
                    },
                },
            });

            this.logger.log(`📅 Created calendar event: ${event.data.id}`);
            return { eventId: event.data.id || null, htmlLink: event.data.htmlLink || null };
        } catch (error) {
            this.logger.error(`Failed to create calendar event: ${error.message}`);
            return { eventId: null, htmlLink: null };
        }
    }

    /**
     * Update an existing calendar event.
     */
    async updateCalendarEvent(
        eventId: string,
        data: {
            summary?: string;
            startDateTime?: Date;
            endDateTime?: Date;
            description?: string;
            refreshToken: string;
            calendarId?: string;
        },
    ): Promise<boolean> {
        if (!this.isConfigured || !eventId) return false;

        try {
            const client = this.oauth2Client;
            client.setCredentials({ refresh_token: data.refreshToken });
            const calendar = google.calendar({ version: 'v3', auth: client });

            const patchBody: any = {};
            if (data.summary) patchBody.summary = data.summary;
            if (data.description) patchBody.description = data.description;
            if (data.startDateTime) patchBody.start = { dateTime: data.startDateTime.toISOString() };
            if (data.endDateTime) patchBody.end = { dateTime: data.endDateTime.toISOString() };

            await calendar.events.patch({
                calendarId: data.calendarId || 'primary',
                eventId: eventId,
                requestBody: patchBody,
            });

            this.logger.log(`📅 Updated calendar event: ${eventId}`);
            return true;
        } catch (error) {
            this.logger.error(`Failed to update calendar event: ${error.message}`);
            return false;
        }
    }

    /**
     * Delete (cancel) a calendar event.
     */
    async deleteCalendarEvent(
        eventId: string,
        refreshToken: string,
        calendarId: string = 'primary'
    ): Promise<boolean> {
        if (!this.isConfigured || !eventId) return false;

        try {
            const client = this.oauth2Client;
            client.setCredentials({ refresh_token: refreshToken });
            const calendar = google.calendar({ version: 'v3', auth: client });

            await calendar.events.delete({
                calendarId,
                eventId,
            });

            this.logger.log(`📅 Deleted calendar event: ${eventId}`);
            return true;
        } catch (error) {
            this.logger.error(`Failed to delete calendar event: ${error.message}`);
            return false;
        }
    }

    /**
     * Generate an OAuth2 authorization URL for a business to connect their calendar.
     */
    getAuthUrl(businessId: string): string {
        if (!this.isConfigured) return '';

        const client = this.oauth2Client;
        return client.generateAuthUrl({
            access_type: 'offline', // Critical for receiving refresh token
            scope: ['https://www.googleapis.com/auth/calendar'],
            state: businessId,
            prompt: 'consent', // Force consent to ensure refresh token is returned
        });
    }

    /**
     * Exchange auth code for tokens
     */
    async getTokens(code: string): Promise<{ refresh_token: string | null | undefined; access_token: string | null | undefined }> {
        if (!this.isConfigured) throw new Error('Google Calendar not configured');

        const client = this.oauth2Client;
        const { tokens } = await client.getToken(code);
        return {
            refresh_token: tokens.refresh_token,
            access_token: tokens.access_token
        };
    }
}
