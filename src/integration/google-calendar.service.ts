import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';

/**
 * Google Calendar integration service.
 */
@Injectable()
export class GoogleCalendarService {
    private readonly logger = new Logger(GoogleCalendarService.name);

    constructor(private readonly configService: ConfigService) { }

    private get isConfigured(): boolean {
        return !!(
            this.configService.get('GOOGLE_CALENDAR_CLIENT_ID') &&
            this.configService.get('GOOGLE_CALENDAR_CLIENT_SECRET')
        );
    }

    private get oauth2Client() {
        if (!this.isConfigured) {
            throw new Error('Google Calendar is not configured with environment variables');
        }
        return new google.auth.OAuth2(
            this.configService.get('GOOGLE_CALENDAR_CLIENT_ID'),
            this.configService.get('GOOGLE_CALENDAR_CLIENT_SECRET'),
            this.configService.get('GOOGLE_CALENDAR_REDIRECT_URI') ||
            `${this.configService.get('FRONTEND_URL')}/settings/integrations/google-callback`,
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
        refreshToken: string;
        createMeetLink?: boolean;
    }): Promise<{ eventId: string | null; htmlLink: string | null; meetLink: string | null }> {
        if (!this.isConfigured) {
            this.logger.warn('Google Calendar not configured. Skipping event creation.');
            return { eventId: null, htmlLink: null, meetLink: null };
        }

        try {
            const client = this.oauth2Client;
            client.setCredentials({ refresh_token: data.refreshToken });

            const calendar = google.calendar({ version: 'v3', auth: client });

            const requestBody: any = {
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
            };

            if (data.createMeetLink) {
                requestBody.conferenceData = {
                    createRequest: {
                        requestId: Math.random().toString(36).substring(7),
                        conferenceSolutionKey: { type: 'hangoutsMeet' },
                    },
                };
            }

            const event = await calendar.events.insert({
                calendarId: data.calendarId || 'primary',
                requestBody,
                conferenceDataVersion: data.createMeetLink ? 1 : 0,
            });

            const meetLink = event.data.conferenceData?.entryPoints?.find(
                (ep) => ep.entryPointType === 'video',
            )?.uri || null;

            if (data.createMeetLink && !meetLink) {
                this.logger.warn(`⚠️ Meet link requested but not returned for event ${event.data.id}. Ensure 'conferenceDataVersion: 1' is set and permissions are correct.`);
            }

            this.logger.log(`📅 Created calendar event: ${event.data.id} ${meetLink ? `with Meet: ${meetLink}` : ''}`);
            return {
                eventId: event.data.id || null,
                htmlLink: event.data.htmlLink || null,
                meetLink
            };
        } catch (error) {
            this.logger.error(`❌ Failed to create calendar event: ${error.message}`);
            return { eventId: null, htmlLink: null, meetLink: null };
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
