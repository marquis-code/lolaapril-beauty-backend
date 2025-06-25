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
exports.PublicationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const publication_schema_1 = require("./schemas/publication.schema");
const mongoose_2 = require("@nestjs/mongoose");
const enums_1 = require("../common/enums");
let PublicationsService = class PublicationsService {
    constructor(publicationModel) {
        this.publicationModel = publicationModel;
    }
    async create(createPublicationDto) {
        const publication = new this.publicationModel(Object.assign(Object.assign({}, createPublicationDto), { status: enums_1.PublicationStatus.DRAFT }));
        return publication.save();
    }
    async findAll(status) {
        const filter = { isDeleted: false };
        if (status) {
            filter.status = status;
        }
        return this.publicationModel.find(filter).sort({ createdAt: -1 }).exec();
    }
    async findPublished() {
        return this.publicationModel
            .find({
            status: enums_1.PublicationStatus.PUBLISHED,
            isDeleted: false,
        })
            .sort({ year: -1, createdAt: -1 })
            .exec();
    }
    async findOne(id) {
        const publication = await this.publicationModel.findOne({ _id: id, isDeleted: false }).exec();
        if (!publication) {
            throw new common_1.NotFoundException("Publication not found");
        }
        return publication;
    }
    async update(id, updatePublicationDto) {
        const publication = await this.publicationModel
            .findOneAndUpdate({ _id: id, isDeleted: false }, updatePublicationDto, { new: true })
            .exec();
        if (!publication) {
            throw new common_1.NotFoundException("Publication not found");
        }
        return publication;
    }
    async submitForReview(id) {
        const publication = await this.publicationModel
            .findOneAndUpdate({ _id: id, status: enums_1.PublicationStatus.DRAFT, isDeleted: false }, { status: enums_1.PublicationStatus.PENDING_REVIEW }, { new: true })
            .exec();
        if (!publication) {
            throw new common_1.NotFoundException("Publication not found or not in draft status");
        }
        return publication;
    }
    async approve(id, reviewedBy) {
        const publication = await this.publicationModel
            .findOneAndUpdate({ _id: id, status: enums_1.PublicationStatus.PENDING_REVIEW, isDeleted: false }, {
            status: enums_1.PublicationStatus.APPROVED,
            reviewedBy,
            reviewedAt: new Date(),
        }, { new: true })
            .exec();
        if (!publication) {
            throw new common_1.NotFoundException("Publication not found or not pending review");
        }
        return publication;
    }
    async reject(id, reviewedBy, rejectionReason) {
        const publication = await this.publicationModel
            .findOneAndUpdate({ _id: id, status: enums_1.PublicationStatus.PENDING_REVIEW, isDeleted: false }, {
            status: enums_1.PublicationStatus.REJECTED,
            reviewedBy,
            reviewedAt: new Date(),
            rejectionReason,
        }, { new: true })
            .exec();
        if (!publication) {
            throw new common_1.NotFoundException("Publication not found or not pending review");
        }
        return publication;
    }
    async publish(id) {
        const publication = await this.publicationModel
            .findOneAndUpdate({ _id: id, status: enums_1.PublicationStatus.APPROVED, isDeleted: false }, {
            status: enums_1.PublicationStatus.PUBLISHED,
            publishedAt: new Date(),
        }, { new: true })
            .exec();
        if (!publication) {
            throw new common_1.NotFoundException("Publication not found or not approved");
        }
        return publication;
    }
    async softDelete(id, deletedBy) {
        const result = await this.publicationModel.updateOne({ _id: id, isDeleted: false }, { isDeleted: true, deletedAt: new Date(), deletedBy });
        if (result.matchedCount === 0) {
            throw new common_1.NotFoundException("Publication not found");
        }
    }
    async hardDelete(id) {
        const result = await this.publicationModel.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException("Publication not found");
        }
    }
    async restore(id) {
        const publication = await this.publicationModel
            .findOneAndUpdate({ _id: id, isDeleted: true }, { isDeleted: false, $unset: { deletedAt: 1, deletedBy: 1 } }, { new: true })
            .exec();
        if (!publication) {
            throw new common_1.NotFoundException("Publication not found or not deleted");
        }
        return publication;
    }
};
PublicationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(publication_schema_1.Publication.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], PublicationsService);
exports.PublicationsService = PublicationsService;
//# sourceMappingURL=publications.service.js.map