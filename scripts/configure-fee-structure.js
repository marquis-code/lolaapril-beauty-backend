/**
 * Script to configure fee structure for lola-beauty business
 * Sets up platform fees, processing fees, and custom rules
 */

require('dotenv').config();
const { connect, connection, model, Schema, Types } = require('mongoose');

const FeeStructureSchema = new Schema({
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  pricingTierId: { type: Schema.Types.ObjectId, ref: 'PricingTier', required: false },
  effectiveFrom: { type: Date, required: true },
  effectiveTo: Date,
  platformFeePercentage: { type: Number, required: true },
  platformFeeFixed: { type: Number, default: 0 },
  isGrandfathered: { type: Boolean, default: false },
  customRules: {
    noShowFee: Number,
    cancellationFee: Number,
    minBookingAmount: Number
  }
}, { timestamps: true });

const BusinessSchema = new Schema({
  businessName: String,
  subdomain: String
}, { timestamps: true });

async function configureFeeStructure() {
  try {
    const mongoUri = process.env.MONGO_URL || process.env.MONGODB_URI;
    console.log('Connecting to MongoDB...');
    
    await connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get models
    const Business = connection.models.Business || model('Business', BusinessSchema);
    const FeeStructure = connection.models.FeeStructure || model('FeeStructure', FeeStructureSchema);

    // Find the business
    const business = await Business.findOne({ subdomain: 'lola-beauty' });
    
    if (!business) {
      console.error('❌ Business with subdomain "lola-beauty" not found');
      process.exit(1);
    }

    console.log(`✅ Found business: ${business.businessName} (ID: ${business._id})`);

    // Check if fee structure already exists
    const existingFee = await FeeStructure.findOne({
      businessId: business._id,
      $or: [
        { effectiveTo: { $gte: new Date() } },
        { effectiveTo: null }
      ]
    });

    if (existingFee) {
      console.log('\n⚠️  Fee structure already exists for this business');
      console.log('Current Fee Structure:');
      console.log('─────────────────────────────────────────');
      console.log(`Platform Fee Percentage: ${existingFee.platformFeePercentage}%`);
      console.log(`Platform Fee Fixed: ₦${existingFee.platformFeeFixed}`);
      console.log(`Effective From: ${existingFee.effectiveFrom}`);
      console.log(`Effective To: ${existingFee.effectiveTo || 'No expiry (Active)'}`);
      console.log(`Grandfathered: ${existingFee.isGrandfathered ? 'Yes' : 'No'}`);
      
      if (existingFee.customRules) {
        console.log('\nCustom Rules:');
        if (existingFee.customRules.noShowFee) {
          console.log(`  - No Show Fee: ₦${existingFee.customRules.noShowFee}`);
        }
        if (existingFee.customRules.cancellationFee) {
          console.log(`  - Cancellation Fee: ₦${existingFee.customRules.cancellationFee}`);
        }
        if (existingFee.customRules.minBookingAmount) {
          console.log(`  - Minimum Booking Amount: ₦${existingFee.customRules.minBookingAmount}`);
        }
      }
      
      console.log('\n❓ Do you want to update the fee structure? (Close existing and create new)');
      console.log('   Run this script with UPDATE=true to update');
      
      if (process.env.UPDATE !== 'true') {
        console.log('\n✅ No changes made. Use UPDATE=true to update fee structure.');
        process.exit(0);
      }

      // Close existing fee structure
      console.log('\n🔄 Closing existing fee structure...');
      await FeeStructure.findByIdAndUpdate(existingFee._id, {
        effectiveTo: new Date()
      });
      console.log('✅ Existing fee structure closed');
    }

    // Create new fee structure
    console.log('\n🌱 Creating new fee structure...');
    
    const newFeeStructure = {
      businessId: business._id,
      platformFeePercentage: 2.5, // 2.5% platform fee
      platformFeeFixed: 0, // No fixed fee
      effectiveFrom: new Date(),
      effectiveTo: null, // Active indefinitely
      isGrandfathered: false,
      customRules: {
        noShowFee: 5000, // ₦5,000 no-show fee
        cancellationFee: 2500, // ₦2,500 late cancellation fee (within 24hrs)
        minBookingAmount: 0 // No minimum booking amount
      }
    };

    const feeStructure = await FeeStructure.create(newFeeStructure);
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('✅ FEE STRUCTURE CONFIGURED SUCCESSFULLY');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`Business: ${business.businessName}`);
    console.log(`Subdomain: ${business.subdomain}`);
    console.log(`Fee Structure ID: ${feeStructure._id}`);
    console.log('\nFee Details:');
    console.log('─────────────────────────────────────────');
    console.log(`Platform Fee: ${feeStructure.platformFeePercentage}% + ₦${feeStructure.platformFeeFixed}`);
    console.log(`Effective From: ${feeStructure.effectiveFrom.toLocaleDateString()}`);
    console.log(`Status: Active (No expiry)`);
    console.log('\nCustom Rules:');
    console.log(`  • No Show Fee: ₦${feeStructure.customRules.noShowFee}`);
    console.log(`  • Late Cancellation Fee: ₦${feeStructure.customRules.cancellationFee}`);
    console.log(`  • Minimum Booking: ₦${feeStructure.customRules.minBookingAmount} (No minimum)`);
    console.log('\nFee Calculation Example:');
    console.log('─────────────────────────────────────────');
    const exampleAmount = 50000;
    const platformFee = (exampleAmount * feeStructure.platformFeePercentage / 100) + feeStructure.platformFeeFixed;
    const businessReceives = exampleAmount - platformFee;
    console.log(`Booking Amount: ₦${exampleAmount.toLocaleString()}`);
    console.log(`Platform Fee: ₦${platformFee.toLocaleString()}`);
    console.log(`Business Receives: ₦${businessReceives.toLocaleString()}`);
    console.log('═══════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error configuring fee structure:', error);
    throw error;
  } finally {
    await connection.close();
    console.log('Database connection closed');
  }
}

// Run the script
configureFeeStructure()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
