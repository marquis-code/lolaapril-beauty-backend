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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
let CacheService = CacheService_1 = class CacheService {
    constructor(cacheManager) {
        this.cacheManager = cacheManager;
        this.logger = new common_1.Logger(CacheService_1.name);
        this.logger.log('✅ CacheService initialized using NestJS CacheManager (shared Redis connection)');
    }
    async set(key, value, ttl) {
        try {
            const ttlMs = ttl ? ttl * 1000 : undefined;
            await this.cacheManager.set(key, value, ttlMs);
            this.logger.debug(`Cache set: ${key} (TTL: ${ttl || 'none'})`);
        }
        catch (error) {
            this.logger.error(`Failed to set cache for key ${key}`, error.stack);
            throw error;
        }
    }
    async get(key) {
        try {
            const value = await this.cacheManager.get(key);
            if (!value) {
                this.logger.debug(`Cache miss: ${key}`);
                return null;
            }
            this.logger.debug(`Cache hit: ${key}`);
            return value;
        }
        catch (error) {
            this.logger.error(`Failed to get cache for key ${key}`, error.stack);
            return null;
        }
    }
    async delete(key) {
        try {
            await this.cacheManager.del(key);
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
            const store = this.cacheManager.store;
            if (!store.client) {
                this.logger.warn('Redis client not available for pattern deletion');
                return 0;
            }
            const keys = await store.client.keys(pattern);
            if (keys.length === 0) {
                return 0;
            }
            await store.client.del(...keys);
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
            const value = await this.cacheManager.get(key);
            return value !== undefined && value !== null;
        }
        catch (error) {
            this.logger.error(`Failed to check cache existence for key ${key}`, error.stack);
            return false;
        }
    }
    async expire(key, ttl) {
        try {
            const value = await this.cacheManager.get(key);
            if (value !== undefined && value !== null) {
                await this.set(key, value, ttl);
                this.logger.debug(`Cache expiration set for ${key}: ${ttl}s`);
            }
        }
        catch (error) {
            this.logger.error(`Failed to set expiration for key ${key}`, error.stack);
            throw error;
        }
    }
    async ttl(key) {
        try {
            const store = this.cacheManager.store;
            if (store.client && store.client.ttl) {
                return await store.client.ttl(key);
            }
            this.logger.warn('TTL not supported by cache store');
            return -1;
        }
        catch (error) {
            this.logger.error(`Failed to get TTL for key ${key}`, error.stack);
            return -1;
        }
    }
    async increment(key, amount = 1) {
        try {
            const store = this.cacheManager.store;
            if (store.client && store.client.incrby) {
                return await store.client.incrby(key, amount);
            }
            throw new Error('Increment not supported by cache store');
        }
        catch (error) {
            this.logger.error(`Failed to increment key ${key}`, error.stack);
            throw error;
        }
    }
    async decrement(key, amount = 1) {
        try {
            const store = this.cacheManager.store;
            if (store.client && store.client.decrby) {
                return await store.client.decrby(key, amount);
            }
            throw new Error('Decrement not supported by cache store');
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
            const store = this.cacheManager.store;
            if (store.client && store.client.hset) {
                const serializedValue = JSON.stringify(value);
                await store.client.hset(key, field, serializedValue);
                this.logger.debug(`Hash set: ${key}.${field}`);
            }
            else {
                throw new Error('Hash operations not supported by cache store');
            }
        }
        catch (error) {
            this.logger.error(`Failed to set hash field ${key}.${field}`, error.stack);
            throw error;
        }
    }
    async hget(key, field) {
        try {
            const store = this.cacheManager.store;
            if (store.client && store.client.hget) {
                const value = await store.client.hget(key, field);
                if (!value) {
                    return null;
                }
                return JSON.parse(value);
            }
            return null;
        }
        catch (error) {
            this.logger.error(`Failed to get hash field ${key}.${field}`, error.stack);
            return null;
        }
    }
    async hgetall(key) {
        try {
            const store = this.cacheManager.store;
            if (store.client && store.client.hgetall) {
                const hash = await store.client.hgetall(key);
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
            return {};
        }
        catch (error) {
            this.logger.error(`Failed to get all hash fields for ${key}`, error.stack);
            return {};
        }
    }
    async hdel(key, field) {
        try {
            const store = this.cacheManager.store;
            if (store.client && store.client.hdel) {
                await store.client.hdel(key, field);
                this.logger.debug(`Hash field deleted: ${key}.${field}`);
            }
        }
        catch (error) {
            this.logger.error(`Failed to delete hash field ${key}.${field}`, error.stack);
            throw error;
        }
    }
    async lpush(key, value) {
        try {
            const store = this.cacheManager.store;
            if (store.client && store.client.lpush) {
                const serializedValue = JSON.stringify(value);
                await store.client.lpush(key, serializedValue);
                this.logger.debug(`List push: ${key}`);
            }
        }
        catch (error) {
            this.logger.error(`Failed to push to list ${key}`, error.stack);
            throw error;
        }
    }
    async lpop(key) {
        try {
            const store = this.cacheManager.store;
            if (store.client && store.client.lpop) {
                const value = await store.client.lpop(key);
                if (!value) {
                    return null;
                }
                return JSON.parse(value);
            }
            return null;
        }
        catch (error) {
            this.logger.error(`Failed to pop from list ${key}`, error.stack);
            return null;
        }
    }
    async lrange(key, start, stop) {
        try {
            const store = this.cacheManager.store;
            if (store.client && store.client.lrange) {
                const values = await store.client.lrange(key, start, stop);
                return values.map((v) => JSON.parse(v));
            }
            return [];
        }
        catch (error) {
            this.logger.error(`Failed to get range from list ${key}`, error.stack);
            return [];
        }
    }
    async reset() {
        try {
            await this.cacheManager.reset();
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
            const store = this.cacheManager.store;
            if (store.client && store.client.info && store.client.dbsize) {
                const info = await store.client.info();
                const dbSize = await store.client.dbsize();
                return {
                    dbSize,
                    info: this.parseRedisInfo(info)
                };
            }
            return { message: 'Stats not available for this cache store' };
        }
        catch (error) {
            this.logger.error('Failed to get cache stats', error.stack);
            return null;
        }
    }
    async ping() {
        try {
            const store = this.cacheManager.store;
            if (store.client && store.client.ping) {
                const result = await store.client.ping();
                this.logger.log(`Redis PING: ${result}`);
                return result === 'PONG';
            }
            await this.set('ping:test', 'pong', 5);
            const value = await this.get('ping:test');
            return value === 'pong';
        }
        catch (error) {
            this.logger.error('Cache PING failed:', error.message);
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
        this.logger.log('✅ CacheService cleanup complete');
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
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object])
], CacheService);
exports.CacheService = CacheService;
//# sourceMappingURL=cache.service.js.map