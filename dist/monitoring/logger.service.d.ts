import { ConfigService } from '@nestjs/config';
export declare class LoggerService {
    private configService;
    private context;
    constructor(configService: ConfigService);
    setContext(context: string): void;
    log(message: string, metadata?: any): void;
    error(message: string, trace?: string, metadata?: any): void;
    warn(message: string, metadata?: any): void;
    debug(message: string, metadata?: any): void;
    verbose(message: string, metadata?: any): void;
    private writeLog;
}
