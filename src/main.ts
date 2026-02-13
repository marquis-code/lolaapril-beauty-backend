import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet'; // Keep helmet as default import
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';
import mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Database connection events
  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected successfully');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
  });

  app.use(compression());

  // ⚠️ IMPORTANT: Configure helmet to not block CORS
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: { policy: 'unsafe-none' },
    crossOriginEmbedderPolicy: false,
  }));

  // 🔍 DEBUGGING MIDDLEWARE - Add this BEFORE CORS
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

  // 🚨 ROBUST CORS CONFIGURATION
  const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS')?.split(',') || [];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      // Check if origin is allowed
      const isAllowed = allowedOrigins.some(allowed => {
        if (allowed === '*') return true;
        // Clean up allowed origin (remove trailing slashes)
        const cleanAllowed = allowed.replace(/\/$/, '');
        return cleanAllowed === origin;
      });

      if (isAllowed || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        console.warn(`🔒 CORS blocked for origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
      'X-Business-Id',
      'X-Forwarded-For',
      'Sec-Ch-Ua',
      'Sec-Ch-Ua-Mobile',
      'Sec-Ch-Ua-Platform',
    ],
    exposedHeaders: ['Content-Disposition'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

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

  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`🔐 JWT Secret configured:`, !!configService.get('JWT_SECRET'));
  console.log(`🌐 CORS enabled for ALL origins`);
}
bootstrap();