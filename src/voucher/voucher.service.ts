// import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
// import { InjectModel } from "@nestjs/mongoose"
// import { Model } from "mongoose"
// import { Voucher, type VoucherDocument } from "./schemas/voucher.schema"
// import { CreateVoucherDto } from "./dto/create-voucher.dto"
// import { UpdateVoucherDto } from "./dto/update-voucher.dto"
// import { VoucherQueryDto } from "./dto/voucher-query.dto"

// @Injectable()
// export class VoucherService {
//   constructor(
//     @InjectModel(Voucher.name) private voucherModel: Model<VoucherDocument>,
//   ) {}


//    async create(createVoucherDto: CreateVoucherDto, userId: string): Promise<Voucher> {
//   const existingVoucher = await this.voucherModel.findOne({
//     voucherCode: createVoucherDto.voucherCode,
//   });
//   if (existingVoucher) {
//     throw new BadRequestException("Voucher code already exists");
//   }

//   const voucher = new this.voucherModel({
//     ...createVoucherDto,
//     createdBy: userId,   // ✅ automatically set from token
//   });

//   return voucher.save();
// }



//   // async create(createVoucherDto: CreateVoucherDto): Promise<Voucher> {
//   //   // Check if voucher code already exists
//   //   const existingVoucher = await this.voucherModel.findOne({
//   //     voucherCode: createVoucherDto.voucherCode,
//   //   })

//   //   if (existingVoucher) {
//   //     throw new BadRequestException("Voucher code already exists")
//   //   }

//   //   const voucher = new this.voucherModel(createVoucherDto)
//   //   return voucher.save()
//   // }

//   async findAll(query: VoucherQueryDto) {
//     const {
//       page = 1,
//       limit = 10,
//       status,
//       discountType,
//       validFrom,
//       validUntil,
//       search,
//       sortBy = "createdAt",
//       sortOrder = "desc",
//     } = query

//     const filter: any = {}

//     if (status) filter.status = status
//     if (discountType) filter.discountType = discountType

//     // Date filtering
//     if (validFrom) filter.validFrom = { $gte: new Date(validFrom) }
//     if (validUntil) filter.validUntil = { $lte: new Date(validUntil) }

//     // Search functionality
//     if (search) {
//       filter.$or = [
//         { voucherCode: { $regex: search, $options: "i" } },
//         { voucherName: { $regex: search, $options: "i" } },
//         { description: { $regex: search, $options: "i" } },
//       ]
//     }

//     const skip = (page - 1) * limit
//     const sortOptions: any = {}
//     sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1

//     const [vouchers, total] = await Promise.all([
//       this.voucherModel
//         .find(filter)
//         .populate("createdBy", "firstName lastName email")
//         .sort(sortOptions)
//         .skip(skip)
//         .limit(limit)
//         .exec(),
//       this.voucherModel.countDocuments(filter),
//     ])

//     return {
//       vouchers,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     }
//   }

//   async findOne(id: string): Promise<Voucher> {
//     const voucher = await this.voucherModel.findById(id).populate("createdBy", "firstName lastName email").exec()

//     if (!voucher) {
//       throw new NotFoundException("Voucher not found")
//     }
//     return voucher
//   }

//   async findByCode(voucherCode: string): Promise<Voucher> {
//     const voucher = await this.voucherModel.findOne({ voucherCode }).exec()
//     if (!voucher) {
//       throw new NotFoundException("Voucher not found")
//     }
//     return voucher
//   }

//   async update(id: string, updateVoucherDto: UpdateVoucherDto): Promise<Voucher> {
//     const voucher = await this.voucherModel
//       .findByIdAndUpdate(id, { ...updateVoucherDto, updatedAt: new Date() }, { new: true })
//       .populate("createdBy", "firstName lastName email")
//       .exec()

//     if (!voucher) {
//       throw new NotFoundException("Voucher not found")
//     }
//     return voucher
//   }

//   async remove(id: string): Promise<void> {
//     const result = await this.voucherModel.findByIdAndDelete(id)
//     if (!result) {
//       throw new NotFoundException("Voucher not found")
//     }
//   }

//   async validateVoucher(
//     voucherCode: string,
//     clientId: string,
//     serviceIds: string[],
//     totalAmount: number,
//   ): Promise<{
//     isValid: boolean
//     voucher?: Voucher
//     discountAmount?: number
//     message?: string
//   }> {
//     const voucher = await this.voucherModel.findOne({ voucherCode }).exec()

//     if (!voucher) {
//       return { isValid: false, message: "Voucher not found" }
//     }

//     // Check if voucher is active
//     if (voucher.status !== "active") {
//       return { isValid: false, message: "Voucher is not active" }
//     }

//     // Check validity dates
//     const now = new Date()
//     if (now < voucher.validFrom || now > voucher.validUntil) {
//       return { isValid: false, message: "Voucher has expired or is not yet valid" }
//     }

//     // Check usage limits
//     if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
//       return { isValid: false, message: "Voucher usage limit exceeded" }
//     }

//     // Check minimum spend
//     if (voucher.restrictions.minimumSpend && totalAmount < voucher.restrictions.minimumSpend) {
//       return { isValid: false, message: `Minimum spend of ${voucher.restrictions.minimumSpend} required` }
//     }

//     // Check applicable services
// if (voucher.restrictions.applicableServices?.length > 0) {
//   const hasApplicableService = serviceIds.some((id) =>
//     voucher.restrictions.applicableServices.some((svc) => svc.toString() === id),
//   )
//   if (!hasApplicableService) {
//     return { isValid: false, message: "Voucher not applicable to selected services" }
//   }
// }

// // Check excluded services
// if (voucher.restrictions.excludedServices?.length > 0) {
//   const hasExcludedService = serviceIds.some((id) =>
//     voucher.restrictions.excludedServices.some((svc) => svc.toString() === id),
//   )
//   if (hasExcludedService) {
//     return { isValid: false, message: "Voucher cannot be used with selected services" }
//   }
// }


//     // // Check applicable services
//     // if (voucher.restrictions.applicableServices?.length > 0) {
//     //   const hasApplicableService = serviceIds.some((id) => voucher.restrictions.applicableServices.includes(id))
//     //   if (!hasApplicableService) {
//     //     return { isValid: false, message: "Voucher not applicable to selected services" }
//     //   }
//     // }

//     // // Check excluded services
//     // if (voucher.restrictions.excludedServices?.length > 0) {
//     //   const hasExcludedService = serviceIds.some((id) => voucher.restrictions.excludedServices.includes(id))
//     //   if (hasExcludedService) {
//     //     return { isValid: false, message: "Voucher cannot be used with selected services" }
//     //   }
//     // }

//     // Calculate discount amount
//     let discountAmount = 0
//     switch (voucher.discountType) {
//       case "percentage":
//         discountAmount = (totalAmount * voucher.discountValue) / 100
//         break
//       case "fixed_amount":
//         discountAmount = voucher.discountValue
//         break
//       default:
//         discountAmount = voucher.discountValue
//     }

//     // Apply maximum discount limit
//     if (voucher.restrictions.maximumDiscount && discountAmount > voucher.restrictions.maximumDiscount) {
//       discountAmount = voucher.restrictions.maximumDiscount
//     }

//     return {
//       isValid: true,
//       voucher,
//       discountAmount,
//       message: "Voucher is valid",
//     }
//   }

//   async useVoucher(voucherCode: string): Promise<Voucher> {
//     const voucher = await this.voucherModel
//       .findOneAndUpdate(
//         { voucherCode },
//         {
//           $inc: { usedCount: 1 },
//           updatedAt: new Date(),
//         },
//         { new: true },
//       )
//       .exec()

//     if (!voucher) {
//       throw new NotFoundException("Voucher not found")
//     }

//     // Update status if usage limit reached
//     if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
//       voucher.status = "used_up"
//       await voucher.save()
//     }

//     return voucher
//   }

//   async getVoucherStats() {
//     const stats = await this.voucherModel.aggregate([
//       {
//         $group: {
//           _id: null,
//           total: { $sum: 1 },
//           active: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
//           expired: { $sum: { $cond: [{ $eq: ["$status", "expired"] }, 1, 0] } },
//           usedUp: { $sum: { $cond: [{ $eq: ["$status", "used_up"] }, 1, 0] } },
//           totalUsage: { $sum: "$usedCount" },
//         },
//       },
//     ])

//     const discountTypeStats = await this.voucherModel.aggregate([
//       {
//         $group: {
//           _id: "$discountType",
//           count: { $sum: 1 },
//           totalUsage: { $sum: "$usedCount" },
//         },
//       },
//     ])

//     return {
//       overview: stats[0] || { total: 0, active: 0, expired: 0, usedUp: 0, totalUsage: 0 },
//       byDiscountType: discountTypeStats,
//     }
//   }
// }


import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Voucher, type VoucherDocument } from "./schemas/voucher.schema"
import { CreateVoucherDto } from "./dto/create-voucher.dto"
import { UpdateVoucherDto } from "./dto/update-voucher.dto"
import { VoucherQueryDto } from "./dto/voucher-query.dto"

@Injectable()
export class VoucherService {
  constructor(
    @InjectModel(Voucher.name) private voucherModel: Model<VoucherDocument>,
  ) {}


   async create(createVoucherDto: CreateVoucherDto, userId: string): Promise<Voucher> {
  const existingVoucher = await this.voucherModel.findOne({
    voucherCode: createVoucherDto.voucherCode,
  });
  if (existingVoucher) {
    throw new BadRequestException("Voucher code already exists");
  }

  const voucher = new this.voucherModel({
    ...createVoucherDto,
    createdBy: userId,   // ✅ automatically set from token
  });

  return voucher.save();
}



  // async create(createVoucherDto: CreateVoucherDto): Promise<Voucher> {
  //   // Check if voucher code already exists
  //   const existingVoucher = await this.voucherModel.findOne({
  //     voucherCode: createVoucherDto.voucherCode,
  //   })

  //   if (existingVoucher) {
  //     throw new BadRequestException("Voucher code already exists")
  //   }

  //   const voucher = new this.voucherModel(createVoucherDto)
  //   return voucher.save()
  // }

  async findAll(query: VoucherQueryDto) {
    const {
      page = 1,
      limit = 10,
      status,
      discountType,
      validFrom,
      validUntil,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query

    const filter: any = {}

    if (status) filter.status = status
    if (discountType) filter.discountType = discountType

    // Date filtering
    if (validFrom) filter.validFrom = { $gte: new Date(validFrom) }
    if (validUntil) filter.validUntil = { $lte: new Date(validUntil) }

    // Search functionality
    if (search) {
      filter.$or = [
        { voucherCode: { $regex: search, $options: "i" } },
        { voucherName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    const skip = (page - 1) * limit
    const sortOptions: any = {}
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1

    // Separate query construction to avoid TypeScript complex type inference
    const vouchersQuery = this.voucherModel.find(filter)
    vouchersQuery.populate("createdBy", "firstName lastName email")
    vouchersQuery.sort(sortOptions)
    vouchersQuery.skip(skip)
    vouchersQuery.limit(limit)

    const vouchers = await vouchersQuery.exec()
    const total = await this.voucherModel.countDocuments(filter)

    return {
      vouchers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async findOne(id: string): Promise<Voucher> {
    const voucherQuery = this.voucherModel.findById(id)
    voucherQuery.populate("createdBy", "firstName lastName email")
    
    const voucher = await voucherQuery.exec()

    if (!voucher) {
      throw new NotFoundException("Voucher not found")
    }
    return voucher
  }

  async findByCode(voucherCode: string): Promise<Voucher> {
    const voucher = await this.voucherModel.findOne({ voucherCode }).exec()
    if (!voucher) {
      throw new NotFoundException("Voucher not found")
    }
    return voucher
  }

  async update(id: string, updateVoucherDto: UpdateVoucherDto): Promise<Voucher> {
    const updateQuery = this.voucherModel.findByIdAndUpdate(
      id, 
      { ...updateVoucherDto, updatedAt: new Date() }, 
      { new: true }
    )
    updateQuery.populate("createdBy", "firstName lastName email")
    
    const voucher = await updateQuery.exec()

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

  async validateVoucher(
    voucherCode: string,
    clientId: string,
    serviceIds: string[],
    totalAmount: number,
  ): Promise<{
    isValid: boolean
    voucher?: Voucher
    discountAmount?: number
    message?: string
  }> {
    const voucher = await this.voucherModel.findOne({ voucherCode }).exec()

    if (!voucher) {
      return { isValid: false, message: "Voucher not found" }
    }

    // Check if voucher is active
    if (voucher.status !== "active") {
      return { isValid: false, message: "Voucher is not active" }
    }

    // Check validity dates
    const now = new Date()
    if (now < voucher.validFrom || now > voucher.validUntil) {
      return { isValid: false, message: "Voucher has expired or is not yet valid" }
    }

    // Check usage limits
    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
      return { isValid: false, message: "Voucher usage limit exceeded" }
    }

    // Check minimum spend
    if (voucher.restrictions.minimumSpend && totalAmount < voucher.restrictions.minimumSpend) {
      return { isValid: false, message: `Minimum spend of ${voucher.restrictions.minimumSpend} required` }
    }

    // Check applicable services
if (voucher.restrictions.applicableServices?.length > 0) {
  const hasApplicableService = serviceIds.some((id) =>
    voucher.restrictions.applicableServices.some((svc) => svc.toString() === id),
  )
  if (!hasApplicableService) {
    return { isValid: false, message: "Voucher not applicable to selected services" }
  }
}

// Check excluded services
if (voucher.restrictions.excludedServices?.length > 0) {
  const hasExcludedService = serviceIds.some((id) =>
    voucher.restrictions.excludedServices.some((svc) => svc.toString() === id),
  )
  if (hasExcludedService) {
    return { isValid: false, message: "Voucher cannot be used with selected services" }
  }
}


    // // Check applicable services
    // if (voucher.restrictions.applicableServices?.length > 0) {
    //   const hasApplicableService = serviceIds.some((id) => voucher.restrictions.applicableServices.includes(id))
    //   if (!hasApplicableService) {
    //     return { isValid: false, message: "Voucher not applicable to selected services" }
    //   }
    // }

    // // Check excluded services
    // if (voucher.restrictions.excludedServices?.length > 0) {
    //   const hasExcludedService = serviceIds.some((id) => voucher.restrictions.excludedServices.includes(id))
    //   if (hasExcludedService) {
    //     return { isValid: false, message: "Voucher cannot be used with selected services" }
    //   }
    // }

    // Calculate discount amount
    let discountAmount = 0
    switch (voucher.discountType) {
      case "percentage":
        discountAmount = (totalAmount * voucher.discountValue) / 100
        break
      case "fixed_amount":
        discountAmount = voucher.discountValue
        break
      default:
        discountAmount = voucher.discountValue
    }

    // Apply maximum discount limit
    if (voucher.restrictions.maximumDiscount && discountAmount > voucher.restrictions.maximumDiscount) {
      discountAmount = voucher.restrictions.maximumDiscount
    }

    return {
      isValid: true,
      voucher,
      discountAmount,
      message: "Voucher is valid",
    }
  }

  async useVoucher(voucherCode: string): Promise<Voucher> {
    const useQuery = this.voucherModel.findOneAndUpdate(
      { voucherCode },
      {
        $inc: { usedCount: 1 },
        updatedAt: new Date(),
      },
      { new: true },
    )
    
    const voucher = await useQuery.exec()

    if (!voucher) {
      throw new NotFoundException("Voucher not found")
    }

    // Update status if usage limit reached
    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
      voucher.status = "used_up"
      await voucher.save()
    }

    return voucher
  }

  async getVoucherStats() {
    const stats = await this.voucherModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
          expired: { $sum: { $cond: [{ $eq: ["$status", "expired"] }, 1, 0] } },
          usedUp: { $sum: { $cond: [{ $eq: ["$status", "used_up"] }, 1, 0] } },
          totalUsage: { $sum: "$usedCount" },
        },
      },
    ])

    const discountTypeStats = await this.voucherModel.aggregate([
      {
        $group: {
          _id: "$discountType",
          count: { $sum: 1 },
          totalUsage: { $sum: "$usedCount" },
        },
      },
    ])

    return {
      overview: stats[0] || { total: 0, active: 0, expired: 0, usedUp: 0, totalUsage: 0 },
      byDiscountType: discountTypeStats,
    }
  }
}