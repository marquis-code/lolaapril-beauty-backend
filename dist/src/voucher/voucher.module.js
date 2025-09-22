"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoucherModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const voucher_service_1 = require("./voucher.service");
const voucher_controller_1 = require("./voucher.controller");
const voucher_schema_1 = require("./schemas/voucher.schema");
const audit_module_1 = require("../audit/audit.module");
let VoucherModule = class VoucherModule {
};
VoucherModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: voucher_schema_1.Voucher.name, schema: voucher_schema_1.VoucherSchema }]), audit_module_1.AuditModule],
        controllers: [voucher_controller_1.VoucherController],
        providers: [voucher_service_1.VoucherService],
        exports: [voucher_service_1.VoucherService],
    })
], VoucherModule);
exports.VoucherModule = VoucherModule;
//# sourceMappingURL=voucher.module.js.map