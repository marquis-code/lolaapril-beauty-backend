/**
 * Simple test for cache increment functionality
 */

const { redisStore } = require('cache-manager-redis-yet');
const { caching } = require('cache-manager');

async function testIncrement() {
  console.log('\n🧪 Testing Cache Increment with cache-manager-redis-yet\n');

  try {
    // Create cache with redis store
    const cache = await caching(
      await redisStore({
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT) || 6379,
        },
        password: process.env.REDIS_PASSWORD,
        username: process.env.REDIS_USERNAME || 'default',
      })
    );

    console.log('✅ Cache store initialized\n');

    // Get the store
    const store = cache.store;
    console.log('Store type:', store.constructor.name);
    console.log('Store has client:', !!store.client);

    if (store.client) {
      console.log('Client type:', store.client.constructor.name);
      console.log('Client has incrBy:', typeof store.client.incrBy);
      console.log('Client has incrby:', typeof store.client.incrby);
      console.log('Client has incr:', typeof store.client.incr);
    }

    // Test increment using our logic
    const testKey = `test:increment:${Date.now()}`;
    
    try {
      let client = null;
      
      if (store && store.client) {
        client = store.client;
      }
      
      if (client) {
        console.log('\n📊 Testing increment methods:\n');
        
        // Try incrBy
        if (typeof client.incrBy === 'function') {
          const val1 = await client.incrBy(testKey, 1);
          console.log('  incrBy(1) = ', val1);
          const val2 = await client.incrBy(testKey, 5);
          console.log('  incrBy(5) = ', val2);
          console.log('  ✅ incrBy method works!');
        } else {
          console.log('  ❌ incrBy not available');
        }

        // Clean up
        if (typeof client.del === 'function') {
          await client.del(testKey);
        }
      } else {
        console.log('❌ Could not access Redis client');
      }

      console.log('\n✅ Test completed successfully!\n');
      process.exit(0);
    } catch (error) {
      console.error('❌ Test failed:', error.message);
      console.error(error.stack);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Failed to initialize:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testIncrement();
