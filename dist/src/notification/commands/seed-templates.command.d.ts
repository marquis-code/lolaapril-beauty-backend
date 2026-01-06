import { NotificationTemplateSeeder } from '../seeders/notification-templates.seeder';
export declare class SeedTemplatesCommand {
    private readonly seeder;
    constructor(seeder: NotificationTemplateSeeder);
    run(): Promise<void>;
}
