const mongoose = require('mongoose');
require('dotenv').config();

const templateSchema = new mongoose.Schema({
  templateType: String,
  name: String,
  subject: String,
  content: String,
  channel: String,
  isDefault: Boolean,
  isActive: Boolean,
}, { timestamps: true });

async function seedTemplates() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    const NotificationTemplate = mongoose.model('NotificationTemplate', templateSchema);

    // Check if payment_failed template exists
    const existing = await NotificationTemplate.findOne({
      templateType: 'payment_failed',
      isDefault: true,
    });

    if (existing) {
      console.log('✅ payment_failed template already exists');
    } else {
      console.log('🌱 Creating payment_failed template...');
      await NotificationTemplate.create({
        templateType: 'payment_failed',
        name: 'Payment Failed',
        subject: 'Payment Issue - Action Required',
        content: `
          <h2>Payment Failed</h2>
          <p>Hello {{clientName}},</p>
          <p>We encountered an issue with your payment:</p>
          <ul>
            <li><strong>Amount:</strong> ₦{{paymentAmount}}</li>
            <li><strong>Reason:</strong> {{failureReason}}</li>
            <li><strong>Service:</strong> {{serviceName}}</li>
            <li><strong>Appointment Date:</strong> {{appointmentDate}}</li>
          </ul>
          <p><a href="{{retryPaymentUrl}}">Retry Payment</a></p>
          <p>Please contact us at {{businessPhone}} if you need assistance.</p>
          <p>Best regards,<br/>{{businessName}}</p>
        `,
        channel: 'both',
        isDefault: true,
        isActive: true,
      });
      console.log('✅ payment_failed template created');
    }

    await mongoose.disconnect();
    console.log('✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedTemplates();
