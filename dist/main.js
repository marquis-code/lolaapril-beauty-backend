"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const config_1 = require("@nestjs/config");
const mongoose_1 = __importDefault(require("mongoose"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    mongoose_1.default.connection.on('connected', () => {
        console.log('✅ MongoDB connected successfully');
    });
    mongoose_1.default.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
    });
    mongoose_1.default.connection.on('disconnected', () => {
        console.log('⚠️  MongoDB disconnected');
    });
    app.use((0, compression_1.default)());
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        crossOriginOpenerPolicy: { policy: "unsafe-none" },
        crossOriginEmbedderPolicy: false,
    }));
    app.use((req, res, next) => {
        if (req.path.includes('/payments/initialize')) {
            console.log('═══════════════════════════════════════');
            console.log('🔍 PAYMENT INITIALIZE REQUEST');
            console.log('📨 Authorization Header:', req.headers.authorization);
            console.log('📍 Path:', req.path);
            console.log('🔑 JWT_SECRET exists:', !!configService.get('JWT_SECRET'));
            console.log('═══════════════════════════════════════');
        }
        next();
    });
    app.enableCors({
        origin: true,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Accept",
            "Origin",
            "X-Requested-With",
            "X-Business-Id",
            "Sec-Ch-Ua",
            "Sec-Ch-Ua-Mobile",
            "Sec-Ch-Ua-Platform",
            "User-Agent",
            "Referer",
        ],
        exposedHeaders: ["Content-Disposition"],
        preflightContinue: false,
        optionsSuccessStatus: 204,
        maxAge: 86400,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Salon Management API')
        .setDescription('Multi-tenant salon management system API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    app.use('/health', (req, res) => {
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        });
    });
    const port = configService.get("PORT") || 3001;
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
    console.log(`🔐 JWT Secret configured:`, !!configService.get('JWT_SECRET'));
    console.log(`🌐 CORS enabled for ALL origins`);
}
bootstrap();
//# sourceMappingURL=main.js.map