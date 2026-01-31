module.exports = class CreatePostUseCase {
  constructor(postRepository) {
    this.postRepository = postRepository;
  }

  execute(postData) {
    return this.postRepository.create(postData);
  }
};
