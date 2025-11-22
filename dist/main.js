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
    app.use((0, helmet_1.default)());
    const allowedOrigins = configService.get("ALLOWED_ORIGINS") ||
        "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:5173";
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true);
            }
            const origins = allowedOrigins.split(",");
            if (origins.indexOf(origin) !== -1 || origins.includes("*")) {
                return callback(null, true);
            }
            else {
                console.log(`Blocked request from: ${origin}`);
                return callback(null, true);
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Accept",
            "Origin",
            "X-Requested-With",
        ],
        exposedHeaders: ["Content-Disposition"],
        preflightContinue: false,
        optionsSuccessStatus: 204,
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
}
bootstrap();
//# sourceMappingURL=main.js.map