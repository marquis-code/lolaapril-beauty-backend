import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { BlogsService } from "./blogs.service"
import { BlogsController } from "./blogs.controller"
import { Blog, BlogSchema } from "./schemas/blog.schema"

@Module({
  imports: [MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }])],
  providers: [BlogsService],
  controllers: [BlogsController],
})
export class BlogsModule {}
