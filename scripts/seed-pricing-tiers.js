/**
 * Seed Pricing Tiers for Salon Application
 * 
 * Run this script to populate the database with default pricing tiers
 * Usage: node scripts/seed-pricing-tiers.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGO_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/lolaapril-beauty';

// Pricing Tier Schema (matching the NestJS schema)
const PricingTierSchema = new mongoose.Schema({
  tierName: { type: String, required: true, unique: true },
  tierLevel: { type: Number, required: true },
  monthlyPrice: { type: Number, required: true },
  yearlyPrice: { type: Number, required: true },
  features: {
    maxStaff: Number,
    maxBookingsPerMonth: Number,
    customBranding: Boolean,
    analyticsAccess: Boolean,
    prioritySupport: Boolean,
    multiLocation: Boolean,
    apiAccess: Boolean,
  },
  commissionRate: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  description: String,
}, { timestamps: true });

const PricingTier = mongoose.model('PricingTier', PricingTierSchema);

// Pricing tiers designed for Nigerian salon businesses (prices in Naira)
const pricingTiers = [
  {
    tierName: 'Starter',
    tierLevel: 1,
    monthlyPrice: 0, // Free tier
    yearlyPrice: 0,
    commissionRate: 7.5, // Higher commission for free tier
    description: 'Perfect for solo stylists and small salons just getting started. Free forever with basic features.',
    features: {
      maxStaff: 1,
      maxBookingsPerMonth: 50,
      customBranding: false,
      analyticsAccess: false,
      prioritySupport: false,
      multiLocation: false,
      apiAccess: false,
    },
    isActive: true,
  },
  {
    tierName: 'Basic',
    tierLevel: 2,
    monthlyPrice: 5000, // ₦5,000/month
    yearlyPrice: 48000, // ₦48,000/year (20% discount)
    commissionRate: 5, // 5% per transaction
    description: 'Great for growing salons with a small team. Includes essential booking and client management features.',
    features: {
      maxStaff: 3,
      maxBookingsPerMonth: 200,
      customBranding: false,
      analyticsAccess: true,
      prioritySupport: false,
      multiLocation: false,
      apiAccess: false,
    },
    isActive: true,
  },
  {
    tierName: 'Professional',
    tierLevel: 3,
    monthlyPrice: 15000, // ₦15,000/month
    yearlyPrice: 144000, // ₦144,000/year (20% discount)
    commissionRate: 3.5, // 3.5% per transaction
    description: 'Ideal for established salons with multiple stylists. Full analytics, custom branding, and priority support.',
    features: {
      maxStaff: 10,
      maxBookingsPerMonth: 1000,
      customBranding: true,
      analyticsAccess: true,
      prioritySupport: true,
      multiLocation: false,
      apiAccess: false,
    },
    isActive: true,
  },
  {
    tierName: 'Business',
    tierLevel: 4,
    monthlyPrice: 35000, // ₦35,000/month
    yearlyPrice: 336000, // ₦336,000/year (20% discount)
    commissionRate: 2.5, // 2.5% per transaction
    description: 'For growing salon chains and beauty businesses with multiple locations. Includes multi-location support.',
    features: {
      maxStaff: 25,
      maxBookingsPerMonth: 5000,
      customBranding: true,
      analyticsAccess: true,
      prioritySupport: true,
      multiLocation: true,
      apiAccess: false,
    },
    isActive: true,
  },
  {
    tierName: 'Enterprise',
    tierLevel: 5,
    monthlyPrice: 75000, // ₦75,000/month
    yearlyPrice: 720000, // ₦720,000/year (20% discount)
    commissionRate: 1.5, // 1.5% per transaction (lowest)
    description: 'For large salon chains and franchises. Unlimited features, API access, dedicated support, and custom integrations.',
    features: {
      maxStaff: 100, // Essentially unlimited
      maxBookingsPerMonth: 50000, // Essentially unlimited
      customBranding: true,
      analyticsAccess: true,
      prioritySupport: true,
      multiLocation: true,
      apiAccess: true,
    },
    isActive: true,
  },
];

async function seedPricingTiers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n📊 Seeding pricing tiers...\n');

    for (const tier of pricingTiers) {
      // Check if tier already exists
      const existing = await PricingTier.findOne({ tierName: tier.tierName });
      
      if (existing) {
        // Update existing tier
        await PricingTier.updateOne({ tierName: tier.tierName }, tier);
        console.log(`🔄 Updated: ${tier.tierName}`);
      } else {
        // Create new tier
        await PricingTier.create(tier);
        console.log(`✅ Created: ${tier.tierName}`);
      }
    }

    console.log('\n📋 All pricing tiers:');
    console.log('─'.repeat(80));
    
    const allTiers = await PricingTier.find().sort({ tierLevel: 1 });
    
    for (const tier of allTiers) {
      console.log(`
┌─ ${tier.tierName.toUpperCase()} (Level ${tier.tierLevel})
│  Monthly: ₦${tier.monthlyPrice.toLocaleString()} | Yearly: ₦${tier.yearlyPrice.toLocaleString()}
│  Commission: ${tier.commissionRate}%
│  Staff: ${tier.features.maxStaff} | Bookings/mo: ${tier.features.maxBookingsPerMonth.toLocaleString()}
│  Features: ${[
        tier.features.customBranding && 'Branding',
        tier.features.analyticsAccess && 'Analytics',
        tier.features.prioritySupport && 'Priority Support',
        tier.features.multiLocation && 'Multi-Location',
        tier.features.apiAccess && 'API Access',
      ].filter(Boolean).join(', ') || 'Basic features only'}
└─ ${tier.description}
`);
    }

    console.log('─'.repeat(80));
    console.log(`\n✅ Successfully seeded ${allTiers.length} pricing tiers\n`);

  } catch (error) {
    console.error('❌ Error seeding pricing tiers:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seed function
seedPricingTiers();
