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
exports.EnquiriesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const enquiry_schema_1 = require("./schemas/enquiry.schema");
let EnquiriesService = class EnquiriesService {
    constructor(enquiryModel) {
        this.enquiryModel = enquiryModel;
    }
    async create(createEnquiryDto) {
        const enquiry = new this.enquiryModel(createEnquiryDto);
        return enquiry.save();
    }
    async findAll() {
        return this.enquiryModel.find({ isDeleted: false }).sort({ createdAt: -1 }).exec();
    }
    async findOne(id) {
        const enquiry = await this.enquiryModel.findOne({ _id: id, isDeleted: false }).exec();
        if (!enquiry) {
            throw new common_1.NotFoundException("Enquiry not found");
        }
        return enquiry;
    }
    async softDelete(id, deletedBy) {
        const result = await this.enquiryModel.updateOne({ _id: id, isDeleted: false }, { isDeleted: true, deletedAt: new Date(), deletedBy });
        if (result.matchedCount === 0) {
            throw new common_1.NotFoundException("Enquiry not found");
        }
    }
    async hardDelete(id) {
        const result = await this.enquiryModel.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException("Enquiry not found");
        }
    }
};
EnquiriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(enquiry_schema_1.Enquiry.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], EnquiriesService);
exports.EnquiriesService = EnquiriesService;
//# sourceMappingURL=enquiries.service.js.map