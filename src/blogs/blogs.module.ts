// import { Module } from "@nestjs/common"
// import { MongooseModule } from "@nestjs/mongoose"
// import { BlogsService } from "./blogs.service"
// import { BlogsController } from "./blogs.controller"
// import { Blog, BlogSchema } from "./schemas/blog.schema"
// import { BlogClap, BlogClapSchema } from './schemas/blog-clap.schema'; 

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
//     MongooseModule.forFeature([{ name: BlogClap.name, schema: BlogClapSchema }]), // Import BlogClapModel here
//   ],
//   providers: [BlogsService],
//   controllers: [BlogsController],
// })
// export class BlogsModule {}


import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { Blog, BlogSchema } from './schemas/blog.schema';
import { BlogClap, BlogClapSchema } from './schemas/blog-clap.schema'; // Import BlogClap schema
import { BlogComment, BlogCommentSchema } from './schemas/blog-comment.schema'; // Import BlogComment schema
import { BlogBookmark, BlogBookmarkSchema } from './schemas/blog-bookmark.schema'; // Import BlogBookmark schema
import { Series, SeriesSchema } from './schemas/series.schema'; // Import Series schema
import { ContentProcessorService } from './services/content-processor.service'; 
import { BlogAnalyticsService } from './services/blog-analytics.service'; 

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: BlogClap.name, schema: BlogClapSchema }, // Register BlogClap schema
      { name: BlogComment.name, schema: BlogCommentSchema }, // Register BlogComment schema
      { name: BlogBookmark.name, schema: BlogBookmarkSchema }, // Register BlogBookmark schema
      { name: Series.name, schema: SeriesSchema }, // Register Series schema
    ]),
  ],
  providers: [BlogsService, ContentProcessorService, BlogAnalyticsService],
  controllers: [BlogsController],
})
export class BlogsModule {}
