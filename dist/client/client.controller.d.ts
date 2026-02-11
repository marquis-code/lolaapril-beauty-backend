/// <reference types="multer" />
import { Response } from "express";
import { ClientService } from "./client.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { ClientQueryDto } from "./dto/client-query.dto";
import { Client } from "./schemas/client.schema";
export declare class ClientController {
    private readonly clientService;
    constructor(clientService: ClientService);
    create(createClientDto: CreateClientDto, businessId: string): Promise<import("../common/interfaces/common.interface").ApiResponse<Client>>;
    findAll(query: ClientQueryDto, businessId: string): Promise<import("../common/interfaces/common.interface").ApiResponse<Client[]>>;
    getStats(businessId: string): Promise<import("../common/interfaces/common.interface").ApiResponse<any>>;
    enableGrokCodeFast1(businessId: string): Promise<import("../common/interfaces/common.interface").ApiResponse<any>>;
    exportCSV(res: Response, businessId: string): Promise<void>;
    exportPDF(res: Response, businessId: string): Promise<void>;
    importCSV(file: Express.Multer.File, businessId: string): Promise<import("../common/interfaces/common.interface").ApiResponse<{
        imported: number;
        errors: string[];
    }>>;
    findOne(id: string, businessId: string): Promise<import("../common/interfaces/common.interface").ApiResponse<Client>>;
    update(id: string, updateClientDto: UpdateClientDto, businessId: string): Promise<import("../common/interfaces/common.interface").ApiResponse<Client>>;
    remove(id: string, businessId: string): Promise<import("../common/interfaces/common.interface").ApiResponse<null>>;
}
