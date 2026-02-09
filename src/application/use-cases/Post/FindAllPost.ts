import { Post } from "../../../domain/entities/Post.js";
import type { PostRepository } from "../../../domain/repositories/PostRepository.js";

export default class FindAllPostUseCase {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  async execute(): Promise<Post[]> {
    return this.postRepository.findAll();
  }
}
