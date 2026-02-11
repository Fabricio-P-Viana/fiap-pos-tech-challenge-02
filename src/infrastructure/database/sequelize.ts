import { Sequelize } from "sequelize";
import createPostModel from "./models/PostModel.ts";
import config from "./config.ts";

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect as "postgres",
    logging: false,
  },
);

const PostModel = createPostModel(sequelize);

export { sequelize, PostModel };
