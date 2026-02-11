import { BrandingService } from './branding.service';
export declare class PublicPreviewController {
    private readonly brandingService;
    constructor(brandingService: BrandingService);
    getPreviewTheme(previewId: string): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
}
