"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const throttler_1 = require("@nestjs/throttler");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const enquiries_module_1 = require("./enquiries/enquiries.module");
const subscriptions_module_1 = require("./subscriptions/subscriptions.module");
const teams_module_1 = require("./teams/teams.module");
const publications_module_1 = require("./publications/publications.module");
const programs_module_1 = require("./programs/programs.module");
const blogs_module_1 = require("./blogs/blogs.module");
const forms_module_1 = require("./forms/forms.module");
const audit_module_1 = require("./audit/audit.module");
const audit_interceptor_1 = require("./common/interceptors/audit.interceptor");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env', `.env.${process.env.NODE_ENV || 'development'}`],
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGO_URL'),
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                }),
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 10,
                },
            ]),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            enquiries_module_1.EnquiriesModule,
            subscriptions_module_1.SubscriptionsModule,
            teams_module_1.TeamsModule,
            publications_module_1.PublicationsModule,
            programs_module_1.ProgramsModule,
            blogs_module_1.BlogsModule,
            forms_module_1.FormsModule,
            audit_module_1.AuditModule,
        ],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: audit_interceptor_1.AuditInterceptor,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map