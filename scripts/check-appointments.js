require('dotenv').config();
const mongoose = require('mongoose');

const mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl).then(async () => {
  const db = mongoose.connection.db;
  
  const currentUserId = '696f7398456a84a2d976e3f5'; // ngozi@gmail.com
  
  console.log('\n=== CHECKING APPOINTMENTS FOR USER ===\n');
  
  // Check appointments for this user
  const appointments = await db.collection('appointments').find({
    $or: [
      { clientId: new mongoose.Types.ObjectId(currentUserId) },
      { 'clientInfo.clientId': new mongoose.Types.ObjectId(currentUserId) }
    ]
  }).toArray();
  
  console.log(`Found ${appointments.length} appointment(s) for ngozi@gmail.com\n`);
  
  if (appointments.length > 0) {
    appointments.forEach((apt, i) => {
      console.log(`\n--- Appointment ${i + 1} ---`);
      console.log('ID:', apt._id);
      console.log('Appointment Number:', apt.appointmentNumber);
      console.log('Client ID:', apt.clientId || apt.clientInfo?.clientId);
      console.log('Status:', apt.status);
      console.log('Date:', apt.selectedDate);
      console.log('Time:', apt.selectedTime);
      console.log('Total Amount:', apt.totalAmount);
      console.log('Created At:', apt.createdAt);
    });
  } else {
    console.log('❌ No appointments found for this user');
    
    // Check total appointments in DB
    const totalApts = await db.collection('appointments').countDocuments();
    console.log(`\nTotal appointments in database: ${totalApts}`);
    
    if (totalApts > 0) {
      console.log('\nSample appointments:');
      const sampleApts = await db.collection('appointments').find().limit(3).toArray();
      sampleApts.forEach((apt, i) => {
        console.log(`\n  Appointment ${i + 1}:`);
        console.log('    Client ID:', apt.clientId || apt.clientInfo?.clientId);
        console.log('    Status:', apt.status);
      });
    }
  }
  
  // Check if bookings reference appointmentId
  console.log('\n\n=== CHECKING IF PAYMENTS LINK TO APPOINTMENTS ===\n');
  const paymentsWithAppointments = await db.collection('payments').find({
    clientId: new mongoose.Types.ObjectId(currentUserId),
    appointmentId: { $exists: true, $ne: null }
  }).toArray();
  
  console.log(`Payments with appointmentId: ${paymentsWithAppointments.length}`);
  
  if (paymentsWithAppointments.length > 0) {
    for (const payment of paymentsWithAppointments.slice(0, 5)) {
      console.log(`\n  Payment: ${payment.paymentReference}`);
      console.log('    Status:', payment.status);
      console.log('    Appointment ID:', payment.appointmentId);
      
      // Check if appointment exists
      const apt = await db.collection('appointments').findOne({ _id: payment.appointmentId });
      console.log('    Appointment exists?', apt ? 'YES' : 'NO');
    }
  }
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
