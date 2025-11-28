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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedTemplatesCommand = void 0;
const nestjs_command_1 = require("nestjs-command");
const common_1 = require("@nestjs/common");
const notification_templates_seeder_1 = require("../seeders/notification-templates.seeder");
let SeedTemplatesCommand = class SeedTemplatesCommand {
    constructor(seeder) {
        this.seeder = seeder;
    }
    async run() {
        console.log('🌱 Seeding notification templates...');
        await this.seeder.seedDefaultTemplates();
        console.log('✅ Done!');
    }
};
__decorate([
    (0, nestjs_command_1.Command)({
        command: 'seed:notification-templates',
        describe: 'Seed default notification templates',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeedTemplatesCommand.prototype, "run", null);
SeedTemplatesCommand = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notification_templates_seeder_1.NotificationTemplateSeeder])
], SeedTemplatesCommand);
exports.SeedTemplatesCommand = SeedTemplatesCommand;
//# sourceMappingURL=seed-templates.command.js.map