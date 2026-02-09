import type { PostRepository } from "../../../domain/repositories/PostRepository.js";
import type { PostData } from "../../../domain/entities/Post.js";

export default class CreatePostUseCase {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  async execute(postData: PostData): Promise<any> {
    return this.postRepository.create(postData);
  }
}
