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
exports.FormSubmissionSchema = exports.FormSubmission = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const base_schema_1 = require("../../common/schemas/base.schema");
let FormResponse = class FormResponse {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], FormResponse.prototype, "fieldId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], FormResponse.prototype, "fieldLabel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], FormResponse.prototype, "value", void 0);
FormResponse = __decorate([
    (0, mongoose_1.Schema)()
], FormResponse);
let FormSubmission = class FormSubmission extends base_schema_1.BaseSchema {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, ref: "Form" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], FormSubmission.prototype, "formId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], FormSubmission.prototype, "formTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], FormSubmission.prototype, "submitterEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)([FormResponse]),
    __metadata("design:type", Array)
], FormSubmission.prototype, "responses", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], FormSubmission.prototype, "submitterIp", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], FormSubmission.prototype, "userAgent", void 0);
FormSubmission = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], FormSubmission);
exports.FormSubmission = FormSubmission;
exports.FormSubmissionSchema = mongoose_1.SchemaFactory.createForClass(FormSubmission);
//# sourceMappingURL=form-submission.schema.js.map