const express = require("express");
const bodyParser = require("body-parser");

const PostController = require("./interface-adapters/controllers/PostController.js");
const RequestLoggerMiddleware = require("./interface-adapters/middlewares/requestLogger.js");
const ErrorHandlerMiddleware = require("./interface-adapters/middlewares/errorHandler.js");
const { sequelize } = require("./infrastructure/database/sequelize.js");

const app = express();
const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Unable to connect to the database:", err));

app.use(bodyParser.json());
app.use(express.json());
app.use(RequestLoggerMiddleware);

const postController = new PostController();

app.post("/posts", (req, res) => postController.createPost(req, res));
app.get("/posts", (req, res) => postController.findAllPosts(req, res));

app.use(ErrorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
