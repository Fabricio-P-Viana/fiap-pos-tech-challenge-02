import type { PostRepository } from "../../../domain/repositories/PostRepository.ts";

export class DeletePostUseCase {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  async execute(postId: number): Promise<any> {
    return this.postRepository.delete(postId);
  }
}
