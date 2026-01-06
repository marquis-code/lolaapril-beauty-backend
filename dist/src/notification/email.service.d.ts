export declare class EmailService {
    private transporter;
    constructor();
    sendEmail(to: string, subject: string, html: string, from?: string): Promise<{
        messageId: string;
        success: boolean;
        error?: string;
    }>;
    sendBulkEmail(recipients: string[], subject: string, html: string, from?: string): Promise<{
        sent: number;
        failed: number;
        errors: any[];
    }>;
}
