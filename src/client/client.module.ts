import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { MulterModule } from "@nestjs/platform-express"
import { ClientService } from "./client.service"
import { ClientController } from "./client.controller"
import { Client, ClientSchema } from "./schemas/client.schema"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
    MulterModule.register({
      dest: "./uploads",
    }),
  ],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
