import { Sequelize } from "sequelize";
import createPostModel from "./models/PostModel.js";
import config from "./config.js";

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
