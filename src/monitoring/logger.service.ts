// monitoring/logger.service.ts
import { Injectable, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggerService {
  private context = 'Application';

  constructor(private configService: ConfigService) {}

  setContext(context: string) {
    this.context = context;
  }

  log(message: string, metadata?: any) {
    this.writeLog('log', message, metadata);
  }

  error(message: string, trace?: string, metadata?: any) {
    this.writeLog('error', message, { trace, ...metadata });
  }

  warn(message: string, metadata?: any) {
    this.writeLog('warn', message, metadata);
  }

  debug(message: string, metadata?: any) {
    this.writeLog('debug', message, metadata);
  }

  verbose(message: string, metadata?: any) {
    this.writeLog('verbose', message, metadata);
  }

  private writeLog(level: string, message: string, metadata?: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      context: this.context,
      message,
      ...metadata,
    };

    // In production, send to external logging service (e.g., Sentry, LogRocket)
    console.log(JSON.stringify(logEntry));
  }
}