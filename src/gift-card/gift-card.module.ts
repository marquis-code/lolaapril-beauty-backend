import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { GiftCardService } from "./gift-card.service"
import { GiftCardController } from "./gift-card.controller"
import { GiftCard, GiftCardSchema } from "./schemas/gift-card.schema"

@Module({
  imports: [MongooseModule.forFeature([{ name: GiftCard.name, schema: GiftCardSchema }])],
  controllers: [GiftCardController],
  providers: [GiftCardService],
  exports: [GiftCardService],
})
export class GiftCardModule {}
