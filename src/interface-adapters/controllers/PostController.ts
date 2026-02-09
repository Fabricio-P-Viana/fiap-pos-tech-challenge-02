import type { Request, Response } from "express";
import { PostModel } from "../../infrastructure/database/sequelize.js";
import SequelizePostRepository from "../../infrastructure/repositories/postgresql/SequelizePostRepository.js";
import CreatePostUseCase from "../../application/use-cases/Post/CreatePost.js";
import FindAllPostUseCase from "../../application/use-cases/Post/FindAllPost.js";

export default class PostController {
  private createPostUseCase: CreatePostUseCase;
  private findAllPostUseCase: FindAllPostUseCase;

  constructor() {
    const postRepository = new SequelizePostRepository(PostModel);
    this.createPostUseCase = new CreatePostUseCase(postRepository);
    this.findAllPostUseCase = new FindAllPostUseCase(postRepository);
  }

  async createPost(req: Request, res: Response): Promise<void> {
    try {
      const postData = req.body;
      const newPost = await this.createPostUseCase.execute(postData);
      res.status(201).json(newPost);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }

  async findAllPosts(_req: Request, res: Response): Promise<void> {
    try {
      const posts = await this.findAllPostUseCase.execute();
      res.status(200).json(posts);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }
}
