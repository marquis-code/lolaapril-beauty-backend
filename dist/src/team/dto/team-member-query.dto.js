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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMemberQueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const team_member_schema_1 = require("../schemas/team-member.schema");
class TeamMemberQueryDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
        this.sortBy = "createdAt";
        this.sortOrder = "desc";
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Page number", required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], TeamMemberQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Items per page", required: false, default: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], TeamMemberQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Search term", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TeamMemberQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Filter by role", enum: team_member_schema_1.TeamRole, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(team_member_schema_1.TeamRole),
    __metadata("design:type", typeof (_a = typeof team_member_schema_1.TeamRole !== "undefined" && team_member_schema_1.TeamRole) === "function" ? _a : Object)
], TeamMemberQueryDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Filter by status", enum: team_member_schema_1.TeamStatus, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(team_member_schema_1.TeamStatus),
    __metadata("design:type", typeof (_b = typeof team_member_schema_1.TeamStatus !== "undefined" && team_member_schema_1.TeamStatus) === "function" ? _b : Object)
], TeamMemberQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Filter by department", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TeamMemberQueryDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Sort by field", required: false, default: "createdAt" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TeamMemberQueryDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Sort order", enum: ["asc", "desc"], required: false, default: "desc" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(["asc", "desc"]),
    __metadata("design:type", String)
], TeamMemberQueryDto.prototype, "sortOrder", void 0);
exports.TeamMemberQueryDto = TeamMemberQueryDto;
//# sourceMappingURL=team-member-query.dto.js.map