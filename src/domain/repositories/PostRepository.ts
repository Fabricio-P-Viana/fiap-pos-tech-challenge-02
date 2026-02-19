import type { Post, PostData } from "../entities/Post.ts";

export interface PostRepository {
  create(_postData: PostData): Promise<Post>;

  findAll(): Promise<Post[]>;

  findById(_id: number): Promise<Post | null>;

  searchByWord(_word: string): Promise<PostData[]>;

  update(_id: number, _postData: Partial<PostData>): Promise<Post | null>;

  delete(_id: number): Promise<boolean>;
}
