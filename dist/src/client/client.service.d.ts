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
    create(createClientDto: CreateClientDto): Promise<ApiResponse<Client>>;
    findAll(query: ClientQueryDto): Promise<ApiResponse<Client[]>>;
    findOne(id: string): Promise<ApiResponse<Client>>;
    update(id: string, updateClientDto: UpdateClientDto): Promise<ApiResponse<Client>>;
    remove(id: string): Promise<ApiResponse<null>>;
    exportToCSV(): Promise<string>;
    exportToPDF(): Promise<Buffer>;
    importFromCSV(filePath: string): Promise<ApiResponse<{
        imported: number;
        errors: string[];
    }>>;
    getClientStats(): Promise<ApiResponse<any>>;
}
