const { Sequelize } = require("sequelize");
const createPostModel = require("./models/PostModel.js");
const config = require("./config.js");

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: false,
  },
);

const PostModel = createPostModel(sequelize);

module.exports = { sequelize, PostModel };
