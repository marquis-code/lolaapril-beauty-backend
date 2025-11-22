"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMembershipDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_membership_dto_1 = require("./create-membership.dto");
class UpdateMembershipDto extends (0, swagger_1.PartialType)(create_membership_dto_1.CreateMembershipDto) {
}
exports.UpdateMembershipDto = UpdateMembershipDto;
//# sourceMappingURL=update-membership.dto.js.map