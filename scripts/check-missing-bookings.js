require('dotenv').config();
const mongoose = require('mongoose');

const mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl).then(async () => {
  const db = mongoose.connection.db;
  
  // Check specific booking IDs from payments
  const bookingIds = [
    '697076b2467a8b48017304e0', // Payment 17 (completed)
    '6970e75d48516cb9fd42f1c1', // Payment 19 (completed)
    '6970faae36659e0df0494558', // Payment 20 (completed)
    '697106065582bb0b76c4d40b', // Payment 21 (completed)
    '6971429c867571b2bc069d64', // Payment 22 (completed)
  ];
  
  console.log('\n=== CHECKING IF BOOKINGS FROM PAYMENTS EXIST ===\n');
  
  for (const bookingId of bookingIds) {
    const booking = await db.collection('bookings').findOne({ 
      _id: new mongoose.Types.ObjectId(bookingId) 
    });
    
    if (booking) {
      console.log(`✅ Booking ${bookingId} EXISTS`);
      console.log('   Status:', booking.status);
      console.log('   Client ID:', booking.clientId);
    } else {
      console.log(`❌ Booking ${bookingId} DOES NOT EXIST`);
    }
  }
  
  // Check ALL bookings in database
  console.log('\n=== ALL BOOKINGS IN DATABASE ===\n');
  const allBookings = await db.collection('bookings').find().toArray();
  console.log(`Total bookings in database: ${allBookings.length}`);
  
  if (allBookings.length > 0) {
    allBookings.slice(0, 5).forEach((booking, i) => {
      console.log(`\nBooking ${i + 1}:`);
      console.log('  ID:', booking._id);
      console.log('  Booking Number:', booking.bookingNumber);
      console.log('  Client ID:', booking.clientId);
      console.log('  Status:', booking.status);
    });
  }
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
