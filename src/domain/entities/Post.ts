export interface PostData {
  id?: number;
  title: string;
  content: string;
  authorId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Post {
  id?: number;
  title: string;
  content: string;
  authorId: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor({
    id,
    title,
    content,
    authorId,
    createdAt,
    updatedAt,
  }: PostData) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.authorId = authorId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
