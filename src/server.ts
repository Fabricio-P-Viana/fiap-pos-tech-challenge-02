import express from "express";
import swaggerUi from "swagger-ui-express";
import postRoutes from "./interface-adapters/routes/postRoutes.ts";
import RequestLoggerMiddleware from "./interface-adapters/middlewares/requestLogger.ts";
import ErrorHandlerMiddleware from "./interface-adapters/middlewares/errorHandler.ts";
import { sequelize } from "./infrastructure/database/sequelize.ts";
import { swaggerSpec } from "./infrastructure/frameworks/swagger.ts";

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
      console.log(
        `Swagger UI available at http://localhost:${this.PORT}/api-docs`,
      );
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
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    this.app.use("/posts", postRoutes);
  }

  setupErrorHandling(): void {
    this.app.use(ErrorHandlerMiddleware);
  }
}

const server = new Server();

server.init();
