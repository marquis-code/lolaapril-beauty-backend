import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { Model } from "mongoose"
import type { GiftCard, GiftCardDocument } from "./schemas/gift-card.schema"
import type { CreateGiftCardDto, UseGiftCardDto } from "./dto/create-gift-card.dto"

@Injectable()
export class GiftCardService {
  constructor(private giftCardModel: Model<GiftCardDocument>) {}

  async create(createGiftCardDto: CreateGiftCardDto): Promise<GiftCard> {
    const code = this.generateGiftCardCode()
    const giftCard = new this.giftCardModel({
      ...createGiftCardDto,
      code,
      purchaseDate: new Date(),
      status: "active",
    })
    return giftCard.save()
  }

  async findAll(query: any = {}): Promise<GiftCard[]> {
    return this.giftCardModel.find(query).populate("purchasedBy assignedTo").exec()
  }

  async findOne(id: string): Promise<GiftCard> {
    const giftCard = await this.giftCardModel.findById(id).populate("purchasedBy assignedTo").exec()
    if (!giftCard) {
      throw new NotFoundException("Gift card not found")
    }
    return giftCard
  }

  async findByCode(code: string): Promise<GiftCard> {
    const giftCard = await this.giftCardModel.findOne({ code }).populate("purchasedBy assignedTo").exec()
    if (!giftCard) {
      throw new NotFoundException("Gift card not found")
    }
    return giftCard
  }

  async useGiftCard(useGiftCardDto: UseGiftCardDto): Promise<{ success: boolean; remainingBalance: number }> {
    const giftCard = await this.findByCode(useGiftCardDto.code)

    if (giftCard.status !== "active") {
      throw new BadRequestException("Gift card is not active")
    }

    if (new Date() > giftCard.expiryDate) {
      await this.giftCardModel.findByIdAndUpdate(giftCard._id, { status: "expired" })
      throw new BadRequestException("Gift card has expired")
    }

    const remainingBalance = giftCard.amount - giftCard.usedAmount
    if (useGiftCardDto.amount > remainingBalance) {
      throw new BadRequestException("Insufficient gift card balance")
    }

    const newUsedAmount = giftCard.usedAmount + useGiftCardDto.amount
    const newStatus = newUsedAmount >= giftCard.amount ? "used" : "active"

    await this.giftCardModel.findByIdAndUpdate(giftCard._id, {
      usedAmount: newUsedAmount,
      status: newStatus,
      $push: {
        usageHistory: {
          date: new Date(),
          amount: useGiftCardDto.amount,
          bookingId: useGiftCardDto.bookingId,
        },
      },
    })

    return {
      success: true,
      remainingBalance: giftCard.amount - newUsedAmount,
    }
  }

  async getBalance(code: string): Promise<{ balance: number; status: string }> {
    const giftCard = await this.findByCode(code)
    return {
      balance: giftCard.amount - giftCard.usedAmount,
      status: giftCard.status,
    }
  }

  private generateGiftCardCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  async remove(id: string): Promise<void> {
    const result = await this.giftCardModel.findByIdAndDelete(id)
    if (!result) {
      throw new NotFoundException("Gift card not found")
    }
  }
}
