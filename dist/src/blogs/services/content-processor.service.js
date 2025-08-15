"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentProcessorService = void 0;
const common_1 = require("@nestjs/common");
let ContentProcessorService = class ContentProcessorService {
    calculateReadingTime(content, contentBlocks) {
        const wordsPerMinute = 225;
        let totalWords = 0;
        if (content) {
            totalWords += this.countWords(content);
        }
        if (contentBlocks) {
            for (const block of contentBlocks) {
                totalWords += this.countWordsInBlock(block);
            }
        }
        const readingTimeMinutes = Math.ceil(totalWords / wordsPerMinute);
        return Math.max(1, readingTimeMinutes);
    }
    countWords(text) {
        return text
            .trim()
            .split(/\s+/)
            .filter((word) => word.length > 0).length;
    }
    countWordsInBlock(block) {
        let words = 0;
        switch (block.type) {
            case "paragraph":
            case "heading1":
            case "heading2":
            case "heading3":
            case "quote":
                words += this.countWords(block.data.text || "");
                break;
            case "code":
                words += Math.ceil(this.countWords(block.data.code || "") * 0.5);
                break;
            case "orderedList":
            case "unorderedList":
                if (block.data.items) {
                    words += block.data.items.reduce((acc, item) => acc + this.countWords(item), 0);
                }
                break;
            case "table":
                if (block.data.rows) {
                    words += block.data.rows.reduce((acc, row) => acc + row.reduce((rowAcc, cell) => rowAcc + this.countWords(cell), 0), 0);
                }
                break;
            case "callout":
                words += this.countWords(block.data.text || "");
                break;
            case "image":
            case "video":
            case "audio":
                words += 10;
                break;
        }
        return words;
    }
    generateExcerpt(content, maxLength = 160) {
        const plainText = content.replace(/<[^>]*>/g, "").trim();
        if (plainText.length <= maxLength) {
            return plainText;
        }
        const truncated = plainText.substring(0, maxLength);
        const lastSentence = truncated.lastIndexOf(".");
        const lastSpace = truncated.lastIndexOf(" ");
        if (lastSentence > maxLength * 0.7) {
            return plainText.substring(0, lastSentence + 1);
        }
        else if (lastSpace > maxLength * 0.8) {
            return plainText.substring(0, lastSpace) + "...";
        }
        else {
            return truncated + "...";
        }
    }
    generateTableOfContents(contentBlocks) {
        if (!contentBlocks)
            return [];
        return contentBlocks
            .filter((block) => ["heading1", "heading2", "heading3"].includes(block.type))
            .map((block) => ({
            level: Number.parseInt(block.type.replace("heading", "")),
            text: block.data.text || "",
            id: this.generateHeadingId(block.data.text || ""),
        }))
            .map((heading) => `${"  ".repeat(heading.level - 1)}${heading.text}`);
    }
    generateHeadingId(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    }
};
ContentProcessorService = __decorate([
    (0, common_1.Injectable)()
], ContentProcessorService);
exports.ContentProcessorService = ContentProcessorService;
//# sourceMappingURL=content-processor.service.js.map