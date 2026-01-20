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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const schedule_1 = require("@nestjs/schedule");
const event_emitter_1 = require("@nestjs/event-emitter");
const core_1 = require("@nestjs/core");
const nest_winston_1 = require("nest-winston");
const winston = require("winston");
const throttler_1 = require("@nestjs/throttler");
const ioredis_1 = require("@nestjs-modules/ioredis");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
const validate_business_access_guard_1 = require("./auth/guards/validate-business-access.guard");
const client_module_1 = require("./client/client.module");
const service_module_1 = require("./service/service.module");
const appointment_module_1 = require("./appointment/appointment.module");
const booking_module_1 = require("./booking/booking.module");
const payment_module_1 = require("./payment/payment.module");
const sales_module_1 = require("./sales/sales.module");
const team_module_1 = require("./team/team.module");
const settings_module_1 = require("./settings/settings.module");
const voucher_module_1 = require("./voucher/voucher.module");
const membership_module_1 = require("./membership/membership.module");
const reports_module_1 = require("./reports/reports.module");
const auth_module_1 = require("./auth/auth.module");
const commission_module_1 = require("./commission/commission.module");
const audit_module_1 = require("./audit/audit.module");
const cancellation_module_1 = require("./cancellation/cancellation.module");
const upload_module_1 = require("./upload/upload.module");
const availability_module_1 = require("./availability/availability.module");
const notification_module_1 = require("./notification/notification.module");
const business_module_1 = require("./business/business.module");
const staff_module_1 = require("./staff/staff.module");
const audit_interceptor_1 = require("./audit/interceptors/audit.interceptor");
const analytics_module_1 = require("./analytics/analytics.module");
const pricing_module_1 = require("./pricing/pricing.module");
const branding_module_1 = require("./branding/branding.module");
const support_module_1 = require("./support/support.module");
const integration_module_1 = require("./integration/integration.module");
const jobs_module_1 = require("./jobs/jobs.module");
const cache_module_1 = require("./cache/cache.module");
const monitoring_module_1 = require("./monitoring/monitoring.module");
const webhook_module_1 = require("./webhook/webhook.module");
const rate_limiter_module_1 = require("./rate-limiter/rate-limiter.module");
const marketplace_module_1 = require("./marketplace/marketplace.module");
const subscription_module_1 = require("./subscription/subscription.module");
const migrations_module_1 = require("./migrations/migrations.module");
let AppModule = class AppModule {
    constructor() {
        console.log('🚀 Application Module Initialized');
        console.log(`📅 Startup Time: ${new Date().toISOString()}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`📍 Node Version: ${process.version}`);
        console.log('═'.repeat(80));
    }
    configure(consumer) {
        console.log('⚙️  Configuring middleware...');
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env'
            }),
            ioredis_1.RedisModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const redisHost = configService.get('REDIS_HOST');
                    const redisPort = configService.get('REDIS_PORT');
                    const redisPassword = configService.get('REDIS_PASSWORD');
                    const redisUsername = configService.get('REDIS_USERNAME');
                    const redisTls = configService.get('REDIS_TLS');
                    console.log('🔴 Redis Configuration:');
                    console.log(`   Host: ${redisHost}`);
                    console.log(`   Port: ${redisPort}`);
                    console.log(`   Username: ${redisUsername}`);
                    console.log(`   Password: ${redisPassword ? '***' : 'not set'}`);
                    console.log(`   TLS: ${redisTls === 'true' ? 'enabled' : 'disabled'}`);
                    const config = {
                        type: 'single',
                        options: {
                            host: redisHost,
                            port: redisPort,
                            password: redisPassword,
                            username: redisUsername,
                            retryStrategy: (times) => {
                                const delay = Math.min(times * 50, 2000);
                                console.log(`🔄 Redis retry attempt ${times}, waiting ${delay}ms`);
                                return delay;
                            },
                            maxRetriesPerRequest: 3,
                            enableReadyCheck: true,
                            lazyConnect: false,
                        },
                    };
                    if (redisTls === 'true') {
                        config.options.tls = {
                            rejectUnauthorized: false
                        };
                    }
                    return config;
                },
            }),
            nest_winston_1.WinstonModule.forRoot({
                transports: [
                    new winston.transports.Console({
                        level: 'debug',
                        format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.ms(), winston.format.errors({ stack: true }), winston.format.splat(), winston.format.colorize({ all: true }), winston.format.printf(({ level, message, timestamp, ms, context, stack, ...meta }) => {
                            let log = `${timestamp} [${context || 'Application'}] ${level}: ${message}`;
                            if (ms)
                                log += ` ${ms}`;
                            if (Object.keys(meta).length > 0) {
                                log += `\n   📋 Meta: ${JSON.stringify(meta, null, 2)}`;
                            }
                            if (stack) {
                                log += `\n   🔥 Stack: ${stack}`;
                            }
                            return log;
                        })),
                    }),
                    new winston.transports.File({
                        filename: 'logs/error.log',
                        level: 'error',
                        format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.errors({ stack: true }), winston.format.json()),
                        maxsize: 5242880,
                        maxFiles: 10,
                    }),
                    new winston.transports.File({
                        filename: 'logs/combined.log',
                        level: 'debug',
                        format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.json()),
                        maxsize: 5242880,
                        maxFiles: 10,
                    }),
                    new winston.transports.File({
                        filename: 'logs/http.log',
                        level: 'http',
                        format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.json()),
                        maxsize: 5242880,
                        maxFiles: 5,
                    }),
                    new winston.transports.File({
                        filename: 'logs/database.log',
                        level: 'debug',
                        format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.json()),
                        maxsize: 5242880,
                        maxFiles: 5,
                    }),
                    new winston.transports.File({
                        filename: 'logs/auth.log',
                        level: 'info',
                        format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.json()),
                        maxsize: 5242880,
                        maxFiles: 5,
                    }),
                ],
                defaultMeta: {
                    service: 'lola-beauty-backend',
                    environment: process.env.NODE_ENV || 'development'
                },
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGO_URL'),
                    connectionFactory: (connection) => {
                        connection.set('debug', (collectionName, method, query, doc) => {
                            console.log(`📊 MongoDB Query: ${collectionName}.${method}`, {
                                query: JSON.stringify(query),
                                doc: doc ? JSON.stringify(doc) : undefined,
                                timestamp: new Date().toISOString()
                            });
                        });
                        connection.on('connected', () => {
                            console.log('✅ MongoDB connected successfully');
                            console.log(`📍 Database: ${connection.name}`);
                            console.log(`🔗 Host: ${connection.host}:${connection.port}`);
                            console.log(`⏰ Connected at: ${new Date().toISOString()}`);
                        });
                        connection.on('error', (error) => {
                            console.error('❌ MongoDB connection error:', {
                                message: error.message,
                                code: error.code,
                                name: error.name,
                                timestamp: new Date().toISOString()
                            });
                        });
                        connection.on('disconnected', () => {
                            console.log('⚠️  MongoDB disconnected at:', new Date().toISOString());
                        });
                        connection.on('reconnected', () => {
                            console.log('🔄 MongoDB reconnected at:', new Date().toISOString());
                        });
                        connection.on('close', () => {
                            console.log('🔴 MongoDB connection closed at:', new Date().toISOString());
                        });
                        return connection;
                    },
                }),
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            monitoring_module_1.MonitoringModule,
            cache_module_1.CacheModule,
            rate_limiter_module_1.RateLimiterModule,
            schedule_1.ScheduleModule.forRoot(),
            event_emitter_1.EventEmitterModule.forRoot(),
            auth_module_1.AuthModule,
            business_module_1.BusinessModule,
            audit_module_1.AuditModule,
            upload_module_1.UploadModule,
            client_module_1.ClientModule,
            service_module_1.ServiceModule,
            appointment_module_1.AppointmentModule,
            booking_module_1.BookingModule,
            payment_module_1.PaymentModule,
            sales_module_1.SalesModule,
            team_module_1.TeamModule,
            settings_module_1.SettingsModule,
            voucher_module_1.VoucherModule,
            membership_module_1.MembershipModule,
            reports_module_1.ReportsModule,
            availability_module_1.AvailabilityModule,
            notification_module_1.NotificationModule,
            staff_module_1.StaffModule,
            commission_module_1.CommissionModule,
            cancellation_module_1.CancellationModule,
            analytics_module_1.AnalyticsModule,
            pricing_module_1.PricingModule,
            branding_module_1.BrandingModule,
            support_module_1.SupportModule,
            marketplace_module_1.MarketplaceModule,
            integration_module_1.IntegrationModule,
            jobs_module_1.JobsModule,
            webhook_module_1.WebhookModule,
            subscription_module_1.SubscriptionModule,
            migrations_module_1.MigrationsModule,
        ],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: audit_interceptor_1.AuditInterceptor,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: validate_business_access_guard_1.ValidateBusinessAccessGuard,
            },
        ],
    }),
    __metadata("design:paramtypes", [])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map