import type { Request, Response } from "express";
import { PostModel } from "../../infrastructure/database/sequelize.ts";
import SequelizePostRepository from "../../infrastructure/repositories/postgresql/SequelizePostRepository.ts";

import {
  CreatePostUseCase,
  FindAllPostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  FindOneByIdPostUseCase,
  SearchByWordPostUseCase,
} from "../../application/use-cases/Post/index.ts";

export default class PostController {
  private createPostUseCase: CreatePostUseCase;
  private findAllPostUseCase: FindAllPostUseCase;
  private updatePostUseCase: UpdatePostUseCase;
  private deletePostUseCase: DeletePostUseCase;
  private findOneByIdPostUseCase: FindOneByIdPostUseCase;
  private searchByWordPostUseCase: SearchByWordPostUseCase;

  constructor() {
    const postRepository = new SequelizePostRepository(PostModel);
    this.createPostUseCase = new CreatePostUseCase(postRepository);
    this.findAllPostUseCase = new FindAllPostUseCase(postRepository);
    this.updatePostUseCase = new UpdatePostUseCase(postRepository);
    this.deletePostUseCase = new DeletePostUseCase(postRepository);
    this.findOneByIdPostUseCase = new FindOneByIdPostUseCase(postRepository);
    this.searchByWordPostUseCase = new SearchByWordPostUseCase(postRepository);
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

  async findPostById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        res.status(400).json({ error: "Post ID is required " });
        return;
      }

      const postId = parseInt(id, 10);

      if (isNaN(postId)) {
        res.status(400).json({ error: "Post ID must be a valid number" });
        return;
      }

      const post = await this.findOneByIdPostUseCase.execute(postId);
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ error: "Post not found" });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }

  async searchPostsByWord(req: Request, res: Response): Promise<void> {
    try {
      const { word } = req.query;

      if (!word || typeof word !== "string") {
        res.status(400).json({ error: "Search word is required" });
        return;
      }

      const posts = await this.searchByWordPostUseCase.execute(word);

      if (posts.length === 0) {
        res
          .status(404)
          .json({ error: "No posts found matching the search criteria" });
        return;
      }

      res.status(200).json(posts);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }

  async updatePost(req: Request, res: Response): Promise<void> {
    try {
      const postData = req.body;
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        res.status(400).json({ error: "Post ID is required " });
        return;
      }

      const postId = parseInt(id, 10);

      if (isNaN(postId)) {
        res.status(400).json({ error: "Post ID must be a valid number" });
        return;
      }

      const updatedPost = await this.updatePostUseCase.execute(
        postId,
        postData,
      );
      res.status(200).json(updatedPost);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }

  async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        res.status(400).json({ error: "Post ID is required " });
        return;
      }

      const postId = parseInt(id, 10);

      if (isNaN(postId)) {
        res.status(400).json({ error: "Post ID must be a valid number" });
        return;
      }

      await this.deletePostUseCase.execute(postId);
      res.status(204).send();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }
}
