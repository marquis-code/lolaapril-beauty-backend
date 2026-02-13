import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { SalesService } from "./sales.service"
import { SalesController } from "./sales.controller"
import { Sale, SaleSchema } from "./schemas/sale.schema"
import { AuditModule } from "../audit/audit.module"
import { SalesEventListener } from "./services/sales-event.listener"

@Module({
  imports: [MongooseModule.forFeature([{ name: Sale.name, schema: SaleSchema }]), AuditModule],
  controllers: [SalesController],
  providers: [SalesService, SalesEventListener],
  exports: [SalesService],
})
export class SalesModule { }
