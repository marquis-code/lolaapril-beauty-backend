"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const marketplace_service_1 = require("./marketplace.service");
const marketplace_controller_1 = require("./marketplace.controller");
const business_verification_schema_1 = require("./schemas/business-verification.schema");
const review_schema_1 = require("./schemas/review.schema");
const quality_metric_schema_1 = require("./schemas/quality-metric.schema");
let MarketplaceModule = class MarketplaceModule {
};
MarketplaceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: business_verification_schema_1.BusinessVerification.name, schema: business_verification_schema_1.BusinessVerificationSchema },
                { name: review_schema_1.Review.name, schema: review_schema_1.ReviewSchema },
                { name: quality_metric_schema_1.QualityMetric.name, schema: quality_metric_schema_1.QualityMetricSchema },
            ]),
        ],
        controllers: [marketplace_controller_1.MarketplaceController],
        providers: [marketplace_service_1.MarketplaceService],
        exports: [marketplace_service_1.MarketplaceService],
    })
], MarketplaceModule);
exports.MarketplaceModule = MarketplaceModule;
//# sourceMappingURL=marketplace.module.js.map