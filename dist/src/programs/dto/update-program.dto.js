"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProgramDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_program_dto_1 = require("./create-program.dto");
class UpdateProgramDto extends (0, mapped_types_1.PartialType)(create_program_dto_1.CreateProgramDto) {
}
exports.UpdateProgramDto = UpdateProgramDto;
//# sourceMappingURL=update-program.dto.js.map