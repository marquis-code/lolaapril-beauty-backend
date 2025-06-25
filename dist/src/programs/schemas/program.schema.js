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
exports.ProgramSchema = exports.Program = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const enums_1 = require("../../common/enums");
const base_schema_1 = require("../../common/schemas/base.schema");
let FormField = class FormField {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], FormField.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], FormField.prototype, "label", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: enums_1.FormFieldType, required: true }),
    __metadata("design:type", String)
], FormField.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], FormField.prototype, "required", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], FormField.prototype, "options", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], FormField.prototype, "placeholder", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], FormField.prototype, "description", void 0);
FormField = __decorate([
    (0, mongoose_1.Schema)()
], FormField);
let Program = class Program extends base_schema_1.BaseSchema {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Program.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Program.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Program.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Program.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Program.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Program.prototype, "focusAreas", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Program.prototype, "outcomes", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Program.prototype, "keyResponsibilities", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Program.prototype, "image", void 0);
__decorate([
    (0, mongoose_1.Prop)([
        {
            title: { type: String, required: true },
            description: { type: String, required: true },
        },
    ]),
    __metadata("design:type", Array)
], Program.prototype, "highlights", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: enums_1.ProgramStatus, default: enums_1.ProgramStatus.DRAFT }),
    __metadata("design:type", String)
], Program.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Program.prototype, "registrationToken", void 0);
__decorate([
    (0, mongoose_1.Prop)([FormField]),
    __metadata("design:type", Array)
], Program.prototype, "formFields", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Program.prototype, "formTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Program.prototype, "formInstructions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Program.prototype, "applicationsCount", void 0);
Program = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Program);
exports.Program = Program;
exports.ProgramSchema = mongoose_1.SchemaFactory.createForClass(Program);
//# sourceMappingURL=program.schema.js.map