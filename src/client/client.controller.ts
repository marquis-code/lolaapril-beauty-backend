// src/modules/client/client.controller.ts
import { Controller, Query, Body, Get, Post, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, UseGuards } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { Response } from "express"
import { Express } from "express"
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiBearerAuth } from "@nestjs/swagger"
import { ClientService } from "./client.service"
import { CreateClientDto } from "./dto/create-client.dto"
import { UpdateClientDto } from "./dto/update-client.dto"
import { ClientQueryDto } from "./dto/client-query.dto"
import { Client } from "./schemas/client.schema"
import { ApiResponseWrapper, ApiPaginatedResponse } from "../common/decorators/api-response.decorator"
import { JwtAuthGuard, BusinessId } from "../auth"

@ApiTags("Clients")
@Controller("clients")

@ApiBearerAuth()
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiOperation({ summary: "Create a new client" })
  @ApiResponseWrapper(Client, 201, "Client created successfully")
  create(
    @Body() createClientDto: CreateClientDto,
    @BusinessId() businessId: string
  ) {
    return this.clientService.create(createClientDto, businessId)
  }

  @Get()
  @ApiOperation({ summary: "Get all clients with filtering and pagination" })
  @ApiPaginatedResponse(Client)
  findAll(
    @Query() query: ClientQueryDto,
    @BusinessId() businessId: string
  ) {
    return this.clientService.findAll(query, businessId)
  }

  @Get("stats")
  @ApiOperation({ summary: "Get client statistics" })
  @ApiResponse({ status: 200, description: "Client statistics retrieved successfully" })
  getStats(@BusinessId() businessId: string) {
    return this.clientService.getClientStats(businessId)
  }

  @Post('enable-grok-code-fast-1')
  @ApiOperation({ summary: 'Enable Grok Code Fast 1 for all clients' })
  @ApiResponse({ status: 200, description: 'Grok Code Fast 1 enabled successfully for all clients' })
  enableGrokCodeFast1(@BusinessId() businessId: string) {
    return this.clientService.enableGrokCodeFast1ForAllClients(businessId)
  }

  @Get('export/csv')
  @ApiOperation({ summary: 'Export clients to CSV' })
  @ApiResponse({ status: 200, description: 'CSV file generated successfully' })
  async exportCSV(
    @Res() res: Response,
    @BusinessId() businessId: string
  ) {
    try {
      const filePath = await this.clientService.exportToCSV(businessId)
      res.download(filePath, 'clients-export.csv')
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  @Get('export/pdf')
  @ApiOperation({ summary: 'Export clients to PDF' })
  @ApiResponse({ status: 200, description: 'PDF file generated successfully' })
  async exportPDF(
    @Res() res: Response,
    @BusinessId() businessId: string
  ) {
    try {
      const pdfBuffer = await this.clientService.exportToPDF(businessId)
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=clients-export.pdf',
        'Content-Length': pdfBuffer.length,
      })
      res.send(pdfBuffer)
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
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
  async importCSV(
    @UploadedFile() file: Express.Multer.File,
    @BusinessId() businessId: string
  ) {
    if (!file) {
      return { success: false, error: 'No file uploaded' }
    }
    return this.clientService.importFromCSV(file.path, businessId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a client by ID' })
  @ApiResponseWrapper(Client)
  findOne(
    @Param('id') id: string,
    @BusinessId() businessId: string
  ) {
    return this.clientService.findOne(id, businessId)
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a client" })
  @ApiResponseWrapper(Client)
  update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @BusinessId() businessId: string
  ) {
    return this.clientService.update(id, updateClientDto, businessId)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate a client' })
  @ApiResponse({ status: 200, description: 'Client deactivated successfully' })
  remove(
    @Param('id') id: string,
    @BusinessId() businessId: string
  ) {
    return this.clientService.remove(id, businessId)
  }
}