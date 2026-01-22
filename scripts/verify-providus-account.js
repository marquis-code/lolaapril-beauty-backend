require('dotenv').config();
const axios = require('axios');

async function verifyBankAccount() {
  try {
    const accountNumber = '1304427625';
    const bankCode = '023'; // Current code for Providus Bank
    const accountName = 'LOLA APRIL WELLNESS SPA LTD';
    
    console.log('\n=== STEP 1: CHECKING PROVIDUS BANK CODE ===\n');
    
    // First, get all banks to find the correct Providus code
    const banksResponse = await axios.get('https://api.paystack.co/bank', {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });
    
    const banks = banksResponse.data.data;
    const providusBanks = banks.filter(bank => 
      bank.name.toLowerCase().includes('providus')
    );
    
    if (providusBanks.length === 0) {
      console.log('❌ Providus Bank not found in Paystack\'s bank list!');
    } else {
      console.log('✅ Found Providus Bank:');
      providusBanks.forEach(bank => {
        console.log(`   Name: ${bank.name}`);
        console.log(`   Code: ${bank.code}`);
        console.log(`   Active: ${bank.active}`);
      });
    }
    
    // Use the correct code
    const correctBankCode = providusBanks[0]?.code || bankCode;
    
    console.log('\n=== STEP 2: VERIFYING ACCOUNT NUMBER ===\n');
    console.log(`Account Number: ${accountNumber}`);
    console.log(`Bank Code: ${correctBankCode}`);
    
    // Try to resolve the account
    try {
      const resolveResponse = await axios.get(
        `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${correctBankCode}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
          }
        }
      );
      
      console.log('\n✅ ACCOUNT RESOLVED SUCCESSFULLY!');
      console.log(`   Account Name: ${resolveResponse.data.data.account_name}`);
      console.log(`   Account Number: ${resolveResponse.data.data.account_number}`);
      
      // Check if name matches
      const resolvedName = resolveResponse.data.data.account_name.toLowerCase();
      const expectedName = accountName.toLowerCase();
      
      if (resolvedName.includes('lola') || expectedName.includes(resolvedName.split(' ')[0])) {
        console.log('\n✅ Account name matches!');
      } else {
        console.log('\n⚠️  Account name mismatch:');
        console.log(`   Expected: ${accountName}`);
        console.log(`   Resolved: ${resolveResponse.data.data.account_name}`);
      }
      
      console.log('\n📝 RECOMMENDATION:');
      if (correctBankCode !== bankCode) {
        console.log(`   Update bank code from "${bankCode}" to "${correctBankCode}" in database`);
      } else {
        console.log('   Bank code is correct!');
      }
      
    } catch (resolveError) {
      console.log('\n❌ ACCOUNT RESOLUTION FAILED!');
      console.log('Error:', resolveError.response?.data || resolveError.message);
      
      if (correctBankCode !== bankCode) {
        console.log(`\n💡 Try using bank code "${correctBankCode}" instead of "${bankCode}"`);
      } else {
        console.log('\n⚠️  Possible issues:');
        console.log('   1. Account number may be incorrect');
        console.log('   2. Account may not exist or is closed');
        console.log('   3. Providus Bank may not be fully supported for transfers');
      }
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
  }
}

verifyBankAccount();
