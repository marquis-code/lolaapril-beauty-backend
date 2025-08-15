export declare class HighlightedRangeDto {
    start: number;
    end: number;
    text?: string;
}
export declare class CreateCommentDto {
    content: string;
    parentId?: string;
    isHighlighted?: boolean;
    highlightedRange?: HighlightedRangeDto;
    mentions?: string[];
}
export declare class UpdateCommentDto {
    content: string;
}
export declare class CommentReactionDto {
    type: 'like' | 'dislike' | 'love' | 'laugh' | 'angry';
}
