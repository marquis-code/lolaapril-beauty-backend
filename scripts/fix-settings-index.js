require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URL;

async function fixIndexes() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected.');

        const collection = mongoose.connection.collection('businesssettings');

        console.log('Listing indexes...');
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes);

        const indexName = 'appointmentStatuses.statusName_1';
        const indexExists = indexes.some(idx => idx.name === indexName);

        if (indexExists) {
            console.log(`Found incorrect index: ${indexName}. Dropping it...`);
            await collection.dropIndex(indexName);
            console.log('Index dropped successfully.');
        } else {
            console.log(`Index ${indexName} not found. It might have already been removed.`);
        }

    } catch (error) {
        console.error('Error fixing indexes:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

fixIndexes();
