// import { Injectable, NotFoundException, ConflictException } from "@nestjs/common"
// import type { Model, SortOrder } from "mongoose"
// import type { ServiceCategory, ServiceCategoryDocument } from "./schemas/service-category.schema"
// import type { Service, ServiceDocument } from "./schemas/service.schema"
// import type { ServiceBundle, ServiceBundleDocument } from "./schemas/service-bundle.schema"
// import type { CreateServiceCategoryDto } from "./dto/create-service-category.dto"
// import type { CreateServiceDto } from "./dto/create-service.dto"
// import type { CreateServiceBundleDto } from "./dto/create-service-bundle.dto"
// import type { CreateServiceVariantDto } from "./dto/service-variant.dto"
// import type { UpdateServiceCategoryDto } from "./dto/update-service-category.dto"
// import type { UpdateServiceDto } from "./dto/update-service.dto"
// import type { UpdateServiceBundleDto } from "./dto/update-service-bundle.dto"
// import type { ServiceQueryDto } from "./dto/service-query.dto"
// import type { ApiResponse } from "../common/interfaces/common.interface"

// @Injectable()
// export class ServiceService {
//   private serviceCategoryModel: Model<ServiceCategoryDocument>
//   private serviceModel: Model<ServiceDocument>
//   private serviceBundleModel: Model<ServiceBundleDocument>

//   constructor(
//     serviceCategoryModel: Model<ServiceCategoryDocument>,
//     serviceModel: Model<ServiceDocument>,
//     serviceBundleModel: Model<ServiceBundleDocument>,
//   ) {
//     this.serviceCategoryModel = serviceCategoryModel
//     this.serviceModel = serviceModel
//     this.serviceBundleModel = serviceBundleModel
//   }

//   // Service Categories
//   async createCategory(createCategoryDto: CreateServiceCategoryDto): Promise<ApiResponse<ServiceCategory>> {
//     try {
//       const existingCategory = await this.serviceCategoryModel.findOne({
//         categoryName: createCategoryDto.categoryName,
//       })

//       if (existingCategory) {
//         throw new ConflictException("Service category with this name already exists")
//       }

//       const category = new this.serviceCategoryModel(createCategoryDto)
//       const savedCategory = await category.save()

//       return {
//         success: true,
//         data: savedCategory,
//         message: "Service category created successfully",
//       }
//     } catch (error) {
//       if (error instanceof ConflictException) {
//         throw error
//       }
//       throw new Error(`Failed to create service category: ${error.message}`)
//     }
//   }

//   async findAllCategories(): Promise<ApiResponse<ServiceCategory[]>> {
//     try {
//       const categories = await this.serviceCategoryModel.find({ isActive: true }).sort({ createdAt: -1 })
//       return {
//         success: true,
//         data: categories,
//       }
//     } catch (error) {
//       throw new Error(`Failed to fetch service categories: ${error.message}`)
//     }
//   }

//   async updateCategory(id: string, updateCategoryDto: UpdateServiceCategoryDto): Promise<ApiResponse<ServiceCategory>> {
//     try {
//       if (updateCategoryDto.categoryName) {
//         const existingCategory = await this.serviceCategoryModel.findOne({
//           categoryName: updateCategoryDto.categoryName,
//           _id: { $ne: id },
//         })

//         if (existingCategory) {
//           throw new ConflictException("Service category with this name already exists")
//         }
//       }

//       const category = await this.serviceCategoryModel.findByIdAndUpdate(
//         id,
//         { ...updateCategoryDto, updatedAt: new Date() },
//         { new: true, runValidators: true },
//       )

//       if (!category) {
//         throw new NotFoundException("Service category not found")
//       }

//       return {
//         success: true,
//         data: category,
//         message: "Service category updated successfully",
//       }
//     } catch (error) {
//       if (error instanceof NotFoundException || error instanceof ConflictException) {
//         throw error
//       }
//       throw new Error(`Failed to update service category: ${error.message}`)
//     }
//   }

//   // Services
//   async createService(createServiceDto: CreateServiceDto): Promise<ApiResponse<Service>> {
//     try {
//       const existingService = await this.serviceModel.findOne({
//         "basicDetails.serviceName": createServiceDto.basicDetails.serviceName,
//       })

//       if (existingService) {
//         throw new ConflictException("Service with this name already exists")
//       }

//       const service = new this.serviceModel(createServiceDto)
//       const savedService = await service.save()

//       return {
//         success: true,
//         data: savedService,
//         message: "Service created successfully",
//       }
//     } catch (error) {
//       if (error instanceof ConflictException) {
//         throw error
//       }
//       throw new Error(`Failed to create service: ${error.message}`)
//     }
//   }

//   async findAllServices(query: ServiceQueryDto): Promise<ApiResponse<Service[]>> {
//     try {
//       const {
//         page = 1,
//         limit = 10,
//         sortBy = "createdAt",
//         sortOrder = "desc",
//         search,
//         category,
//         serviceType,
//         priceType,
//         isActive,
//         onlineBookingEnabled,
//       } = query

//       const filter: any = {}

//       if (search) {
//         filter.$or = [
//           { "basicDetails.serviceName": { $regex: search, $options: "i" } },
//           { "basicDetails.description": { $regex: search, $options: "i" } },
//         ]
//       }

//       if (category) filter["basicDetails.category"] = category
//       if (serviceType) filter["basicDetails.serviceType"] = serviceType
//       if (priceType) filter["pricingAndDuration.priceType"] = priceType
//       if (isActive !== undefined) filter.isActive = isActive
//       if (onlineBookingEnabled !== undefined) filter["settings.onlineBooking.enabled"] = onlineBookingEnabled

//       const skip = (page - 1) * limit
//       const sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 }

//       const [services, total] = await Promise.all([
//         this.serviceModel.find(filter).sort(sortOptions).skip(skip).limit(limit).exec(),
//         this.serviceModel.countDocuments(filter),
//       ])

//       return {
//         success: true,
//         data: services,
//         pagination: {
//           page,
//           limit,
//           total,
//           totalPages: Math.ceil(total / limit),
//         },
//       }
//     } catch (error) {
//       throw new Error(`Failed to fetch services: ${error.message}`)
//     }
//   }

//   async findOneService(id: string): Promise<ApiResponse<Service>> {
//     try {
//       const service = await this.serviceModel.findById(id)
//       if (!service) {
//         throw new NotFoundException("Service not found")
//       }

//       return {
//         success: true,
//         data: service,
//       }
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error
//       }
//       throw new Error(`Failed to fetch service: ${error.message}`)
//     }
//   }

//   async updateService(id: string, updateServiceDto: UpdateServiceDto): Promise<ApiResponse<Service>> {
//     try {
//       if (updateServiceDto.basicDetails?.serviceName) {
//         const existingService = await this.serviceModel.findOne({
//           "basicDetails.serviceName": updateServiceDto.basicDetails.serviceName,
//           _id: { $ne: id },
//         })

//         if (existingService) {
//           throw new ConflictException("Service with this name already exists")
//         }
//       }

//       const service = await this.serviceModel.findByIdAndUpdate(
//         id,
//         { ...updateServiceDto, updatedAt: new Date() },
//         { new: true, runValidators: true },
//       )

//       if (!service) {
//         throw new NotFoundException("Service not found")
//       }

//       return {
//         success: true,
//         data: service,
//         message: "Service updated successfully",
//       }
//     } catch (error) {
//       if (error instanceof NotFoundException || error instanceof ConflictException) {
//         throw error
//       }
//       throw new Error(`Failed to update service: ${error.message}`)
//     }
//   }

//   async addServiceVariant(serviceId: string, variantDto: CreateServiceVariantDto): Promise<ApiResponse<Service>> {
//     try {
//       const service = await this.serviceModel.findById(serviceId)
//       if (!service) {
//         throw new NotFoundException("Service not found")
//       }

//       // Check if variant name already exists for this service
//       const existingVariant = service.variants.find((v) => v.variantName === variantDto.variantName)
//       if (existingVariant) {
//         throw new ConflictException("Variant with this name already exists for this service")
//       }

//       service.variants.push(variantDto as any)
//       service.updatedAt = new Date()
//       const updatedService = await service.save()

//       return {
//         success: true,
//         data: updatedService,
//         message: "Service variant added successfully",
//       }
//     } catch (error) {
//       if (error instanceof NotFoundException || error instanceof ConflictException) {
//         throw error
//       }
//       throw new Error(`Failed to add service variant: ${error.message}`)
//     }
//   }

//   // Service Bundles
//   async createBundle(createBundleDto: CreateServiceBundleDto): Promise<ApiResponse<ServiceBundle>> {
//     try {
//       const existingBundle = await this.serviceBundleModel.findOne({
//         "basicInfo.bundleName": createBundleDto.basicInfo.bundleName,
//       })

//       if (existingBundle) {
//         throw new ConflictException("Service bundle with this name already exists")
//       }

//       const bundle = new this.serviceBundleModel(createBundleDto)
//       const savedBundle = await bundle.save()

//       return {
//         success: true,
//         data: savedBundle,
//         message: "Service bundle created successfully",
//       }
//     } catch (error) {
//       if (error instanceof ConflictException) {
//         throw error
//       }
//       throw new Error(`Failed to create service bundle: ${error.message}`)
//     }
//   }

//   async findAllBundles(): Promise<ApiResponse<ServiceBundle[]>> {
//     try {
//       const bundles = await this.serviceBundleModel.find({ isActive: true }).sort({ createdAt: -1 })
//       return {
//         success: true,
//         data: bundles,
//       }
//     } catch (error) {
//       throw new Error(`Failed to fetch service bundles: ${error.message}`)
//     }
//   }

//   async findOneBundle(id: string): Promise<ApiResponse<ServiceBundle>> {
//     try {
//       const bundle = await this.serviceBundleModel.findById(id)
//       if (!bundle) {
//         throw new NotFoundException("Service bundle not found")
//       }

//       return {
//         success: true,
//         data: bundle,
//       }
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error
//       }
//       throw new Error(`Failed to fetch service bundle: ${error.message}`)
//     }
//   }

//   async updateBundle(id: string, updateBundleDto: UpdateServiceBundleDto): Promise<ApiResponse<ServiceBundle>> {
//     try {
//       if (updateBundleDto.basicInfo?.bundleName) {
//         const existingBundle = await this.serviceBundleModel.findOne({
//           "basicInfo.bundleName": updateBundleDto.basicInfo.bundleName,
//           _id: { $ne: id },
//         })

//         if (existingBundle) {
//           throw new ConflictException("Service bundle with this name already exists")
//         }
//       }

//       const bundle = await this.serviceBundleModel.findByIdAndUpdate(
//         id,
//         { ...updateBundleDto, updatedAt: new Date() },
//         { new: true, runValidators: true },
//       )

//       if (!bundle) {
//         throw new NotFoundException("Service bundle not found")
//       }

//       return {
//         success: true,
//         data: bundle,
//         message: "Service bundle updated successfully",
//       }
//     } catch (error) {
//       if (error instanceof NotFoundException || error instanceof ConflictException) {
//         throw error
//       }
//       throw new Error(`Failed to update service bundle: ${error.message}`)
//     }
//   }

//   async removeService(id: string): Promise<ApiResponse<null>> {
//     try {
//       const service = await this.serviceModel.findByIdAndUpdate(
//         id,
//         { isActive: false, updatedAt: new Date() },
//         { new: true },
//       )

//       if (!service) {
//         throw new NotFoundException("Service not found")
//       }

//       return {
//         success: true,
//         message: "Service deactivated successfully",
//       }
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error
//       }
//       throw new Error(`Failed to deactivate service: ${error.message}`)
//     }
//   }

//   async getServiceStats(): Promise<ApiResponse<any>> {
//     try {
//       const [totalServices, activeServices, totalCategories, totalBundles] = await Promise.all([
//         this.serviceModel.countDocuments(),
//         this.serviceModel.countDocuments({ isActive: true }),
//         this.serviceCategoryModel.countDocuments({ isActive: true }),
//         this.serviceBundleModel.countDocuments({ isActive: true }),
//       ])

//       const servicesByCategory = await this.serviceModel.aggregate([
//         { $match: { isActive: true } },
//         { $group: { _id: "$basicDetails.category", count: { $sum: 1 } } },
//         { $sort: { count: -1 } },
//       ])

//       return {
//         success: true,
//         data: {
//           totalServices,
//           activeServices,
//           totalCategories,
//           totalBundles,
//           servicesByCategory,
//         },
//       }
//     } catch (error) {
//       throw new Error(`Failed to get service stats: ${error.message}`)
//     }
//   }
// }



import { Injectable, NotFoundException, ConflictException } from "@nestjs/common"
import type { Model, SortOrder } from "mongoose"
import type { ServiceCategory, ServiceCategoryDocument } from "./schemas/service-category.schema"
import type { Service, ServiceDocument } from "./schemas/service.schema"
import type { ServiceBundle, ServiceBundleDocument } from "./schemas/service-bundle.schema"
import type { CreateServiceCategoryDto } from "./dto/create-service-category.dto"
import type { CreateServiceDto } from "./dto/create-service.dto"
import type { CreateServiceBundleDto } from "./dto/create-service-bundle.dto"
import type { CreateServiceVariantDto } from "./dto/service-variant.dto"
import type { UpdateServiceCategoryDto } from "./dto/update-service-category.dto"
import type { UpdateServiceDto } from "./dto/update-service.dto"
import type { UpdateServiceBundleDto } from "./dto/update-service-bundle.dto"
import type { ServiceQueryDto } from "./dto/service-query.dto"
import type { ApiResponse } from "../common/interfaces/common.interface"

@Injectable()
export class ServiceService {
  private serviceCategoryModel: Model<ServiceCategoryDocument>
  private serviceModel: Model<ServiceDocument>
  private serviceBundleModel: Model<ServiceBundleDocument>

  constructor(
    serviceCategoryModel: Model<ServiceCategoryDocument>,
    serviceModel: Model<ServiceDocument>,
    serviceBundleModel: Model<ServiceBundleDocument>,
  ) {
    this.serviceCategoryModel = serviceCategoryModel
    this.serviceModel = serviceModel
    this.serviceBundleModel = serviceBundleModel
  }

  // Service Categories
  async createCategory(createCategoryDto: CreateServiceCategoryDto): Promise<ApiResponse<ServiceCategory>> {
    try {
      const existingCategory = await this.serviceCategoryModel.findOne({
        categoryName: createCategoryDto.categoryName,
      })

      if (existingCategory) {
        throw new ConflictException("Service category with this name already exists")
      }

      const category = new this.serviceCategoryModel(createCategoryDto)
      const savedCategory = await category.save()

      return {
        success: true,
        data: savedCategory,
        message: "Service category created successfully",
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error
      }
      throw new Error(`Failed to create service category: ${error.message}`)
    }
  }

  async findAllCategories(): Promise<ApiResponse<ServiceCategory[]>> {
    try {
      const categories = await this.serviceCategoryModel.find({ isActive: true }).sort({ createdAt: -1 })
      return {
        success: true,
        data: categories,
      }
    } catch (error) {
      throw new Error(`Failed to fetch service categories: ${error.message}`)
    }
  }

  async updateCategory(id: string, updateCategoryDto: UpdateServiceCategoryDto): Promise<ApiResponse<ServiceCategory>> {
    try {
      if (updateCategoryDto.categoryName) {
        const existingCategory = await this.serviceCategoryModel.findOne({
          categoryName: updateCategoryDto.categoryName,
          _id: { $ne: id },
        })

        if (existingCategory) {
          throw new ConflictException("Service category with this name already exists")
        }
      }

      const category = await this.serviceCategoryModel.findByIdAndUpdate(
        id,
        { ...updateCategoryDto, updatedAt: new Date() },
        { new: true, runValidators: true },
      )

      if (!category) {
        throw new NotFoundException("Service category not found")
      }

      return {
        success: true,
        data: category,
        message: "Service category updated successfully",
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error
      }
      throw new Error(`Failed to update service category: ${error.message}`)
    }
  }

  // Services
  async createService(createServiceDto: CreateServiceDto): Promise<ApiResponse<Service>> {
    try {
      const existingService = await this.serviceModel.findOne({
        "basicDetails.serviceName": createServiceDto.basicDetails.serviceName,
      })

      if (existingService) {
        throw new ConflictException("Service with this name already exists")
      }

      const service = new this.serviceModel(createServiceDto)
      const savedService = await service.save()

      return {
        success: true,
        data: savedService,
        message: "Service created successfully",
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error
      }
      throw new Error(`Failed to create service: ${error.message}`)
    }
  }

  async findAllServices(query: ServiceQueryDto): Promise<ApiResponse<Service[]>> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
        search,
        category,
        serviceType,
        priceType,
        isActive,
        onlineBookingEnabled,
      } = query

      const filter: any = {}

      if (search) {
        filter.$or = [
          { "basicDetails.serviceName": { $regex: search, $options: "i" } },
          { "basicDetails.description": { $regex: search, $options: "i" } },
        ]
      }

      if (category) filter["basicDetails.category"] = category
      if (serviceType) filter["basicDetails.serviceType"] = serviceType
      if (priceType) filter["pricingAndDuration.priceType"] = priceType
      if (isActive !== undefined) filter.isActive = isActive
      if (onlineBookingEnabled !== undefined) filter["settings.onlineBooking.enabled"] = onlineBookingEnabled

      const skip = (page - 1) * limit
      const sortDirection: SortOrder = sortOrder === "asc" ? 1 : -1
      const sortOptions: Record<string, SortOrder> = { [sortBy]: sortDirection }

      const [services, total] = await Promise.all([
        this.serviceModel.find(filter).sort(sortOptions).skip(skip).limit(limit).exec(),
        this.serviceModel.countDocuments(filter),
      ])

      return {
        success: true,
        data: services,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      }
    } catch (error) {
      throw new Error(`Failed to fetch services: ${error.message}`)
    }
  }

  async findOneService(id: string): Promise<ApiResponse<Service>> {
    try {
      const service = await this.serviceModel.findById(id)
      if (!service) {
        throw new NotFoundException("Service not found")
      }

      return {
        success: true,
        data: service,
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new Error(`Failed to fetch service: ${error.message}`)
    }
  }

  async updateService(id: string, updateServiceDto: UpdateServiceDto): Promise<ApiResponse<Service>> {
    try {
      if (updateServiceDto.basicDetails?.serviceName) {
        const existingService = await this.serviceModel.findOne({
          "basicDetails.serviceName": updateServiceDto.basicDetails.serviceName,
          _id: { $ne: id },
        })

        if (existingService) {
          throw new ConflictException("Service with this name already exists")
        }
      }

      const service = await this.serviceModel.findByIdAndUpdate(
        id,
        { ...updateServiceDto, updatedAt: new Date() },
        { new: true, runValidators: true },
      )

      if (!service) {
        throw new NotFoundException("Service not found")
      }

      return {
        success: true,
        data: service,
        message: "Service updated successfully",
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error
      }
      throw new Error(`Failed to update service: ${error.message}`)
    }
  }

  async addServiceVariant(serviceId: string, variantDto: CreateServiceVariantDto): Promise<ApiResponse<Service>> {
    try {
      const service = await this.serviceModel.findById(serviceId)
      if (!service) {
        throw new NotFoundException("Service not found")
      }

      // Check if variant name already exists for this service
      const existingVariant = service.variants.find((v) => v.variantName === variantDto.variantName)
      if (existingVariant) {
        throw new ConflictException("Variant with this name already exists for this service")
      }

      service.variants.push(variantDto as any)
      service.updatedAt = new Date()
      const updatedService = await service.save()

      return {
        success: true,
        data: updatedService,
        message: "Service variant added successfully",
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error
      }
      throw new Error(`Failed to add service variant: ${error.message}`)
    }
  }

  // Service Bundles
  async createBundle(createBundleDto: CreateServiceBundleDto): Promise<ApiResponse<ServiceBundle>> {
    try {
      const existingBundle = await this.serviceBundleModel.findOne({
        "basicInfo.bundleName": createBundleDto.basicInfo.bundleName,
      })

      if (existingBundle) {
        throw new ConflictException("Service bundle with this name already exists")
      }

      const bundle = new this.serviceBundleModel(createBundleDto)
      const savedBundle = await bundle.save()

      return {
        success: true,
        data: savedBundle,
        message: "Service bundle created successfully",
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error
      }
      throw new Error(`Failed to create service bundle: ${error.message}`)
    }
  }

  async findAllBundles(): Promise<ApiResponse<ServiceBundle[]>> {
    try {
      const bundles = await this.serviceBundleModel.find({ isActive: true }).sort({ createdAt: -1 })
      return {
        success: true,
        data: bundles,
      }
    } catch (error) {
      throw new Error(`Failed to fetch service bundles: ${error.message}`)
    }
  }

  async findOneBundle(id: string): Promise<ApiResponse<ServiceBundle>> {
    try {
      const bundle = await this.serviceBundleModel.findById(id)
      if (!bundle) {
        throw new NotFoundException("Service bundle not found")
      }

      return {
        success: true,
        data: bundle,
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new Error(`Failed to fetch service bundle: ${error.message}`)
    }
  }

  async updateBundle(id: string, updateBundleDto: UpdateServiceBundleDto): Promise<ApiResponse<ServiceBundle>> {
    try {
      if (updateBundleDto.basicInfo?.bundleName) {
        const existingBundle = await this.serviceBundleModel.findOne({
          "basicInfo.bundleName": updateBundleDto.basicInfo.bundleName,
          _id: { $ne: id },
        })

        if (existingBundle) {
          throw new ConflictException("Service bundle with this name already exists")
        }
      }

      const bundle = await this.serviceBundleModel.findByIdAndUpdate(
        id,
        { ...updateBundleDto, updatedAt: new Date() },
        { new: true, runValidators: true },
      )

      if (!bundle) {
        throw new NotFoundException("Service bundle not found")
      }

      return {
        success: true,
        data: bundle,
        message: "Service bundle updated successfully",
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error
      }
      throw new Error(`Failed to update service bundle: ${error.message}`)
    }
  }

  async removeService(id: string): Promise<ApiResponse<null>> {
    try {
      const service = await this.serviceModel.findByIdAndUpdate(
        id,
        { isActive: false, updatedAt: new Date() },
        { new: true },
      )

      if (!service) {
        throw new NotFoundException("Service not found")
      }

      return {
        success: true,
        message: "Service deactivated successfully",
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new Error(`Failed to deactivate service: ${error.message}`)
    }
  }

  async getServiceStats(): Promise<ApiResponse<any>> {
    try {
      const [totalServices, activeServices, totalCategories, totalBundles] = await Promise.all([
        this.serviceModel.countDocuments(),
        this.serviceModel.countDocuments({ isActive: true }),
        this.serviceCategoryModel.countDocuments({ isActive: true }),
        this.serviceBundleModel.countDocuments({ isActive: true }),
      ])

      const servicesByCategory = await this.serviceModel.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: "$basicDetails.category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])

      return {
        success: true,
        data: {
          totalServices,
          activeServices,
          totalCategories,
          totalBundles,
          servicesByCategory,
        },
      }
    } catch (error) {
      throw new Error(`Failed to get service stats: ${error.message}`)
    }
  }
}