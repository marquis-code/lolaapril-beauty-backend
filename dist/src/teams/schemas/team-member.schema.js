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
exports.TeamMemberSchema = exports.TeamMember = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const base_schema_1 = require("../../common/schemas/base.schema");
let TeamMember = class TeamMember extends base_schema_1.BaseSchema {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], TeamMember.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TeamMember.prototype, "image", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TeamMember.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TeamMember.prototype, "initials", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TeamMember.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], TeamMember.prototype, "position", void 0);
__decorate([
    (0, mongoose_1.Prop)([
        {
            type: { type: String, required: true },
            url: { type: String, required: true },
        },
    ]),
    __metadata("design:type", Array)
], TeamMember.prototype, "profiles", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TeamMember.prototype, "bio", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], TeamMember.prototype, "methods", void 0);
__decorate([
    (0, mongoose_1.Prop)([
        {
            title: { type: String, required: true },
            authors: { type: String, required: true },
            year: { type: Number, required: true },
            journal: { type: String, required: true },
            doi: String,
            pubLink: String,
            doiLink: String,
        },
    ]),
    __metadata("design:type", Array)
], TeamMember.prototype, "publications", void 0);
TeamMember = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], TeamMember);
exports.TeamMember = TeamMember;
exports.TeamMemberSchema = mongoose_1.SchemaFactory.createForClass(TeamMember);
//# sourceMappingURL=team-member.schema.js.map