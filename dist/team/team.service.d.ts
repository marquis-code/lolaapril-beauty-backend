import { Model } from "mongoose";
import { TeamMember, TeamMemberDocument } from "./schemas/team-member.schema";
import { ServiceDocument } from "../service/schemas/service.schema";
import { CreateTeamMemberDto } from "./dto/create-team-member.dto";
import { UpdateTeamMemberDto } from "./dto/update-team-member.dto";
import { TeamMemberQueryDto } from "./dto/team-member-query.dto";
import { ApiResponse } from "../common/interfaces/common.interface";
export declare class TeamService {
    private teamMemberModel;
    private serviceModel;
    constructor(teamMemberModel: Model<TeamMemberDocument>, serviceModel: Model<ServiceDocument>);
    private validateObjectId;
    private validateServiceReferences;
    create(businessId: string, createTeamMemberDto: CreateTeamMemberDto): Promise<ApiResponse<TeamMember>>;
    findAll(businessId: string, query: TeamMemberQueryDto): Promise<ApiResponse<TeamMember[]>>;
    findOne(businessId: string, id: string): Promise<ApiResponse<TeamMember>>;
    update(businessId: string, id: string, updateTeamMemberDto: UpdateTeamMemberDto): Promise<ApiResponse<TeamMember>>;
    remove(businessId: string, id: string): Promise<ApiResponse<null>>;
    findByRole(businessId: string, role: string): Promise<ApiResponse<TeamMember[]>>;
    findByDepartment(businessId: string, department: string): Promise<ApiResponse<TeamMember[]>>;
    updateStatus(businessId: string, id: string, status: string): Promise<ApiResponse<TeamMember>>;
    addCommission(businessId: string, teamMemberId: string, serviceId: string, commissionData: {
        commissionType: string;
        commissionValue: number;
    }): Promise<ApiResponse<TeamMember>>;
    getTeamStats(businessId: string): Promise<ApiResponse<any>>;
}
