import type { PostRepository } from "../../../domain/repositories/PostRepository.ts";
import type { Post } from "../../../domain/entities/Post.ts";
import type { UpdatePostDTO } from "../dtos/index.ts";
import { PostNotFoundError } from "../../../domain/errors/PostNotFoundError.ts";
import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError.ts";

export class UpdatePostUseCase {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  async execute(
    postId: number,
    dto: UpdatePostDTO,
    userId?: number,
  ): Promise<Post> {
    const post = await this.postRepository.findById(postId);

    if (!post) {
      throw new PostNotFoundError(postId);
    }

    if (!userId && post.authorId !== userId) {
      throw new UnauthorizedError(postId);
    }

    const updatedPost = await this.postRepository.update(post.id as number, {
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.content !== undefined && { content: dto.content }),
    });

    if (!updatedPost) {
      throw new PostNotFoundError(postId);
    }

    return updatedPost;
  }
}
