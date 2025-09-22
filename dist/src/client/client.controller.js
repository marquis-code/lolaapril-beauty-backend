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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const client_schema_1 = require("./schemas/client.schema");
const api_response_decorator_1 = require("../../common/decorators/api-response.decorator");
let ClientController = class ClientController {
    constructor(clientService) {
        this.clientService = clientService;
    }
    create(createClientDto) {
        return this.clientService.create(createClientDto);
    }
    findAll(query) {
        return this.clientService.findAll(query);
    }
    getStats() {
        return this.clientService.getClientStats();
    }
    async exportCSV(res) {
        try {
            const filePath = await this.clientService.exportToCSV();
            res.download(filePath, 'clients-export.csv');
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    async exportPDF(res) {
        try {
            const pdfBuffer = await this.clientService.exportToPDF();
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
    async importCSV(file) {
        if (!file) {
            return { success: false, error: 'No file uploaded' };
        }
        return this.clientService.importFromCSV(file.path);
    }
    findOne(id) {
        return this.clientService.findOne(id);
    }
    update(id, updateClientDto) {
        return this.clientService.update(id, updateClientDto);
    }
    remove(id) {
        return this.clientService.remove(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new client" }),
    (0, api_response_decorator_1.ApiResponseWrapper)(client_schema_1.Client, 201, "Client created successfully"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all clients with filtering and pagination" }),
    (0, api_response_decorator_1.ApiPaginatedResponse)(client_schema_1.Client),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    (0, swagger_1.ApiOperation)({ summary: "Get client statistics" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Client statistics retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('export/csv'),
    (0, swagger_1.ApiOperation)({ summary: 'Export clients to CSV' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CSV file generated successfully' }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "exportCSV", null);
__decorate([
    (0, common_1.Get)('export/pdf'),
    (0, swagger_1.ApiOperation)({ summary: 'Export clients to PDF' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'PDF file generated successfully' }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof express_1.Express !== "undefined" && (_a = express_1.Express.Multer) !== void 0 && _a.File) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "importCSV", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a client by ID' }),
    (0, api_response_decorator_1.ApiResponseWrapper)(client_schema_1.Client),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Update a client" }),
    (0, api_response_decorator_1.ApiResponseWrapper)(client_schema_1.Client),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate a client' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Client deactivated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "remove", null);
ClientController = __decorate([
    (0, swagger_1.ApiTags)("Clients"),
    (0, common_1.Controller)("clients"),
    __metadata("design:paramtypes", [Function])
], ClientController);
exports.ClientController = ClientController;
//# sourceMappingURL=client.controller.js.map