import { Injectable, NotFoundException } from "@nestjs/common"
import type { Model } from "mongoose"
import type { Voucher, VoucherDocument } from "./schemas/voucher.schema"
import type { CreateVoucherDto, ApplyVoucherDto } from "./dto/create-voucher.dto"

@Injectable()
export class VoucherService {
  constructor(private voucherModel: Model<VoucherDocument>) {}

  async create(createVoucherDto: CreateVoucherDto): Promise<Voucher> {
    const voucher = new this.voucherModel(createVoucherDto)
    return voucher.save()
  }

  async findAll(): Promise<Voucher[]> {
    return this.voucherModel.find({ status: "active" }).exec()
  }

  async findOne(id: string): Promise<Voucher> {
    const voucher = await this.voucherModel.findById(id).exec()
    if (!voucher) {
      throw new NotFoundException("Voucher not found")
    }
    return voucher
  }

  async findByCode(code: string): Promise<Voucher> {
    const voucher = await this.voucherModel.findOne({ code }).exec()
    if (!voucher) {
      throw new NotFoundException("Voucher not found")
    }
    return voucher
  }

  async validateVoucher(applyVoucherDto: ApplyVoucherDto): Promise<{
    valid: boolean
    discount: number
    message?: string
  }> {
    try {
      const voucher = await this.findByCode(applyVoucherDto.code)

      // Check if voucher is active
      if (voucher.status !== "active") {
        return { valid: false, discount: 0, message: "Voucher is not active" }
      }

      // Check date validity
      const now = new Date()
      if (now < voucher.validFrom || now > voucher.validUntil) {
        return { valid: false, discount: 0, message: "Voucher has expired or not yet valid" }
      }

      // Check usage limit
      if (voucher.usedCount >= voucher.usageLimit) {
        return { valid: false, discount: 0, message: "Voucher usage limit exceeded" }
      }

      // Check per-client usage limit
      const clientUsage = voucher.usageHistory.filter(
        (usage) => usage.clientId.toString() === applyVoucherDto.clientId.toString(),
      ).length

      if (clientUsage >= voucher.usagePerClient) {
        return { valid: false, discount: 0, message: "Client usage limit exceeded" }
      }

      // Check minimum order amount
      if (voucher.minOrderAmount && applyVoucherDto.orderAmount < voucher.minOrderAmount) {
        return {
          valid: false,
          discount: 0,
          message: `Minimum order amount of ${voucher.minOrderAmount} required`,
        }
      }

      // Check applicable services
      if (voucher.applicableServices.length > 0) {
        const hasApplicableService = applyVoucherDto.serviceIds.some((serviceId) =>
          voucher.applicableServices.some((applicableId) => applicableId.toString() === serviceId.toString()),
        )

        if (!hasApplicableService) {
          return { valid: false, discount: 0, message: "Voucher not applicable to selected services" }
        }
      }

      // Check applicable clients
      if (voucher.applicableClients.length > 0) {
        const isApplicableClient = voucher.applicableClients.some(
          (clientId) => clientId.toString() === applyVoucherDto.clientId.toString(),
        )

        if (!isApplicableClient) {
          return { valid: false, discount: 0, message: "Voucher not applicable to this client" }
        }
      }

      // Calculate discount
      let discount = 0
      if (voucher.discountType === "percentage") {
        discount = (applyVoucherDto.orderAmount * voucher.discountValue) / 100
      } else {
        discount = voucher.discountValue
      }

      // Apply maximum discount limit
      if (voucher.maxDiscountAmount && discount > voucher.maxDiscountAmount) {
        discount = voucher.maxDiscountAmount
      }

      return { valid: true, discount }
    } catch (error) {
      return { valid: false, discount: 0, message: "Invalid voucher code" }
    }
  }

  async applyVoucher(
    applyVoucherDto: ApplyVoucherDto,
    bookingId: string,
  ): Promise<{
    success: boolean
    discount: number
    message?: string
  }> {
    const validation = await this.validateVoucher(applyVoucherDto)

    if (!validation.valid) {
      return { success: false, discount: 0, message: validation.message }
    }

    // Update voucher usage
    await this.voucherModel.findOneAndUpdate(
      { code: applyVoucherDto.code },
      {
        $inc: { usedCount: 1 },
        $push: {
          usageHistory: {
            clientId: applyVoucherDto.clientId,
            usedAt: new Date(),
            bookingId,
          },
        },
      },
    )

    return { success: true, discount: validation.discount }
  }

  async update(id: string, updateData: Partial<CreateVoucherDto>): Promise<Voucher> {
    const voucher = await this.voucherModel.findByIdAndUpdate(id, updateData, { new: true })
    if (!voucher) {
      throw new NotFoundException("Voucher not found")
    }
    return voucher
  }

  async remove(id: string): Promise<void> {
    const result = await this.voucherModel.findByIdAndDelete(id)
    if (!result) {
      throw new NotFoundException("Voucher not found")
    }
  }
}
