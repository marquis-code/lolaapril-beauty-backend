import { Model } from "mongoose";
import { Subscription, SubscriptionDocument } from "./schemas/subscription.schema";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
export declare class SubscriptionsService {
    private subscriptionModel;
    constructor(subscriptionModel: Model<SubscriptionDocument>);
    create(createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription>;
    findAll(): Promise<Subscription[]>;
    findOne(id: string): Promise<Subscription>;
    unsubscribe(email: string): Promise<void>;
    softDelete(id: string, deletedBy: string): Promise<void>;
    hardDelete(id: string): Promise<void>;
}
