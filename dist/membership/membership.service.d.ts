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
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { Model } from "mongoose";
import { Types } from "mongoose";
import { Membership, type MembershipDocument } from "./schemas/membership.schema";
import { ClientMembership, type ClientMembershipDocument } from "./schemas/client-membership.schema";
import { CreateMembershipDto } from "./dto/create-membership.dto";
import { UpdateMembershipDto } from "./dto/update-membership.dto";
import { CreateClientMembershipDto } from "./dto/create-client-membership.dto";
import { MembershipQueryDto } from "./dto/membership-query.dto";
export declare class MembershipService {
    private membershipModel;
    private clientMembershipModel;
    constructor(membershipModel: Model<MembershipDocument>, clientMembershipModel: Model<ClientMembershipDocument>);
    createMembership(createMembershipDto: CreateMembershipDto): Promise<Membership>;
    findAllMemberships(query: MembershipQueryDto): Promise<{
        memberships: (import("mongoose").Document<unknown, {}, MembershipDocument, {}, {}> & Membership & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
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
    findMembershipById(id: string): Promise<Membership>;
    updateMembership(id: string, updateMembershipDto: UpdateMembershipDto): Promise<Membership>;
    removeMembership(id: string): Promise<void>;
    enrollClient(createClientMembershipDto: CreateClientMembershipDto): Promise<ClientMembership>;
    findClientMemberships(clientId: string): Promise<(import("mongoose").Document<unknown, {}, ClientMembershipDocument, {}, {}> & ClientMembership & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findClientMembershipById(id: string): Promise<ClientMembership>;
    addPoints(clientMembershipId: string, points: number, description: string, saleId?: string, appointmentId?: string): Promise<ClientMembership>;
    redeemPoints(clientMembershipId: string, points: number, description: string, appointmentId?: string): Promise<ClientMembership>;
    updateSpending(clientMembershipId: string, amount: number): Promise<ClientMembership>;
    private checkTierUpgrade;
    getMembershipStats(): Promise<{
        programs: any;
        members: any;
        tierDistribution: any[];
    }>;
    getClientMembershipBenefits(clientId: string): Promise<any[]>;
}
