declare class CampaignAudienceDto {
    type: 'all' | 'active_clients' | 'specific_emails' | 'query';
    query?: any;
    specificEmails?: string[];
}
declare class CampaignScheduleDto {
    type: 'now' | 'scheduled' | 'recurring';
    scheduledAt?: Date;
    cronExpression?: string;
    timezone?: string;
}
export declare class CreateCampaignDto {
    name: string;
    subject: string;
    content: string;
    previewText?: string;
    audience: CampaignAudienceDto;
    schedule: CampaignScheduleDto;
    bannerUrl?: string;
}
export declare class UpdateCampaignDto extends CreateCampaignDto {
}
export {};
