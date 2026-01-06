"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const chat_seeder_service_1 = require("../src/notification/services/chat-seeder.service");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const chatSeederService = app.get(chat_seeder_service_1.ChatSeederService);
    const faqModel = app.get('FAQModel');
    try {
        console.log('🔍 Checking database for existing FAQs...');
        const businessId = process.argv[2];
        if (!businessId) {
            console.error('❌ Please provide a business ID');
            console.log('Usage: npx ts-node scripts/seed-faqs.ts <businessId>');
            process.exit(1);
        }
        console.log(`📊 Checking FAQs for business: ${businessId}`);
        const existingFAQs = await faqModel.find({ businessId }).exec();
        console.log(`📝 Found ${existingFAQs.length} existing FAQs`);
        if (existingFAQs.length > 0) {
            console.log('\n📋 Existing FAQs:');
            existingFAQs.forEach((faq, index) => {
                console.log(`  ${index + 1}. ${faq.question}`);
                console.log(`     - Category: ${faq.category || 'N/A'}`);
                console.log(`     - Priority: ${faq.priority || 0}`);
                console.log(`     - Usage Count: ${faq.usageCount || 0}`);
                console.log(`     - Active: ${faq.isActive}`);
                console.log(`     - Keywords: ${faq.keywords.join(', ')}`);
                console.log('');
            });
            console.log('⚠️  FAQs already exist. Do you want to:');
            console.log('   1. Keep existing FAQs');
            console.log('   2. Add new FAQs (keep existing)');
            console.log('   3. Replace all FAQs');
            console.log('');
            console.log('Run with --force flag to replace: npx ts-node scripts/seed-faqs.ts <businessId> --force');
            if (process.argv.includes('--force')) {
                console.log('\n🗑️  Removing existing FAQs...');
                await faqModel.deleteMany({ businessId }).exec();
                console.log('✅ Existing FAQs removed');
            }
            else {
                console.log('\n✅ Keeping existing FAQs. Exiting...');
                await app.close();
                return;
            }
        }
        console.log('\n🌱 Seeding FAQs...');
        await chatSeederService.seedDefaultFAQs(businessId);
        const newFAQs = await faqModel.find({ businessId }).exec();
        console.log(`\n✅ Successfully seeded ${newFAQs.length} FAQs`);
        console.log('\n📋 Seeded FAQs:');
        newFAQs.forEach((faq, index) => {
            console.log(`  ${index + 1}. ${faq.question}`);
            console.log(`     - Category: ${faq.category || 'N/A'}`);
            console.log(`     - Priority: ${faq.priority || 0}`);
            console.log(`     - Keywords: ${faq.keywords.join(', ')}`);
            console.log('');
        });
        console.log('\n🎉 FAQ seeding completed successfully!');
        console.log('\n🧪 Testing FAQ matching...');
        const testQueries = [
            'What are your hours?',
            'How do I book?',
            'Can I cancel?',
            'What payment do you accept?',
            'Where are you located?',
        ];
        console.log('\nTest Queries:');
        for (const query of testQueries) {
            const matches = await findMatchingFAQ(query, businessId, faqModel);
            if (matches) {
                console.log(`✅ "${query}" → Matched: "${matches.faq.question}" (${matches.confidence.toFixed(1)}%)`);
            }
            else {
                console.log(`❌ "${query}" → No match found`);
            }
        }
    }
    catch (error) {
        console.error('❌ Error seeding FAQs:', error);
    }
    finally {
        await app.close();
    }
}
async function findMatchingFAQ(message, businessId, faqModel) {
    const messageLower = message.toLowerCase();
    const faqs = await faqModel.find({
        businessId,
        isActive: true,
    }).sort({ priority: -1 }).exec();
    let bestMatch = null;
    let highestConfidence = 0;
    for (const faq of faqs) {
        let matchScore = 0;
        let totalKeywords = faq.keywords.length;
        for (const keyword of faq.keywords) {
            if (messageLower.includes(keyword.toLowerCase())) {
                matchScore += 1;
            }
        }
        for (const altQuestion of faq.alternativeQuestions) {
            const similarity = calculateSimilarity(messageLower, altQuestion.toLowerCase());
            if (similarity > 0.7) {
                matchScore += 2;
                totalKeywords += 2;
            }
        }
        const confidence = totalKeywords > 0 ? (matchScore / totalKeywords) * 100 : 0;
        if (confidence > highestConfidence && confidence >= (faq.confidenceThreshold || 70)) {
            highestConfidence = confidence;
            bestMatch = { faq, confidence };
        }
    }
    return bestMatch;
}
function calculateSimilarity(str1, str2) {
    const words1 = str1.split(/\s+/);
    const words2 = str2.split(/\s+/);
    const commonWords = words1.filter(word => words2.includes(word));
    const similarity = (2 * commonWords.length) / (words1.length + words2.length);
    return similarity;
}
bootstrap();
//# sourceMappingURL=seed-faqs.js.map