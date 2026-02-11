// scripts/fix-lolaapril-categories.ts


import { connect, Types } from 'mongoose';
import { ServiceCategory, ServiceCategoryDocument } from '../src/service/schemas/service-category.schema';
import { Service, ServiceDocument } from '../src/service/schemas/service.schema';
import { Business, BusinessDocument } from '../src/business/schemas/business.schema';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-db';
const LOLA_EMAIL = 'lolaaprilwellness@gmail.com';

// Helper: Generate a random color for new categories
function randomColor() {
  const colors = ['#FF69B4', '#E75480', '#FFB6C1', '#FF1493', '#C71585', '#DB7093'];
  return colors[Math.floor(Math.random() * colors.length)];
}

const valentinesCategory = {
  categoryName: "VALENTINE'S AT LA",
  appointmentColor: randomColor(),
  description: "Valentine's Packages for couples and singles  ONLY VALID from 1st February - 28th February",
  services: [
    {
      serviceName: "''WE NEEDED THIS'' RESET (Couple's Package)",
      description: `Includes:\n\n- Couples Intimate soak\nDesigned to help you unwind deeply, soften emotional walls, and reconnect through quiet intimacy.\n\n- 60 min Full Body Aromatherapy Massage\nWith exotic Ylang Ylang essential oil to calm the nervous system and enhance relaxation.\n\n- 1 hour Extended Relaxation in a Private Suite\nPost - massage quiet time with complimentary light bites\n\nCompliment your package with fresh flower bouquet at an extra fee.`,
      price: 205000,
      duration: 150,
    },
    {
      serviceName: "AFTER WORK COUPLES FIX",
      description: `-Clarifying & Relaxing Foot Soak (10mins): A warm mineral soak designed to cleanse the feet, stimulate blood circulation, reduce cortisol levels and support mental clarity after a long work day.\n\n-60 min full body Swedish Massage\n\n-Quick Face Cleanse, Moisture & Mask: To refresh the skin before heading home\n\nCompliment your package with a fresh flower bouquet at an extra fee.`,
      price: 100000,
      duration: 85,
    },
    {
      serviceName: "I DON'T FEEL LIKE EXPLAINING MYSELF (Solo Package)",
      description: `For People avoiding questions like ''so what are you doing for valentine?''\n\nIncludes:\n- Hot Stone Pedicure\n- Calming Elixir Bath Soak\n- Illuminating Facial (Women) or Gentle-men's Facial (Men)\n- 60 mins Full Body Aromatherapy Massage\n- Complimentary Meal`,
      price: 130000,
      duration: 180,
    },
    {
      serviceName: "SOFT VALENTINE FOR SOFT GIRLS (Solo Package)",
      description: `- 60 mins full body Swedish Massage \n- Hydrating Facial\n\nCompliment your package with fresh flower bouquet at an extra fee.`,
      price: 65000,
      duration: 100,
    },
    {
      serviceName: "''BOOK IT FOR ME'' (When You Don't Know What She Wants)",
      description: `Pre-paid Gift Option - We contact Recipient to choose the date & time.\n*Content of this service is fully customizable by the recipient*\n\n* 90 mins Choice Massage (Swedish, LA Signature or Aromatherapy Massage)\n* Hot Stone Pedicure\n* TNC Signature Manicure with Paraffin Wax\n* Complimentary Meal\n\nCompliment your package with fresh flower bouquet at an extra fee.`,
      price: 139535,
      duration: 210,
    },
  ],
};

async function main() {
  await connect(MONGODB_URI);

  // 1. Find Lola April business
  const business = await Business.findOne({ 'contact.email': LOLA_EMAIL });
  if (!business) {
    throw new Error('Lola April business not found');
  }

  // 2. Get all categories for this business
  const categories = await ServiceCategory.find({ businessId: business._id });

  // 3. Deduplicate categories by categoryName (case-insensitive)
  const seenCat = new Map();
  for (const cat of categories) {
    const key = cat.categoryName.trim().toLowerCase();
    if (!seenCat.has(key)) {
      seenCat.set(key, cat);
    } else {
      // Remove duplicate category
      await ServiceCategory.deleteOne({ _id: cat._id });
      // Also remove all services under this duplicate category
      await Service.deleteMany({ 'basicDetails.category': cat._id });
    }
  }

  // 4. For each unique category, deduplicate services by serviceName (case-insensitive)
  for (const cat of seenCat.values()) {
    const services = await Service.find({ 'basicDetails.category': cat._id, businessId: business._id });
    const seenSvc = new Map();
    for (const svc of services) {
      const key = svc.basicDetails.serviceName.trim().toLowerCase();
      if (!seenSvc.has(key)) {
        seenSvc.set(key, svc);
      } else {
        await Service.deleteOne({ _id: svc._id });
      }
    }
  }

  // 5. Add/update the Valentine's category
  let valentinesCat = await ServiceCategory.findOne({ businessId: business._id, categoryName: valentinesCategory.categoryName });
  if (!valentinesCat) {
    valentinesCat = await ServiceCategory.create({
      businessId: business._id,
      categoryName: valentinesCategory.categoryName,
      appointmentColor: valentinesCategory.appointmentColor,
      description: valentinesCategory.description,
      isActive: true,
    });
  } else {
    valentinesCat.description = valentinesCategory.description;
    valentinesCat.appointmentColor = valentinesCategory.appointmentColor;
    valentinesCat.isActive = true;
    await valentinesCat.save();
  }

  // Remove all existing services in this category (to avoid duplicates)
  await Service.deleteMany({ 'basicDetails.category': valentinesCat._id, businessId: business._id });

  // Add the new services
  for (const svc of valentinesCategory.services) {
    await Service.create({
      basicDetails: {
        serviceName: svc.serviceName,
        serviceType: 'Special',
        category: valentinesCat._id,
        description: svc.description,
      },
      teamMembers: { allTeamMembers: true, selectedMembers: [] },
      resources: { isRequired: false, resourceList: [] },
      pricingAndDuration: {
        priceType: 'Fixed',
        price: { currency: 'NGN', amount: svc.price },
        duration: {
          servicingTime: { value: svc.duration, unit: 'min' },
          processingTime: { value: 0, unit: 'min' },
          totalDuration: `${Math.floor(svc.duration / 60)}h ${svc.duration % 60}min`,
        },
      },
      serviceAddOns: [],
      settings: { onlineBooking: { enabled: true, availableFor: 'All clients' }, forms: [], commissions: [], generalSettings: {} },
      variants: [],
      businessId: business._id,
      isActive: true,
    });
  }

  console.log('Deduplication and update complete for Lola April.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
