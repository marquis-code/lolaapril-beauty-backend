export declare class SMSService {
    private readonly baseUrl;
    private readonly apiKey;
    constructor();
    sendSMS(to: string, message: string, from?: string): Promise<{
        messageId: string;
        success: boolean;
        error?: string;
    }>;
    sendBulkSMS(recipients: string[], message: string, from?: string): Promise<{
        sent: number;
        failed: number;
        errors: any[];
    }>;
    private formatPhoneNumber;
}
