import type {
  CreatePostUseCase,
  FindAllPostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  FindOneByIdPostUseCase,
  SearchByWordPostUseCase,
} from "../../application/post/use-cases/index.ts";
import {
  CreatePostDTO,
  UpdatePostDTO,
} from "../../application/post/dtos/index.ts";
import { ValidationError } from "../../domain/errors/ValidationError.ts";
import { ReqResNextFunction } from "../types/index.ts";
import PostView from "../presenters/PostView.ts";
import * as prometheus from "prom-client";

export default class PostController {
  private createPostUseCase: CreatePostUseCase;
  private findAllPostUseCase: FindAllPostUseCase;
  private updatePostUseCase: UpdatePostUseCase;
  private deletePostUseCase: DeletePostUseCase;
  private findOneByIdPostUseCase: FindOneByIdPostUseCase;
  private searchByWordPostUseCase: SearchByWordPostUseCase;
  private prometheusCounter: prometheus.Counter<string>;

  constructor(
    createPostUseCase: CreatePostUseCase,
    findAllPostUseCase: FindAllPostUseCase,
    updatePostUseCase: UpdatePostUseCase,
    deletePostUseCase: DeletePostUseCase,
    findOneByIdPostUseCase: FindOneByIdPostUseCase,
    searchByWordPostUseCase: SearchByWordPostUseCase,
  ) {
    this.prometheusCounter = new prometheus.Counter({
      name: "post_controller_requests_total",
      help: "Total number of requests to PostController",
      labelNames: ["method", "endpoint", "status_code"],
    });

    this.createPostUseCase = createPostUseCase;
    this.findAllPostUseCase = findAllPostUseCase;
    this.updatePostUseCase = updatePostUseCase;
    this.deletePostUseCase = deletePostUseCase;
    this.findOneByIdPostUseCase = findOneByIdPostUseCase;
    this.searchByWordPostUseCase = searchByWordPostUseCase;
  }

  private parseId(id: string | string[]): number {
    const idString = Array.isArray(id) ? id[0] : id;
    const postId = parseInt(idString, 10);

    if (isNaN(postId)) {
      throw new ValidationError("Post ID must be a valid number");
    }

    return postId;
  }

  async createPost({ req, res, next }: ReqResNextFunction): Promise<void> {
    try {
      const dto = CreatePostDTO.create({
        ...req.body,
        authorId: req?.user?.userId,
      });

      const post = await this.createPostUseCase.execute(dto);

      res.status(201).json(PostView.render(post));
    } catch (error) {
      next(error);
    } finally {
      this.prometheusCounter.inc({
        method: req.method,
        endpoint: req.path,
        status_code: res.statusCode.toString(),
      });
    }
  }

  async findAllPosts({ res, next }: ReqResNextFunction): Promise<void> {
    try {
      const posts = await this.findAllPostUseCase.execute();
      res.status(200).json(PostView.renderMany(posts));
    } catch (error) {
      next(error);
    } finally {
      this.prometheusCounter.inc({
        method: "GET",
        endpoint: "/posts",
        status_code: res.statusCode.toString(),
      });
    }
  }

  async findPostById({ req, res, next }: ReqResNextFunction): Promise<void> {
    try {
      const postId = this.parseId(req.params.id);
      const post = await this.findOneByIdPostUseCase.execute(postId);
      res.status(200).json(PostView.render(post));
    } catch (error) {
      next(error);
    } finally {
      this.prometheusCounter.inc({
        method: req.method,
        endpoint: req.path,
        status_code: res.statusCode.toString(),
      });
    }
  }

  async searchPostsByWord({
    req,
    res,
    next,
  }: ReqResNextFunction): Promise<void> {
    try {
      const { word } = req.query;

      if (!word || typeof word !== "string") {
        throw new ValidationError("Search word is required");
      }

      const posts = await this.searchByWordPostUseCase.execute(word);
      res.status(200).json(PostView.renderMany(posts));
    } catch (error) {
      next(error);
    } finally {
      this.prometheusCounter.inc({
        method: req.method,
        endpoint: req.path,
        status_code: res.statusCode.toString(),
      });
    }
  }

  async updatePost({ req, res, next }: ReqResNextFunction): Promise<void> {
    try {
      const postId = this.parseId(req.params.id);
      const dto = UpdatePostDTO.create(req.body);
      const userId = req?.user?.userId;
      const updatedPost = await this.updatePostUseCase.execute(
        postId,
        dto,
        userId,
      );
      res.status(200).json(PostView.render(updatedPost));
    } catch (error) {
      next(error);
    } finally {
      this.prometheusCounter.inc({
        method: req.method,
        endpoint: req.path,
        status_code: res.statusCode.toString(),
      });
    }
  }

  async deletePost({ req, res, next }: ReqResNextFunction): Promise<void> {
    try {
      const postId = this.parseId(req.params.id);
      await this.deletePostUseCase.execute(postId);
      res.status(204).send();
    } catch (error) {
      next(error);
    } finally {
      this.prometheusCounter.inc({
        method: req.method,
        endpoint: req.path,
        status_code: res.statusCode.toString(),
      });
    }
  }
}
