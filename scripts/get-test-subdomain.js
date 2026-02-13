require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URL || 'mongodb://localhost:27017/lola-beauty';

async function getSubdomain() {
    try {
        await mongoose.connect(MONGO_URI);
        const Business = mongoose.model('Business', new mongoose.Schema({ subdomain: String }, { strict: false }));

        const business = await Business.findOne({ subdomain: { $exists: true, $ne: null } });

        if (business) {
            console.log(`FOUND_SUBDOMAIN:${business.subdomain}`);
        } else {
            console.log('NO_BUSINESS_WITH_SUBDOMAIN_FOUND');
        }
    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
}

getSubdomain();
