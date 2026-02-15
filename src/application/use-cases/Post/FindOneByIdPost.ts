import type { Post } from "../../../domain/entities/Post.ts";
import type { PostRepository } from "../../../domain/repositories/PostRepository.ts";
import { PostNotFoundError } from "../../../domain/errors/PostNotFoundError.ts";

export class FindOneByIdPostUseCase {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  async execute(postId: number): Promise<Post> {
    const post = await this.postRepository.findById(postId);

    if (!post) {
      throw new PostNotFoundError(postId);
    }

    return post;
  }
}
