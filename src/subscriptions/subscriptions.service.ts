import { Injectable, ConflictException, NotFoundException } from "@nestjs/common"
import { Model } from "mongoose"
import { Subscription, SubscriptionDocument } from "./schemas/subscription.schema"
import { CreateSubscriptionDto } from "./dto/create-subscription.dto"
import { InjectModel } from "@nestjs/mongoose"

@Injectable()
export class SubscriptionsService {

  constructor(@InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>) {}

  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
    const existingSubscription = await this.subscriptionModel.findOne({
      email: createSubscriptionDto.email,
      isDeleted: false,
    })

    if (existingSubscription) {
      throw new ConflictException("Email already subscribed")
    }

    const subscription = new this.subscriptionModel(createSubscriptionDto)
    return subscription.save()
  }

  async findAll(): Promise<Subscription[]> {
    return this.subscriptionModel.find({ isDeleted: false }).sort({ createdAt: -1 }).exec()
  }

  async findOne(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionModel.findOne({ _id: id, isDeleted: false }).exec()
    if (!subscription) {
      throw new NotFoundException("Subscription not found")
    }
    return subscription
  }

  async unsubscribe(email: string): Promise<void> {
    const result = await this.subscriptionModel.updateOne({ email, isDeleted: false }, { isActive: false })

    if (result.matchedCount === 0) {
      throw new NotFoundException("Subscription not found")
    }
  }

  async softDelete(id: string, deletedBy: string): Promise<void> {
    const result = await this.subscriptionModel.updateOne(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date(), deletedBy },
    )

    if (result.matchedCount === 0) {
      throw new NotFoundException("Subscription not found")
    }
  }

  async hardDelete(id: string): Promise<void> {
    const result = await this.subscriptionModel.deleteOne({ _id: id })
    if (result.deletedCount === 0) {
      throw new NotFoundException("Subscription not found")
    }
  }
}
