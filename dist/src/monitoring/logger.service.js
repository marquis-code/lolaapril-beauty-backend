"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let LoggerService = class LoggerService {
    constructor(configService) {
        this.configService = configService;
        this.context = 'Application';
    }
    setContext(context) {
        this.context = context;
    }
    log(message, metadata) {
        this.writeLog('log', message, metadata);
    }
    error(message, trace, metadata) {
        this.writeLog('error', message, { trace, ...metadata });
    }
    warn(message, metadata) {
        this.writeLog('warn', message, metadata);
    }
    debug(message, metadata) {
        this.writeLog('debug', message, metadata);
    }
    verbose(message, metadata) {
        this.writeLog('verbose', message, metadata);
    }
    writeLog(level, message, metadata) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            level,
            context: this.context,
            message,
            ...metadata,
        };
        console.log(JSON.stringify(logEntry));
    }
};
LoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LoggerService);
exports.LoggerService = LoggerService;
//# sourceMappingURL=logger.service.js.map