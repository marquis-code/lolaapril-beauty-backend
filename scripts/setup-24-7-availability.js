/**
 * Script to setup 24/7 availability for lola-beauty business
 * Sets working hours to 24 hours round the clock every day
 * Populates all staff availability slots
 */

require('dotenv').config();
const { connect, connection, model, Schema, Types } = require('mongoose');

// Define schemas
const TimeSlotSchema = new Schema({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  isBreak: { type: Boolean, default: false }
}, { _id: false });

const DayScheduleSchema = new Schema({
  dayOfWeek: { type: Number, required: true },
  isOpen: { type: Boolean, default: true },
  timeSlots: { type: [TimeSlotSchema], default: [] },
  is24Hours: { type: Boolean, default: false }
}, { _id: false });

const BusinessHoursSchema = new Schema({
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  weeklySchedule: { type: [DayScheduleSchema], required: true },
  holidays: { type: [Date], default: [] },
  specialOpenDays: { type: [Date], default: [] },
  defaultSlotDuration: { type: Number, default: 30 },
  bufferTime: { type: Number, default: 0 },
  operates24x7: { type: Boolean, default: false }
}, { timestamps: true });

const StaffAvailabilitySchema = new Schema({
  staffId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  date: { type: Date, required: true },
  availableSlots: { type: [TimeSlotSchema], required: true },
  blockedSlots: { type: [TimeSlotSchema], default: [] },
  status: { type: String, enum: ['available', 'unavailable', 'partial'], default: 'available' },
  reason: String,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const BusinessSchema = new Schema({
  businessName: String,
  subdomain: String,
  staffIds: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const StaffSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  businessId: { type: Schema.Types.ObjectId, ref: 'Business' },
  status: String
}, { timestamps: true });

async function setup24x7Availability() {
  try {
    const mongoUri = process.env.MONGO_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/lola-beauty';
    console.log(`Connecting to MongoDB...`);
    
    await connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get models
    const Business = connection.models.Business || model('Business', BusinessSchema);
    const BusinessHours = connection.models.BusinessHours || model('BusinessHours', BusinessHoursSchema);
    const StaffAvailability = connection.models.StaffAvailability || model('StaffAvailability', StaffAvailabilitySchema);
    const Staff = connection.models.Staff || model('Staff', StaffSchema);

    // Find the business
    const business = await Business.findOne({ subdomain: 'lola-beauty' });
    
    if (!business) {
      console.error('❌ Business with subdomain "lola-beauty" not found');
      process.exit(1);
    }

    console.log(`✅ Found business: ${business.businessName} (ID: ${business._id})`);

    // Create 24/7 weekly schedule
    const weeklySchedule = [];
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    for (let day = 0; day < 7; day++) {
      weeklySchedule.push({
        dayOfWeek: day,
        isOpen: true,
        is24Hours: true,
        timeSlots: [
          {
            startTime: '00:00',
            endTime: '23:59',
            isBreak: false
          }
        ]
      });
      console.log(`✅ Configured ${daysOfWeek[day]}: 00:00 - 23:59 (24 hours)`);
    }

    // Update or create business hours
    const businessHours = await BusinessHours.findOneAndUpdate(
      { businessId: business._id },
      {
        businessId: business._id,
        weeklySchedule,
        operates24x7: true,
        defaultSlotDuration: 30,
        bufferTime: 0,
        holidays: [],
        specialOpenDays: []
      },
      { upsert: true, new: true }
    );

    console.log(`\n✅ Business hours updated for 24/7 operation`);

    // Get all staff members from both business.staffIds and Staff collection
    let allStaffIds = [];
    
    // Get staff from business.staffIds
    if (business.staffIds && business.staffIds.length > 0) {
      allStaffIds = [...business.staffIds];
    }
    
    // Get staff from Staff collection
    const staffRecords = await Staff.find({ 
      businessId: business._id,
      status: { $ne: 'inactive' }
    });
    
    // Add staff userIds to allStaffIds
    staffRecords.forEach(staffRecord => {
      if (staffRecord.userId && !allStaffIds.some(id => id.toString() === staffRecord.userId.toString())) {
        allStaffIds.push(staffRecord.userId);
      }
    });

    const staffCount = allStaffIds.length;
    console.log(`\n📋 Found ${staffCount} staff members (${business.staffIds?.length || 0} from business, ${staffRecords.length} from staff collection)`);

    if (staffCount > 0) {
      // Generate availability for next 90 days
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 90);
      
      let datesCreated = 0;
      let staffUpdated = 0;

      console.log(`\n🔄 Creating staff availability from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`);

      for (const staffId of allStaffIds) {
        let currentDate = new Date(startDate);
        let staffDatesCreated = 0;

        while (currentDate <= endDate) {
          const dateOnly = new Date(currentDate);
          dateOnly.setHours(0, 0, 0, 0);

          // Check if availability already exists
          const existing = await StaffAvailability.findOne({
            staffId,
            businessId: business._id,
            date: dateOnly
          });

          if (!existing) {
            await StaffAvailability.create({
              staffId,
              businessId: business._id,
              date: dateOnly,
              availableSlots: [
                {
                  startTime: '00:00',
                  endTime: '23:59',
                  isBreak: false
                }
              ],
              blockedSlots: [],
              status: 'available'
            });
            
            staffDatesCreated++;
            datesCreated++;
          }

          currentDate.setDate(currentDate.getDate() + 1);
        }

        if (staffDatesCreated > 0) {
          staffUpdated++;
          console.log(`   ✅ Staff ${staffId}: Created ${staffDatesCreated} availability records`);
        } else {
          console.log(`   ℹ️  Staff ${staffId}: All dates already configured`);
        }
      }

      console.log(`\n✅ Staff availability setup complete!`);
      console.log(`   - ${staffUpdated} staff members updated`);
      console.log(`   - ${datesCreated} new availability records created`);
    } else {
      console.log('\n⚠️  No staff members found. Add staff to enable bookings.');
    }

    // Summary
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('✅ 24/7 AVAILABILITY SETUP COMPLETE');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`Business: ${business.businessName}`);
    console.log(`Subdomain: ${business.subdomain}`);
    console.log(`Operating Hours: 24/7 (00:00 - 23:59 every day)`);
    console.log(`Staff Members: ${staffCount}`);
    console.log(`Availability Period: Next 90 days`);
    console.log('═══════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error setting up 24/7 availability:', error);
    throw error;
  } finally {
    await connection.close();
    console.log('Database connection closed');
  }
}

// Run the script
setup24x7Availability()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
