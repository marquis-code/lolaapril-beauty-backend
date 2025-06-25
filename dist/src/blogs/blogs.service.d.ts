import { Model } from "mongoose";
import { Blog, BlogDocument } from "./schemas/blog.schema";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { BlogStatus } from "../common/enums";
export declare class BlogsService {
    private blogModel;
    constructor(blogModel: Model<BlogDocument>);
    create(createBlogDto: CreateBlogDto, authorId: string): Promise<Blog>;
    findAll(status?: BlogStatus): Promise<Blog[]>;
    findPublished(): Promise<Blog[]>;
    findOne(id: string): Promise<Blog>;
    update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog>;
    publish(id: string): Promise<Blog>;
    unpublish(id: string): Promise<Blog>;
    softDelete(id: string, deletedBy: string): Promise<void>;
    hardDelete(id: string): Promise<void>;
    restore(id: string): Promise<Blog>;
}
