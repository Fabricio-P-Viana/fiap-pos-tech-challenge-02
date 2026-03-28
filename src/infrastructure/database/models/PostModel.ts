import {
  DataTypes,
  Model,
  Sequelize,
  type ModelStatic,
  type NonAttribute,
} from "sequelize";
import type { UserModel } from "./UserModel.ts";

export interface PostAttributes {
  id?: number;
  title: string;
  content: string;
  authorId: number;
}

export class PostModel extends Model<PostAttributes> implements PostAttributes {
  declare id: number;
  declare title: string;
  declare content: string;
  declare authorId: number;
  declare author?: NonAttribute<Pick<UserModel, "name">>;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

export default function createPostModel(
  sequelize: Sequelize,
): ModelStatic<PostModel> {
  PostModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Post",
      tableName: "posts",
      timestamps: true,
    },
  );

  return PostModel as ModelStatic<PostModel>;
}
