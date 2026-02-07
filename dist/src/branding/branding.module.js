"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandingModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const branding_service_1 = require("./branding.service");
const branding_controller_1 = require("./branding.controller");
const preview_controller_1 = require("./preview.controller");
const theme_schema_1 = require("./schemas/theme.schema");
const custom_domain_schema_1 = require("./schemas/custom-domain.schema");
const email_template_schema_1 = require("./schemas/email-template.schema");
const booking_widget_schema_1 = require("./schemas/booking-widget.schema");
const auth_module_1 = require("../auth/auth.module");
const upload_module_1 = require("../upload/upload.module");
const cache_module_1 = require("../cache/cache.module");
let BrandingModule = class BrandingModule {
};
BrandingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: theme_schema_1.Theme.name, schema: theme_schema_1.ThemeSchema },
                { name: custom_domain_schema_1.CustomDomain.name, schema: custom_domain_schema_1.CustomDomainSchema },
                { name: email_template_schema_1.EmailTemplate.name, schema: email_template_schema_1.EmailTemplateSchema },
                { name: booking_widget_schema_1.BookingWidget.name, schema: booking_widget_schema_1.BookingWidgetSchema },
            ]),
            auth_module_1.AuthModule,
            upload_module_1.UploadModule,
            cache_module_1.CacheModule,
        ],
        controllers: [branding_controller_1.BrandingController, preview_controller_1.PublicPreviewController],
        providers: [branding_service_1.BrandingService],
        exports: [branding_service_1.BrandingService],
    })
], BrandingModule);
exports.BrandingModule = BrandingModule;
//# sourceMappingURL=branding.module.js.map