import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MobileSpaService } from './mobile-spa.service';
import { MobileSpaController } from './mobile-spa.controller';
import { MobileSpaRequest, MobileSpaRequestSchema } from './schemas/mobile-spa-request.schema';
import { NotificationModule } from '../notification/notification.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: MobileSpaRequest.name, schema: MobileSpaRequestSchema },
        ]),
        NotificationModule,
    ],
    controllers: [MobileSpaController],
    providers: [MobileSpaService],
    exports: [MobileSpaService],
})
export class MobileSpaModule { }
