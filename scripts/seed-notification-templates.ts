import { NestFactory } from '@nestjs/core'
import { AppModule } from '../src/app.module'
import { NotificationTemplateSeeder } from '../src/notification/seeders/notification-templates.seeder'

async function bootstrap() {
  console.log('🌱 Seeding notification templates...')
  
  const app = await NestFactory.createApplicationContext(AppModule)
  const seeder = app.get(NotificationTemplateSeeder)
  
  try {
    await seeder.seedDefaultTemplates()
    console.log('✅ Notification templates seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding templates:', error)
    process.exit(1)
  }
  
  await app.close()
  process.exit(0)
}

bootstrap()
