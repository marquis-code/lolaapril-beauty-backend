async;
createCategory(createCategoryDto, CreateServiceCategoryDto, businessId, string);
Promise < ApiResponse < ServiceCategory >> {
    try: {
        this: .validateObjectId(businessId, "Business"),
        const: existingCategory = await this.serviceCategoryModel.findOne({
            categoryName: createCategoryDto.categoryName,
            businessId: new Types.ObjectId(businessId),
        }),
        if(existingCategory) {
            throw new ConflictException("Service category with this name already exists");
        },
        const: category = new this.serviceCategoryModel({
            ...createCategoryDto,
            businessId: new Types.ObjectId(businessId),
        }),
        const: savedCategory = await category.save(),
        return: {
            success: true,
            data: savedCategory,
            message: "Service category created successfully",
        }
    }, catch(error) {
        if (error instanceof ConflictException || error instanceof NotFoundException) {
            throw error;
        }
        throw new Error(`Failed to create service category: ${error.message}`);
    }
};
async;
findAllCategories(subdomain ?  : string, businessId ?  : string);
Promise < ApiResponse < ServiceCategory[] >> {
    try: {
        const: filter, any = { isActive: true },
        if(subdomain) {
            const business = await this.businessModel.findOne({
                subdomain: subdomain.toLowerCase()
            });
            if (!business) {
                throw new NotFoundException(`Business with subdomain '${subdomain}' not found`);
            }
            filter.businessId = business._id;
        }, else: , if(businessId) {
            this.validateObjectId(businessId, "Business");
            filter.businessId = new Types.ObjectId(businessId);
        }, else: {
            throw: new Error("Either subdomain or businessId must be provided")
        },
        const: categories = await this.serviceCategoryModel
            .find(filter)
            .sort({ createdAt: -1 }),
        return: {
            success: true,
            data: categories,
        }
    }, catch(error) {
        if (error instanceof NotFoundException) {
            throw error;
        }
        throw new Error(`Failed to fetch service categories: ${error.message}`);
    }
};
async;
createService(createServiceDto, CreateServiceDto, businessId, string);
Promise < ApiResponse < Service >> {
    try: {
        this: .validateObjectId(businessId, "Business"),
        if(createServiceDto) { }, : .basicDetails?.category
    }
};
{
    this.validateObjectId(createServiceDto.basicDetails.category.toString(), "Service category");
    const categoryExists = await this.serviceCategoryModel.findOne({
        _id: createServiceDto.basicDetails.category,
        businessId: new Types.ObjectId(businessId),
    });
    if (!categoryExists) {
        throw new NotFoundException("Service category not found or does not belong to this business");
    }
}
const existingService = await this.serviceModel.findOne({
    "basicDetails.serviceName": createServiceDto.basicDetails.serviceName,
    businessId: new Types.ObjectId(businessId),
});
if (existingService) {
    throw new ConflictException("Service with this name already exists");
}
const service = new this.serviceModel({
    ...createServiceDto,
    businessId: new Types.ObjectId(businessId),
});
const savedService = await service.save();
return {
    success: true,
    data: savedService,
    message: "Service created successfully",
};
try { }
catch (error) {
    if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
    }
    throw new Error(`Failed to create service: ${error.message}`);
}
async;
findAllServices(query, ServiceQueryDto, businessId ?  : string);
Promise < ApiResponse < Service[] >> {
    try: {
        const: {
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
            subdomain,
        } = query,
        const: filter, any = {},
        if(subdomain) {
            const business = await this.businessModel.findOne({
                subdomain: subdomain.toLowerCase()
            });
            if (!business) {
                throw new NotFoundException(`Business with subdomain '${subdomain}' not found`);
            }
            filter.businessId = business._id;
        }, else: , if(businessId) {
            this.validateObjectId(businessId, "Business");
            filter.businessId = new Types.ObjectId(businessId);
        }, else: {
            throw: new Error("Either subdomain or businessId must be provided")
        },
        if(search) {
            filter.$or = [
                { "basicDetails.serviceName": { $regex: search, $options: "i" } },
                { "basicDetails.description": { $regex: search, $options: "i" } },
            ];
        },
        if(category) {
            this.validateObjectId(category, "Category");
            filter["basicDetails.category"] = new Types.ObjectId(category);
        },
        if(serviceType) { }, filter, ["basicDetails.serviceType"]:  = serviceType,
        if(priceType) { }, filter, ["pricingAndDuration.priceType"]:  = priceType,
        if(isActive) { }
    } !== undefined, filter, : .isActive = isActive,
    if(onlineBookingEnabled) { }
} !== undefined;
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
try { }
catch (error) {
    if (error instanceof NotFoundException) {
        throw error;
    }
    throw new Error(`Failed to fetch services: ${error.message}`);
}
async;
createBundle(createBundleDto, CreateServiceBundleDto, businessId, string);
Promise < ApiResponse < ServiceBundle >> {
    try: {
        this: .validateObjectId(businessId, "Business"),
        if(createBundleDto) { }, : .basicInfo?.category
    }
};
{
    this.validateObjectId(createBundleDto.basicInfo.category.toString(), "Service category");
    const categoryExists = await this.serviceCategoryModel.findOne({
        _id: createBundleDto.basicInfo.category,
        businessId: new Types.ObjectId(businessId),
    });
    if (!categoryExists) {
        throw new NotFoundException("Service category not found or does not belong to this business");
    }
}
if (createBundleDto.services && createBundleDto.services.length > 0) {
    for (const service of createBundleDto.services) {
        this.validateObjectId(service.serviceId.toString(), "Service");
        const serviceExists = await this.serviceModel.findOne({
            _id: service.serviceId,
            businessId: new Types.ObjectId(businessId),
        });
        if (!serviceExists) {
            throw new NotFoundException(`Service with ID ${service.serviceId} not found or does not belong to this business`);
        }
    }
}
const existingBundle = await this.serviceBundleModel.findOne({
    "basicInfo.bundleName": createBundleDto.basicInfo.bundleName,
    businessId: new Types.ObjectId(businessId),
});
if (existingBundle) {
    throw new ConflictException("Service bundle with this name already exists");
}
const bundle = new this.serviceBundleModel({
    ...createBundleDto,
    businessId: new Types.ObjectId(businessId),
});
const savedBundle = await bundle.save();
return {
    success: true,
    data: savedBundle,
    message: "Service bundle created successfully",
};
try { }
catch (error) {
    if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
    }
    throw new Error(`Failed to create service bundle: ${error.message}`);
}
async;
findAllBundles(subdomain ?  : string, businessId ?  : string);
Promise < ApiResponse < ServiceBundle[] >> {
    try: {
        const: filter, any = { isActive: true },
        if(subdomain) {
            const business = await this.businessModel.findOne({
                subdomain: subdomain.toLowerCase()
            });
            if (!business) {
                throw new NotFoundException(`Business with subdomain '${subdomain}' not found`);
            }
            filter.businessId = business._id;
        }, else: , if(businessId) {
            this.validateObjectId(businessId, "Business");
            filter.businessId = new Types.ObjectId(businessId);
        }, else: {
            throw: new Error("Either subdomain or businessId must be provided")
        },
        const: bundles = await this.serviceBundleModel
            .find(filter)
            .populate('basicInfo.category', 'categoryName appointmentColor')
            .populate('services.serviceId', 'basicDetails.serviceName')
            .sort({ createdAt: -1 }),
        return: {
            success: true,
            data: bundles,
        }
    }, catch(error) {
        if (error instanceof NotFoundException) {
            throw error;
        }
        throw new Error(`Failed to fetch service bundles: ${error.message}`);
    }
};
async;
getServiceStats(businessId, string);
Promise < ApiResponse < any >> {
    try: {
        this: .validateObjectId(businessId, "Business"),
        const: businessFilter = { businessId: new Types.ObjectId(businessId) },
        const: [totalServices, activeServices, totalCategories, totalBundles] = await Promise.all([
            this.serviceModel.countDocuments(businessFilter),
            this.serviceModel.countDocuments({ ...businessFilter, isActive: true }),
            this.serviceCategoryModel.countDocuments({ ...businessFilter, isActive: true }),
            this.serviceBundleModel.countDocuments({ ...businessFilter, isActive: true }),
        ]),
        const: servicesByCategory = await this.serviceModel.aggregate([
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
        ]),
        return: {
            success: true,
            data: {
                totalServices,
                activeServices,
                totalCategories,
                totalBundles,
                servicesByCategory,
            },
        }
    }, catch(error) {
        throw new Error(`Failed to get service stats: ${error.message}`);
    }
};
//# sourceMappingURL=play.js.map