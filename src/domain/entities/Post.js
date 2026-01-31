module.exports = class Post {
  constructor({ id, title, content, createdAt, updatedAt }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
};
