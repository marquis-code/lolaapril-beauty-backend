import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ReportsService } from "./reports.service"
import { ReportsController } from "./reports.controller"
import { DailySalesSummary, DailySalesSummarySchema } from "./schemas/daily-sales-summary.schema"
import { Sale, SaleSchema } from "../sales/schemas/sale.schema"
import { Appointment, AppointmentSchema } from "../appointment/schemas/appointment.schema"
import { Client, ClientSchema } from "../client/schemas/client.schema"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DailySalesSummary.name, schema: DailySalesSummarySchema },
      { name: Sale.name, schema: SaleSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Client.name, schema: ClientSchema },
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
