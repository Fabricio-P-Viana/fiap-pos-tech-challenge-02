const { PostModel } = require("../../infrastructure/database/sequelize.js");
const SequelizePostRepository = require("../../infrastructure/repositories/postgresql/SequelizePostRepository.js");
const CreatePostUseCase = require("../../application/use-cases/Post/CreatePost.js");
const FindAllPostUseCase = require("../../application/use-cases/Post/FindAllPost.js");

module.exports = class PostController {
  constructor() {
    this.postRepository = new SequelizePostRepository(PostModel);
    this.createPostUseCase = new CreatePostUseCase(this.postRepository);
    this.findAllPostUseCase = new FindAllPostUseCase(this.postRepository);
  }

  async createPost(req, res) {
    try {
      const postData = req.body;
      const newPost = await this.createPostUseCase.execute(postData);
      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async findAllPosts(req, res) {
    try {
      const posts = await this.findAllPostUseCase.execute();
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
