require('dotenv').config();
const mongoose = require('mongoose');

const mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl).then(async () => {
  const db = mongoose.connection.db;
  
  const currentUserId = '696f7398456a84a2d976e3f5'; // ngozi@gmail.com
  const bookingOwnerId = '68d3d48b5fcb8ddba0303551'; // Bookings belong to this user
  
  console.log('\n=== INVESTIGATING MISMATCH ===\n');
  
  // Check current user
  const currentUser = await db.collection('users').findOne({ _id: new mongoose.Types.ObjectId(currentUserId) });
  console.log('Current User (ngozi@gmail.com):', {
    _id: currentUser?._id,
    email: currentUser?.email,
    role: currentUser?.role,
    createdAt: currentUser?.createdAt
  });
  
  // Check booking owner
  const bookingOwner = await db.collection('users').findOne({ _id: new mongoose.Types.ObjectId(bookingOwnerId) });
  console.log('\nBooking Owner User:', {
    _id: bookingOwner?._id,
    email: bookingOwner?.email,
    role: bookingOwner?.role,
    createdAt: bookingOwner?.createdAt
  });
  
  // Check payments for current user
  console.log('\n=== PAYMENTS FOR CURRENT USER ===');
  const payments = await db.collection('payments').find({ 
    clientId: new mongoose.Types.ObjectId(currentUserId) 
  }).toArray();
  console.log(`Found ${payments.length} payment(s) for ngozi@gmail.com`);
  
  payments.forEach((payment, i) => {
    console.log(`\nPayment ${i + 1}:`);
    console.log('  Reference:', payment.paymentReference);
    console.log('  Status:', payment.status);
    console.log('  Amount:', payment.totalAmount);
    console.log('  Booking ID:', payment.bookingId);
    console.log('  Client ID:', payment.clientId);
  });
  
  // Check bookings with those payment bookingIds
  if (payments.length > 0 && payments[0].bookingId) {
    console.log('\n=== CHECKING BOOKING FROM PAYMENT ===');
    const booking = await db.collection('bookings').findOne({ 
      _id: payments[0].bookingId 
    });
    
    if (booking) {
      console.log('Booking found:');
      console.log('  Booking Number:', booking.bookingNumber);
      console.log('  Client ID:', booking.clientId);
      console.log('  Status:', booking.status);
      console.log('  Client ID matches current user?', booking.clientId.toString() === currentUserId);
      
      // FIX: Update booking clientId to match the payment clientId
      if (booking.clientId.toString() !== currentUserId) {
        console.log('\n🔧 FIXING: Updating booking clientId to match payment...');
        const result = await db.collection('bookings').updateOne(
          { _id: booking._id },
          { $set: { clientId: new mongoose.Types.ObjectId(currentUserId) } }
        );
        console.log('✅ Updated booking clientId:', result.modifiedCount, 'booking(s)');
      }
    } else {
      console.log('❌ No booking found with that ID');
    }
  }
  
  // Check all bookings for booking owner
  console.log('\n=== BOOKINGS FOR BOOKING OWNER ===');
  const ownerBookings = await db.collection('bookings').find({ 
    clientId: new mongoose.Types.ObjectId(bookingOwnerId) 
  }).toArray();
  console.log(`Found ${ownerBookings.length} booking(s) for user ${bookingOwnerId}`);
  
  ownerBookings.forEach((booking, i) => {
    console.log(`\nBooking ${i + 1}:`);
    console.log('  Booking Number:', booking.bookingNumber);
    console.log('  Status:', booking.status);
    console.log('  Client ID:', booking.clientId);
    console.log('  Created At:', booking.createdAt);
  });
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
