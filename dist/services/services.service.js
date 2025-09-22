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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const service_schema_1 = require("../schemas/service.schema");
let ServicesService = class ServicesService {
    constructor(serviceModel) {
        this.serviceModel = serviceModel;
    }
    async create(createServiceDto) {
        const service = new this.serviceModel(createServiceDto);
        return service.save();
    }
    async findAll(filterDto) {
        const query = {};
        if (filterDto === null || filterDto === void 0 ? void 0 : filterDto.category) {
            query.category = filterDto.category;
        }
        if ((filterDto === null || filterDto === void 0 ? void 0 : filterDto.isActive) !== undefined) {
            query.isActive = filterDto.isActive;
        }
        if ((filterDto === null || filterDto === void 0 ? void 0 : filterDto.minPrice) !== undefined) {
            query.price = Object.assign(Object.assign({}, query.price), { $gte: filterDto.minPrice });
        }
        if ((filterDto === null || filterDto === void 0 ? void 0 : filterDto.maxPrice) !== undefined) {
            query.price = Object.assign(Object.assign({}, query.price), { $lte: filterDto.maxPrice });
        }
        if ((filterDto === null || filterDto === void 0 ? void 0 : filterDto.minDuration) !== undefined) {
            query.duration = Object.assign(Object.assign({}, query.duration), { $gte: filterDto.minDuration });
        }
        if ((filterDto === null || filterDto === void 0 ? void 0 : filterDto.maxDuration) !== undefined) {
            query.duration = Object.assign(Object.assign({}, query.duration), { $lte: filterDto.maxDuration });
        }
        if (filterDto === null || filterDto === void 0 ? void 0 : filterDto.search) {
            query.$or = [
                { name: { $regex: filterDto.search, $options: "i" } },
                { description: { $regex: filterDto.search, $options: "i" } },
                { tags: { $in: [new RegExp(filterDto.search, "i")] } },
            ];
        }
        let queryBuilder = this.serviceModel.find(query);
        if (filterDto === null || filterDto === void 0 ? void 0 : filterDto.sortBy) {
            const sortOrder = filterDto.sortOrder === "desc" ? -1 : 1;
            queryBuilder = queryBuilder.sort({ [filterDto.sortBy]: sortOrder });
        }
        else {
            queryBuilder = queryBuilder.sort({ popularity: -1, createdAt: -1 });
        }
        if ((filterDto === null || filterDto === void 0 ? void 0 : filterDto.page) && (filterDto === null || filterDto === void 0 ? void 0 : filterDto.limit)) {
            const skip = (filterDto.page - 1) * filterDto.limit;
            queryBuilder = queryBuilder.skip(skip).limit(filterDto.limit);
        }
        return queryBuilder.exec();
    }
    async findOne(id) {
        const service = await this.serviceModel.findById(id).exec();
        if (!service) {
            throw new common_1.NotFoundException("Service not found");
        }
        return service;
    }
    async findByCategory(category) {
        return this.serviceModel.find({ category, isActive: true }).exec();
    }
    async findPopular(limit = 10) {
        return this.serviceModel.find({ isActive: true }).sort({ popularity: -1 }).limit(limit).exec();
    }
    async update(id, updateServiceDto) {
        const service = await this.serviceModel
            .findByIdAndUpdate(id, updateServiceDto, { new: true, runValidators: true })
            .exec();
        if (!service) {
            throw new common_1.NotFoundException("Service not found");
        }
        return service;
    }
    async remove(id) {
        const result = await this.serviceModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException("Service not found");
        }
    }
    async toggleActive(id) {
        const service = await this.serviceModel.findById(id).exec();
        if (!service) {
            throw new common_1.NotFoundException("Service not found");
        }
        service.isActive = !service.isActive;
        return service.save();
    }
    async incrementPopularity(id) {
        await this.serviceModel.findByIdAndUpdate(id, { $inc: { popularity: 1 } }, { new: true }).exec();
    }
    async getServicesByIds(serviceIds) {
        const services = await this.serviceModel.find({ _id: { $in: serviceIds }, isActive: true }).exec();
        if (services.length !== serviceIds.length) {
            throw new common_1.BadRequestException("One or more services not found or inactive");
        }
        return services;
    }
    async calculateTotalPrice(serviceIds) {
        const services = await this.getServicesByIds(serviceIds);
        return services.reduce((total, service) => total + service.price, 0);
    }
    async calculateTotalDuration(serviceIds) {
        const services = await this.getServicesByIds(serviceIds);
        return services.reduce((total, service) => total + service.duration, 0);
    }
    async getServiceCategories() {
        return Object.values(service_schema_1.ServiceCategory);
    }
    async getServiceStats() {
        const totalServices = await this.serviceModel.countDocuments();
        const activeServices = await this.serviceModel.countDocuments({ isActive: true });
        const inactiveServices = totalServices - activeServices;
        const categoryStats = await this.serviceModel.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
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
        ]);
        return {
            totalServices,
            activeServices,
            inactiveServices,
            categoryStats,
            priceStats: priceStats[0] || { avgPrice: 0, minPrice: 0, maxPrice: 0 },
        };
    }
};
ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function])
], ServicesService);
exports.ServicesService = ServicesService;
//# sourceMappingURL=services.service.js.map