/**
 * Test script for cache increment functionality
 * This script tests the CacheService increment and incrementCounter methods
 */

const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/src/app.module');
const { CacheService } = require('../dist/src/cache/cache.service');

async function testCacheIncrement() {
  console.log('🧪 Testing Cache Increment Functionality...\n');

  try {
    // Create the Nest application
    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: ['error', 'warn', 'log'],
    });

    // Get the CacheService
    const cacheService = app.get(CacheService);

    console.log('✅ Application context created\n');

    // Test 1: Basic increment
    console.log('Test 1: Basic increment operation');
    const testKey1 = `test:increment:${Date.now()}`;
    
    const value1 = await cacheService.increment(testKey1, 1);
    console.log(`  First increment: ${value1} (expected: 1)`);
    
    const value2 = await cacheService.increment(testKey1, 1);
    console.log(`  Second increment: ${value2} (expected: 2)`);
    
    const value3 = await cacheService.increment(testKey1, 5);
    console.log(`  Third increment (+5): ${value3} (expected: 7)`);
    
    if (value1 === 1 && value2 === 2 && value3 === 7) {
      console.log('  ✅ Basic increment test PASSED\n');
    } else {
      console.log('  ❌ Basic increment test FAILED\n');
    }

    // Clean up
    await cacheService.delete(testKey1);

    // Test 2: incrementCounter with TTL
    console.log('Test 2: incrementCounter with TTL');
    const testKey2 = `test:counter:${Date.now()}`;
    
    const counter1 = await cacheService.incrementCounter(testKey2, 5);
    console.log(`  First counter increment: ${counter1} (expected: 1)`);
    
    const counter2 = await cacheService.incrementCounter(testKey2, 5);
    console.log(`  Second counter increment: ${counter2} (expected: 2)`);
    
    // Check if key exists
    const exists = await cacheService.exists(testKey2);
    console.log(`  Key exists: ${exists} (expected: true)`);
    
    if (counter1 === 1 && counter2 === 2 && exists) {
      console.log('  ✅ incrementCounter test PASSED\n');
    } else {
      console.log('  ❌ incrementCounter test FAILED\n');
    }

    // Clean up
    await cacheService.delete(testKey2);

    // Test 3: Rate limiter simulation
    console.log('Test 3: Rate limiter simulation (10 requests)');
    const testKey3 = `test:ratelimit:${Date.now()}`;
    const limit = 5;
    const ttl = 10;
    
    let blocked = false;
    for (let i = 1; i <= 10; i++) {
      const count = await cacheService.incrementCounter(testKey3, ttl);
      console.log(`  Request ${i}: count = ${count}`);
      
      if (count > limit && !blocked) {
        console.log(`  🚫 Rate limit exceeded at request ${i}`);
        blocked = true;
      }
    }
    
    if (blocked) {
      console.log('  ✅ Rate limiter simulation test PASSED\n');
    } else {
      console.log('  ❌ Rate limiter simulation test FAILED\n');
    }

    // Clean up
    await cacheService.delete(testKey3);

    console.log('✅ All tests completed!\n');

    // Close the application
    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  }
}

// Run the test
testCacheIncrement();
