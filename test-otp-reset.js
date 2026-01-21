// Quick test script for OTP password reset
const axios = require('axios');

const API_URL = 'http://localhost:3000/auth';
const TEST_EMAIL = 'marquis@admin.com'; // One of the fixed users

async function testPasswordReset() {
  console.log('🧪 Testing OTP Password Reset System\n');

  try {
    // Step 1: Request OTP
    console.log('1️⃣  Requesting OTP for:', TEST_EMAIL);
    const forgotResponse = await axios.post(`${API_URL}/forgot-password`, {
      email: TEST_EMAIL
    });
    console.log('✅ Response:', forgotResponse.data);
    console.log('📝 Check server console for OTP code\n');

    // Prompt for OTP (in production, this would come from email/SMS)
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question('Enter the OTP from console: ', async (otp) => {
      try {
        // Step 2: Verify OTP (optional)
        console.log('\n2️⃣  Verifying OTP...');
        const verifyResponse = await axios.post(`${API_URL}/verify-reset-otp`, {
          email: TEST_EMAIL,
          otp: otp
        });
        console.log('✅ Response:', verifyResponse.data);

        // Step 3: Reset password
        console.log('\n3️⃣  Resetting password...');
        const resetResponse = await axios.post(`${API_URL}/reset-password`, {
          email: TEST_EMAIL,
          otp: otp,
          newPassword: 'NewTestPass123!'
        });
        console.log('✅ Response:', resetResponse.data);

        console.log('\n✨ Password reset completed successfully!');
        console.log('🔐 New password: NewTestPass123!');
        
      } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
      } finally {
        readline.close();
      }
    });

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Check if server is running
axios.get('http://localhost:3000')
  .then(() => {
    testPasswordReset();
  })
  .catch(() => {
    console.error('❌ Server not running. Start the server first: npm run start:dev');
    process.exit(1);
  });
