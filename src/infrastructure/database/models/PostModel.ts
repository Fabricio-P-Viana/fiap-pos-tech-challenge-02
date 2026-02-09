import { DataTypes, Model, Sequelize, type ModelStatic } from "sequelize";

export interface PostAttributes {
  id?: number;
  title: string;
  content: string;
}

export class PostModel extends Model<PostAttributes> implements PostAttributes {
  declare id: number;
  declare title: string;
  declare content: string;
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
