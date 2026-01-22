# Cache Increment Error Fix

## Problem
The application was experiencing "Increment not supported by cache store" errors on Render, specifically when the RateLimiterGuard tried to increment request counters.

### Error Stack Trace
```
Error: Increment not supported by cache store
    at CacheService.increment (/opt/render/project/src/dist/src/cache/cache.service.js:127:19)
    at CacheService.incrementCounter (/opt/render/project/src/dist/src/cache/cache.service.js:369:40)
    at RateLimiterGuard.canActivate (/opt/render/project/src/dist/src/rate-limiter/rate-limiter.guard.js:28:47)
```

## Root Cause
The `CacheService.increment()` method was trying to access the Redis client from the cache-manager store, but it was:
1. Only trying one specific path to access the Redis client
2. Throwing an error immediately if the client wasn't found
3. Not handling cases where the cache store structure might differ

## Solution
Updated the `increment()` and `decrement()` methods in `src/cache/cache.service.ts` to:

### 1. Try Multiple Paths to Access Redis Client
```typescript
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
```

### 2. Try Multiple Redis Increment Methods
```typescript
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
```

### 3. Implement Fallback for Non-Atomic Operations
If direct Redis increment is not available, the method now falls back to a get/set pattern:
```typescript
// Fallback: Use get/set pattern if direct increment not available
this.logger.warn(`Direct increment not available for key ${key}, using get/set fallback`);
const current = await this.get<number>(key);
const newValue = (current || 0) + amount;
await this.set(key, newValue);
return newValue;
```

### 4. Enhanced incrementCounter for Rate Limiting
Updated the `incrementCounter()` method to properly check if the key exists before setting TTL:
```typescript
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
```

## Changes Made

### Files Modified
1. **`src/cache/cache.service.ts`**
   - Updated `increment()` method with multiple client access paths and fallback
   - Updated `decrement()` method with multiple client access paths and fallback
   - Enhanced `incrementCounter()` to check key existence before setting TTL

### Benefits of This Fix
1. **Resilient**: Works with different cache store implementations
2. **Graceful Degradation**: Falls back to get/set if atomic operations aren't available
3. **Comprehensive**: Handles multiple Redis client method naming conventions
4. **Better Logging**: Warns when using fallback method for debugging
5. **Production Ready**: Won't crash the application if Redis client structure changes

## Testing
After deploying this fix to Render, the rate limiter should work without throwing errors. The application will:
- Use atomic Redis increment operations when available (preferred)
- Fall back to get/set pattern if needed (still functional)
- Log warnings if fallback is used (for monitoring)

## Deployment
1. Build the application: `npm run build`
2. Deploy to Render
3. Monitor logs for any "using get/set fallback" warnings
4. Verify no more "Increment not supported" errors

## Future Improvements
- Monitor if fallback is being used in production
- If fallback is frequently used, investigate the cache store configuration
- Consider adding metrics for cache operation types

## Affected Components
- **RateLimiterGuard**: Rate limiting for API endpoints
- **CacheService**: All increment/decrement operations
- **Any service using counter operations**: Analytics, metrics, etc.
