require('dotenv').config();
const mongoose = require('mongoose');

const mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl).then(async () => {
  const db = mongoose.connection.db;
  
  console.log('\n=== CHECKING BOOKING DATA ===\n');
  
  // Get all bookings
  const bookings = await db.collection('bookings').find().sort({ createdAt: -1 }).limit(10).toArray();
  
  console.log(`Total bookings found: ${bookings.length}\n`);
  
  bookings.forEach((booking, index) => {
    console.log(`\n--- Booking ${index + 1} ---`);
    console.log(`ID: ${booking._id}`);
    console.log(`Booking Number: ${booking.bookingNumber}`);
    console.log(`Client ID: ${booking.clientId}`);
    console.log(`Client ID Type: ${typeof booking.clientId} - Is ObjectId: ${booking.clientId instanceof mongoose.Types.ObjectId}`);
    console.log(`Business ID: ${booking.businessId}`);
    console.log(`Status: ${booking.status}`);
    console.log(`Created At: ${booking.createdAt}`);
    console.log(`Estimated Total: ${booking.estimatedTotal}`);
  });
  
  // Check if there are payments
  console.log('\n\n=== CHECKING PAYMENT DATA ===\n');
  const payments = await db.collection('payments').find().sort({ createdAt: -1 }).limit(5).toArray();
  console.log(`Total payments found: ${payments.length}\n`);
  
  payments.forEach((payment, index) => {
    console.log(`\n--- Payment ${index + 1} ---`);
    console.log(`ID: ${payment._id}`);
    console.log(`Reference: ${payment.paymentReference}`);
    console.log(`Client ID: ${payment.clientId}`);
    console.log(`Booking ID: ${payment.bookingId}`);
    console.log(`Status: ${payment.status}`);
    console.log(`Total Amount: ${payment.totalAmount}`);
  });
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
