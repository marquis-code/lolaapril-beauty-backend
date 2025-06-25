import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { PublicationsService } from "./publications.service"
import { PublicationsController } from "./publications.controller"
import { Publication, PublicationSchema } from "./schemas/publication.schema"

@Module({
  imports: [MongooseModule.forFeature([{ name: Publication.name, schema: PublicationSchema }])],
  providers: [PublicationsService],
  controllers: [PublicationsController],
})
export class PublicationsModule {}
