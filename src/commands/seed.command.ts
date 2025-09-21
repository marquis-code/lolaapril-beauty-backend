// src/commands/seed.command.ts
import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { DatabaseSeeder } from '../database/seeders/database.seeder';

@Injectable()
export class SeedCommand {
  constructor(private readonly databaseSeeder: DatabaseSeeder) {}

  @Command({ command: 'seed', describe: 'Seed the database' })
  async seed() {
    await this.databaseSeeder.seed();
  }
}