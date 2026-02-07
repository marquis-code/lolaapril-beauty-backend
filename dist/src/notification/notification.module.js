"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const schedule_1 = require("@nestjs/schedule");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const notification_service_1 = require("./notification.service");
const notification_controller_1 = require("./notification.controller");
const email_service_1 = require("./email.service");
const sms_service_1 = require("./sms.service");
const chat_service_1 = require("./services/chat.service");
const chat_seeder_service_1 = require("./services/chat-seeder.service");
const notification_event_listener_1 = require("./services/notification-event.listener");
const realtime_gateway_1 = require("./gateways/realtime.gateway");
const chat_controller_1 = require("./controllers/chat.controller");
const notification_schema_1 = require("../notification/schemas/notification.schema");
const chat_schema_1 = require("./schemas/chat.schema");
const business_module_1 = require("../business/business.module");
const user_schema_1 = require("../auth/schemas/user.schema");
let NotificationModule = class NotificationModule {
};
NotificationModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: notification_schema_1.NotificationTemplate.name,
                    schema: notification_schema_1.NotificationTemplateSchema,
                },
                {
                    name: notification_schema_1.NotificationLog.name,
                    schema: notification_schema_1.NotificationLogSchema,
                },
                {
                    name: notification_schema_1.NotificationPreference.name,
                    schema: notification_schema_1.NotificationPreferenceSchema,
                },
                {
                    name: chat_schema_1.ChatRoom.name,
                    schema: chat_schema_1.ChatRoomSchema,
                },
                {
                    name: chat_schema_1.ChatMessage.name,
                    schema: chat_schema_1.ChatMessageSchema,
                },
                {
                    name: chat_schema_1.ChatParticipant.name,
                    schema: chat_schema_1.ChatParticipantSchema,
                },
                {
                    name: chat_schema_1.FAQ.name,
                    schema: chat_schema_1.FAQSchema,
                },
                {
                    name: chat_schema_1.AutoResponse.name,
                    schema: chat_schema_1.AutoResponseSchema,
                },
                {
                    name: user_schema_1.User.name,
                    schema: user_schema_1.UserSchema,
                },
            ]),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                }),
                inject: [config_1.ConfigService],
            }),
            schedule_1.ScheduleModule.forRoot(),
            business_module_1.BusinessModule,
        ],
        controllers: [notification_controller_1.NotificationController, chat_controller_1.ChatController],
        providers: [
            notification_service_1.NotificationService,
            email_service_1.EmailService,
            sms_service_1.SMSService,
            chat_service_1.ChatService,
            chat_seeder_service_1.ChatSeederService,
            notification_event_listener_1.NotificationEventListener,
            realtime_gateway_1.RealtimeGateway,
        ],
        exports: [
            notification_service_1.NotificationService,
            email_service_1.EmailService,
            sms_service_1.SMSService,
            chat_service_1.ChatService,
            chat_seeder_service_1.ChatSeederService,
            realtime_gateway_1.RealtimeGateway,
        ],
    })
], NotificationModule);
exports.NotificationModule = NotificationModule;
//# sourceMappingURL=notification.module.js.map