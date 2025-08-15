import { Injectable } from "@nestjs/common"
import { ContentBlockDto } from "../dto/create-blog.dto"

@Injectable()
export class ContentProcessorService {
  calculateReadingTime(content: string, contentBlocks?: ContentBlockDto[]): number {
    // Average reading speed: 200-250 words per minute
    const wordsPerMinute = 225

    let totalWords = 0

    // Count words in main content
    if (content) {
      totalWords += this.countWords(content)
    }

    // Count words in content blocks
    if (contentBlocks) {
      for (const block of contentBlocks) {
        totalWords += this.countWordsInBlock(block)
      }
    }

    const readingTimeMinutes = Math.ceil(totalWords / wordsPerMinute)
    return Math.max(1, readingTimeMinutes) // Minimum 1 minute
  }

  private countWords(text: string): number {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
  }

  private countWordsInBlock(block: ContentBlockDto): number {
    let words = 0

    switch (block.type) {
      case "paragraph":
      case "heading1":
      case "heading2":
      case "heading3":
      case "quote":
        words += this.countWords(block.data.text || "")
        break
      case "code":
        // Code blocks count as fewer words for reading time
        words += Math.ceil(this.countWords(block.data.code || "") * 0.5)
        break
      case "orderedList":
      case "unorderedList":
        if (block.data.items) {
          words += block.data.items.reduce((acc: number, item: string) => acc + this.countWords(item), 0)
        }
        break
      case "table":
        if (block.data.rows) {
          words += block.data.rows.reduce(
            (acc: number, row: string[]) => acc + row.reduce((rowAcc, cell) => rowAcc + this.countWords(cell), 0),
            0,
          )
        }
        break
      case "callout":
        words += this.countWords(block.data.text || "")
        break
      // Images, videos, etc. add minimal reading time
      case "image":
      case "video":
      case "audio":
        words += 10 // Equivalent to viewing time
        break
    }

    return words
  }

  generateExcerpt(content: string, maxLength = 160): string {
    // Remove HTML tags and get plain text
    const plainText = content.replace(/<[^>]*>/g, "").trim()

    if (plainText.length <= maxLength) {
      return plainText
    }

    // Find the last complete sentence within the limit
    const truncated = plainText.substring(0, maxLength)
    const lastSentence = truncated.lastIndexOf(".")
    const lastSpace = truncated.lastIndexOf(" ")

    if (lastSentence > maxLength * 0.7) {
      return plainText.substring(0, lastSentence + 1)
    } else if (lastSpace > maxLength * 0.8) {
      return plainText.substring(0, lastSpace) + "..."
    } else {
      return truncated + "..."
    }
  }

  generateTableOfContents(contentBlocks?: ContentBlockDto[]): string[] {
    if (!contentBlocks) return []

    return contentBlocks
      .filter((block) => ["heading1", "heading2", "heading3"].includes(block.type))
      .map((block) => ({
        level: Number.parseInt(block.type.replace("heading", "")),
        text: block.data.text || "",
        id: this.generateHeadingId(block.data.text || ""),
      }))
      .map((heading) => `${"  ".repeat(heading.level - 1)}${heading.text}`)
  }

  private generateHeadingId(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }
}
