import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { VoucherService } from "./voucher.service"
import { VoucherController } from "./voucher.controller"
import { Voucher, VoucherSchema } from "./schemas/voucher.schema"
import { AuditModule } from "../audit/audit.module"

@Module({
  imports: [MongooseModule.forFeature([{ name: Voucher.name, schema: VoucherSchema }]), AuditModule],
  controllers: [VoucherController],
  providers: [VoucherService],
  exports: [VoucherService],
})
export class VoucherModule {}
