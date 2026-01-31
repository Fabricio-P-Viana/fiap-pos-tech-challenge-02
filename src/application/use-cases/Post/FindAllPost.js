module.exports = class FindAllPostUseCase {
  constructor(postRepository) {
    this.postRepository = postRepository;
  }

  execute(postData) {
    return this.postRepository.findAll(postData);
  }
};
