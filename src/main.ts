import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from "compression"
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser'
import mongoose from "mongoose"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Database connection events
  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected successfully')
  })

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err)
  })

  mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected')
  })

  app.use(compression());
  
  // ⚠️ IMPORTANT: Configure helmet to not block CORS
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" },
    crossOriginEmbedderPolicy: false,
  }));

  // 🔍 DEBUGGING MIDDLEWARE - Add this BEFORE CORS
  app.use((req, res, next) => {
    if (req.path.includes('/payments/initialize')) {
      console.log('═══════════════════════════════════════')
      console.log('🔍 PAYMENT INITIALIZE REQUEST')
      console.log('📨 Authorization Header:', req.headers.authorization)
      console.log('📍 Path:', req.path)
      console.log('🔑 JWT_SECRET exists:', !!configService.get('JWT_SECRET'))
      console.log('═══════════════════════════════════════')
    }
    next()
  })

  // 🚨 AGGRESSIVE CORS FIX - Allow ALL origins
  app.enableCors({
    origin: true, // This allows ALL origins
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
      "X-Business-Id", // Added your custom header
      "Sec-Ch-Ua",
      "Sec-Ch-Ua-Mobile",
      "Sec-Ch-Ua-Platform",
      "User-Agent",
      "Referer",
    ],
    exposedHeaders: ["Content-Disposition"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400, // Cache preflight for 24 hours
  })

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('Salon Management API')
    .setDescription('Multi-tenant salon management system API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Health check
  app.use('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });
  
  const port = configService.get<number>("PORT") || 3001
  await app.listen(port)
  console.log(`Application is running on: ${await app.getUrl()}`)
  console.log(`🔐 JWT Secret configured:`, !!configService.get('JWT_SECRET'))
  console.log(`🌐 CORS enabled for ALL origins`)
}
bootstrap();