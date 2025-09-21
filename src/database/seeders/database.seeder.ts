// src/database/seeders/database.seeder.ts
import { Injectable } from '@nestjs/common';
import { TeamMemberSeeder } from './team-member.seeder';

@Injectable()
export class DatabaseSeeder {
  constructor(private readonly teamMemberSeeder: TeamMemberSeeder) {}

  async seed(): Promise<void> {
    console.log('🌱 Starting database seeding...');
    
    try {
      await this.teamMemberSeeder.seed();
      console.log('✅ Database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      throw error;
    }
  }
}
