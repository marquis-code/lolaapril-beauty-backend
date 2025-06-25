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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const bcrypt = require("bcryptjs");
const user_schema_1 = require("./schemas/user.schema");
const mongoose_2 = require("@nestjs/mongoose");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(createUserDto) {
        const existingUser = await this.userModel.findOne({ email: createUserDto.email });
        if (existingUser) {
            throw new common_1.ConflictException("User with this email already exists");
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = new this.userModel(Object.assign(Object.assign({}, createUserDto), { password: hashedPassword }));
        return user.save();
    }
    async findAll() {
        return this.userModel.find({ isDeleted: false }).select("-password").exec();
    }
    async findOne(id) {
        const user = await this.userModel.findOne({ _id: id, isDeleted: false }).select("-password").exec();
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        return user;
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email, isDeleted: false }).exec();
    }
    async update(id, updateUserDto) {
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        const user = await this.userModel
            .findOneAndUpdate({ _id: id, isDeleted: false }, updateUserDto, { new: true })
            .select("-password")
            .exec();
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        return user;
    }
    async softDelete(id, deletedBy) {
        const result = await this.userModel.updateOne({ _id: id, isDeleted: false }, { isDeleted: true, deletedAt: new Date(), deletedBy });
        if (result.matchedCount === 0) {
            throw new common_1.NotFoundException("User not found");
        }
    }
    async hardDelete(id) {
        const result = await this.userModel.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException("User not found");
        }
    }
    async restore(id) {
        const user = await this.userModel
            .findOneAndUpdate({ _id: id, isDeleted: true }, { isDeleted: false, $unset: { deletedAt: 1, deletedBy: 1 } }, { new: true })
            .select("-password")
            .exec();
        if (!user) {
            throw new common_1.NotFoundException("User not found or not deleted");
        }
        return user;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map