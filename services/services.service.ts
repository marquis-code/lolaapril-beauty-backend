import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { Model } from "mongoose"

import { type Service, type ServiceDocument, ServiceCategory } from "../schemas/service.schema"
import type { CreateServiceDto } from "./dto/create-service.dto"
import type { UpdateServiceDto } from "./dto/update-service.dto"
import type { ServiceFilterDto } from "./dto/service-filter.dto"

@Injectable()
export class ServicesService {
  private serviceModel: Model<ServiceDocument>

  constructor(serviceModel: Model<ServiceDocument>) {
    this.serviceModel = serviceModel
  }

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const service = new this.serviceModel(createServiceDto)
    return service.save()
  }

  async findAll(filterDto?: ServiceFilterDto): Promise<Service[]> {
    const query: any = {}

    if (filterDto?.category) {
      query.category = filterDto.category
    }

    if (filterDto?.isActive !== undefined) {
      query.isActive = filterDto.isActive
    }

    if (filterDto?.minPrice !== undefined) {
      query.price = { ...query.price, $gte: filterDto.minPrice }
    }

    if (filterDto?.maxPrice !== undefined) {
      query.price = { ...query.price, $lte: filterDto.maxPrice }
    }

    if (filterDto?.minDuration !== undefined) {
      query.duration = { ...query.duration, $gte: filterDto.minDuration }
    }

    if (filterDto?.maxDuration !== undefined) {
      query.duration = { ...query.duration, $lte: filterDto.maxDuration }
    }

    if (filterDto?.search) {
      query.$or = [
        { name: { $regex: filterDto.search, $options: "i" } },
        { description: { $regex: filterDto.search, $options: "i" } },
        { tags: { $in: [new RegExp(filterDto.search, "i")] } },
      ]
    }

    let queryBuilder = this.serviceModel.find(query)

    // Sorting
    if (filterDto?.sortBy) {
      const sortOrder = filterDto.sortOrder === "desc" ? -1 : 1
      queryBuilder = queryBuilder.sort({ [filterDto.sortBy]: sortOrder })
    } else {
      queryBuilder = queryBuilder.sort({ popularity: -1, createdAt: -1 })
    }

    // Pagination
    if (filterDto?.page && filterDto?.limit) {
      const skip = (filterDto.page - 1) * filterDto.limit
      queryBuilder = queryBuilder.skip(skip).limit(filterDto.limit)
    }

    return queryBuilder.exec()
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.serviceModel.findById(id).exec()
    if (!service) {
      throw new NotFoundException("Service not found")
    }
    return service
  }

  async findByCategory(category: ServiceCategory): Promise<Service[]> {
    return this.serviceModel.find({ category, isActive: true }).exec()
  }

  async findPopular(limit = 10): Promise<Service[]> {
    return this.serviceModel.find({ isActive: true }).sort({ popularity: -1 }).limit(limit).exec()
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const service = await this.serviceModel
      .findByIdAndUpdate(id, updateServiceDto, { new: true, runValidators: true })
      .exec()

    if (!service) {
      throw new NotFoundException("Service not found")
    }

    return service
  }

  async remove(id: string): Promise<void> {
    const result = await this.serviceModel.findByIdAndDelete(id).exec()
    if (!result) {
      throw new NotFoundException("Service not found")
    }
  }

  async toggleActive(id: string): Promise<Service> {
    const service = await this.serviceModel.findById(id).exec()
    if (!service) {
      throw new NotFoundException("Service not found")
    }

    service.isActive = !service.isActive
    return service.save()
  }

  async incrementPopularity(id: string): Promise<void> {
    await this.serviceModel.findByIdAndUpdate(id, { $inc: { popularity: 1 } }, { new: true }).exec()
  }

  async getServicesByIds(serviceIds: string[]): Promise<Service[]> {
    const services = await this.serviceModel.find({ _id: { $in: serviceIds }, isActive: true }).exec()

    if (services.length !== serviceIds.length) {
      throw new BadRequestException("One or more services not found or inactive")
    }

    return services
  }

  async calculateTotalPrice(serviceIds: string[]): Promise<number> {
    const services = await this.getServicesByIds(serviceIds)
    return services.reduce((total, service) => total + service.price, 0)
  }

  async calculateTotalDuration(serviceIds: string[]): Promise<number> {
    const services = await this.getServicesByIds(serviceIds)
    return services.reduce((total, service) => total + service.duration, 0)
  }

  async getServiceCategories(): Promise<ServiceCategory[]> {
    return Object.values(ServiceCategory)
  }

  async getServiceStats(): Promise<any> {
    const totalServices = await this.serviceModel.countDocuments()
    const activeServices = await this.serviceModel.countDocuments({ isActive: true })
    const inactiveServices = totalServices - activeServices

    const categoryStats = await this.serviceModel.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    const priceStats = await this.serviceModel.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ])

    return {
      totalServices,
      activeServices,
      inactiveServices,
      categoryStats,
      priceStats: priceStats[0] || { avgPrice: 0, minPrice: 0, maxPrice: 0 },
    }
  }
}
