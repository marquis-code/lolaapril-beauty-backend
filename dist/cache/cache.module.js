"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheModule = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const config_1 = require("@nestjs/config");
const cache_manager_redis_yet_1 = require("cache-manager-redis-yet");
const cache_service_1 = require("./cache.service");
let CacheModule = class CacheModule {
};
CacheModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    const redisHost = configService.get('REDIS_HOST');
                    const redisPort = configService.get('REDIS_PORT');
                    const redisPassword = configService.get('REDIS_PASSWORD');
                    const redisUsername = configService.get('REDIS_USERNAME');
                    const redisTLS = configService.get('REDIS_TLS');
                    const nodeEnv = configService.get('NODE_ENV');
                    const useTLS = redisTLS === 'true';
                    console.log('🔴 Cache Module - Redis Configuration:');
                    console.log(`   Host: ${redisHost}`);
                    console.log(`   Port: ${redisPort}`);
                    console.log(`   Username: ${redisUsername || 'default'}`);
                    console.log(`   Password: ${redisPassword ? '✓ Set' : '✗ Not set'}`);
                    console.log(`   REDIS_TLS: ${redisTLS}`);
                    console.log(`   Using TLS: ${useTLS}`);
                    console.log(`   Environment: ${nodeEnv}`);
                    const socketConfig = {
                        host: redisHost,
                        port: redisPort,
                        connectTimeout: 10000,
                        reconnectStrategy: (retries) => {
                            const delay = Math.min(retries * 50, 2000);
                            console.log(`🔄 Redis retry attempt ${retries}, waiting ${delay}ms`);
                            return delay;
                        },
                    };
                    if (useTLS) {
                        socketConfig.tls = true;
                        console.log('   ✅ TLS enabled in socket config');
                    }
                    else {
                        console.log('   ✅ TLS disabled (not added to socket config)');
                    }
                    return {
                        store: await (0, cache_manager_redis_yet_1.redisStore)({
                            socket: socketConfig,
                            password: redisPassword,
                            username: redisUsername || 'default',
                            ttl: 3600 * 1000,
                        }),
                    };
                },
            }),
        ],
        providers: [cache_service_1.CacheService],
        exports: [cache_manager_1.CacheModule, cache_service_1.CacheService],
    })
], CacheModule);
exports.CacheModule = CacheModule;
//# sourceMappingURL=cache.module.js.map