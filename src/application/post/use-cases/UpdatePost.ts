import type { PostRepository } from "../../../domain/repositories/PostRepository.ts";
import type { Post } from "../../../domain/entities/Post.ts";
import type { UpdatePostDTO } from "../dtos/index.ts";
import { PostNotFoundError } from "../../../domain/errors/PostNotFoundError.ts";

export class UpdatePostUseCase {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  async execute(postId: number, dto: UpdatePostDTO): Promise<Post> {
    const updatedPost = await this.postRepository.update(postId, {
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.content !== undefined && { content: dto.content }),
    });

    if (!updatedPost) {
      throw new PostNotFoundError(postId);
    }

    return updatedPost;
  }
}
