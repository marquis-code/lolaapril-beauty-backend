import { Controller, Get, Post, Delete } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"
import type { GiftCardService } from "./gift-card.service"
import type { CreateGiftCardDto, UseGiftCardDto } from "./dto/create-gift-card.dto"

@ApiTags("gift-cards")
@Controller("gift-cards")
export class GiftCardController {
  constructor(private readonly giftCardService: GiftCardService) {}

  @Post()
  @ApiOperation({ summary: "Create a new gift card" })
  @ApiResponse({ status: 201, description: "Gift card created successfully" })
  create(createGiftCardDto: CreateGiftCardDto) {
    return this.giftCardService.create(createGiftCardDto)
  }

  @Get()
  @ApiOperation({ summary: "Get all gift cards" })
  findAll(query: any) {
    return this.giftCardService.findAll(query)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get gift card by ID" })
  findOne(id: string) {
    return this.giftCardService.findOne(id)
  }

  @Get("code/:code")
  @ApiOperation({ summary: "Get gift card by code" })
  findByCode(code: string) {
    return this.giftCardService.findByCode(code)
  }

  @Post("use")
  @ApiOperation({ summary: "Use gift card for payment" })
  useGiftCard(useGiftCardDto: UseGiftCardDto) {
    return this.giftCardService.useGiftCard(useGiftCardDto)
  }

  @Get("balance/:code")
  @ApiOperation({ summary: "Check gift card balance" })
  getBalance(code: string) {
    return this.giftCardService.getBalance(code)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete gift card" })
  remove(id: string) {
    return this.giftCardService.remove(id)
  }
}
