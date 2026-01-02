// branding.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandingService } from './branding.service';
import { BrandingController } from './branding.controller';
import { Theme, ThemeSchema } from './schemas/theme.schema';
import { CustomDomain, CustomDomainSchema } from './schemas/custom-domain.schema';
import { EmailTemplate, EmailTemplateSchema } from './schemas/email-template.schema';
import { BookingWidget, BookingWidgetSchema } from './schemas/booking-widget.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Theme.name, schema: ThemeSchema },
      { name: CustomDomain.name, schema: CustomDomainSchema },
      { name: EmailTemplate.name, schema: EmailTemplateSchema },
      { name: BookingWidget.name, schema: BookingWidgetSchema },
    ]),
  ],
  controllers: [BrandingController],
  providers: [BrandingService],
  exports: [BrandingService],
})
export class BrandingModule {}