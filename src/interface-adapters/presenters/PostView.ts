import { Post } from "../../domain/entities/Post.ts";

interface PostViewData {
  id?: number | string | undefined;
  title: string;
  content: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}

export default class PostView {
  static render(post: Post): PostViewData {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  static renderMany(posts: Post[]): PostViewData[] {
    return posts.map(this.render);
  }
}
