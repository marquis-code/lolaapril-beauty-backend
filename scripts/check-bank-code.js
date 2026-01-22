require('dotenv').config();
const mongoose = require('mongoose');

const mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl).then(async () => {
  const db = mongoose.connection.db;
  
  const tenantId = '68d92deef36aec8d397f4c8c'; // From error log
  
  console.log('\n=== CHECKING BUSINESS BANK DETAILS ===\n');
  
  const business = await db.collection('businesses').findOne({ 
    _id: new mongoose.Types.ObjectId(tenantId) 
  });
  
  if (!business) {
    console.log('❌ Business not found');
    process.exit(1);
  }
  
  console.log('Business Name:', business.businessName);
  console.log('\nBank Account Details:');
  console.log('  Account Name:', business.businessDocuments?.bankAccount?.accountName);
  console.log('  Account Number:', business.businessDocuments?.bankAccount?.accountNumber);
  console.log('  Bank Name:', business.businessDocuments?.bankAccount?.bankName);
  console.log('  Bank Code:', business.businessDocuments?.bankAccount?.bankCode);
  console.log('  Bank Code Type:', typeof business.businessDocuments?.bankAccount?.bankCode);
  
  if (!business.businessDocuments?.bankAccount?.bankCode) {
    console.log('\n⚠️  PROBLEM: No bank code found!');
  } else {
    console.log('\n📝 Bank code found:', business.businessDocuments.bankAccount.bankCode);
    console.log('   Expected format: 3-digit code like "058", "044", "063", etc.');
  }
  
  console.log('\n\n=== PAYSTACK BANK CODES (EXAMPLES) ===');
  console.log('GT Bank: 058');
  console.log('Access Bank: 044');
  console.log('First Bank: 011');
  console.log('Zenith Bank: 057');
  console.log('UBA: 033');
  console.log('Guarantee Trust Bank: 058');
  console.log('\nSee full list: https://paystack.com/docs/identity-verification/supported-banks/');
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
