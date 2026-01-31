const PostRepository = require("../../../domain/repositories/PostRepository.js");

module.exports = class SequelizePostRepository extends PostRepository {
  constructor(postModel) {
    super();
    this.postModel = postModel;
  }

  async create(postData) {
    return await this.postModel.create(postData);
  }

  async findAll() {
    return await this.postModel.findAll();
  }

  async findById(id) {
    return await this.postModel.findByPk(id);
  }

  async update(id, postData) {
    const post = await this.postModel.findByPk(id);
    if (post) {
      await post.update(postData);
      return post;
    }
    return null;
  }

  async delete(id) {
    const post = await this.postModel.findByPk(id);
    if (post) {
      await post.destroy();
      return true;
    }
    return false;
  }
};
