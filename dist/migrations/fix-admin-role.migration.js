"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var FixAdminRoleMigration_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixAdminRoleMigration = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../auth/schemas/user.schema");
let FixAdminRoleMigration = FixAdminRoleMigration_1 = class FixAdminRoleMigration {
    constructor(userModel) {
        this.userModel = userModel;
        this.logger = new common_1.Logger(FixAdminRoleMigration_1.name);
    }
    async up() {
        this.logger.log('Starting migration: Fix invalid admin role...');
        try {
            const result = await this.userModel.updateMany({ role: 'admin' }, { $set: { role: 'super_admin' } });
            this.logger.log(`Migration completed: Updated ${result.modifiedCount} users from 'admin' to 'super_admin'`);
        }
        catch (error) {
            this.logger.error('Migration failed:', error);
            throw error;
        }
    }
    async down() {
        this.logger.log('Rolling back migration: Fix admin role...');
        try {
            const result = await this.userModel.updateMany({
                role: 'super_admin',
                email: {
                    $in: [
                        'alice.johnson@example.com',
                        'marquis@admin.com',
                        'lolaapril@gmal.com'
                    ]
                }
            }, { $set: { role: 'admin' } });
            this.logger.log(`Rollback completed: Reverted ${result.modifiedCount} users`);
        }
        catch (error) {
            this.logger.error('Rollback failed:', error);
            throw error;
        }
    }
};
FixAdminRoleMigration = FixAdminRoleMigration_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FixAdminRoleMigration);
exports.FixAdminRoleMigration = FixAdminRoleMigration;
//# sourceMappingURL=fix-admin-role.migration.js.map