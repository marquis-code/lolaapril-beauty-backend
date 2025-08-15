"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeoService = void 0;
const common_1 = require("@nestjs/common");
let SeoService = class SeoService {
    generateMetaTags(blog) {
        var _a, _b, _c, _d, _e, _f, _g;
        const baseUrl = process.env.BASE_URL || "https://yourblog.com";
        const blogUrl = `${baseUrl}/blog/${blog.slug}`;
        return {
            title: `${blog.title} | Your Blog`,
            description: blog.excerpt || ((_a = blog.metadata) === null || _a === void 0 ? void 0 : _a.metaDescription) || "",
            keywords: ((_b = blog.tags) === null || _b === void 0 ? void 0 : _b.join(", ")) || "",
            ogTitle: ((_c = blog.metadata) === null || _c === void 0 ? void 0 : _c.ogTitle) || blog.title,
            ogDescription: ((_d = blog.metadata) === null || _d === void 0 ? void 0 : _d.ogDescription) || blog.excerpt || "",
            ogImage: blog.featuredImage || `${baseUrl}/default-og-image.jpg`,
            ogUrl: blogUrl,
            twitterCard: "summary_large_image",
            twitterTitle: ((_e = blog.metadata) === null || _e === void 0 ? void 0 : _e.twitterTitle) || blog.title,
            twitterDescription: ((_f = blog.metadata) === null || _f === void 0 ? void 0 : _f.twitterDescription) || blog.excerpt || "",
            twitterImage: blog.featuredImage || `${baseUrl}/default-twitter-image.jpg`,
            canonicalUrl: ((_g = blog.metadata) === null || _g === void 0 ? void 0 : _g.canonicalUrl) || blogUrl,
            structuredData: this.generateStructuredData(blog, blogUrl),
        };
    }
    generateStructuredData(blog, blogUrl) {
        var _a, _b, _c, _d, _e;
        const isAuthorPopulated = blog.authorId && typeof blog.authorId === 'object' && 'name' in blog.authorId;
        const authorName = isAuthorPopulated ? blog.authorId.name : blog.authorName || "Anonymous";
        const authorId = isAuthorPopulated ? blog.authorId._id : blog.authorId;
        return {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: blog.title,
            description: blog.excerpt,
            image: blog.featuredImage,
            author: {
                "@type": "Person",
                name: authorName,
                url: `${process.env.BASE_URL}/author/${authorId}`,
            },
            publisher: {
                "@type": "Organization",
                name: "Your Blog",
                logo: {
                    "@type": "ImageObject",
                    url: `${process.env.BASE_URL}/logo.png`,
                },
            },
            datePublished: (_a = blog.publishedAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
            dateModified: (_b = blog.updatedAt) === null || _b === void 0 ? void 0 : _b.toISOString(),
            mainEntityOfPage: {
                "@type": "WebPage",
                "@id": blogUrl,
            },
            keywords: (_c = blog.tags) === null || _c === void 0 ? void 0 : _c.join(", "),
            articleSection: blog.category,
            wordCount: (_d = blog.analytics) === null || _d === void 0 ? void 0 : _d.wordCount,
            timeRequired: `PT${(_e = blog.analytics) === null || _e === void 0 ? void 0 : _e.estimatedReadTime}M`,
        };
    }
    generateSitemap(blogs) {
        const baseUrl = process.env.BASE_URL || "https://yourblog.com";
        const urls = blogs
            .filter((blog) => blog.status === "published" && !blog.isDeleted)
            .map((blog) => {
            var _a;
            return `
    <url>
      <loc>${baseUrl}/blog/${blog.slug}</loc>
      <lastmod>${(_a = blog.updatedAt) === null || _a === void 0 ? void 0 : _a.toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`;
        })
            .join("");
        return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>${urls}
</urlset>`;
    }
    generateRobotsTxt() {
        const baseUrl = process.env.BASE_URL || "https://yourblog.com";
        return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /draft/

Sitemap: ${baseUrl}/sitemap.xml`;
    }
};
SeoService = __decorate([
    (0, common_1.Injectable)()
], SeoService);
exports.SeoService = SeoService;
//# sourceMappingURL=seo.service.js.map