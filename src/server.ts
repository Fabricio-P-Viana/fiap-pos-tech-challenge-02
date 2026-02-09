import express from "express";
import PostController from "./interface-adapters/controllers/PostController.js";
import RequestLoggerMiddleware from "./interface-adapters/middlewares/requestLogger.js";
import ErrorHandlerMiddleware from "./interface-adapters/middlewares/errorHandler.js";
import { sequelize } from "./infrastructure/database/sequelize.js";

class Server {
  app: express.Application;
  PORT: number | string;

  constructor() {
    this.app = express();
    this.PORT = process.env.PORT || 3000;
  }

  init(): void {
    this.conectToDatabase();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();

    this.app.listen(this.PORT, () => {
      console.log(`Server is running on port ${this.PORT}`);
    });
  }

  conectToDatabase(): void {
    sequelize
      .authenticate()
      .then(() => console.log("Database connected"))
      .catch((err: Error) =>
        console.error("Unable to connect to the database:", err),
      );
  }

  setupMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(RequestLoggerMiddleware);
  }

  setupRoutes(): void {
    const postController = new PostController();

    this.app.post("/posts", (req, res) => postController.createPost(req, res));
    this.app.get("/posts", (req, res) => postController.findAllPosts(req, res));
  }

  setupErrorHandling(): void {
    this.app.use(ErrorHandlerMiddleware);
  }
}

const server = new Server();

server.init();
