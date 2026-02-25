import { Post } from "../../../domain/entities/Post.ts";
import type { PostRepository } from "../../../domain/repositories/PostRepository.ts";

export class SearchByWordPostUseCase {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  async execute(word: string): Promise<Post[]> {
    return this.postRepository.searchByWord(word);
  }
}
