import { ValidationError } from "../../../domain/errors/ValidationError.ts";

export class UpdatePostDTO {
  readonly title?: string;
  readonly content?: string;

  private constructor(title?: string, content?: string) {
    this.title = title;
    this.content = content;
  }

  static create(data: Record<string, unknown>): UpdatePostDTO {
    const { title, content } = data;

    if (
      title !== undefined &&
      (typeof title !== "string" || title.trim().length === 0)
    ) {
      throw new ValidationError("Title must be a non-empty string");
    }

    if (
      content !== undefined &&
      (typeof content !== "string" || content.trim().length === 0)
    ) {
      throw new ValidationError("Content must be a non-empty string");
    }

    if (title === undefined && content === undefined) {
      throw new ValidationError(
        "At least one field (title or content) must be provided",
      );
    }

    return new UpdatePostDTO(
      title ? title.trim() : undefined,
      content ? content.trim() : undefined,
    );
  }
}
