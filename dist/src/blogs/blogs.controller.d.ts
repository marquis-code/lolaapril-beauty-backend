import { BlogsService } from "./blogs.service";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { type BlogStatus } from "../common/enums";
export declare class BlogsController {
    private readonly blogsService;
    constructor(blogsService: BlogsService);
    create(createBlogDto: CreateBlogDto, user: any): Promise<import("./schemas/blog.schema").Blog>;
    findAll(status?: BlogStatus): Promise<import("./schemas/blog.schema").Blog[]>;
    findPublished(): Promise<import("./schemas/blog.schema").Blog[]>;
    findOne(id: string): Promise<import("./schemas/blog.schema").Blog>;
    update(id: string, updateBlogDto: UpdateBlogDto): Promise<import("./schemas/blog.schema").Blog>;
    publish(id: string): Promise<import("./schemas/blog.schema").Blog>;
    unpublish(id: string): Promise<import("./schemas/blog.schema").Blog>;
    softDelete(id: string, user: any): Promise<void>;
    hardDelete(id: string): Promise<void>;
    restore(id: string): Promise<import("./schemas/blog.schema").Blog>;
}
