// import { Injectable, Logger } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import Redis from 'ioredis';

// @Injectable()
// export class CacheService {
//   private readonly logger = new Logger(CacheService.name);
//   private redisClient: Redis;

//   constructor(private configService: ConfigService) {
//     const redisHost = this.configService.get('REDIS_HOST', 'localhost');
//     const redisPort = this.configService.get('REDIS_PORT', 6379);
//     const redisPassword = this.configService.get('REDIS_PASSWORD');
//     const redisUsername = this.configService.get('REDIS_USERNAME', 'default');
//     const nodeEnv = this.configService.get('NODE_ENV', 'development');

//     // Check if we're using Redis Cloud (by checking host)
//     const isRedisCloud = redisHost.includes('redislabs.com') || redisHost.includes('cloud.redislabs');

//     this.logger.log('🔴 Initializing Redis Cache Service');
//     this.logger.log(`   Host: ${redisHost}`);
//     this.logger.log(`   Port: ${redisPort}`);
//     this.logger.log(`   Username: ${redisUsername}`);
//     this.logger.log(`   Password: ${redisPassword ? '✓ Set' : '✗ Not set'}`);
//     this.logger.log(`   TLS: ${isRedisCloud ? 'Enabled' : 'Disabled'}`);
//     this.logger.log(`   Environment: ${nodeEnv}`);

//     this.redisClient = new Redis({
//       host: redisHost,
//       port: redisPort,
//       password: redisPassword,
//       username: redisUsername,
//       // Enable TLS for Redis Cloud
//       tls: isRedisCloud ? {} : undefined,
//       // Connection settings
//       connectTimeout: 10000, // 10 seconds
//       maxRetriesPerRequest: 3,
//       enableReadyCheck: true,
//       retryStrategy: (times) => {
//         const delay = Math.min(times * 50, 2000);
//         this.logger.warn(`🔄 Redis retry attempt ${times}, waiting ${delay}ms`);
//         return delay;
//       },
//       // Reconnect settings
//       lazyConnect: false,
//       keepAlive: 30000,
//       family: 4, // Use IPv4
//     });

//     this.redisClient.on('connect', () => {
//       this.logger.log('✅ Redis client connected successfully');
//     });

//     this.redisClient.on('ready', () => {
//       this.logger.log('✅ Redis client ready to receive commands');
//     });

//     this.redisClient.on('error', (error) => {
//       this.logger.error('❌ Redis connection error:', error.message);
//     });

//     this.redisClient.on('close', () => {
//       this.logger.warn('⚠️  Redis connection closed');
//     });

//     this.redisClient.on('reconnecting', () => {
//       this.logger.log('🔄 Redis client reconnecting...');
//     });
//   }

//   /**
//    * Set a value in cache with optional TTL (time to live in seconds)
//    */
//   async set(key: string, value: any, ttl?: number): Promise<void> {
//     try {
//       const serializedValue = JSON.stringify(value);
      
//       if (ttl) {
//         await this.redisClient.setex(key, ttl, serializedValue);
//       } else {
//         await this.redisClient.set(key, serializedValue);
//       }
      
//       this.logger.debug(`Cache set: ${key} (TTL: ${ttl || 'none'})`);
//     } catch (error) {
//       this.logger.error(`Failed to set cache for key ${key}`, error.stack);
//       throw error;
//     }
//   }

//   /**
//    * Get a value from cache
//    */
//   async get<T = any>(key: string): Promise<T | null> {
//     try {
//       const value = await this.redisClient.get(key);
      
//       if (!value) {
//         this.logger.debug(`Cache miss: ${key}`);
//         return null;
//       }
      
//       this.logger.debug(`Cache hit: ${key}`);
//       return JSON.parse(value) as T;
//     } catch (error) {
//       this.logger.error(`Failed to get cache for key ${key}`, error.stack);
//       return null;
//     }
//   }

//   /**
//    * Delete a value from cache
//    */
//   async delete(key: string): Promise<void> {
//     try {
//       await this.redisClient.del(key);
//       this.logger.debug(`Cache deleted: ${key}`);
//     } catch (error) {
//       this.logger.error(`Failed to delete cache for key ${key}`, error.stack);
//       throw error;
//     }
//   }

//   /**
//    * Alias for delete method (for backward compatibility)
//    */
//   async del(key: string): Promise<void> {
//     return this.delete(key);
//   }

//   /**
//    * Delete multiple keys matching a pattern
//    */
//   async deletePattern(pattern: string): Promise<number> {
//     try {
//       const keys = await this.redisClient.keys(pattern);
      
//       if (keys.length === 0) {
//         return 0;
//       }
      
//       await this.redisClient.del(...keys);
//       this.logger.debug(`Cache deleted ${keys.length} keys matching pattern: ${pattern}`);
      
//       return keys.length;
//     } catch (error) {
//       this.logger.error(`Failed to delete cache pattern ${pattern}`, error.stack);
//       throw error;
//     }
//   }

//   /**
//    * Check if a key exists in cache
//    */
//   async exists(key: string): Promise<boolean> {
//     try {
//       const result = await this.redisClient.exists(key);
//       return result === 1;
//     } catch (error) {
//       this.logger.error(`Failed to check cache existence for key ${key}`, error.stack);
//       return false;
//     }
//   }

//   /**
//    * Set expiration time for a key
//    */
//   async expire(key: string, ttl: number): Promise<void> {
//     try {
//       await this.redisClient.expire(key, ttl);
//       this.logger.debug(`Cache expiration set for ${key}: ${ttl}s`);
//     } catch (error) {
//       this.logger.error(`Failed to set expiration for key ${key}`, error.stack);
//       throw error;
//     }
//   }

//   /**
//    * Get remaining TTL for a key
//    */
//   async ttl(key: string): Promise<number> {
//     try {
//       return await this.redisClient.ttl(key);
//     } catch (error) {
//       this.logger.error(`Failed to get TTL for key ${key}`, error.stack);
//       return -1;
//     }
//   }

//   /**
//    * Increment a numeric value
//    */
//   async increment(key: string, amount: number = 1): Promise<number> {
//     try {
//       return await this.redisClient.incrby(key, amount);
//     } catch (error) {
//       this.logger.error(`Failed to increment key ${key}`, error.stack);
//       throw error;
//     }
//   }

//   /**
//    * Decrement a numeric value
//    */
//   async decrement(key: string, amount: number = 1): Promise<number> {
//     try {
//       return await this.redisClient.decrby(key, amount);
//     } catch (error) {
//       this.logger.error(`Failed to decrement key ${key}`, error.stack);
//       throw error;
//     }
//   }

//   /**
//    * Get or set pattern - get from cache or execute function and cache result
//    */
//   async getOrSet<T>(
//     key: string,
//     factory: () => Promise<T>,
//     ttl?: number
//   ): Promise<T> {
//     try {
//       // Try to get from cache first
//       const cached = await this.get<T>(key);
      
//       if (cached !== null) {
//         return cached;
//       }
      
//       // If not in cache, execute factory function
//       const value = await factory();
      
//       // Cache the result
//       await this.set(key, value, ttl);
      
//       return value;
//     } catch (error) {
//       this.logger.error(`Failed getOrSet for key ${key}`, error.stack);
//       throw error;
//     }
//   }

//   /**
//    * Hash operations - set field in hash
//    */
//   async hset(key: string, field: string, value: any): Promise<void> {
//     try {
//       const serializedValue = JSON.stringify(value);
//       await this.redisClient.hset(key, field, serializedValue);
//       this.logger.debug(`Hash set: ${key}.${field}`);
//     } catch (error) {
//       this.logger.error(`Failed to set hash field ${key}.${field}`, error.stack);
//       throw error;
//     }
//   }

//   /**
//    * Hash operations - get field from hash
//    */
//   async hget<T = any>(key: string, field: string): Promise<T | null> {
//     try {
//       const value = await this.redisClient.hget(key, field);
      
//       if (!value) {
//         return null;
//       }
      
//       return JSON.parse(value) as T;
//     } catch (error) {
//       this.logger.error(`Failed to get hash field ${key}.${field}`, error.stack);
//       return null;
//     }
//   }

//   /**
//    * Hash operations - get all fields from hash
//    */
//   async hgetall<T = any>(key: string): Promise<Record<string, T>> {
//     try {
//       const hash = await this.redisClient.hgetall(key);
      
//       const result: Record<string, T> = {};
      
//       for (const [field, value] of Object.entries(hash)) {
//         try {
//           result[field] = JSON.parse(value) as T;
//         } catch {
//           result[field] = value as any;
//         }
//       }
      
//       return result;
//     } catch (error) {
//       this.logger.error(`Failed to get all hash fields for ${key}`, error.stack);
//       return {};
//     }
//   }

//   /**
//    * Hash operations - delete field from hash
//    */
//   async hdel(key: string, field: string): Promise<void> {
//     try {
//       await this.redisClient.hdel(key, field);
//       this.logger.debug(`Hash field deleted: ${key}.${field}`);
//     } catch (error) {
//       this.logger.error(`Failed to delete hash field ${key}.${field}`, error.stack);
//       throw error;
//     }
//   }

//   /**
//    * List operations - push to list
//    */
//   async lpush(key: string, value: any): Promise<void> {
//     try {
//       const serializedValue = JSON.stringify(value);
//       await this.redisClient.lpush(key, serializedValue);
//       this.logger.debug(`List push: ${key}`);
//     } catch (error) {
//       this.logger.error(`Failed to push to list ${key}`, error.stack);
//       throw error;
//     }
//   }

//   /**
//    * List operations - pop from list
//    */
//   async lpop<T = any>(key: string): Promise<T | null> {
//     try {
//       const value = await this.redisClient.lpop(key);
      
//       if (!value) {
//         return null;
//       }
      
//       return JSON.parse(value) as T;
//     } catch (error) {
//       this.logger.error(`Failed to pop from list ${key}`, error.stack);
//       return null;
//     }
//   }

//   /**
//    * List operations - get range from list
//    */
//   async lrange<T = any>(key: string, start: number, stop: number): Promise<T[]> {
//     try {
//       const values = await this.redisClient.lrange(key, start, stop);
//       return values.map(v => JSON.parse(v) as T);
//     } catch (error) {
//       this.logger.error(`Failed to get range from list ${key}`, error.stack);
//       return [];
//     }
//   }

//   /**
//    * Clear all cache
//    */
//   async reset(): Promise<void> {
//     try {
//       await this.redisClient.flushdb(); // Use flushdb instead of flushall to clear current database only
//       this.logger.warn('All cache cleared');
//     } catch (error) {
//       this.logger.error('Failed to flush all cache', error.stack);
//       throw error;
//     }
//   }

//   /**
//    * Alias for reset (for backward compatibility)
//    */
//   async flushAll(): Promise<void> {
//     return this.reset();
//   }

//   /**
//    * Get cache statistics
//    */
//   async getStats(): Promise<any> {
//     try {
//       const info = await this.redisClient.info();
//       const dbSize = await this.redisClient.dbsize();
      
//       return {
//         dbSize,
//         info: this.parseRedisInfo(info)
//       };
//     } catch (error) {
//       this.logger.error('Failed to get cache stats', error.stack);
//       return null;
//     }
//   }

//   /**
//    * Test Redis connection
//    */
//   async ping(): Promise<boolean> {
//     try {
//       const result = await this.redisClient.ping();
//       this.logger.log(`Redis PING: ${result}`);
//       return result === 'PONG';
//     } catch (error) {
//       this.logger.error('Redis PING failed:', error.message);
//       return false;
//     }
//   }

//   // Business-specific cache methods
//   async cacheBusinessProfile(businessId: string, profile: any): Promise<void> {
//     await this.set(`business:${businessId}:profile`, profile, 3600);
//   }

//   async getBusinessProfile(businessId: string): Promise<any> {
//     return this.get(`business:${businessId}:profile`);
//   }

//   async cacheAvailability(staffId: string, date: string, slots: any): Promise<void> {
//     await this.set(`availability:${staffId}:${date}`, slots, 1800); // 30 minutes
//   }

//   async getAvailability(staffId: string, date: string): Promise<any> {
//     return this.get(`availability:${staffId}:${date}`);
//   }

//   async invalidateAvailability(staffId: string): Promise<void> {
//     try {
//       await this.deletePattern(`availability:${staffId}:*`);
//       this.logger.debug(`Invalidated availability cache for staff ${staffId}`);
//     } catch (error) {
//       this.logger.error(`Failed to invalidate availability for staff ${staffId}`, error.stack);
//     }
//   }

//   async cachePricingRules(tenantId: string, rules: any): Promise<void> {
//     await this.set(`pricing:${tenantId}`, rules, 7200); // 2 hours
//   }

//   async getPricingRules(tenantId: string): Promise<any> {
//     return this.get(`pricing:${tenantId}`);
//   }

//   // Session management
//   async setSession(sessionId: string, data: any, ttl = 86400): Promise<void> {
//     await this.set(`session:${sessionId}`, data, ttl);
//   }

//   async getSession(sessionId: string): Promise<any> {
//     return this.get(`session:${sessionId}`);
//   }

//   async deleteSession(sessionId: string): Promise<void> {
//     await this.del(`session:${sessionId}`);
//   }

//   // Rate limiting support
//   async incrementCounter(key: string, ttl = 60): Promise<number> {
//     try {
//       const current = await this.increment(key, 1);
      
//       // Set TTL only if this is a new key
//       if (current === 1) {
//         await this.expire(key, ttl);
//       }
      
//       return current;
//     } catch (error) {
//       this.logger.error(`Failed to increment counter for key ${key}`, error.stack);
//       throw error;
//     }
//   }

//   /**
//    * Close Redis connection
//    */
//   async onModuleDestroy(): Promise<void> {
//     await this.redisClient.quit();
//     this.logger.log('✅ Redis client disconnected gracefully');
//   }

//   // Helper methods
//   private parseRedisInfo(info: string): Record<string, any> {
//     const result: Record<string, any> = {};
//     const lines = info.split('\r\n');
    
//     for (const line of lines) {
//       if (line && !line.startsWith('#')) {
//         const [key, value] = line.split(':');
//         if (key && value) {
//           result[key] = value;
//         }
//       }
//     }
    
//     return result;
//   }
// }


import { Injectable, Logger, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.logger.log('✅ CacheService initialized using NestJS CacheManager (shared Redis connection)');
  }

  /**
   * Set a value in cache with optional TTL (time to live in seconds)
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const ttlMs = ttl ? ttl * 1000 : undefined; // Convert seconds to milliseconds
      await this.cacheManager.set(key, value, ttlMs);
      this.logger.debug(`Cache set: ${key} (TTL: ${ttl || 'none'})`);
    } catch (error) {
      this.logger.error(`Failed to set cache for key ${key}`, error.stack);
      throw error;
    }
  }

  /**
   * Get a value from cache
   */
  async get<T = any>(key: string): Promise<T | null> {
    try {
      const value = await this.cacheManager.get<T>(key);
      
      if (!value) {
        this.logger.debug(`Cache miss: ${key}`);
        return null;
      }
      
      this.logger.debug(`Cache hit: ${key}`);
      return value;
    } catch (error) {
      this.logger.error(`Failed to get cache for key ${key}`, error.stack);
      return null;
    }
  }

  /**
   * Delete a value from cache
   */
  async delete(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
      this.logger.debug(`Cache deleted: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete cache for key ${key}`, error.stack);
      throw error;
    }
  }

  /**
   * Alias for delete method (for backward compatibility)
   */
  async del(key: string): Promise<void> {
    return this.delete(key);
  }

  /**
   * Delete multiple keys matching a pattern
   * Note: This requires accessing the underlying Redis store
   */
  async deletePattern(pattern: string): Promise<number> {
    try {
      // Access the underlying Redis store
      const store: any = (this.cacheManager as any).store || this.cacheManager.stores?.[0];
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
    } catch (error) {
      this.logger.error(`Failed to delete cache pattern ${pattern}`, error.stack);
      throw error;
    }
  }

  /**
   * Check if a key exists in cache
   * Note: cache-manager doesn't have exists(), so we try to get it
   */
  async exists(key: string): Promise<boolean> {
    try {
      const value = await this.cacheManager.get(key);
      return value !== undefined && value !== null;
    } catch (error) {
      this.logger.error(`Failed to check cache existence for key ${key}`, error.stack);
      return false;
    }
  }

  /**
   * Set expiration time for a key
   * Note: cache-manager doesn't support separate expire, must reset with TTL
   */
  async expire(key: string, ttl: number): Promise<void> {
    try {
      const value = await this.cacheManager.get(key);
      if (value !== undefined && value !== null) {
        await this.set(key, value, ttl);
        this.logger.debug(`Cache expiration set for ${key}: ${ttl}s`);
      }
    } catch (error) {
      this.logger.error(`Failed to set expiration for key ${key}`, error.stack);
      throw error;
    }
  }

  /**
   * Get remaining TTL for a key
   * Note: Requires direct Redis access
   */
  async ttl(key: string): Promise<number> {
    try {
      const store: any = (this.cacheManager as any).store || this.cacheManager.stores?.[0];
      if (store.client && store.client.ttl) {
        return await store.client.ttl(key);
      }
      this.logger.warn('TTL not supported by cache store');
      return -1;
    } catch (error) {
      this.logger.error(`Failed to get TTL for key ${key}`, error.stack);
      return -1;
    }
  }

  /**
   * Increment a numeric value
   * Note: Requires direct Redis access
   */
  async increment(key: string, amount: number = 1): Promise<number> {
    try {
      const store: any = (this.cacheManager as any).store;
      
      // Try multiple paths to access the Redis client
      let client = null;
      
      // Path 1: Direct client access (cache-manager-redis-yet)
      if (store && store.client) {
        client = store.client;
      }
      // Path 2: Try accessing from stores array
      else if ((this.cacheManager as any).stores?.[0]?.client) {
        client = (this.cacheManager as any).stores[0].client;
      }
      // Path 3: Direct store access
      else if (store && typeof store.incrBy === 'function') {
        client = store;
      }
      
      if (client) {
        // Try incrBy method (most common)
        if (typeof client.incrBy === 'function') {
          return await client.incrBy(key, amount);
        }
        // Try incrby method (alternative casing)
        if (typeof client.incrby === 'function') {
          return await client.incrby(key, amount);
        }
        // Try incr for amount = 1
        if (amount === 1 && typeof client.incr === 'function') {
          return await client.incr(key);
        }
      }
      
      // Fallback: Use get/set pattern if direct increment not available
      this.logger.warn(`Direct increment not available for key ${key}, using get/set fallback`);
      const current = await this.get<number>(key);
      const newValue = (current || 0) + amount;
      await this.set(key, newValue);
      return newValue;
      
    } catch (error) {
      this.logger.error(`Failed to increment key ${key}`, error.stack);
      throw error;
    }
  }

  /**
   * Decrement a numeric value
   * Note: Requires direct Redis access
   */
  async decrement(key: string, amount: number = 1): Promise<number> {
    try {
      const store: any = (this.cacheManager as any).store;
      
      // Try multiple paths to access the Redis client
      let client = null;
      
      // Path 1: Direct client access (cache-manager-redis-yet)
      if (store && store.client) {
        client = store.client;
      }
      // Path 2: Try accessing from stores array
      else if ((this.cacheManager as any).stores?.[0]?.client) {
        client = (this.cacheManager as any).stores[0].client;
      }
      // Path 3: Direct store access
      else if (store && typeof store.decrBy === 'function') {
        client = store;
      }
      
      if (client) {
        // Try decrBy method (most common)
        if (typeof client.decrBy === 'function') {
          return await client.decrBy(key, amount);
        }
        // Try decrby method (alternative casing)
        if (typeof client.decrby === 'function') {
          return await client.decrby(key, amount);
        }
        // Try decr for amount = 1
        if (amount === 1 && typeof client.decr === 'function') {
          return await client.decr(key);
        }
      }
      
      // Fallback: Use get/set pattern if direct decrement not available
      this.logger.warn(`Direct decrement not available for key ${key}, using get/set fallback`);
      const current = await this.get<number>(key);
      const newValue = (current || 0) - amount;
      await this.set(key, newValue);
      return newValue;
      
    } catch (error) {
      this.logger.error(`Failed to decrement key ${key}`, error.stack);
      throw error;
    }
  }

  /**
   * Get or set pattern - get from cache or execute function and cache result
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    try {
      // Try to get from cache first
      const cached = await this.get<T>(key);
      
      if (cached !== null) {
        return cached;
      }
      
      // If not in cache, execute factory function
      const value = await factory();
      
      // Cache the result
      await this.set(key, value, ttl);
      
      return value;
    } catch (error) {
      this.logger.error(`Failed getOrSet for key ${key}`, error.stack);
      throw error;
    }
  }

  /**
   * Hash operations - set field in hash
   * Note: Requires direct Redis access
   */
  async hset(key: string, field: string, value: any): Promise<void> {
    try {
      const store: any = (this.cacheManager as any).store || this.cacheManager.stores?.[0];
      if (store.client && store.client.hset) {
        const serializedValue = JSON.stringify(value);
        await store.client.hset(key, field, serializedValue);
        this.logger.debug(`Hash set: ${key}.${field}`);
      } else {
        throw new Error('Hash operations not supported by cache store');
      }
    } catch (error) {
      this.logger.error(`Failed to set hash field ${key}.${field}`, error.stack);
      throw error;
    }
  }

  /**
   * Hash operations - get field from hash
   * Note: Requires direct Redis access
   */
  async hget<T = any>(key: string, field: string): Promise<T | null> {
    try {
      const store: any = (this.cacheManager as any).store || this.cacheManager.stores?.[0];
      if (store.client && store.client.hget) {
        const value = await store.client.hget(key, field);
        
        if (!value) {
          return null;
        }
        
        return JSON.parse(value) as T;
      }
      return null;
    } catch (error) {
      this.logger.error(`Failed to get hash field ${key}.${field}`, error.stack);
      return null;
    }
  }

  /**
   * Hash operations - get all fields from hash
   * Note: Requires direct Redis access
   */
  async hgetall<T = any>(key: string): Promise<Record<string, T>> {
    try {
      const store: any = (this.cacheManager as any).store || this.cacheManager.stores?.[0];
      if (store.client && store.client.hgetall) {
        const hash = await store.client.hgetall(key);
        
        const result: Record<string, T> = {};
        
        for (const [field, value] of Object.entries(hash)) {
          try {
            result[field] = JSON.parse(value as string) as T;
          } catch {
            result[field] = value as any;
          }
        }
        
        return result;
      }
      return {};
    } catch (error) {
      this.logger.error(`Failed to get all hash fields for ${key}`, error.stack);
      return {};
    }
  }

  /**
   * Hash operations - delete field from hash
   * Note: Requires direct Redis access
   */
  async hdel(key: string, field: string): Promise<void> {
    try {
      const store: any = (this.cacheManager as any).store || this.cacheManager.stores?.[0];
      if (store.client && store.client.hdel) {
        await store.client.hdel(key, field);
        this.logger.debug(`Hash field deleted: ${key}.${field}`);
      }
    } catch (error) {
      this.logger.error(`Failed to delete hash field ${key}.${field}`, error.stack);
      throw error;
    }
  }

  /**
   * List operations - push to list
   * Note: Requires direct Redis access
   */
  async lpush(key: string, value: any): Promise<void> {
    try {
      const store: any = (this.cacheManager as any).store || this.cacheManager.stores?.[0];
      if (store.client && store.client.lpush) {
        const serializedValue = JSON.stringify(value);
        await store.client.lpush(key, serializedValue);
        this.logger.debug(`List push: ${key}`);
      }
    } catch (error) {
      this.logger.error(`Failed to push to list ${key}`, error.stack);
      throw error;
    }
  }

  /**
   * List operations - pop from list
   * Note: Requires direct Redis access
   */
  async lpop<T = any>(key: string): Promise<T | null> {
    try {
      const store: any = (this.cacheManager as any).store || this.cacheManager.stores?.[0];
      if (store.client && store.client.lpop) {
        const value = await store.client.lpop(key);
        
        if (!value) {
          return null;
        }
        
        return JSON.parse(value) as T;
      }
      return null;
    } catch (error) {
      this.logger.error(`Failed to pop from list ${key}`, error.stack);
      return null;
    }
  }

  /**
   * List operations - get range from list
   * Note: Requires direct Redis access
   */
  async lrange<T = any>(key: string, start: number, stop: number): Promise<T[]> {
    try {
      const store: any = (this.cacheManager as any).store || this.cacheManager.stores?.[0];
      if (store.client && store.client.lrange) {
        const values = await store.client.lrange(key, start, stop);
        return values.map((v: string) => JSON.parse(v) as T);
      }
      return [];
    } catch (error) {
      this.logger.error(`Failed to get range from list ${key}`, error.stack);
      return [];
    }
  }

  /**
   * Clear all cache
   */
  async reset(): Promise<void> {
    try {
      // cache-manager v5 doesn't have reset(), use store directly
      const store: any = (this.cacheManager as any).store || this.cacheManager.stores?.[0];
      if (store?.client?.flushdb) {
        await store.client.flushdb();
        this.logger.warn('All cache cleared');
      } else {
        this.logger.warn('Cache reset not supported in current configuration');
      }
    } catch (error) {
      this.logger.error('Failed to flush all cache', error.stack);
      throw error;
    }
  }

  /**
   * Alias for reset (for backward compatibility)
   */
  async flushAll(): Promise<void> {
    return this.reset();
  }

  /**
   * Get cache statistics
   * Note: Requires direct Redis access
   */
  async getStats(): Promise<any> {
    try {
      const store: any = (this.cacheManager as any).store || this.cacheManager.stores?.[0];
      if (store.client && store.client.info && store.client.dbsize) {
        const info = await store.client.info();
        const dbSize = await store.client.dbsize();
        
        return {
          dbSize,
          info: this.parseRedisInfo(info)
        };
      }
      return { message: 'Stats not available for this cache store' };
    } catch (error) {
      this.logger.error('Failed to get cache stats', error.stack);
      return null;
    }
  }

  /**
   * Test Redis connection
   */
  async ping(): Promise<boolean> {
    try {
      const store: any = (this.cacheManager as any).store || this.cacheManager.stores?.[0];
      if (store.client && store.client.ping) {
        const result = await store.client.ping();
        this.logger.log(`Redis PING: ${result}`);
        return result === 'PONG';
      }
      // Fallback: try to set/get a test key
      await this.set('ping:test', 'pong', 5);
      const value = await this.get('ping:test');
      return value === 'pong';
    } catch (error) {
      this.logger.error('Cache PING failed:', error.message);
      return false;
    }
  }

  // Business-specific cache methods
  async cacheBusinessProfile(businessId: string, profile: any): Promise<void> {
    await this.set(`business:${businessId}:profile`, profile, 3600);
  }

  async getBusinessProfile(businessId: string): Promise<any> {
    return this.get(`business:${businessId}:profile`);
  }

  async cacheAvailability(staffId: string, date: string, slots: any): Promise<void> {
    await this.set(`availability:${staffId}:${date}`, slots, 1800);
  }

  async getAvailability(staffId: string, date: string): Promise<any> {
    return this.get(`availability:${staffId}:${date}`);
  }

  async invalidateAvailability(staffId: string): Promise<void> {
    try {
      await this.deletePattern(`availability:${staffId}:*`);
      this.logger.debug(`Invalidated availability cache for staff ${staffId}`);
    } catch (error) {
      this.logger.error(`Failed to invalidate availability for staff ${staffId}`, error.stack);
    }
  }

  async cachePricingRules(tenantId: string, rules: any): Promise<void> {
    await this.set(`pricing:${tenantId}`, rules, 7200);
  }

  async getPricingRules(tenantId: string): Promise<any> {
    return this.get(`pricing:${tenantId}`);
  }

  // Session management
  async setSession(sessionId: string, data: any, ttl = 86400): Promise<void> {
    await this.set(`session:${sessionId}`, data, ttl);
  }

  async getSession(sessionId: string): Promise<any> {
    return this.get(`session:${sessionId}`);
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.del(`session:${sessionId}`);
  }

  // Rate limiting support
  async incrementCounter(key: string, ttl = 60): Promise<number> {
    try {
      // Check if key exists first
      const exists = await this.exists(key);
      
      // Increment the counter
      const current = await this.increment(key, 1);
      
      // Set TTL only if this is a new key (first increment)
      if (!exists || current === 1) {
        await this.expire(key, ttl);
      }
      
      return current;
    } catch (error) {
      this.logger.error(`Failed to increment counter for key ${key}`, error.stack);
      throw error;
    }
  }

  /**
   * Close cache connection (if needed)
   */
  async onModuleDestroy(): Promise<void> {
    // Cache manager handles connection cleanup automatically
    this.logger.log('✅ CacheService cleanup complete');
  }

  // Helper methods
  private parseRedisInfo(info: string): Record<string, any> {
    const result: Record<string, any> = {};
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
}