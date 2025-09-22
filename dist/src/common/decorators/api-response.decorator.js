"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiPaginatedResponse = exports.ApiResponseWrapper = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ApiResponseWrapper = (model, status = 200, description) => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({
        status,
        description: description || "Success",
        schema: {
            properties: {
                success: { type: "boolean" },
                data: { $ref: (0, swagger_1.getSchemaPath)(model) },
                message: { type: "string" },
            },
        },
    }));
};
exports.ApiResponseWrapper = ApiResponseWrapper;
const ApiPaginatedResponse = (model) => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({
        status: 200,
        description: "Paginated response",
        schema: {
            properties: {
                success: { type: "boolean" },
                data: {
                    type: "array",
                    items: { $ref: (0, swagger_1.getSchemaPath)(model) },
                },
                pagination: {
                    type: "object",
                    properties: {
                        page: { type: "number" },
                        limit: { type: "number" },
                        total: { type: "number" },
                        totalPages: { type: "number" },
                    },
                },
            },
        },
    }));
};
exports.ApiPaginatedResponse = ApiPaginatedResponse;
//# sourceMappingURL=api-response.decorator.js.map