import { SubscriptionsService } from "./subscriptions.service";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    create(createSubscriptionDto: CreateSubscriptionDto): Promise<import("./schemas/subscription.schema").Subscription>;
    findAll(): Promise<import("./schemas/subscription.schema").Subscription[]>;
    findOne(id: string): Promise<import("./schemas/subscription.schema").Subscription>;
    unsubscribe(email: string): Promise<void>;
    softDelete(id: string, user: any): Promise<void>;
    hardDelete(id: string): Promise<void>;
}
