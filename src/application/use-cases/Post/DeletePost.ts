import type { PostRepository } from "../../../domain/repositories/PostRepository.ts";
import { PostNotFoundError } from "../../../domain/errors/PostNotFoundError.ts";

export class DeletePostUseCase {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  async execute(postId: number): Promise<void> {
    const deleted = await this.postRepository.delete(postId);

    if (!deleted) {
      throw new PostNotFoundError(postId);
    }
  }
}
