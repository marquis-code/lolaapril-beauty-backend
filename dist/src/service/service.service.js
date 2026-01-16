"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const service_category_schema_1 = require("./schemas/service-category.schema");
const service_schema_1 = require("./schemas/service.schema");
const service_bundle_schema_1 = require("./schemas/service-bundle.schema");
const business_schema_1 = require("../business/schemas/business.schema");
const mongoose_2 = require("@nestjs/mongoose");
let ServiceService = class ServiceService {
    constructor(serviceCategoryModel, serviceModel, serviceBundleModel, businessModel) {
        this.serviceCategoryModel = serviceCategoryModel;
        this.serviceModel = serviceModel;
        this.serviceBundleModel = serviceBundleModel;
        this.businessModel = businessModel;
    }
    validateObjectId(id, entityName = "Entity") {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException(`${entityName} not found`);
        }
    }
    async createCategory(createCategoryDto, businessId) {
        try {
            this.validateObjectId(businessId, "Business");
            const existingCategory = await this.serviceCategoryModel.findOne({
                categoryName: createCategoryDto.categoryName,
                businessId: new mongoose_1.Types.ObjectId(businessId),
            });
            if (existingCategory) {
                throw new common_1.ConflictException("Service category with this name already exists");
            }
            const category = new this.serviceCategoryModel({
                ...createCategoryDto,
                businessId: new mongoose_1.Types.ObjectId(businessId),
            });
            const savedCategory = await category.save();
            return {
                success: true,
                data: savedCategory,
                message: "Service category created successfully",
            };
        }
        catch (error) {
            if (error instanceof common_1.ConflictException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to create service category: ${error.message}`);
        }
    }
    async findAllCategories(subdomain, businessId) {
        try {
            const filter = { isActive: true };
            if (subdomain) {
                const business = await this.businessModel.findOne({
                    subdomain: subdomain.toLowerCase()
                });
                if (!business) {
                    throw new common_1.NotFoundException(`Business with subdomain '${subdomain}' not found`);
                }
                filter.businessId = business._id;
            }
            else if (businessId) {
                this.validateObjectId(businessId, "Business");
                filter.businessId = new mongoose_1.Types.ObjectId(businessId);
            }
            else {
                throw new Error("Either subdomain or businessId must be provided");
            }
            const categories = await this.serviceCategoryModel
                .find(filter)
                .sort({ createdAt: -1 });
            return {
                success: true,
                data: categories,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to fetch service categories: ${error.message}`);
        }
    }
    async updateCategory(id, updateCategoryDto) {
        try {
            this.validateObjectId(id, "Service category");
            if (updateCategoryDto.categoryName) {
                const existingCategory = await this.serviceCategoryModel.findOne({
                    categoryName: updateCategoryDto.categoryName,
                    _id: { $ne: new mongoose_1.Types.ObjectId(id) },
                });
                if (existingCategory) {
                    throw new common_1.ConflictException("Service category with this name already exists");
                }
            }
            const category = await this.serviceCategoryModel.findByIdAndUpdate(new mongoose_1.Types.ObjectId(id), { ...updateCategoryDto, updatedAt: new Date() }, { new: true, runValidators: true });
            if (!category) {
                throw new common_1.NotFoundException("Service category not found");
            }
            return {
                success: true,
                data: category,
                message: "Service category updated successfully",
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Failed to update service category: ${error.message}`);
        }
    }
    async createService(createServiceDto, businessId) {
        try {
            this.validateObjectId(businessId, "Business");
            if (createServiceDto.basicDetails?.category) {
                this.validateObjectId(createServiceDto.basicDetails.category.toString(), "Service category");
                const categoryExists = await this.serviceCategoryModel.findOne({
                    _id: createServiceDto.basicDetails.category,
                    businessId: new mongoose_1.Types.ObjectId(businessId),
                });
                if (!categoryExists) {
                    throw new common_1.NotFoundException("Service category not found or does not belong to this business");
                }
            }
            const existingService = await this.serviceModel.findOne({
                "basicDetails.serviceName": createServiceDto.basicDetails.serviceName,
                businessId: new mongoose_1.Types.ObjectId(businessId),
            });
            if (existingService) {
                throw new common_1.ConflictException("Service with this name already exists");
            }
            const service = new this.serviceModel({
                ...createServiceDto,
                businessId: new mongoose_1.Types.ObjectId(businessId),
            });
            const savedService = await service.save();
            return {
                success: true,
                data: savedService,
                message: "Service created successfully",
            };
        }
        catch (error) {
            if (error instanceof common_1.ConflictException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to create service: ${error.message}`);
        }
    }
    async findAllServices(query, businessId) {
        try {
            const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc", search, category, serviceType, priceType, isActive, onlineBookingEnabled, subdomain, } = query;
            const filter = {};
            if (subdomain) {
                const business = await this.businessModel.findOne({
                    subdomain: subdomain.toLowerCase()
                });
                if (!business) {
                    throw new common_1.NotFoundException(`Business with subdomain '${subdomain}' not found`);
                }
                filter.businessId = business._id;
            }
            else if (businessId) {
                this.validateObjectId(businessId, "Business");
                filter.businessId = new mongoose_1.Types.ObjectId(businessId);
            }
            else {
                throw new Error("Either subdomain or businessId must be provided");
            }
            if (search) {
                filter.$or = [
                    { "basicDetails.serviceName": { $regex: search, $options: "i" } },
                    { "basicDetails.description": { $regex: search, $options: "i" } },
                ];
            }
            if (category) {
                this.validateObjectId(category, "Category");
                filter["basicDetails.category"] = new mongoose_1.Types.ObjectId(category);
            }
            if (serviceType)
                filter["basicDetails.serviceType"] = serviceType;
            if (priceType)
                filter["pricingAndDuration.priceType"] = priceType;
            if (isActive !== undefined)
                filter.isActive = isActive;
            if (onlineBookingEnabled !== undefined)
                filter["settings.onlineBooking.enabled"] = onlineBookingEnabled;
            const skip = (page - 1) * limit;
            const sortDirection = sortOrder === "asc" ? 1 : -1;
            const sortOptions = { [sortBy]: sortDirection };
            const services = await this.serviceModel
                .find(filter)
                .populate('basicDetails.category', 'categoryName appointmentColor')
                .populate('businessId', 'businessName subdomain logo')
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .exec();
            const total = await this.serviceModel.countDocuments(filter);
            return {
                success: true,
                data: services,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to fetch services: ${error.message}`);
        }
    }
    async getServicesByIds(serviceIds) {
        const objectIds = serviceIds.map(id => new mongoose_1.Types.ObjectId(id));
        const services = await this.serviceModel
            .find({ _id: { $in: objectIds } })
            .populate('teamMembers.selectedMembers.id', 'firstName lastName');
        return services;
    }
    async findOneService(id) {
        console.log("findOneService called with id:", id);
        this.validateObjectId(id, "Service");
        try {
            const service = await this.serviceModel
                .findById(id)
                .populate('basicDetails.category', 'categoryName appointmentColor');
            console.log("Service found:", !!service);
            if (!service) {
                throw new common_1.NotFoundException("Service not found");
            }
            return {
                success: true,
                data: service,
            };
        }
        catch (error) {
            console.error("findOneService error:", error);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to fetch service: ${error.message}`);
        }
    }
    async updateService(id, updateServiceDto) {
        try {
            this.validateObjectId(id, "Service");
            if (updateServiceDto.basicDetails?.category) {
                this.validateObjectId(updateServiceDto.basicDetails.category.toString(), "Service category");
                const categoryExists = await this.serviceCategoryModel.findById(updateServiceDto.basicDetails.category);
                if (!categoryExists) {
                    throw new common_1.NotFoundException("Service category not found");
                }
            }
            if (updateServiceDto.basicDetails?.serviceName) {
                const existingService = await this.serviceModel.findOne({
                    "basicDetails.serviceName": updateServiceDto.basicDetails.serviceName,
                    _id: { $ne: new mongoose_1.Types.ObjectId(id) },
                });
                if (existingService) {
                    throw new common_1.ConflictException("Service with this name already exists");
                }
            }
            const service = await this.serviceModel.findByIdAndUpdate(new mongoose_1.Types.ObjectId(id), { ...updateServiceDto, updatedAt: new Date() }, { new: true, runValidators: true }).populate('basicDetails.category', 'categoryName appointmentColor');
            if (!service) {
                throw new common_1.NotFoundException("Service not found");
            }
            return {
                success: true,
                data: service,
                message: "Service updated successfully",
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Failed to update service: ${error.message}`);
        }
    }
    async addServiceVariant(serviceId, variantDto) {
        try {
            this.validateObjectId(serviceId, "Service");
            const service = await this.serviceModel.findById(new mongoose_1.Types.ObjectId(serviceId));
            if (!service) {
                throw new common_1.NotFoundException("Service not found");
            }
            const existingVariant = service.variants.find((v) => v.variantName === variantDto.variantName);
            if (existingVariant) {
                throw new common_1.ConflictException("Variant with this name already exists for this service");
            }
            service.variants.push(variantDto);
            service.updatedAt = new Date();
            const updatedService = await service.save();
            return {
                success: true,
                data: updatedService,
                message: "Service variant added successfully",
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Failed to add service variant: ${error.message}`);
        }
    }
    async createBundle(createBundleDto, businessId) {
        try {
            this.validateObjectId(businessId, "Business");
            if (createBundleDto.basicInfo?.category) {
                this.validateObjectId(createBundleDto.basicInfo.category.toString(), "Service category");
                const categoryExists = await this.serviceCategoryModel.findOne({
                    _id: createBundleDto.basicInfo.category,
                    businessId: new mongoose_1.Types.ObjectId(businessId),
                });
                if (!categoryExists) {
                    throw new common_1.NotFoundException("Service category not found or does not belong to this business");
                }
            }
            if (createBundleDto.services && createBundleDto.services.length > 0) {
                for (const service of createBundleDto.services) {
                    this.validateObjectId(service.serviceId.toString(), "Service");
                    const serviceExists = await this.serviceModel.findOne({
                        _id: service.serviceId,
                        businessId: new mongoose_1.Types.ObjectId(businessId),
                    });
                    if (!serviceExists) {
                        throw new common_1.NotFoundException(`Service with ID ${service.serviceId} not found or does not belong to this business`);
                    }
                }
            }
            const existingBundle = await this.serviceBundleModel.findOne({
                "basicInfo.bundleName": createBundleDto.basicInfo.bundleName,
                businessId: new mongoose_1.Types.ObjectId(businessId),
            });
            if (existingBundle) {
                throw new common_1.ConflictException("Service bundle with this name already exists");
            }
            const bundle = new this.serviceBundleModel({
                ...createBundleDto,
                businessId: new mongoose_1.Types.ObjectId(businessId),
            });
            const savedBundle = await bundle.save();
            return {
                success: true,
                data: savedBundle,
                message: "Service bundle created successfully",
            };
        }
        catch (error) {
            if (error instanceof common_1.ConflictException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to create service bundle: ${error.message}`);
        }
    }
    async findAllBundles(subdomain, businessId) {
        try {
            const filter = { isActive: true };
            if (subdomain) {
                const business = await this.businessModel.findOne({
                    subdomain: subdomain.toLowerCase()
                });
                if (!business) {
                    throw new common_1.NotFoundException(`Business with subdomain '${subdomain}' not found`);
                }
                filter.businessId = business._id;
            }
            else if (businessId) {
                this.validateObjectId(businessId, "Business");
                filter.businessId = new mongoose_1.Types.ObjectId(businessId);
            }
            else {
                throw new Error("Either subdomain or businessId must be provided");
            }
            const bundles = await this.serviceBundleModel
                .find(filter)
                .populate('basicInfo.category', 'categoryName appointmentColor')
                .populate('services.serviceId', 'basicDetails.serviceName')
                .sort({ createdAt: -1 });
            return {
                success: true,
                data: bundles,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to fetch service bundles: ${error.message}`);
        }
    }
    async findOneBundle(id) {
        try {
            this.validateObjectId(id, "Service bundle");
            const bundle = await this.serviceBundleModel
                .findById(new mongoose_1.Types.ObjectId(id))
                .populate('basicInfo.category', 'categoryName appointmentColor')
                .populate('services.serviceId', 'basicDetails.serviceName');
            if (!bundle) {
                throw new common_1.NotFoundException("Service bundle not found");
            }
            return {
                success: true,
                data: bundle,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to fetch service bundle: ${error.message}`);
        }
    }
    async updateBundle(id, updateBundleDto) {
        try {
            this.validateObjectId(id, "Service bundle");
            if (updateBundleDto.basicInfo?.category) {
                this.validateObjectId(updateBundleDto.basicInfo.category.toString(), "Service category");
                const categoryExists = await this.serviceCategoryModel.findById(updateBundleDto.basicInfo.category);
                if (!categoryExists) {
                    throw new common_1.NotFoundException("Service category not found");
                }
            }
            if (updateBundleDto.services && updateBundleDto.services.length > 0) {
                for (const service of updateBundleDto.services) {
                    this.validateObjectId(service.serviceId.toString(), "Service");
                    const serviceExists = await this.serviceModel.findById(service.serviceId);
                    if (!serviceExists) {
                        throw new common_1.NotFoundException(`Service with ID ${service.serviceId} not found`);
                    }
                }
            }
            if (updateBundleDto.basicInfo?.bundleName) {
                const existingBundle = await this.serviceBundleModel.findOne({
                    "basicInfo.bundleName": updateBundleDto.basicInfo.bundleName,
                    _id: { $ne: new mongoose_1.Types.ObjectId(id) },
                });
                if (existingBundle) {
                    throw new common_1.ConflictException("Service bundle with this name already exists");
                }
            }
            const bundle = await this.serviceBundleModel.findByIdAndUpdate(new mongoose_1.Types.ObjectId(id), { ...updateBundleDto, updatedAt: new Date() }, { new: true, runValidators: true })
                .populate('basicInfo.category', 'categoryName appointmentColor')
                .populate('services.serviceId', 'basicDetails.serviceName');
            if (!bundle) {
                throw new common_1.NotFoundException("Service bundle not found");
            }
            return {
                success: true,
                data: bundle,
                message: "Service bundle updated successfully",
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Failed to update service bundle: ${error.message}`);
        }
    }
    async removeService(id) {
        try {
            this.validateObjectId(id, "Service");
            const service = await this.serviceModel.findByIdAndUpdate(new mongoose_1.Types.ObjectId(id), { isActive: false, updatedAt: new Date() }, { new: true });
            if (!service) {
                throw new common_1.NotFoundException("Service not found");
            }
            return {
                success: true,
                message: "Service deactivated successfully",
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to deactivate service: ${error.message}`);
        }
    }
    async getServiceStats(businessId) {
        try {
            this.validateObjectId(businessId, "Business");
            const businessFilter = { businessId: new mongoose_1.Types.ObjectId(businessId) };
            const [totalServices, activeServices, totalCategories, totalBundles] = await Promise.all([
                this.serviceModel.countDocuments(businessFilter),
                this.serviceModel.countDocuments({ ...businessFilter, isActive: true }),
                this.serviceCategoryModel.countDocuments({ ...businessFilter, isActive: true }),
                this.serviceBundleModel.countDocuments({ ...businessFilter, isActive: true }),
            ]);
            const servicesByCategory = await this.serviceModel.aggregate([
                { $match: { ...businessFilter, isActive: true } },
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
            ]);
            return {
                success: true,
                data: {
                    totalServices,
                    activeServices,
                    totalCategories,
                    totalBundles,
                    servicesByCategory,
                },
            };
        }
        catch (error) {
            throw new Error(`Failed to get service stats: ${error.message}`);
        }
    }
};
ServiceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(service_category_schema_1.ServiceCategory.name)),
    __param(1, (0, mongoose_2.InjectModel)(service_schema_1.Service.name)),
    __param(2, (0, mongoose_2.InjectModel)(service_bundle_schema_1.ServiceBundle.name)),
    __param(3, (0, mongoose_2.InjectModel)(business_schema_1.Business.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model])
], ServiceService);
exports.ServiceService = ServiceService;
//# sourceMappingURL=service.service.js.map