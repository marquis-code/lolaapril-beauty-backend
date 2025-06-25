import { Injectable, ConflictException, NotFoundException } from "@nestjs/common"
import { Model } from "mongoose"
import * as bcrypt from "bcryptjs"
import { User, UserDocument } from "./schemas/user.schema"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { InjectModel } from "@nestjs/mongoose"

@Injectable()
export class UsersService {

  constructor( @InjectModel(User.name) private userModel: Model<UserDocument>) {
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email })
    if (existingUser) {
      throw new ConflictException("User with this email already exists")
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    })

    return user.save()
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find({ isDeleted: false }).select("-password").exec()
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: id, isDeleted: false }).select("-password").exec()
    if (!user) {
      throw new NotFoundException("User not found")
    }
    return user
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email, isDeleted: false }).exec()
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10)
    }

    const user = await this.userModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, updateUserDto, { new: true })
      .select("-password")
      .exec()

    if (!user) {
      throw new NotFoundException("User not found")
    }
    return user
  }

  async softDelete(id: string, deletedBy: string): Promise<void> {
    const result = await this.userModel.updateOne(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date(), deletedBy },
    )

    if (result.matchedCount === 0) {
      throw new NotFoundException("User not found")
    }
  }

  async hardDelete(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id })
    if (result.deletedCount === 0) {
      throw new NotFoundException("User not found")
    }
  }

  async restore(id: string): Promise<User> {
    const user = await this.userModel
      .findOneAndUpdate(
        { _id: id, isDeleted: true },
        { isDeleted: false, $unset: { deletedAt: 1, deletedBy: 1 } },
        { new: true },
      )
      .select("-password")
      .exec()

    if (!user) {
      throw new NotFoundException("User not found or not deleted")
    }
    return user
  }
}
