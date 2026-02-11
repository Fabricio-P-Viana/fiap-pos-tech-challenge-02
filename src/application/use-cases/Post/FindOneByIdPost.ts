import { Post } from "../../../domain/entities/Post.ts";
import type { PostRepository } from "../../../domain/repositories/PostRepository.ts";

export class FindOneByIdPostUseCase {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  async execute(postId: number): Promise<Post> {
    return this.postRepository.findById(postId);
  }
}
