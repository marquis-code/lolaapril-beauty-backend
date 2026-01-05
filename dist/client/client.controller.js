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
exports.ClientController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const client_service_1 = require("./client.service");
const create_client_dto_1 = require("./dto/create-client.dto");
const update_client_dto_1 = require("./dto/update-client.dto");
const client_query_dto_1 = require("./dto/client-query.dto");
const client_schema_1 = require("./schemas/client.schema");
const api_response_decorator_1 = require("../common/decorators/api-response.decorator");
const auth_1 = require("../auth");
let ClientController = class ClientController {
    constructor(clientService) {
        this.clientService = clientService;
    }
    create(createClientDto, businessId) {
        return this.clientService.create(createClientDto, businessId);
    }
    findAll(query, businessId) {
        return this.clientService.findAll(query, businessId);
    }
    getStats(businessId) {
        return this.clientService.getClientStats(businessId);
    }
    async exportCSV(res, businessId) {
        try {
            const filePath = await this.clientService.exportToCSV(businessId);
            res.download(filePath, 'clients-export.csv');
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    async exportPDF(res, businessId) {
        try {
            const pdfBuffer = await this.clientService.exportToPDF(businessId);
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=clients-export.pdf',
                'Content-Length': pdfBuffer.length,
            });
            res.send(pdfBuffer);
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    async importCSV(file, businessId) {
        if (!file) {
            return { success: false, error: 'No file uploaded' };
        }
        return this.clientService.importFromCSV(file.path, businessId);
    }
    findOne(id, businessId) {
        return this.clientService.findOne(id, businessId);
    }
    update(id, updateClientDto, businessId) {
        return this.clientService.update(id, updateClientDto, businessId);
    }
    remove(id, businessId) {
        return this.clientService.remove(id, businessId);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new client" }),
    (0, api_response_decorator_1.ApiResponseWrapper)(client_schema_1.Client, 201, "Client created successfully"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_client_dto_1.CreateClientDto, String]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all clients with filtering and pagination" }),
    (0, api_response_decorator_1.ApiPaginatedResponse)(client_schema_1.Client),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [client_query_dto_1.ClientQueryDto, String]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    (0, swagger_1.ApiOperation)({ summary: "Get client statistics" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Client statistics retrieved successfully" }),
    __param(0, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('export/csv'),
    (0, swagger_1.ApiOperation)({ summary: 'Export clients to CSV' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CSV file generated successfully' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "exportCSV", null);
__decorate([
    (0, common_1.Get)('export/pdf'),
    (0, swagger_1.ApiOperation)({ summary: 'Export clients to PDF' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'PDF file generated successfully' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "exportPDF", null);
__decorate([
    (0, common_1.Post)('import/csv'),
    (0, swagger_1.ApiOperation)({ summary: 'Import clients from CSV file' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "importCSV", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a client by ID' }),
    (0, api_response_decorator_1.ApiResponseWrapper)(client_schema_1.Client),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Update a client" }),
    (0, api_response_decorator_1.ApiResponseWrapper)(client_schema_1.Client),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_client_dto_1.UpdateClientDto, String]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate a client' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Client deactivated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "remove", null);
ClientController = __decorate([
    (0, swagger_1.ApiTags)("Clients"),
    (0, common_1.Controller)("clients"),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [client_service_1.ClientService])
], ClientController);
exports.ClientController = ClientController;
//# sourceMappingURL=client.controller.js.map