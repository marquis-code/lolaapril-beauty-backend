// scripts/update-lola-business.js


require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URL;

const businessId = '68d92deef36aec8d397f4c8c'; // from your snapshot

const updatedData = {
  businessName: "Lola April Wellness Spa",
  businessDescription: `Your Premier Destination for Holistic Rejuvenation\nLola April Wellness Spa is your premier destination for bespoke, conscious, and intentional wellness, providing transformative experiences that revitalize both body and mind. We seamlessly blend luxurious spa treatments with comfortable extended stays, offering an unparalleled oasis of relaxation.\n\nWhether you're looking for a few hours of pampering or an overnight retreat, we cater to your every need, 24/7.\n\nOur 24-hour spa services, including a round-the-clock kitchen, ensure that no matter the time of day, you can unwind and refresh at your convenience. Whether you're in Nigeria or an international guest seeking a unique wellness experience, we provide a sanctuary where you can escape the pressures of daily life and rediscover tranquility.`,
  logo: "https://www.lolaapril.com/_nuxt/logo.fog8jQGT.png",
  images: [
    "https://www.lolaapril.com/_nuxt/spa2.ToulnvxO.png",
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=800&fit=crop"
  ],
  contact: {
    email: "lolaaprilwellness@gmail.com",
    website: "www.lolaapril.com"
    // add other contact fields as needed
  }
};


const bcrypt = require('bcryptjs');

async function updateBusiness() {
  await mongoose.connect(MONGO_URI);

  const Business = mongoose.model('Business', new mongoose.Schema({}, { strict: false }));
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

  // Update business details
  const result = await Business.findByIdAndUpdate(
    businessId,
    {
      $set: updatedData
    },
    { new: true }
  );


  // Update the Lola April user: change email and password
  const oldEmail = 'lolaapril@gmal.com';
  const newEmail = 'lolaaprilwellness@gmail.com';
  const newPassword = 'Test1234@';
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  const updatedUser = await User.findOneAndUpdate(
    { email: oldEmail },
    { $set: { email: newEmail, password: hashedPassword, authProvider: 'local' } },
    { new: true }
  );
  if (updatedUser) {
    console.log(`User email updated from ${oldEmail} to ${newEmail} and password set to Test1234@`);
  } else {
    console.log(`User with email ${oldEmail} not found.`);
  }

  if (result) {
    console.log('Business updated:', result);
  } else {
    console.log('Business not found.');
  }

  await mongoose.disconnect();
}

updateBusiness().catch(console.error);
