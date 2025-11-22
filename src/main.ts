// main.ts
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
  app.use(helmet());

    const allowedOrigins =
    configService.get("ALLOWED_ORIGINS") ||
    "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:5173"

  // Enable CORS
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true)
      }

      const origins = allowedOrigins.split(",")

      // Check if the origin is allowed
      if (origins.indexOf(origin) !== -1 || origins.includes("*")) {
        return callback(null, true)
      } else {
        console.log(`Blocked request from: ${origin}`)
        return callback(null, true) // Still allow for now, but log it
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
  })

  // app.use(
  //   '/payments/webhook',
  //   bodyParser.raw({ type: 'application/json' })
  // )


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
  SwaggerModule.setup('docs', app, document); // ✅ Available at /docs (not /v1/docs)

  // Health check (✅ stays outside /v1)
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
}
bootstrap();
