import type { Post } from "../../domain/entities/Post.ts";

export default class PostView {
  static render<T extends Post>(post: T): T {
    return post;
  }

  static renderMany<T extends Post>(posts: T[]): T[] {
    return posts;
  }
}
