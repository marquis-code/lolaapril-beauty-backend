import { ContentBlockDto } from "../dto/create-blog.dto";
export declare class ContentProcessorService {
    calculateReadingTime(content: string, contentBlocks?: ContentBlockDto[]): number;
    private countWords;
    private countWordsInBlock;
    generateExcerpt(content: string, maxLength?: number): string;
    generateTableOfContents(contentBlocks?: ContentBlockDto[]): string[];
    private generateHeadingId;
}
