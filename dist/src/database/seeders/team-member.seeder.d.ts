import { Model } from 'mongoose';
import { TeamMemberDocument } from '../../teams/schemas/team-member.schema';
export declare class TeamMemberSeeder {
    private readonly teamMemberModel;
    constructor(teamMemberModel: Model<TeamMemberDocument>);
    seed(): Promise<void>;
}
