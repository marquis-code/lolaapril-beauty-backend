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
exports.FormsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const form_schema_1 = require("./schemas/form.schema");
const form_submission_schema_1 = require("./schemas/form-submission.schema");
const mongoose_2 = require("@nestjs/mongoose");
const slugify_1 = require("slugify");
let FormsService = class FormsService {
    constructor(formModel, submissionModel) {
        this.formModel = formModel;
        this.submissionModel = submissionModel;
    }
    async create(createFormDto) {
        const slug = (0, slugify_1.default)(createFormDto.title, { lower: true });
        const form = new this.formModel(Object.assign(Object.assign({}, createFormDto), { slug }));
        return form.save();
    }
    async findAll() {
        return this.formModel.find({ isDeleted: false }).sort({ createdAt: -1 }).exec();
    }
    async findOne(id) {
        const form = await this.formModel
            .findOne({
            $or: [{ _id: id }, { slug: id }],
            isDeleted: false,
        })
            .exec();
        if (!form) {
            throw new common_1.NotFoundException("Form not found");
        }
        return form;
    }
    async update(id, updateFormDto) {
        if (updateFormDto.title) {
            updateFormDto.slug = (0, slugify_1.default)(updateFormDto.title, { lower: true });
        }
        const form = await this.formModel
            .findOneAndUpdate({ $or: [{ _id: id }, { slug: id }], isDeleted: false }, updateFormDto, { new: true })
            .exec();
        if (!form) {
            throw new common_1.NotFoundException("Form not found");
        }
        return form;
    }
    async submitForm(id, submitFormDto) {
        const form = await this.findOne(id);
        const submission = new this.submissionModel({
            formId: form._id,
            formTitle: form.title,
            responses: submitFormDto.responses,
            submitterEmail: submitFormDto.submitterEmail,
        });
        await this.formModel.updateOne({ _id: form._id }, { $inc: { submissionsCount: 1 } });
        return submission.save();
    }
    async getSubmissions(formId) {
        const form = await this.findOne(formId);
        return this.submissionModel.find({ formId: form._id, isDeleted: false }).sort({ createdAt: -1 }).exec();
    }
    async softDelete(id, deletedBy) {
        const result = await this.formModel.updateOne({ $or: [{ _id: id }, { slug: id }], isDeleted: false }, { isDeleted: true, deletedAt: new Date(), deletedBy });
        if (result.matchedCount === 0) {
            throw new common_1.NotFoundException("Form not found");
        }
    }
    async hardDelete(id) {
        const result = await this.formModel.deleteOne({
            $or: [{ _id: id }, { slug: id }],
        });
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException("Form not found");
        }
    }
    async restore(id) {
        const form = await this.formModel
            .findOneAndUpdate({ $or: [{ _id: id }, { slug: id }], isDeleted: true }, { isDeleted: false, $unset: { deletedAt: 1, deletedBy: 1 } }, { new: true })
            .exec();
        if (!form) {
            throw new common_1.NotFoundException("Form not found or not deleted");
        }
        return form;
    }
};
FormsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(form_schema_1.Form.name)),
    __param(1, (0, mongoose_2.InjectModel)(form_submission_schema_1.FormSubmission.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model])
], FormsService);
exports.FormsService = FormsService;
//# sourceMappingURL=forms.service.js.map