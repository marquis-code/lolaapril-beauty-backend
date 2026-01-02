"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const support_service_1 = require("./support.service");
const support_controller_1 = require("./support.controller");
const ticket_schema_1 = require("./schemas/ticket.schema");
const ticket_message_schema_1 = require("./schemas/ticket-message.schema");
const sla_config_schema_1 = require("./schemas/sla-config.schema");
let SupportModule = class SupportModule {
};
SupportModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: ticket_schema_1.Ticket.name, schema: ticket_schema_1.TicketSchema },
                { name: ticket_message_schema_1.TicketMessage.name, schema: ticket_message_schema_1.TicketMessageSchema },
                { name: sla_config_schema_1.SLAConfig.name, schema: sla_config_schema_1.SLAConfigSchema },
            ]),
            config_1.ConfigModule,
        ],
        controllers: [support_controller_1.SupportController],
        providers: [support_service_1.SupportService],
        exports: [support_service_1.SupportService],
    })
], SupportModule);
exports.SupportModule = SupportModule;
//# sourceMappingURL=support.module.js.map