import { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
export declare class FixAdminRoleMigration {
    private userModel;
    private readonly logger;
    constructor(userModel: Model<User>);
    up(): Promise<void>;
    down(): Promise<void>;
}
