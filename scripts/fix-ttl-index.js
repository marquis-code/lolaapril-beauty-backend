require('dotenv').config();
const mongoose = require('mongoose');

const mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl).then(async () => {
  const db = mongoose.connection.db;
  
  console.log('\n=== FIXING BOOKING TTL INDEX ===\n');
  
  // Get current indexes
  const indexes = await db.collection('bookings').indexes();
  console.log('Current indexes:');
  indexes.forEach(index => {
    console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    if (index.expireAfterSeconds !== undefined) {
      console.log(`    ⚠️  HAS TTL: expireAfterSeconds = ${index.expireAfterSeconds}`);
    }
  });
  
  // Drop the TTL index
  console.log('\n🔧 Dropping TTL index on expiresAt...');
  try {
    await db.collection('bookings').dropIndex('expiresAt_1');
    console.log('✅ TTL index dropped successfully');
  } catch (err) {
    console.log('⚠️  Index might not exist or already dropped:', err.message);
  }
  
  // Recreate as regular index without TTL
  console.log('\n🔧 Creating regular index on expiresAt (without TTL)...');
  await db.collection('bookings').createIndex({ expiresAt: 1 });
  console.log('✅ Regular index created');
  
  // Verify
  const newIndexes = await db.collection('bookings').indexes();
  console.log('\nNew indexes:');
  newIndexes.forEach(index => {
    console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    if (index.expireAfterSeconds !== undefined) {
      console.log(`    ⚠️  HAS TTL: expireAfterSeconds = ${index.expireAfterSeconds}`);
    }
  });
  
  console.log('\n✅ BOOKING TTL INDEX FIXED!');
  console.log('Bookings will no longer be auto-deleted.');
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
