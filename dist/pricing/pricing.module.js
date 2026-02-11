"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const pricing_service_1 = require("./pricing.service");
const pricing_controller_1 = require("./pricing.controller");
const pricing_tier_schema_1 = require("./schemas/pricing-tier.schema");
const fee_structure_schema_1 = require("./schemas/fee-structure.schema");
const pricing_history_schema_1 = require("./schemas/pricing-history.schema");
let PricingModule = class PricingModule {
};
PricingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: pricing_tier_schema_1.PricingTier.name, schema: pricing_tier_schema_1.PricingTierSchema },
                { name: fee_structure_schema_1.FeeStructure.name, schema: fee_structure_schema_1.FeeStructureSchema },
                { name: pricing_history_schema_1.PricingHistory.name, schema: pricing_history_schema_1.PricingHistorySchema },
            ]),
        ],
        controllers: [pricing_controller_1.PricingController],
        providers: [pricing_service_1.PricingService],
        exports: [pricing_service_1.PricingService],
    })
], PricingModule);
exports.PricingModule = PricingModule;
//# sourceMappingURL=pricing.module.js.map