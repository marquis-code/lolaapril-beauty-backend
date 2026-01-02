import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { WebhookProcessorService } from './webhook-processor.service';
import { WebhookController } from './webhook.controller';
import { Webhook, WebhookSchema } from './schemas/webhook.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Webhook.name, schema: WebhookSchema }]),
    ConfigModule,
  ],
  controllers: [WebhookController],
  providers: [WebhookProcessorService],
  exports: [WebhookProcessorService],
})
export class WebhookModule {}