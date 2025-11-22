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
exports.VoucherService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const voucher_schema_1 = require("./schemas/voucher.schema");
let VoucherService = class VoucherService {
    constructor(voucherModel) {
        this.voucherModel = voucherModel;
    }
    async create(createVoucherDto, userId) {
        const existingVoucher = await this.voucherModel.findOne({
            voucherCode: createVoucherDto.voucherCode,
        });
        if (existingVoucher) {
            throw new common_1.BadRequestException("Voucher code already exists");
        }
        const voucher = new this.voucherModel(Object.assign(Object.assign({}, createVoucherDto), { createdBy: userId }));
        return voucher.save();
    }
    async findAll(query) {
        const { page = 1, limit = 10, status, discountType, validFrom, validUntil, search, sortBy = "createdAt", sortOrder = "desc", } = query;
        const filter = {};
        if (status)
            filter.status = status;
        if (discountType)
            filter.discountType = discountType;
        if (validFrom)
            filter.validFrom = { $gte: new Date(validFrom) };
        if (validUntil)
            filter.validUntil = { $lte: new Date(validUntil) };
        if (search) {
            filter.$or = [
                { voucherCode: { $regex: search, $options: "i" } },
                { voucherName: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }
        const skip = (page - 1) * limit;
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
        const vouchersQuery = this.voucherModel.find(filter);
        vouchersQuery.populate("createdBy", "firstName lastName email");
        vouchersQuery.sort(sortOptions);
        vouchersQuery.skip(skip);
        vouchersQuery.limit(limit);
        const vouchers = await vouchersQuery.exec();
        const total = await this.voucherModel.countDocuments(filter);
        return {
            vouchers,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const voucherQuery = this.voucherModel.findById(id);
        voucherQuery.populate("createdBy", "firstName lastName email");
        const voucher = await voucherQuery.exec();
        if (!voucher) {
            throw new common_1.NotFoundException("Voucher not found");
        }
        return voucher;
    }
    async findByCode(voucherCode) {
        const voucher = await this.voucherModel.findOne({ voucherCode }).exec();
        if (!voucher) {
            throw new common_1.NotFoundException("Voucher not found");
        }
        return voucher;
    }
    async update(id, updateVoucherDto) {
        const updateQuery = this.voucherModel.findByIdAndUpdate(id, Object.assign(Object.assign({}, updateVoucherDto), { updatedAt: new Date() }), { new: true });
        updateQuery.populate("createdBy", "firstName lastName email");
        const voucher = await updateQuery.exec();
        if (!voucher) {
            throw new common_1.NotFoundException("Voucher not found");
        }
        return voucher;
    }
    async remove(id) {
        const result = await this.voucherModel.findByIdAndDelete(id);
        if (!result) {
            throw new common_1.NotFoundException("Voucher not found");
        }
    }
    async validateVoucher(voucherCode, clientId, serviceIds, totalAmount) {
        var _a, _b;
        const voucher = await this.voucherModel.findOne({ voucherCode }).exec();
        if (!voucher) {
            return { isValid: false, message: "Voucher not found" };
        }
        if (voucher.status !== "active") {
            return { isValid: false, message: "Voucher is not active" };
        }
        const now = new Date();
        if (now < voucher.validFrom || now > voucher.validUntil) {
            return { isValid: false, message: "Voucher has expired or is not yet valid" };
        }
        if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
            return { isValid: false, message: "Voucher usage limit exceeded" };
        }
        if (voucher.restrictions.minimumSpend && totalAmount < voucher.restrictions.minimumSpend) {
            return { isValid: false, message: `Minimum spend of ${voucher.restrictions.minimumSpend} required` };
        }
        if (((_a = voucher.restrictions.applicableServices) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            const hasApplicableService = serviceIds.some((id) => voucher.restrictions.applicableServices.some((svc) => svc.toString() === id));
            if (!hasApplicableService) {
                return { isValid: false, message: "Voucher not applicable to selected services" };
            }
        }
        if (((_b = voucher.restrictions.excludedServices) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            const hasExcludedService = serviceIds.some((id) => voucher.restrictions.excludedServices.some((svc) => svc.toString() === id));
            if (hasExcludedService) {
                return { isValid: false, message: "Voucher cannot be used with selected services" };
            }
        }
        let discountAmount = 0;
        switch (voucher.discountType) {
            case "percentage":
                discountAmount = (totalAmount * voucher.discountValue) / 100;
                break;
            case "fixed_amount":
                discountAmount = voucher.discountValue;
                break;
            default:
                discountAmount = voucher.discountValue;
        }
        if (voucher.restrictions.maximumDiscount && discountAmount > voucher.restrictions.maximumDiscount) {
            discountAmount = voucher.restrictions.maximumDiscount;
        }
        return {
            isValid: true,
            voucher,
            discountAmount,
            message: "Voucher is valid",
        };
    }
    async useVoucher(voucherCode) {
        const useQuery = this.voucherModel.findOneAndUpdate({ voucherCode }, {
            $inc: { usedCount: 1 },
            updatedAt: new Date(),
        }, { new: true });
        const voucher = await useQuery.exec();
        if (!voucher) {
            throw new common_1.NotFoundException("Voucher not found");
        }
        if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
            voucher.status = "used_up";
            await voucher.save();
        }
        return voucher;
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
        ]);
        const discountTypeStats = await this.voucherModel.aggregate([
            {
                $group: {
                    _id: "$discountType",
                    count: { $sum: 1 },
                    totalUsage: { $sum: "$usedCount" },
                },
            },
        ]);
        return {
            overview: stats[0] || { total: 0, active: 0, expired: 0, usedUp: 0, totalUsage: 0 },
            byDiscountType: discountTypeStats,
        };
    }
};
VoucherService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(voucher_schema_1.Voucher.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], VoucherService);
exports.VoucherService = VoucherService;
//# sourceMappingURL=voucher.service.js.map