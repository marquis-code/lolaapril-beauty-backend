import { Model } from 'mongoose';
import { ClientReliabilityDocument } from '../schemas/client-reliability.schema';
export declare class ClientReliabilityService {
    private reliabilityModel;
    constructor(reliabilityModel: Model<ClientReliabilityDocument>);
    getClientScore(clientId: string): Promise<number>;
    shouldRequireDeposit(clientId: string): Promise<boolean>;
    recordNoShow(clientId: string): Promise<void>;
    recordLateCancellation(clientId: string): Promise<void>;
    recordCompletion(clientId: string, wasOnTime: boolean): Promise<void>;
}
