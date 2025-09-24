import { Injectable, NotFoundException, ConflictException } from "@nestjs/common"
import { Model, SortOrder, Types } from "mongoose"
import { ServiceCategory, ServiceCategoryDocument } from "./schemas/service-category.schema"
import { Service, ServiceDocument } from "./schemas/service.schema"
import { ServiceBundle, ServiceBundleDocument } from "./schemas/service-bundle.schema"
import { CreateServiceCategoryDto } from "./dto/create-service-category.dto"
import { CreateServiceDto } from "./dto/create-service.dto"
import { CreateServiceBundleDto } from "./dto/create-service-bundle.dto"
import { CreateServiceVariantDto } from "./dto/service-variant.dto"
import { UpdateServiceCategoryDto } from "./dto/update-service-category.dto"
import { UpdateServiceDto } from "./dto/update-service.dto"
import { UpdateServiceBundleDto } from "./dto/update-service-bundle.dto"
import { ServiceQueryDto } from "./dto/service-query.dto"
import { ApiResponse } from "../common/interfaces/common.interface"
import { InjectModel } from "@nestjs/mongoose"

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel(ServiceCategory.name) private serviceCategoryModel: Model<ServiceCategoryDocument>,
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
    @InjectModel(ServiceBundle.name) private serviceBundleModel: Model<ServiceBundleDocument>,
  ) {}

  // Utility method to validate ObjectId
  private validateObjectId(id: string, entityName: string = "Entity"): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`${entityName} not found`)
    }
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
      this.validateObjectId(id, "Service category")

      if (updateCategoryDto.categoryName) {
        const existingCategory = await this.serviceCategoryModel.findOne({
          categoryName: updateCategoryDto.categoryName,
          _id: { $ne: new Types.ObjectId(id) },
        })

        if (existingCategory) {
          throw new ConflictException("Service category with this name already exists")
        }
      }

      const category = await this.serviceCategoryModel.findByIdAndUpdate(
        new Types.ObjectId(id),
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
      // Validate category ObjectId if provided
      if (createServiceDto.basicDetails?.category) {
        this.validateObjectId(createServiceDto.basicDetails.category.toString(), "Service category")
        
        // Check if category exists
        const categoryExists = await this.serviceCategoryModel.findById(createServiceDto.basicDetails.category)
        if (!categoryExists) {
          throw new NotFoundException("Service category not found")
        }
      }

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
      if (error instanceof ConflictException || error instanceof NotFoundException) {
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

      if (category) {
        this.validateObjectId(category, "Category")
        filter["basicDetails.category"] = new Types.ObjectId(category)
      }
      if (serviceType) filter["basicDetails.serviceType"] = serviceType
      if (priceType) filter["pricingAndDuration.priceType"] = priceType
      if (isActive !== undefined) filter.isActive = isActive
      if (onlineBookingEnabled !== undefined) filter["settings.onlineBooking.enabled"] = onlineBookingEnabled

      const skip = (page - 1) * limit
      const sortDirection: SortOrder = sortOrder === "asc" ? 1 : -1
      const sortOptions: Record<string, SortOrder> = { [sortBy]: sortDirection }

      const [services, total] = await Promise.all([
        this.serviceModel
          .find(filter)
          .populate('basicDetails.category', 'categoryName appointmentColor')
          .sort(sortOptions)
          .skip(skip)
          .limit(limit)
          .exec(),
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
      this.validateObjectId(id, "Service")

      const service = await this.serviceModel
        .findById(new Types.ObjectId(id))
        .populate('basicDetails.category', 'categoryName appointmentColor')

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
      this.validateObjectId(id, "Service")

      // Validate category ObjectId if being updated
      if (updateServiceDto.basicDetails?.category) {
        this.validateObjectId(updateServiceDto.basicDetails.category.toString(), "Service category")
        
        // Check if category exists
        const categoryExists = await this.serviceCategoryModel.findById(updateServiceDto.basicDetails.category)
        if (!categoryExists) {
          throw new NotFoundException("Service category not found")
        }
      }

      if (updateServiceDto.basicDetails?.serviceName) {
        const existingService = await this.serviceModel.findOne({
          "basicDetails.serviceName": updateServiceDto.basicDetails.serviceName,
          _id: { $ne: new Types.ObjectId(id) },
        })

        if (existingService) {
          throw new ConflictException("Service with this name already exists")
        }
      }

      const service = await this.serviceModel.findByIdAndUpdate(
        new Types.ObjectId(id),
        { ...updateServiceDto, updatedAt: new Date() },
        { new: true, runValidators: true },
      ).populate('basicDetails.category', 'categoryName appointmentColor')

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
      this.validateObjectId(serviceId, "Service")

      const service = await this.serviceModel.findById(new Types.ObjectId(serviceId))
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
      // Validate category ObjectId
      if (createBundleDto.basicInfo?.category) {
        this.validateObjectId(createBundleDto.basicInfo.category.toString(), "Service category")
        
        // Check if category exists
        const categoryExists = await this.serviceCategoryModel.findById(createBundleDto.basicInfo.category)
        if (!categoryExists) {
          throw new NotFoundException("Service category not found")
        }
      }

      // Validate service ObjectIds in the bundle
      if (createBundleDto.services && createBundleDto.services.length > 0) {
        for (const service of createBundleDto.services) {
          this.validateObjectId(service.serviceId.toString(), "Service")
          
          // Check if service exists
          const serviceExists = await this.serviceModel.findById(service.serviceId)
          if (!serviceExists) {
            throw new NotFoundException(`Service with ID ${service.serviceId} not found`)
          }
        }
      }

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
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error
      }
      throw new Error(`Failed to create service bundle: ${error.message}`)
    }
  }

  async findAllBundles(): Promise<ApiResponse<ServiceBundle[]>> {
    try {
      const bundles = await this.serviceBundleModel
        .find({ isActive: true })
        .populate('basicInfo.category', 'categoryName appointmentColor')
        .populate('services.serviceId', 'basicDetails.serviceName')
        .sort({ createdAt: -1 })

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
      this.validateObjectId(id, "Service bundle")

      const bundle = await this.serviceBundleModel
        .findById(new Types.ObjectId(id))
        .populate('basicInfo.category', 'categoryName appointmentColor')
        .populate('services.serviceId', 'basicDetails.serviceName')

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
      this.validateObjectId(id, "Service bundle")

      // Validate category ObjectId if being updated
      if (updateBundleDto.basicInfo?.category) {
        this.validateObjectId(updateBundleDto.basicInfo.category.toString(), "Service category")
        
        // Check if category exists
        const categoryExists = await this.serviceCategoryModel.findById(updateBundleDto.basicInfo.category)
        if (!categoryExists) {
          throw new NotFoundException("Service category not found")
        }
      }

      // Validate service ObjectIds if services are being updated
      if (updateBundleDto.services && updateBundleDto.services.length > 0) {
        for (const service of updateBundleDto.services) {
          this.validateObjectId(service.serviceId.toString(), "Service")
          
          // Check if service exists
          const serviceExists = await this.serviceModel.findById(service.serviceId)
          if (!serviceExists) {
            throw new NotFoundException(`Service with ID ${service.serviceId} not found`)
          }
        }
      }

      if (updateBundleDto.basicInfo?.bundleName) {
        const existingBundle = await this.serviceBundleModel.findOne({
          "basicInfo.bundleName": updateBundleDto.basicInfo.bundleName,
          _id: { $ne: new Types.ObjectId(id) },
        })

        if (existingBundle) {
          throw new ConflictException("Service bundle with this name already exists")
        }
      }

      const bundle = await this.serviceBundleModel.findByIdAndUpdate(
        new Types.ObjectId(id),
        { ...updateBundleDto, updatedAt: new Date() },
        { new: true, runValidators: true },
      )
        .populate('basicInfo.category', 'categoryName appointmentColor')
        .populate('services.serviceId', 'basicDetails.serviceName')

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
      this.validateObjectId(id, "Service")

      const service = await this.serviceModel.findByIdAndUpdate(
        new Types.ObjectId(id),
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
        { 
          $lookup: {
            from: 'servicecategories',
            localField: 'basicDetails.category',
            foreignField: '_id',
            as: 'categoryInfo'
          }
        },
        { $unwind: '$categoryInfo' },
        { 
          $group: { 
            _id: '$categoryInfo.categoryName',
            categoryId: { $first: '$categoryInfo._id' },
            count: { $sum: 1 } 
          } 
        },
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