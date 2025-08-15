// import { Injectable } from "@nestjs/common"
// import { Blog } from "../schemas/blog.schema"

// @Injectable()
// export class SeoService {
//   generateMetaTags(blog: Blog): {
//     title: string
//     description: string
//     keywords: string
//     ogTitle: string
//     ogDescription: string
//     ogImage: string
//     ogUrl: string
//     twitterCard: string
//     twitterTitle: string
//     twitterDescription: string
//     twitterImage: string
//     canonicalUrl: string
//     structuredData: any
//   } {
//     const baseUrl = process.env.BASE_URL || "https://yourblog.com"
//     const blogUrl = `${baseUrl}/blog/${blog.slug}`

//     return {
//       title: `${blog.title} | Your Blog`,
//       description: blog.excerpt || blog.metadata?.metaDescription || "",
//       keywords: blog.tags?.join(", ") || "",
//       ogTitle: blog.metadata?.ogTitle || blog.title,
//       ogDescription: blog.metadata?.ogDescription || blog.excerpt || "",
//       ogImage: blog.featuredImage || `${baseUrl}/default-og-image.jpg`,
//       ogUrl: blogUrl,
//       twitterCard: "summary_large_image",
//       twitterTitle: blog.metadata?.twitterTitle || blog.title,
//       twitterDescription: blog.metadata?.twitterDescription || blog.excerpt || "",
//       twitterImage: blog.featuredImage || `${baseUrl}/default-twitter-image.jpg`,
//       canonicalUrl: blog.metadata?.canonicalUrl || blogUrl,
//       structuredData: this.generateStructuredData(blog, blogUrl),
//     }
//   }

//   private generateStructuredData(blog: Blog, blogUrl: string): any {
//     return {
//       "@context": "https://schema.org",
//       "@type": "BlogPosting",
//       headline: blog.title,
//       description: blog.excerpt,
//       image: blog.featuredImage,
//       author: {
//         "@type": "Person",
//         name: blog.authorId?.name || "Anonymous",
//         url: `${process.env.BASE_URL}/author/${blog.authorId._id}`,
//       },
//       publisher: {
//         "@type": "Organization",
//         name: "Your Blog",
//         logo: {
//           "@type": "ImageObject",
//           url: `${process.env.BASE_URL}/logo.png`,
//         },
//       },
//       datePublished: blog.publishedAt?.toISOString(),
//       dateModified: blog.updatedAt?.toISOString(),
//       mainEntityOfPage: {
//         "@type": "WebPage",
//         "@id": blogUrl,
//       },
//       keywords: blog.tags?.join(", "),
//       articleSection: blog.category,
//       wordCount: blog.analytics?.wordCount,
//       timeRequired: `PT${blog.analytics?.estimatedReadTime}M`,
//     }
//   }

//   generateSitemap(blogs: Blog[]): string {
//     const baseUrl = process.env.BASE_URL || "https://yourblog.com"

//     const urls = blogs
//       .filter((blog) => blog.status === "published" && !blog.isDeleted)
//       .map((blog) => {
//         return `
//     <url>
//       <loc>${baseUrl}/blog/${blog.slug}</loc>
//       <lastmod>${blog.updatedAt?.toISOString()}</lastmod>
//       <changefreq>weekly</changefreq>
//       <priority>0.8</priority>
//     </url>`
//       })
//       .join("")

//     return `<?xml version="1.0" encoding="UTF-8"?>
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//   <url>
//     <loc>${baseUrl}</loc>
//     <lastmod>${new Date().toISOString()}</lastmod>
//     <changefreq>daily</changefreq>
//     <priority>1.0</priority>
//   </url>
//   <url>
//     <loc>${baseUrl}/blog</loc>
//     <lastmod>${new Date().toISOString()}</lastmod>
//     <changefreq>daily</changefreq>
//     <priority>0.9</priority>
//   </url>${urls}
// </urlset>`
//   }

//   generateRobotsTxt(): string {
//     const baseUrl = process.env.BASE_URL || "https://yourblog.com"

//     return `User-agent: *
// Allow: /
// Disallow: /admin/
// Disallow: /api/
// Disallow: /draft/

// Sitemap: ${baseUrl}/sitemap.xml`
//   }
// }



import { Injectable } from "@nestjs/common"
import { Blog } from "../schemas/blog.schema"

@Injectable()
export class SeoService {
  generateMetaTags(blog: Blog): {
    title: string
    description: string
    keywords: string
    ogTitle: string
    ogDescription: string
    ogImage: string
    ogUrl: string
    twitterCard: string
    twitterTitle: string
    twitterDescription: string
    twitterImage: string
    canonicalUrl: string
    structuredData: any
  } {
    const baseUrl = process.env.BASE_URL || "https://yourblog.com"
    const blogUrl = `${baseUrl}/blog/${blog.slug}`

    return {
      title: `${blog.title} | Your Blog`,
      description: blog.excerpt || blog.metadata?.metaDescription || "",
      keywords: blog.tags?.join(", ") || "",
      ogTitle: blog.metadata?.ogTitle || blog.title,
      ogDescription: blog.metadata?.ogDescription || blog.excerpt || "",
      ogImage: blog.featuredImage || `${baseUrl}/default-og-image.jpg`,
      ogUrl: blogUrl,
      twitterCard: "summary_large_image",
      twitterTitle: blog.metadata?.twitterTitle || blog.title,
      twitterDescription: blog.metadata?.twitterDescription || blog.excerpt || "",
      twitterImage: blog.featuredImage || `${baseUrl}/default-twitter-image.jpg`,
      canonicalUrl: blog.metadata?.canonicalUrl || blogUrl,
      structuredData: this.generateStructuredData(blog, blogUrl),
    }
  }

  private generateStructuredData(blog: Blog, blogUrl: string): any {
    // Check if authorId is populated (has name property) or is just an ObjectId
    const isAuthorPopulated = blog.authorId && typeof blog.authorId === 'object' && 'name' in blog.authorId
    const authorName = isAuthorPopulated ? (blog.authorId as any).name : blog.authorName || "Anonymous"
    const authorId = isAuthorPopulated ? (blog.authorId as any)._id : blog.authorId

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
      datePublished: blog.publishedAt?.toISOString(),
      dateModified: blog.updatedAt?.toISOString(),
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": blogUrl,
      },
      keywords: blog.tags?.join(", "),
      articleSection: blog.category,
      wordCount: blog.analytics?.wordCount,
      timeRequired: `PT${blog.analytics?.estimatedReadTime}M`,
    }
  }

  generateSitemap(blogs: Blog[]): string {
    const baseUrl = process.env.BASE_URL || "https://yourblog.com"

    const urls = blogs
      .filter((blog) => blog.status === "published" && !blog.isDeleted)
      .map((blog) => {
        return `
    <url>
      <loc>${baseUrl}/blog/${blog.slug}</loc>
      <lastmod>${blog.updatedAt?.toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`
      })
      .join("")

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
</urlset>`
  }

  generateRobotsTxt(): string {
    const baseUrl = process.env.BASE_URL || "https://yourblog.com"

    return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /draft/

Sitemap: ${baseUrl}/sitemap.xml`
  }
}