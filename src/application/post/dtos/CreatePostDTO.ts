import { ValidationError } from "../../../domain/errors/ValidationError.ts";

export class CreatePostDTO {
  readonly title: string;
  readonly content: string;
  readonly authorId: number;

  private constructor(title: string, content: string, authorId: number) {
    this.title = title;
    this.content = content;
    this.authorId = authorId;
  }

  static create(data: Record<string, unknown>): CreatePostDTO {
    const { title, content, authorId } = data;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      throw new ValidationError(
        "Title is required and must be a non-empty string",
      );
    }

    if (
      !content ||
      typeof content !== "string" ||
      content.trim().length === 0
    ) {
      throw new ValidationError(
        "Content is required and must be a non-empty string",
      );
    }

    if (!authorId || typeof authorId !== "number") {
      throw new ValidationError(
        "Author Id is required and must be a non-empty string",
      );
    }

    return new CreatePostDTO(title.trim(), content.trim(), authorId);
  }
}
