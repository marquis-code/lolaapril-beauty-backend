import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsultationService } from './consultation.service';
import { ConsultationController } from './consultation.controller';
import {
    ConsultationPackage, ConsultationPackageSchema,
    ConsultationBooking, ConsultationBookingSchema,
    ConsultationAvailability, ConsultationAvailabilitySchema
} from './schemas/consultation.schema';
import { IntegrationModule } from '../integration/integration.module';
import { NotificationModule } from '../notification/notification.module';
import { BusinessModule } from '../business/business.module';
import { AppointmentModule } from '../appointment/appointment.module';

import { ConsultationCronService } from './consultation-cron.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ConsultationPackage.name, schema: ConsultationPackageSchema },
            { name: ConsultationBooking.name, schema: ConsultationBookingSchema },
            { name: ConsultationAvailability.name, schema: ConsultationAvailabilitySchema },
        ]),
        IntegrationModule,
        NotificationModule,
        BusinessModule,
        AppointmentModule,
    ],
    controllers: [ConsultationController],
    providers: [ConsultationService, ConsultationCronService],
    exports: [ConsultationService],
})
export class ConsultationModule { }
