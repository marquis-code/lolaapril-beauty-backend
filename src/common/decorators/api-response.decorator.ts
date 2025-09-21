import { applyDecorators, type Type } from "@nestjs/common"
import { ApiResponse, getSchemaPath } from "@nestjs/swagger"

export const ApiResponseWrapper = <TModel extends Type<any>>(model: TModel, status = 200, description?: string) => {
  return applyDecorators(
    ApiResponse({
      status,
      description: description || "Success",
      schema: {
        properties: {
          success: { type: "boolean" },
          data: { $ref: getSchemaPath(model) },
          message: { type: "string" },
        },
      },
    }),
  )
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: "Paginated response",
      schema: {
        properties: {
          success: { type: "boolean" },
          data: {
            type: "array",
            items: { $ref: getSchemaPath(model) },
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
    }),
  )
}
