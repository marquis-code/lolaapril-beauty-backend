import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { Campaign, CampaignSchema } from './schemas/campaign.schema';
import { ClientModule } from '../client/client.module'; // To query clients
import { NotificationModule } from '../notification/notification.module'; // To send emails
import { CampaignProcessor } from './campaign.processor';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Campaign.name, schema: CampaignSchema }]),
        BullModule.registerQueue({
            name: 'campaigns',
        }),
        ClientModule,
        NotificationModule,
    ],
    controllers: [CampaignController],
    providers: [CampaignService, CampaignProcessor],
    exports: [CampaignService],
})
export class CampaignModule { }
