export interface PostAuthor {
  name: string;
}

export interface PostData {
  id?: number;
  title: string;
  content: string;
  authorId: number;
  author?: PostAuthor;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Post {
  id?: number;
  title: string;
  content: string;
  authorId: number;
  author?: PostAuthor;
  createdAt?: Date;
  updatedAt?: Date;

  constructor({
    id,
    title,
    content,
    authorId,
    author,
    createdAt,
    updatedAt,
  }: PostData) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.authorId = authorId;
    this.author = author;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
