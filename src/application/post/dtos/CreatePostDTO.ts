import { ValidationError } from "../../../domain/errors/ValidationError.ts";

export class CreatePostDTO {
  readonly title: string;
  readonly content: string;

  private constructor(title: string, content: string) {
    this.title = title;
    this.content = content;
  }

  static create(data: Record<string, unknown>): CreatePostDTO {
    const { title, content } = data;

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

    return new CreatePostDTO(title.trim(), content.trim());
  }
}
