import { CampaignService } from './campaign.service';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';
export declare class CampaignController {
    private readonly campaignService;
    constructor(campaignService: CampaignService);
    create(createCampaignDto: CreateCampaignDto, req: any): Promise<import("./schemas/campaign.schema").Campaign>;
    findAll(req: any): Promise<import("./schemas/campaign.schema").Campaign[]>;
    listEmailAssets(): Promise<{
        filename: string;
        path: string;
    }[]>;
    findOne(id: string): Promise<import("./schemas/campaign.schema").Campaign>;
    update(id: string, updateCampaignDto: UpdateCampaignDto): Promise<import("./schemas/campaign.schema").Campaign>;
    remove(id: string): Promise<void>;
    duplicate(id: string, req: any): Promise<import("./schemas/campaign.schema").Campaign>;
}
