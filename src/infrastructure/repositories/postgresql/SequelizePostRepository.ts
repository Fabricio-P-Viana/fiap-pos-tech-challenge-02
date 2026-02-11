import { PostRepository } from "../../../domain/repositories/PostRepository.ts";
import type { PostData } from "../../../domain/entities/Post.ts";
import type { PostModel } from "../../database/models/PostModel.ts";
import type { ModelStatic } from "sequelize";
import { Op } from "sequelize";

export default class SequelizePostRepository extends PostRepository {
  private postModel: ModelStatic<PostModel>;

  constructor(postModel: ModelStatic<PostModel>) {
    super();
    this.postModel = postModel;
  }

  async create(postData: PostData): Promise<PostModel> {
    return await this.postModel.create(postData);
  }

  async findAll(): Promise<PostModel[]> {
    return await this.postModel.findAll();
  }

  async findById(id: number): Promise<PostModel | null> {
    return await this.postModel.findByPk(id);
  }

  async searchByWord(word: string): Promise<PostModel[]> {
    return await this.postModel.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${word}%` } },
          { content: { [Op.like]: `%${word}%` } },
        ],
      },
    });
  }

  async update(
    id: number,
    postData: Partial<PostData>,
  ): Promise<PostModel | null> {
    const post = await this.postModel.findByPk(id);
    if (post) {
      await post.update(postData);
      return post;
    }
    return null;
  }

  async delete(id: number): Promise<boolean> {
    const post = await this.postModel.findByPk(id);
    if (post) {
      await post.destroy();
      return true;
    }
    return false;
  }
}
