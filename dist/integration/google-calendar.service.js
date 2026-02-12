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
var GoogleCalendarService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleCalendarService = void 0;
const common_1 = require("@nestjs/common");
const googleapis_1 = require("googleapis");
const config_1 = require("@nestjs/config");
let GoogleCalendarService = GoogleCalendarService_1 = class GoogleCalendarService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(GoogleCalendarService_1.name);
    }
    get isConfigured() {
        return !!(this.configService.get('GOOGLE_CALENDAR_CLIENT_ID') &&
            this.configService.get('GOOGLE_CALENDAR_CLIENT_SECRET'));
    }
    get oauth2Client() {
        if (!this.isConfigured) {
            throw new Error('Google Calendar is not configured with environment variables');
        }
        return new googleapis_1.google.auth.OAuth2(this.configService.get('GOOGLE_CALENDAR_CLIENT_ID'), this.configService.get('GOOGLE_CALENDAR_CLIENT_SECRET'), this.configService.get('GOOGLE_CALENDAR_REDIRECT_URI') ||
            `${this.configService.get('FRONTEND_URL')}/settings/integrations/google-callback`);
    }
    async createCalendarEvent(data) {
        if (!this.isConfigured) {
            this.logger.warn('Google Calendar not configured. Skipping event creation.');
            return { eventId: null, htmlLink: null, meetLink: null };
        }
        try {
            const client = this.oauth2Client;
            client.setCredentials({ refresh_token: data.refreshToken });
            const calendar = googleapis_1.google.calendar({ version: 'v3', auth: client });
            const requestBody = {
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
            const meetLink = event.data.conferenceData?.entryPoints?.find((ep) => ep.entryPointType === 'video')?.uri || null;
            if (data.createMeetLink && !meetLink) {
                this.logger.warn(`⚠️ Meet link requested but not returned for event ${event.data.id}. Ensure 'conferenceDataVersion: 1' is set and permissions are correct.`);
            }
            this.logger.log(`📅 Created calendar event: ${event.data.id} ${meetLink ? `with Meet: ${meetLink}` : ''}`);
            return {
                eventId: event.data.id || null,
                htmlLink: event.data.htmlLink || null,
                meetLink
            };
        }
        catch (error) {
            this.logger.error(`❌ Failed to create calendar event: ${error.message}`);
            return { eventId: null, htmlLink: null, meetLink: null };
        }
    }
    async updateCalendarEvent(eventId, data) {
        if (!this.isConfigured || !eventId)
            return false;
        try {
            const client = this.oauth2Client;
            client.setCredentials({ refresh_token: data.refreshToken });
            const calendar = googleapis_1.google.calendar({ version: 'v3', auth: client });
            const patchBody = {};
            if (data.summary)
                patchBody.summary = data.summary;
            if (data.description)
                patchBody.description = data.description;
            if (data.startDateTime)
                patchBody.start = { dateTime: data.startDateTime.toISOString() };
            if (data.endDateTime)
                patchBody.end = { dateTime: data.endDateTime.toISOString() };
            await calendar.events.patch({
                calendarId: data.calendarId || 'primary',
                eventId: eventId,
                requestBody: patchBody,
            });
            this.logger.log(`📅 Updated calendar event: ${eventId}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to update calendar event: ${error.message}`);
            return false;
        }
    }
    async deleteCalendarEvent(eventId, refreshToken, calendarId = 'primary') {
        if (!this.isConfigured || !eventId)
            return false;
        try {
            const client = this.oauth2Client;
            client.setCredentials({ refresh_token: refreshToken });
            const calendar = googleapis_1.google.calendar({ version: 'v3', auth: client });
            await calendar.events.delete({
                calendarId,
                eventId,
            });
            this.logger.log(`📅 Deleted calendar event: ${eventId}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to delete calendar event: ${error.message}`);
            return false;
        }
    }
    getAuthUrl(businessId) {
        if (!this.isConfigured)
            return '';
        const client = this.oauth2Client;
        return client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/calendar'],
            state: businessId,
            prompt: 'consent',
        });
    }
    async getTokens(code) {
        if (!this.isConfigured)
            throw new Error('Google Calendar not configured');
        const client = this.oauth2Client;
        const { tokens } = await client.getToken(code);
        return {
            refresh_token: tokens.refresh_token,
            access_token: tokens.access_token
        };
    }
};
GoogleCalendarService = GoogleCalendarService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GoogleCalendarService);
exports.GoogleCalendarService = GoogleCalendarService;
//# sourceMappingURL=google-calendar.service.js.map