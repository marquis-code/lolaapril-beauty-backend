export declare class CreateTicketDto {
    clientId: string;
    businessId?: string;
    bookingId?: string;
    subject: string;
    description: string;
    priority: string;
    channel: string;
    category: string;
    tags?: string[];
    metadata?: any;
}
