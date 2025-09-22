import type { Response } from "express";
import type { ClientService } from "./client.service";
import type { CreateClientDto } from "./dto/create-client.dto";
import type { UpdateClientDto } from "./dto/update-client.dto";
import type { ClientQueryDto } from "./dto/client-query.dto";
import { Client } from "./schemas/client.schema";
export declare class ClientController {
    private readonly clientService;
    constructor(clientService: ClientService);
    create(createClientDto: CreateClientDto): Promise<ApiResponse<Client>>;
    findAll(query: ClientQueryDto): Promise<ApiResponse<Client[]>>;
    getStats(): Promise<ApiResponse<any>>;
    exportCSV(res: Response): Promise<void>;
    exportPDF(res: Response): Promise<void>;
    importCSV(file: Express.Multer.File): Promise<any>;
    findOne(id: string): Promise<ApiResponse<Client>>;
    update(id: string, updateClientDto: UpdateClientDto): Promise<ApiResponse<Client>>;
    remove(id: string): Promise<ApiResponse<null>>;
}
