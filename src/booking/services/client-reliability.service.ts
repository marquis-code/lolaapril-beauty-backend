import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { ClientReliability, ClientReliabilityDocument } from '../schemas/client-reliability.schema'

@Injectable()
export class ClientReliabilityService {
  constructor(
    @InjectModel(ClientReliability.name)
    private reliabilityModel: Model<ClientReliabilityDocument>
  ) {}

  async getClientScore(clientId: string): Promise<number> {
    const record = await this.reliabilityModel
      .findOne({ clientId: new Types.ObjectId(clientId) })
      .lean()
      .exec()

    return record?.reliabilityScore || 100 // Default to perfect score
  }

  async shouldRequireDeposit(clientId: string): Promise<boolean> {
    const record = await this.reliabilityModel
      .findOne({ clientId: new Types.ObjectId(clientId) })
      .lean()
      .exec()

    if (!record) return false

    // Require deposit if:
    // - 2+ no-shows
    // - 3+ late cancellations
    // - Score below 70
    return (
      record.noShowCount >= 2 ||
      record.lateCancellations >= 3 ||
      record.reliabilityScore < 70
    )
  }

  async recordNoShow(clientId: string): Promise<void> {
    await this.reliabilityModel.findOneAndUpdate(
      { clientId: new Types.ObjectId(clientId) },
      {
        $inc: {
          noShowCount: 1,
          reliabilityScore: -15 // Heavy penalty
        },
        $set: {
          lastNoShowDate: new Date(),
          requiresDeposit: true
        }
      },
      { upsert: true }
    ).exec()
  }

  async recordLateCancellation(clientId: string): Promise<void> {
    await this.reliabilityModel.findOneAndUpdate(
      { clientId: new Types.ObjectId(clientId) },
      {
        $inc: {
          lateCancellations: 1,
          cancelledBookings: 1,
          reliabilityScore: -5
        },
        $set: { lastCancellationDate: new Date() }
      },
      { upsert: true }
    ).exec()
  }

  async recordCompletion(clientId: string, wasOnTime: boolean): Promise<void> {
    const scoreIncrease = wasOnTime ? 2 : 1

    await this.reliabilityModel.findOneAndUpdate(
      { clientId: new Types.ObjectId(clientId) },
      {
        $inc: {
          completedBookings: 1,
          reliabilityScore: scoreIncrease,
          ...(wasOnTime && { onTimeArrivals: 1 })
        },
        $min: { reliabilityScore: 100 } // Cap at 100
      },
      { upsert: true }
    ).exec()
  }
}