"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const seeder_module_1 = require("./seeders/seeder.module");
const database_seeder_1 = require("./seeders/database.seeder");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(seeder_module_1.SeederModule);
    try {
        const seeder = app.get(database_seeder_1.DatabaseSeeder);
        await seeder.seed();
    }
    catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
    finally {
        await app.close();
    }
}
bootstrap();
//# sourceMappingURL=seed.js.map