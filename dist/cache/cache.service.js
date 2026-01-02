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
var CacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
let CacheService = CacheService_1 = class CacheService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(CacheService_1.name);
        const redisHost = this.configService.get('REDIS_HOST', 'localhost');
        const redisPort = this.configService.get('REDIS_PORT', 6379);
        const redisPassword = this.configService.get('REDIS_PASSWORD');
        const redisUsername = this.configService.get('REDIS_USERNAME', 'default');
        const nodeEnv = this.configService.get('NODE_ENV', 'development');
        const redisTLS = this.configService.get('REDIS_TLS', 'false');
        const isRedisCloud = redisHost.includes('redislabs.com') || redisHost.includes('cloud.redislabs');
        const useTLS = redisTLS === 'true' || redisTLS === true;
        this.logger.log('🔴 Initializing Redis Cache Service');
        this.logger.log(`   Host: ${redisHost}`);
        this.logger.log(`   Port: ${redisPort}`);
        this.logger.log(`   Username: ${redisUsername}`);
        this.logger.log(`   Password: ${redisPassword ? '✓ Set' : '✗ Not set'}`);
        this.logger.log(`   TLS Explicitly Set: ${redisTLS}`);
        this.logger.log(`   Using TLS: ${useTLS}`);
        this.logger.log(`   Is Redis Cloud: ${isRedisCloud}`);
        this.logger.log(`   Environment: ${nodeEnv}`);
        const redisConfig = {
            host: redisHost,
            port: redisPort,
            password: redisPassword,
            username: redisUsername,
            connectTimeout: 10000,
            maxRetriesPerRequest: 3,
            enableReadyCheck: true,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                this.logger.warn(`🔄 Redis retry attempt ${times}, waiting ${delay}ms`);
                return delay;
            },
            lazyConnect: false,
            keepAlive: 30000,
            family: 4,
        };
        if (useTLS) {
            redisConfig.tls = {
                rejectUnauthorized: false,
            };
            this.logger.log('   TLS Config: { rejectUnauthorized: false }');
        }
        this.redisClient = new ioredis_1.default(redisConfig);
        this.redisClient.on('connect', () => {
            this.logger.log('✅ Redis client connected successfully');
        });
        this.redisClient.on('ready', () => {
            this.logger.log('✅ Redis client ready to receive commands');
        });
        this.redisClient.on('error', (error) => {
            this.logger.error('❌ Redis connection error:', error.message);
            if (error.message.includes('ECONNREFUSED')) {
                this.logger.error('💡 Hint: Redis server may not be running or host/port is incorrect');
            }
            else if (error.message.includes('SSL') || error.message.includes('TLS')) {
                this.logger.error('💡 Hint: TLS configuration issue. Try toggling REDIS_TLS in .env');
            }
            else if (error.message.includes('NOAUTH') || error.message.includes('Authentication')) {
                this.logger.error('💡 Hint: Check REDIS_PASSWORD and REDIS_USERNAME');
            }
        });
        this.redisClient.on('close', () => {
            this.logger.warn('⚠️  Redis connection closed');
        });
        this.redisClient.on('reconnecting', () => {
            this.logger.log('🔄 Redis client reconnecting...');
        });
    }
    async set(key, value, ttl) {
        try {
            const serializedValue = JSON.stringify(value);
            if (ttl) {
                await this.redisClient.setex(key, ttl, serializedValue);
            }
            else {
                await this.redisClient.set(key, serializedValue);
            }
            this.logger.debug(`Cache set: ${key} (TTL: ${ttl || 'none'})`);
        }
        catch (error) {
            this.logger.error(`Failed to set cache for key ${key}`, error.stack);
            throw error;
        }
    }
    async get(key) {
        try {
            const value = await this.redisClient.get(key);
            if (!value) {
                this.logger.debug(`Cache miss: ${key}`);
                return null;
            }
            this.logger.debug(`Cache hit: ${key}`);
            return JSON.parse(value);
        }
        catch (error) {
            this.logger.error(`Failed to get cache for key ${key}`, error.stack);
            return null;
        }
    }
    async delete(key) {
        try {
            await this.redisClient.del(key);
            this.logger.debug(`Cache deleted: ${key}`);
        }
        catch (error) {
            this.logger.error(`Failed to delete cache for key ${key}`, error.stack);
            throw error;
        }
    }
    async del(key) {
        return this.delete(key);
    }
    async deletePattern(pattern) {
        try {
            const keys = await this.redisClient.keys(pattern);
            if (keys.length === 0) {
                return 0;
            }
            await this.redisClient.del(...keys);
            this.logger.debug(`Cache deleted ${keys.length} keys matching pattern: ${pattern}`);
            return keys.length;
        }
        catch (error) {
            this.logger.error(`Failed to delete cache pattern ${pattern}`, error.stack);
            throw error;
        }
    }
    async exists(key) {
        try {
            const result = await this.redisClient.exists(key);
            return result === 1;
        }
        catch (error) {
            this.logger.error(`Failed to check cache existence for key ${key}`, error.stack);
            return false;
        }
    }
    async expire(key, ttl) {
        try {
            await this.redisClient.expire(key, ttl);
            this.logger.debug(`Cache expiration set for ${key}: ${ttl}s`);
        }
        catch (error) {
            this.logger.error(`Failed to set expiration for key ${key}`, error.stack);
            throw error;
        }
    }
    async ttl(key) {
        try {
            return await this.redisClient.ttl(key);
        }
        catch (error) {
            this.logger.error(`Failed to get TTL for key ${key}`, error.stack);
            return -1;
        }
    }
    async increment(key, amount = 1) {
        try {
            return await this.redisClient.incrby(key, amount);
        }
        catch (error) {
            this.logger.error(`Failed to increment key ${key}`, error.stack);
            throw error;
        }
    }
    async decrement(key, amount = 1) {
        try {
            return await this.redisClient.decrby(key, amount);
        }
        catch (error) {
            this.logger.error(`Failed to decrement key ${key}`, error.stack);
            throw error;
        }
    }
    async getOrSet(key, factory, ttl) {
        try {
            const cached = await this.get(key);
            if (cached !== null) {
                return cached;
            }
            const value = await factory();
            await this.set(key, value, ttl);
            return value;
        }
        catch (error) {
            this.logger.error(`Failed getOrSet for key ${key}`, error.stack);
            throw error;
        }
    }
    async hset(key, field, value) {
        try {
            const serializedValue = JSON.stringify(value);
            await this.redisClient.hset(key, field, serializedValue);
            this.logger.debug(`Hash set: ${key}.${field}`);
        }
        catch (error) {
            this.logger.error(`Failed to set hash field ${key}.${field}`, error.stack);
            throw error;
        }
    }
    async hget(key, field) {
        try {
            const value = await this.redisClient.hget(key, field);
            if (!value) {
                return null;
            }
            return JSON.parse(value);
        }
        catch (error) {
            this.logger.error(`Failed to get hash field ${key}.${field}`, error.stack);
            return null;
        }
    }
    async hgetall(key) {
        try {
            const hash = await this.redisClient.hgetall(key);
            const result = {};
            for (const [field, value] of Object.entries(hash)) {
                try {
                    result[field] = JSON.parse(value);
                }
                catch {
                    result[field] = value;
                }
            }
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to get all hash fields for ${key}`, error.stack);
            return {};
        }
    }
    async hdel(key, field) {
        try {
            await this.redisClient.hdel(key, field);
            this.logger.debug(`Hash field deleted: ${key}.${field}`);
        }
        catch (error) {
            this.logger.error(`Failed to delete hash field ${key}.${field}`, error.stack);
            throw error;
        }
    }
    async lpush(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            await this.redisClient.lpush(key, serializedValue);
            this.logger.debug(`List push: ${key}`);
        }
        catch (error) {
            this.logger.error(`Failed to push to list ${key}`, error.stack);
            throw error;
        }
    }
    async lpop(key) {
        try {
            const value = await this.redisClient.lpop(key);
            if (!value) {
                return null;
            }
            return JSON.parse(value);
        }
        catch (error) {
            this.logger.error(`Failed to pop from list ${key}`, error.stack);
            return null;
        }
    }
    async lrange(key, start, stop) {
        try {
            const values = await this.redisClient.lrange(key, start, stop);
            return values.map(v => JSON.parse(v));
        }
        catch (error) {
            this.logger.error(`Failed to get range from list ${key}`, error.stack);
            return [];
        }
    }
    async reset() {
        try {
            await this.redisClient.flushdb();
            this.logger.warn('All cache cleared');
        }
        catch (error) {
            this.logger.error('Failed to flush all cache', error.stack);
            throw error;
        }
    }
    async flushAll() {
        return this.reset();
    }
    async getStats() {
        try {
            const info = await this.redisClient.info();
            const dbSize = await this.redisClient.dbsize();
            return {
                dbSize,
                info: this.parseRedisInfo(info)
            };
        }
        catch (error) {
            this.logger.error('Failed to get cache stats', error.stack);
            return null;
        }
    }
    async ping() {
        try {
            const result = await this.redisClient.ping();
            this.logger.log(`Redis PING: ${result}`);
            return result === 'PONG';
        }
        catch (error) {
            this.logger.error('Redis PING failed:', error.message);
            return false;
        }
    }
    async cacheBusinessProfile(businessId, profile) {
        await this.set(`business:${businessId}:profile`, profile, 3600);
    }
    async getBusinessProfile(businessId) {
        return this.get(`business:${businessId}:profile`);
    }
    async cacheAvailability(staffId, date, slots) {
        await this.set(`availability:${staffId}:${date}`, slots, 1800);
    }
    async getAvailability(staffId, date) {
        return this.get(`availability:${staffId}:${date}`);
    }
    async invalidateAvailability(staffId) {
        try {
            await this.deletePattern(`availability:${staffId}:*`);
            this.logger.debug(`Invalidated availability cache for staff ${staffId}`);
        }
        catch (error) {
            this.logger.error(`Failed to invalidate availability for staff ${staffId}`, error.stack);
        }
    }
    async cachePricingRules(tenantId, rules) {
        await this.set(`pricing:${tenantId}`, rules, 7200);
    }
    async getPricingRules(tenantId) {
        return this.get(`pricing:${tenantId}`);
    }
    async setSession(sessionId, data, ttl = 86400) {
        await this.set(`session:${sessionId}`, data, ttl);
    }
    async getSession(sessionId) {
        return this.get(`session:${sessionId}`);
    }
    async deleteSession(sessionId) {
        await this.del(`session:${sessionId}`);
    }
    async incrementCounter(key, ttl = 60) {
        try {
            const current = await this.increment(key, 1);
            if (current === 1) {
                await this.expire(key, ttl);
            }
            return current;
        }
        catch (error) {
            this.logger.error(`Failed to increment counter for key ${key}`, error.stack);
            throw error;
        }
    }
    async onModuleDestroy() {
        await this.redisClient.quit();
        this.logger.log('✅ Redis client disconnected gracefully');
    }
    parseRedisInfo(info) {
        const result = {};
        const lines = info.split('\r\n');
        for (const line of lines) {
            if (line && !line.startsWith('#')) {
                const [key, value] = line.split(':');
                if (key && value) {
                    result[key] = value;
                }
            }
        }
        return result;
    }
};
CacheService = CacheService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CacheService);
exports.CacheService = CacheService;
//# sourceMappingURL=cache.service.js.map