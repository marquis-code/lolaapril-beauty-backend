import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseInterceptors, UploadedFile } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import type { Response } from "express"
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from "@nestjs/swagger"
import type { ClientService } from "./client.service"
import type { CreateClientDto } from "./dto/create-client.dto"
import type { UpdateClientDto } from "./dto/update-client.dto"
import type { ClientQueryDto } from "./dto/client-query.dto"
import { Client } from "./schemas/client.schema"
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator"
import type { Express } from "express"

@ApiTags("clients")
@Controller("clients")
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiOperation({ summary: "Create a new client" })
  @ApiResponse({ status: 201, description: "Client created successfully", type: Client })
  create(createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto)
  }

  @Get()
  @ApiOperation({ summary: "Get all clients with pagination and filtering" })
  @ApiPaginatedResponse(Client)
  findAll(query: ClientQueryDto) {
    return this.clientService.findAll(query)
  }

  @Get("stats")
  @ApiOperation({ summary: "Get client statistics" })
  getStats() {
    return this.clientService.getClientStats()
  }

  @Get('export/csv')
  @ApiOperation({ summary: 'Export clients to CSV' })
  async exportCSV(@Res() res: Response) {
    const csvBuffer = await this.clientService.exportToCSV();
    
    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="clients-${new Date().toISOString().split('T')[0]}.csv"`,
    });
    
    res.send(csvBuffer);
  }

  @Get('export/pdf')
  @ApiOperation({ summary: 'Export clients to PDF' })
  async exportPDF(@Res() res: Response) {
    const pdfBuffer = await this.clientService.exportToPDF();
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="clients-${new Date().toISOString().split('T')[0]}.pdf"`,
    });
    
    res.send(pdfBuffer);
  }

  @Post('import/csv')
  @ApiOperation({ summary: 'Import clients from CSV' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async importCSV(@UploadedFile() file: Express.Multer.File) {
    return this.clientService.importFromCSV(file.buffer);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client by ID' })
  @ApiResponse({ status: 200, description: 'Client found', type: Client })
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update client" })
  @ApiResponse({ status: 200, description: "Client updated successfully", type: Client })
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(id, updateClientDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete client' })
  @ApiResponse({ status: 200, description: 'Client deleted successfully' })
  remove(@Param('id') id: string) {
    return this.clientService.remove(id);
  }
}
