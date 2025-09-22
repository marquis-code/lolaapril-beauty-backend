/// <reference types="node" />
/// <reference types="node" />
import type { Model } from "mongoose";
import type { Client, ClientDocument } from "./schemas/client.schema";
import type { CreateClientDto } from "./dto/create-client.dto";
import type { UpdateClientDto } from "./dto/update-client.dto";
import type { ClientQueryDto } from "./dto/client-query.dto";
import type { ApiResponse } from "../../common/interfaces/common.interface";
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
