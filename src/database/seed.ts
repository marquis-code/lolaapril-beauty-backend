// // src/database/seed.ts - Standalone seeding script
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from '../app.module';
// import { DatabaseSeeder } from './seeders/database.seeder';

// async function bootstrap() {
//   const app = await NestFactory.createApplicationContext(AppModule);
  
//   try {
//     const seeder = app.get(DatabaseSeeder);
//     await seeder.seed();
//   } catch (error) {
//     console.error('Seeding failed:', error);
//     process.exit(1);
//   } finally {
//     await app.close();
//   }
// }

// bootstrap();

// src/database/seed.ts
import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeders/seeder.module';
import { DatabaseSeeder } from './seeders/database.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);

  try {
    const seeder = app.get(DatabaseSeeder);
    await seeder.seed();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
