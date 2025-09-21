// src/database/seeder.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamMember, TeamMemberSchema } from '../../teams/schemas/team-member.schema';
import { TeamMemberSeeder } from './team-member.seeder';
import { DatabaseSeeder } from './database.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TeamMember.name, schema: TeamMemberSchema },
    ]),
  ],
  providers: [TeamMemberSeeder, DatabaseSeeder],
  exports: [DatabaseSeeder],
})
export class SeederModule {}