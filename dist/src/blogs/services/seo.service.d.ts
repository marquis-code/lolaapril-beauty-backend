import { Blog } from "../schemas/blog.schema";
export declare class SeoService {
    generateMetaTags(blog: Blog): {
        title: string;
        description: string;
        keywords: string;
        ogTitle: string;
        ogDescription: string;
        ogImage: string;
        ogUrl: string;
        twitterCard: string;
        twitterTitle: string;
        twitterDescription: string;
        twitterImage: string;
        canonicalUrl: string;
        structuredData: any;
    };
    private generateStructuredData;
    generateSitemap(blogs: Blog[]): string;
    generateRobotsTxt(): string;
}
