import { TeamMemberSeeder } from './team-member.seeder';
export declare class DatabaseSeeder {
    private readonly teamMemberSeeder;
    constructor(teamMemberSeeder: TeamMemberSeeder);
    seed(): Promise<void>;
}
