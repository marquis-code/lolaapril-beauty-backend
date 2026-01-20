"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const notification_templates_seeder_1 = require("../src/notification/seeders/notification-templates.seeder");
async function bootstrap() {
    console.log('🌱 Seeding notification templates...');
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const seeder = app.get(notification_templates_seeder_1.NotificationTemplateSeeder);
    try {
        await seeder.seedDefaultTemplates();
        console.log('✅ Notification templates seeded successfully!');
    }
    catch (error) {
        console.error('❌ Error seeding templates:', error);
        process.exit(1);
    }
    await app.close();
    process.exit(0);
}
bootstrap();
//# sourceMappingURL=seed-notification-templates.js.map