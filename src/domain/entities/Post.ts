export interface PostData {
  id?: number;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Post {
  id?: number;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor({ id, title, content, createdAt, updatedAt }: PostData) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
