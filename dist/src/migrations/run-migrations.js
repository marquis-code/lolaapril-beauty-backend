"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const drop_old_category_index_migration_1 = require("./drop-old-category-index.migration");
async function runMigrations() {
    console.log('🚀 Starting migrations...\n');
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log'],
    });
    try {
        const migration = app.get(drop_old_category_index_migration_1.DropOldCategoryIndexMigration);
        await migration.run();
        console.log('\n✅ All migrations completed successfully!');
    }
    catch (error) {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
    }
    finally {
        await app.close();
        process.exit(0);
    }
}
runMigrations();
//# sourceMappingURL=run-migrations.js.map