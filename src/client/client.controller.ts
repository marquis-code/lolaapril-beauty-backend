import { Controller, Query, Body, Get, Post, Patch, Param, Delete, UseInterceptors, UploadedFile, Res } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { Response } from "express"
import { Express } from "express"
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from "@nestjs/swagger"
import { ClientService } from "./client.service"
import { CreateClientDto } from "./dto/create-client.dto"
import { UpdateClientDto } from "./dto/update-client.dto"
import { ClientQueryDto } from "./dto/client-query.dto"
import { Client } from "./schemas/client.schema"
import { ApiResponseWrapper, ApiPaginatedResponse } from "../common/decorators/api-response.decorator"

@ApiTags("Clients")
@Controller("clients")
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiOperation({ summary: "Create a new client" })
  @ApiResponseWrapper(Client, 201, "Client created successfully")
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto)
  }

  @Get()
  @ApiOperation({ summary: "Get all clients with filtering and pagination" })
  @ApiPaginatedResponse(Client)
  findAll(@Query() query: ClientQueryDto) {
    return this.clientService.findAll(query)
  }

  @Get("stats")
  @ApiOperation({ summary: "Get client statistics" })
  @ApiResponse({ status: 200, description: "Client statistics retrieved successfully" })
  getStats() {
    return this.clientService.getClientStats()
  }

  @Get('export/csv')
  @ApiOperation({ summary: 'Export clients to CSV' })
  @ApiResponse({ status: 200, description: 'CSV file generated successfully' })
  async exportCSV(@Res() res: Response) {
    try {
      const filePath = await this.clientService.exportToCSV();
      res.download(filePath, 'clients-export.csv');
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  @Get('export/pdf')
  @ApiOperation({ summary: 'Export clients to PDF' })
  @ApiResponse({ status: 200, description: 'PDF file generated successfully' })
  async exportPDF(@Res() res: Response) {
    try {
      const pdfBuffer = await this.clientService.exportToPDF();
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=clients-export.pdf',
        'Content-Length': pdfBuffer.length,
      });
      res.send(pdfBuffer);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  @Post('import/csv')
  @ApiOperation({ summary: 'Import clients from CSV file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async importCSV(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { success: false, error: 'No file uploaded' };
    }
    return this.clientService.importFromCSV(file.path);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a client by ID' })
  @ApiResponseWrapper(Client)
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a client" })
  @ApiResponseWrapper(Client)
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(id, updateClientDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate a client' })
  @ApiResponse({ status: 200, description: 'Client deactivated successfully' })
  remove(@Param('id') id: string) {
    return this.clientService.remove(id);
  }
}
