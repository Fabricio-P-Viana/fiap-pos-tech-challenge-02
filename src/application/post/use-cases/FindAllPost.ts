import { Post } from "../../../domain/entities/Post.ts";
import type { PostRepository } from "../../../domain/repositories/PostRepository.ts";

export class FindAllPostUseCase {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  async execute(): Promise<Post[]> {
    return this.postRepository.findAll();
  }
}
