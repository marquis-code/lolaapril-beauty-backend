const mongoose = require('mongoose');
require('dotenv').config();

const feeStructureSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
  pricingTierId: { type: mongoose.Schema.Types.ObjectId, ref: 'PricingTier' },
  platformFeePercentage: Number,
  platformFeeFixed: Number,
  effectiveFrom: Date,
  effectiveTo: Date,
  isGrandfathered: Boolean,
}, { timestamps: true });

async function createDefaultFeeStructure() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    const FeeStructure = mongoose.model('FeeStructure', feeStructureSchema);
    const businessId = '674e1d77a83f982823675034'; // From the error log

    // Check if fee structure already exists
    const existing = await FeeStructure.findOne({
      businessId: new mongoose.Types.ObjectId(businessId),
      $or: [
        { effectiveTo: { $gte: new Date() } },
        { effectiveTo: null }
      ]
    });

    if (existing) {
      console.log('✅ Fee structure already exists for this business');
      console.log('Fee structure:', JSON.stringify(existing, null, 2));
    } else {
      console.log('🌱 Creating default fee structure...');
      
      const newFeeStructure = await FeeStructure.create({
        businessId: new mongoose.Types.ObjectId(businessId),
        platformFeePercentage: 2.5, // 2.5% platform fee
        platformFeeFixed: 0, // No fixed fee
        effectiveFrom: new Date(),
        effectiveTo: null, // Active indefinitely
        isGrandfathered: false,
      });
      
      console.log('✅ Fee structure created successfully!');
      console.log('Details:', JSON.stringify(newFeeStructure, null, 2));
    }

    await mongoose.disconnect();
    console.log('✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createDefaultFeeStructure();
