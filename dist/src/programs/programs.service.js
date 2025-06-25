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
exports.ProgramsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const program_schema_1 = require("./schemas/program.schema");
const program_application_schema_1 = require("./schemas/program-application.schema");
const enums_1 = require("../common/enums");
const mongoose_2 = require("@nestjs/mongoose");
const slugify_1 = require("slugify");
const uuid_1 = require("uuid");
let ProgramsService = class ProgramsService {
    constructor(programModel, applicationModel) {
        this.programModel = programModel;
        this.applicationModel = applicationModel;
    }
    async create(createProgramDto) {
        const slug = (0, slugify_1.default)(createProgramDto.title, { lower: true });
        const registrationToken = (0, uuid_1.v4)();
        const program = new this.programModel(Object.assign(Object.assign({}, createProgramDto), { slug,
            registrationToken, status: enums_1.ProgramStatus.DRAFT }));
        return program.save();
    }
    async findAll(status) {
        const filter = { isDeleted: false };
        if (status) {
            filter.status = status;
        }
        return this.programModel.find(filter).sort({ createdAt: -1 }).exec();
    }
    async findActive() {
        return this.programModel
            .find({
            status: enums_1.ProgramStatus.ACTIVE,
            isDeleted: false,
        })
            .sort({ createdAt: -1 })
            .exec();
    }
    async findOne(id) {
        const program = await this.programModel
            .findOne({
            $or: [{ _id: id }, { slug: id }],
            isDeleted: false,
        })
            .exec();
        if (!program) {
            throw new common_1.NotFoundException("Program not found");
        }
        return program;
    }
    async findByRegistrationToken(token) {
        const program = await this.programModel
            .findOne({
            registrationToken: token,
            status: enums_1.ProgramStatus.ACTIVE,
            isDeleted: false,
        })
            .exec();
        if (!program) {
            throw new common_1.NotFoundException("Program not found or not active");
        }
        return program;
    }
    async update(id, updateProgramDto) {
        const program = await this.programModel
            .findOneAndUpdate({ $or: [{ _id: id }, { slug: id }], isDeleted: false }, updateProgramDto, { new: true })
            .exec();
        if (!program) {
            throw new common_1.NotFoundException("Program not found");
        }
        return program;
    }
    async activate(id) {
        const program = await this.programModel
            .findOneAndUpdate({ $or: [{ _id: id }, { slug: id }], isDeleted: false }, { status: enums_1.ProgramStatus.ACTIVE }, { new: true })
            .exec();
        if (!program) {
            throw new common_1.NotFoundException("Program not found");
        }
        return program;
    }
    async deactivate(id) {
        const program = await this.programModel
            .findOneAndUpdate({ $or: [{ _id: id }, { slug: id }], isDeleted: false }, { status: enums_1.ProgramStatus.INACTIVE }, { new: true })
            .exec();
        if (!program) {
            throw new common_1.NotFoundException("Program not found");
        }
        return program;
    }
    async getRegistrationLink(id) {
        const program = await this.findOne(id);
        const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        return {
            registrationLink: `${baseUrl}/programs/apply/${program.registrationToken}`,
        };
    }
    async submitApplication(token, applicationDto) {
        const program = await this.findByRegistrationToken(token);
        const application = new this.applicationModel({
            programId: program._id,
            programTitle: program.title,
            responses: applicationDto.responses,
            applicantEmail: applicationDto.applicantEmail,
        });
        return application.save();
    }
    async getApplications(programId) {
        return this.applicationModel.find({ programId, isDeleted: false }).sort({ createdAt: -1 }).exec();
    }
    async softDelete(id, deletedBy) {
        const result = await this.programModel.updateOne({ $or: [{ _id: id }, { slug: id }], isDeleted: false }, { isDeleted: true, deletedAt: new Date(), deletedBy });
        if (result.matchedCount === 0) {
            throw new common_1.NotFoundException("Program not found");
        }
    }
    async hardDelete(id) {
        const result = await this.programModel.deleteOne({
            $or: [{ _id: id }, { slug: id }],
        });
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException("Program not found");
        }
    }
    async restore(id) {
        const program = await this.programModel
            .findOneAndUpdate({ $or: [{ _id: id }, { slug: id }], isDeleted: true }, { isDeleted: false, $unset: { deletedAt: 1, deletedBy: 1 } }, { new: true })
            .exec();
        if (!program) {
            throw new common_1.NotFoundException("Program not found or not deleted");
        }
        return program;
    }
};
ProgramsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(program_schema_1.Program.name)),
    __param(1, (0, mongoose_2.InjectModel)(program_application_schema_1.ProgramApplication.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model])
], ProgramsService);
exports.ProgramsService = ProgramsService;
//# sourceMappingURL=programs.service.js.map