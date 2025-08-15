import type { Model } from "mongoose";
import type { BlogClapDocument } from "../schemas/blog-clap.schema";
import type { ClapBlogDto } from "../dto/clap-blog.dto";
export declare class ClapService {
    private readonly blogClapModel;
    constructor(blogClapModel: Model<BlogClapDocument>);
    clapBlog(blogId: string, userId: string, clapDto: ClapBlogDto): Promise<{
        totalClaps: number;
    }>;
    getTotalClaps(blogId: string): Promise<number>;
    getUserClaps(blogId: string, userId: string): Promise<number>;
}
