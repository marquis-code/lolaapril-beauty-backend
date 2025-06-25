import { Document } from "mongoose";
export declare class BaseSchema extends Document {
    isDeleted: boolean;
    deletedAt?: Date;
    deletedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
