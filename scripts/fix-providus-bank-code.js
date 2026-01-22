require('dotenv').config();
const mongoose = require('mongoose');

const mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl).then(async () => {
  const db = mongoose.connection.db;
  
  const businessId = '68d92deef36aec8d397f4c8c';
  
  console.log('\n=== UPDATING PROVIDUS BANK CODE ===\n');
  
  const result = await db.collection('businesses').updateOne(
    { _id: new mongoose.Types.ObjectId(businessId) },
    { 
      $set: { 
        'businessDocuments.bankAccount.bankCode': '101'
      } 
    }
  );
  
  if (result.modifiedCount > 0) {
    console.log('✅ Bank code updated successfully!');
    console.log('   Old code: 023');
    console.log('   New code: 101 (Providus Bank - Paystack)');
    
    // Verify the update
    const business = await db.collection('businesses').findOne({ 
      _id: new mongoose.Types.ObjectId(businessId) 
    });
    
    console.log('\n📋 Updated bank details:');
    console.log('   Account Name:', business.businessDocuments.bankAccount.accountName);
    console.log('   Account Number:', business.businessDocuments.bankAccount.accountNumber);
    console.log('   Bank Name:', business.businessDocuments.bankAccount.bankName);
    console.log('   Bank Code:', business.businessDocuments.bankAccount.bankCode);
    
    console.log('\n✅ Payouts should now work!');
  } else {
    console.log('⚠️  No changes made (already up to date or business not found)');
  }
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
