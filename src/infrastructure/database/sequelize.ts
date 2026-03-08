import { Dialect, Sequelize } from "sequelize";
import createPostModel from "./models/PostModel.ts";
import createUserModel from "./models/UserModel.ts";
import config from "./config.ts";

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect as Dialect,
    logging: false,
  },
);

const PostModel = createPostModel(sequelize);
const UserModel = createUserModel(sequelize);

export { sequelize, PostModel, UserModel };
