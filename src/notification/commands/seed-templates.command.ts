import { Command } from 'nestjs-command'
import { Injectable } from '@nestjs/common'
import { NotificationTemplateSeeder } from '../seeders/notification-templates.seeder'

@Injectable()
export class SeedTemplatesCommand {
  constructor(private readonly seeder: NotificationTemplateSeeder) {}

  @Command({
    command: 'seed:notification-templates',
    describe: 'Seed default notification templates',
  })
  async run(): Promise<void> {
    console.log('🌱 Seeding notification templates...')
    await this.seeder.seedDefaultTemplates()
    console.log('✅ Done!')
  }
}