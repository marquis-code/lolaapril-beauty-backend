"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateServiceBundleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_service_bundle_dto_1 = require("./create-service-bundle.dto");
class UpdateServiceBundleDto extends (0, swagger_1.PartialType)(create_service_bundle_dto_1.CreateServiceBundleDto) {
}
exports.UpdateServiceBundleDto = UpdateServiceBundleDto;
//# sourceMappingURL=update-service-bundle.dto.js.map