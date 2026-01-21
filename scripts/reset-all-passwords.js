const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const DEFAULT_PASSWORD = 'SecurePass123!';

async function resetAllPasswords() {
  try {
    console.log('🔐 Starting password reset for all users...\n');
    
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB\n');

    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

    // Get all users
    const users = await User.find({}).select('email firstName lastName role');
    console.log(`📊 Found ${users.length} users in the database\n`);

    if (users.length === 0) {
      console.log('⚠️  No users found in database');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Hash the default password
    console.log('🔨 Hashing default password...');
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 12);
    console.log('✅ Password hashed\n');

    // Update all users
    console.log('🔄 Updating all user passwords...\n');
    const result = await User.updateMany(
      {},
      {
        $set: {
          password: hashedPassword,
          resetPasswordOTP: undefined,
          resetPasswordOTPExpires: undefined,
          resetPasswordToken: undefined,
          resetPasswordExpires: undefined,
          refreshToken: undefined, // Clear all sessions
        }
      }
    );

    console.log('✅ Password reset completed!\n');
    console.log('📋 Summary:');
    console.log('─────────────────────────────────────────');
    console.log(`Total users:           ${users.length}`);
    console.log(`Passwords updated:     ${result.modifiedCount}`);
    console.log(`Default password:      ${DEFAULT_PASSWORD}`);
    console.log('─────────────────────────────────────────\n');

    console.log('👥 Updated users:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.firstName} ${user.lastName}) - ${user.role}`);
    });

    console.log('\n🔑 All users can now login with:');
    console.log(`   Password: ${DEFAULT_PASSWORD}`);
    console.log('\n⚠️  Note: All existing sessions have been invalidated. Users must login again.\n');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

resetAllPasswords();
