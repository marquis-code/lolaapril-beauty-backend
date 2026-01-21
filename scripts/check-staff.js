require('dotenv').config();
const { connect, connection, model, Schema } = require('mongoose');

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

async function checkStaff() {
  try {
    await connect(process.env.MONGO_URL);
    const Business = connection.models.Business || model('Business', BusinessSchema);
    const Staff = connection.models.Staff || model('Staff', StaffSchema);
    
    const business = await Business.findOne({ subdomain: 'lola-beauty' });
    console.log('Business staffIds:', business.staffIds);
    
    const staff = await Staff.find({ businessId: business._id });
    console.log('Staff records:', staff.length);
    staff.forEach(s => console.log('  -', s._id, s.userId, s.status));
    
  } finally {
    await connection.close();
  }
}

checkStaff().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
