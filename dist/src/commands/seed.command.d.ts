import { DatabaseSeeder } from '../database/seeders/database.seeder';
export declare class SeedCommand {
    private readonly databaseSeeder;
    constructor(databaseSeeder: DatabaseSeeder);
    seed(): Promise<void>;
}
