/// <reference types="node" />
/// <reference types="node" />
import { Model } from "mongoose";
import { Client, type ClientDocument } from "./schemas/client.schema";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { ClientQueryDto } from "./dto/client-query.dto";
import { ApiResponse } from "../common/interfaces/common.interface";
export declare class ClientService {
    private clientModel;
    constructor(clientModel: Model<ClientDocument>);
    create(createClientDto: CreateClientDto, businessId: string): Promise<ApiResponse<Client>>;
    findAll(query: ClientQueryDto, businessId: string): Promise<ApiResponse<Client[]>>;
    findOne(id: string, businessId: string): Promise<ApiResponse<Client>>;
    update(id: string, updateClientDto: UpdateClientDto, businessId: string): Promise<ApiResponse<Client>>;
    remove(id: string, businessId: string): Promise<ApiResponse<null>>;
    exportToCSV(businessId: string): Promise<string>;
    exportToPDF(businessId: string): Promise<Buffer>;
    importFromCSV(filePath: string, businessId: string): Promise<ApiResponse<{
        imported: number;
        errors: string[];
    }>>;
    getClientStats(businessId: string): Promise<ApiResponse<any>>;
}
