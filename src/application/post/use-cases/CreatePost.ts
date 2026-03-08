import type { PostRepository } from "../../../domain/repositories/PostRepository.ts";
import type { Post } from "../../../domain/entities/Post.ts";
import type { CreatePostDTO } from "../dtos/index.ts";

export class CreatePostUseCase {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  async execute(dto: CreatePostDTO): Promise<Post> {
    return this.postRepository.create({
      title: dto.title,
      content: dto.content,
      authorId: dto.authorId,
    });
  }
}
