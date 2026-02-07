import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandingService } from './branding.service';
import { BrandingController } from './branding.controller';
import { PublicPreviewController } from './preview.controller';
import { Theme, ThemeSchema } from './schemas/theme.schema';
import { CustomDomain, CustomDomainSchema } from './schemas/custom-domain.schema';
import { EmailTemplate, EmailTemplateSchema } from './schemas/email-template.schema';
import { BookingWidget, BookingWidgetSchema } from './schemas/booking-widget.schema';

// Import auth module for guards and decorators
import { AuthModule } from '../auth/auth.module';
import { UploadModule } from '../upload/upload.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Theme.name, schema: ThemeSchema },
      { name: CustomDomain.name, schema: CustomDomainSchema },
      { name: EmailTemplate.name, schema: EmailTemplateSchema },
      { name: BookingWidget.name, schema: BookingWidgetSchema },
    ]),
    AuthModule, // Import to use auth guards
    UploadModule, // Import for branding asset uploads
    CacheModule, // Import for temporary preview storage
  ],
  controllers: [BrandingController, PublicPreviewController],
  providers: [BrandingService],
  exports: [BrandingService], // Export for use in other modules
})
export class BrandingModule {}
