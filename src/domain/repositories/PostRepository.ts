import type { PostData } from "../entities/Post.js";

export abstract class PostRepository {
  async create(_postData: PostData): Promise<any> {
    throw new Error("Method create must be implemented by subclass");
  }

  async findAll(): Promise<any[]> {
    throw new Error("Method findAll must be implemented by subclass");
  }

  async findById(_id: number): Promise<any | null> {
    throw new Error("Method findById must be implemented by subclass");
  }

  async update(_id: number, _postData: Partial<PostData>): Promise<any | null> {
    throw new Error("Method update must be implemented by subclass");
  }

  async delete(_id: number): Promise<boolean> {
    throw new Error("Method delete must be implemented by subclass");
  }
}
