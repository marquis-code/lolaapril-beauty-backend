export declare class CreateTrackingCodeDto {
    name: string;
    codeType: 'qr_code' | 'direct_link' | 'social_media' | 'email_campaign';
    description?: string;
    expiresAt?: Date;
}
