module.exports = class PostView {
  static render(post) {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
  static renderMany(posts) {
    return posts.map(this.render);
  }
};
