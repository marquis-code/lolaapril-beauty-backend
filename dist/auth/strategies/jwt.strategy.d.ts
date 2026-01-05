import { Model } from "mongoose";
import { type UserDocument } from "../schemas/user.schema";
import { JwtPayload } from "../types/request-with-user.interface";
declare const JwtStrategy_base: new (...args: unknown[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    validate(payload: any): Promise<JwtPayload>;
}
export {};
