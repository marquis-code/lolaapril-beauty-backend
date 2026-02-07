/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { MembershipService } from "./membership.service";
import { CreateMembershipDto } from "./dto/create-membership.dto";
import { UpdateMembershipDto } from "./dto/update-membership.dto";
import { CreateClientMembershipDto } from "./dto/create-client-membership.dto";
import { MembershipQueryDto } from "./dto/membership-query.dto";
export declare class MembershipController {
    private readonly membershipService;
    constructor(membershipService: MembershipService);
    createMembership(businessId: string, createMembershipDto: CreateMembershipDto): Promise<import("./schemas/membership.schema").Membership>;
    findAllMemberships(businessId: string, query: MembershipQueryDto): Promise<{
        memberships: (import("mongoose").Document<unknown, {}, import("./schemas/membership.schema").MembershipDocument, {}, {}> & import("./schemas/membership.schema").Membership & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getStats(businessId: string): Promise<{
        programs: any;
        members: any;
        tierDistribution: any[];
    }>;
    findMembershipById(businessId: string, id: string): Promise<import("./schemas/membership.schema").Membership>;
    updateMembership(businessId: string, id: string, updateMembershipDto: UpdateMembershipDto): Promise<import("./schemas/membership.schema").Membership>;
    removeMembership(businessId: string, id: string): Promise<void>;
    enrollClient(businessId: string, createClientMembershipDto: CreateClientMembershipDto): Promise<import("./schemas/client-membership.schema").ClientMembership>;
    findClientMemberships(businessId: string, clientId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/client-membership.schema").ClientMembershipDocument, {}, {}> & import("./schemas/client-membership.schema").ClientMembership & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getClientBenefits(businessId: string, clientId: string): Promise<any[]>;
    addPoints(businessId: string, id: string, body: {
        points: number;
        description: string;
        saleId?: string;
    }): Promise<import("./schemas/client-membership.schema").ClientMembership>;
    redeemPoints(businessId: string, id: string, body: {
        points: number;
        description: string;
    }): Promise<import("./schemas/client-membership.schema").ClientMembership>;
    updateSpending(businessId: string, id: string, body: {
        amount: number;
    }): Promise<import("./schemas/client-membership.schema").ClientMembership>;
}
