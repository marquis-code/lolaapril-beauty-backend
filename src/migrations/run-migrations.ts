import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DropOldCategoryIndexMigration } from './drop-old-category-index.migration';

async function runMigrations() {
  console.log('🚀 Starting migrations...\n');
  
  // Create app without initializing providers that depend on Redis
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  
  try {
    // Run the migration
    const migration = app.get(DropOldCategoryIndexMigration);
    await migration.run();
    
    console.log('\n✅ All migrations completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await app.close();
    process.exit(0); // Force exit
  }
}

runMigrations();