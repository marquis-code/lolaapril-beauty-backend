// Script to check if Google OAuth user was created
require('dotenv').config();
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });
const User = mongoose.model('User', userSchema);

async function checkGoogleUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    const googleUsers = await User.find({ googleId: { $exists: true } })
      .sort({ createdAt: -1 })
      .limit(5);

    console.log('\n📊 Recent Google OAuth Users:');
    console.log('================================\n');

    if (googleUsers.length === 0) {
      console.log('❌ No Google OAuth users found yet');
    } else {
      googleUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Google ID: ${user.googleId}`);
        console.log(`   Role: ${user.role || 'client'}`);
        console.log(`   Created: ${user.createdAt || 'N/A'}`);
        console.log('');
      });
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkGoogleUsers();
