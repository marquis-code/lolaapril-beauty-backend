import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class FixAdminRoleMigration {
  private readonly logger = new Logger(FixAdminRoleMigration.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async up(): Promise<void> {
    this.logger.log('Starting migration: Fix invalid admin role...');

    try {
      // Find all users with invalid 'admin' role
      const result = await this.userModel.updateMany(
        { role: 'admin' },
        { $set: { role: 'super_admin' } }
      );

      this.logger.log(
        `Migration completed: Updated ${result.modifiedCount} users from 'admin' to 'super_admin'`,
      );
    } catch (error) {
      this.logger.error('Migration failed:', error);
      throw error;
    }
  }

  async down(): Promise<void> {
    this.logger.log('Rolling back migration: Fix admin role...');

    try {
      // Rollback: super_admin back to admin (for testing purposes only)
      const result = await this.userModel.updateMany(
        { 
          role: 'super_admin',
          email: { 
            $in: [
              'alice.johnson@example.com', 
              'marquis@admin.com', 
              'lolaapril@gmal.com'
            ] 
          }
        },
        { $set: { role: 'admin' } }
      );

      this.logger.log(
        `Rollback completed: Reverted ${result.modifiedCount} users`,
      );
    } catch (error) {
      this.logger.error('Rollback failed:', error);
      throw error;
    }
  }
}
