interface PostViewData {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export default class PostView {
  static render(post: PostViewData): PostViewData {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  static renderMany(posts: PostViewData[]): PostViewData[] {
    return posts.map(this.render);
  }
}
