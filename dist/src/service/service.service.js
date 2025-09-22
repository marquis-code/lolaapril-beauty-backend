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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceService = void 0;
const common_1 = require("@nestjs/common");
let ServiceService = class ServiceService {
    constructor(serviceCategoryModel, serviceModel, serviceBundleModel) {
        this.serviceCategoryModel = serviceCategoryModel;
        this.serviceModel = serviceModel;
        this.serviceBundleModel = serviceBundleModel;
    }
    async createCategory(createCategoryDto) {
        try {
            const existingCategory = await this.serviceCategoryModel.findOne({
                categoryName: createCategoryDto.categoryName,
            });
            if (existingCategory) {
                throw new common_1.ConflictException("Service category with this name already exists");
            }
            const category = new this.serviceCategoryModel(createCategoryDto);
            const savedCategory = await category.save();
            return {
                success: true,
                data: savedCategory,
                message: "Service category created successfully",
            };
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Failed to create service category: ${error.message}`);
        }
    }
    async findAllCategories() {
        try {
            const categories = await this.serviceCategoryModel.find({ isActive: true }).sort({ createdAt: -1 });
            return {
                success: true,
                data: categories,
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch service categories: ${error.message}`);
        }
    }
    async updateCategory(id, updateCategoryDto) {
        try {
            if (updateCategoryDto.categoryName) {
                const existingCategory = await this.serviceCategoryModel.findOne({
                    categoryName: updateCategoryDto.categoryName,
                    _id: { $ne: id },
                });
                if (existingCategory) {
                    throw new common_1.ConflictException("Service category with this name already exists");
                }
            }
            const category = await this.serviceCategoryModel.findByIdAndUpdate(id, Object.assign(Object.assign({}, updateCategoryDto), { updatedAt: new Date() }), { new: true, runValidators: true });
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
    async createService(createServiceDto) {
        try {
            const existingService = await this.serviceModel.findOne({
                "basicDetails.serviceName": createServiceDto.basicDetails.serviceName,
            });
            if (existingService) {
                throw new common_1.ConflictException("Service with this name already exists");
            }
            const service = new this.serviceModel(createServiceDto);
            const savedService = await service.save();
            return {
                success: true,
                data: savedService,
                message: "Service created successfully",
            };
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Failed to create service: ${error.message}`);
        }
    }
    async findAllServices(query) {
        try {
            const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc", search, category, serviceType, priceType, isActive, onlineBookingEnabled, } = query;
            const filter = {};
            if (search) {
                filter.$or = [
                    { "basicDetails.serviceName": { $regex: search, $options: "i" } },
                    { "basicDetails.description": { $regex: search, $options: "i" } },
                ];
            }
            if (category)
                filter["basicDetails.category"] = category;
            if (serviceType)
                filter["basicDetails.serviceType"] = serviceType;
            if (priceType)
                filter["pricingAndDuration.priceType"] = priceType;
            if (isActive !== undefined)
                filter.isActive = isActive;
            if (onlineBookingEnabled !== undefined)
                filter["settings.onlineBooking.enabled"] = onlineBookingEnabled;
            const skip = (page - 1) * limit;
            const sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
            const [services, total] = await Promise.all([
                this.serviceModel.find(filter).sort(sortOptions).skip(skip).limit(limit).exec(),
                this.serviceModel.countDocuments(filter),
            ]);
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
            throw new Error(`Failed to fetch services: ${error.message}`);
        }
    }
    async findOneService(id) {
        try {
            const service = await this.serviceModel.findById(id);
            if (!service) {
                throw new common_1.NotFoundException("Service not found");
            }
            return {
                success: true,
                data: service,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to fetch service: ${error.message}`);
        }
    }
    async updateService(id, updateServiceDto) {
        var _a;
        try {
            if ((_a = updateServiceDto.basicDetails) === null || _a === void 0 ? void 0 : _a.serviceName) {
                const existingService = await this.serviceModel.findOne({
                    "basicDetails.serviceName": updateServiceDto.basicDetails.serviceName,
                    _id: { $ne: id },
                });
                if (existingService) {
                    throw new common_1.ConflictException("Service with this name already exists");
                }
            }
            const service = await this.serviceModel.findByIdAndUpdate(id, Object.assign(Object.assign({}, updateServiceDto), { updatedAt: new Date() }), { new: true, runValidators: true });
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
            const service = await this.serviceModel.findById(serviceId);
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
    async createBundle(createBundleDto) {
        try {
            const existingBundle = await this.serviceBundleModel.findOne({
                "basicInfo.bundleName": createBundleDto.basicInfo.bundleName,
            });
            if (existingBundle) {
                throw new common_1.ConflictException("Service bundle with this name already exists");
            }
            const bundle = new this.serviceBundleModel(createBundleDto);
            const savedBundle = await bundle.save();
            return {
                success: true,
                data: savedBundle,
                message: "Service bundle created successfully",
            };
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Failed to create service bundle: ${error.message}`);
        }
    }
    async findAllBundles() {
        try {
            const bundles = await this.serviceBundleModel.find({ isActive: true }).sort({ createdAt: -1 });
            return {
                success: true,
                data: bundles,
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch service bundles: ${error.message}`);
        }
    }
    async findOneBundle(id) {
        try {
            const bundle = await this.serviceBundleModel.findById(id);
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
        var _a;
        try {
            if ((_a = updateBundleDto.basicInfo) === null || _a === void 0 ? void 0 : _a.bundleName) {
                const existingBundle = await this.serviceBundleModel.findOne({
                    "basicInfo.bundleName": updateBundleDto.basicInfo.bundleName,
                    _id: { $ne: id },
                });
                if (existingBundle) {
                    throw new common_1.ConflictException("Service bundle with this name already exists");
                }
            }
            const bundle = await this.serviceBundleModel.findByIdAndUpdate(id, Object.assign(Object.assign({}, updateBundleDto), { updatedAt: new Date() }), { new: true, runValidators: true });
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
            const service = await this.serviceModel.findByIdAndUpdate(id, { isActive: false, updatedAt: new Date() }, { new: true });
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
    async getServiceStats() {
        try {
            const [totalServices, activeServices, totalCategories, totalBundles] = await Promise.all([
                this.serviceModel.countDocuments(),
                this.serviceModel.countDocuments({ isActive: true }),
                this.serviceCategoryModel.countDocuments({ isActive: true }),
                this.serviceBundleModel.countDocuments({ isActive: true }),
            ]);
            const servicesByCategory = await this.serviceModel.aggregate([
                { $match: { isActive: true } },
                { $group: { _id: "$basicDetails.category", count: { $sum: 1 } } },
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
    __metadata("design:paramtypes", [Function, Function, Function])
], ServiceService);
exports.ServiceService = ServiceService;
//# sourceMappingURL=service.service.js.map