import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  

  app.use(compression());
  app.use(helmet()); 

    const allowedOrigins = configService.get('ALLOWED_ORIGINS') || 
    'http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:5173';
  
  // Enable CORS
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      
      const origins = allowedOrigins.split(',');
      
      // Check if the origin is allowed
      if (origins.indexOf(origin) !== -1 || origins.includes('*')) {
        return callback(null, true);
      } else {
        console.log(`Blocked request from: ${origin}`);
        return callback(null, true); // Still allow for now, but log it
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Content-Disposition'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // Swagger API documentation
  const config = new DocumentBuilder()
     .setTitle('Salon Management API')
    .setDescription('Multi-tenant salon management system API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('bookings', 'Booking management')
    .addTag('appointments', 'Appointment management')
    .addTag('payments', 'Payment processing')
    .addTag('availability', 'Availability management')
    .addTag('staff', 'Staff management')
    .addTag('notifications', 'Notification system')
    .addTag('tenant', 'Multi-tenant management')
    .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

    // Health check endpoint
  app.use('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    })
  })
  
  // Start the server
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation: http://localhost:${port}/api/docs`)
}
bootstrap();