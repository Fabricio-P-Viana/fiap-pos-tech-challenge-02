import type { PostRepository } from "../../../domain/repositories/PostRepository.ts";
import type { PostData } from "../../../domain/entities/Post.ts";

export class UpdatePostUseCase {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  async execute(postId: number, postData: PostData): Promise<any> {
    return this.postRepository.update(postId, postData);
  }
}
