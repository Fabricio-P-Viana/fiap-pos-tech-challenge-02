import type {
  CreateUserUseCase,
  FindAllUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  FindOneByIdUserUseCase,
} from "../../application/user/use-cases/index.ts";
import {
  CreateUserDTO,
  UpdateUserDTO,
} from "../../application/user/dtos/index.ts";
import { ValidationError } from "../../domain/errors/ValidationError.ts";
import { ReqResNextFunction } from "../types/index.ts";
import UserView from "../presenters/UserView.ts";
import * as prometheus from "prom-client";

export default class UserController {
  private createUserUseCase: CreateUserUseCase;
  private findAllUserUseCase: FindAllUserUseCase;
  private updateUserUseCase: UpdateUserUseCase;
  private deleteUserUseCase: DeleteUserUseCase;
  private findOneByIdUserUseCase: FindOneByIdUserUseCase;
  private prometheusCounter: prometheus.Counter<string>;

  constructor(
    createUserUseCase: CreateUserUseCase,
    findAllUserUseCase: FindAllUserUseCase,
    updateUserUseCase: UpdateUserUseCase,
    deleteUserUseCase: DeleteUserUseCase,
    findOneByIdUserUseCase: FindOneByIdUserUseCase,
  ) {
    this.prometheusCounter = new prometheus.Counter({
      name: "user_controller_requests_total",
      help: "Total number of requests to UserController",
      labelNames: ["method", "endpoint", "status_code"],
    });

    this.createUserUseCase = createUserUseCase;
    this.findAllUserUseCase = findAllUserUseCase;
    this.updateUserUseCase = updateUserUseCase;
    this.deleteUserUseCase = deleteUserUseCase;
    this.findOneByIdUserUseCase = findOneByIdUserUseCase;
  }

  private parseId(id: string | string[]): number {
    const idString = Array.isArray(id) ? id[0] : id;
    const userId = parseInt(idString, 10);

    if (isNaN(userId)) {
      throw new ValidationError("User ID must be a valid number");
    }

    return userId;
  }

  async createUser({ req, res, next }: ReqResNextFunction): Promise<void> {
    try {
      const dto = CreateUserDTO.create(req.body);
      const user = await this.createUserUseCase.execute(dto);

      res.status(201).json(UserView.render(user));
    } catch (error) {
      next(error);
    } finally {
      this.prometheusCounter.inc({
        method: req.method,
        endpoint: req.path,
        status_code: res.statusCode.toString(),
      });
    }
  }

  async findAllUsers({ res, next }: ReqResNextFunction): Promise<void> {
    try {
      const users = await this.findAllUserUseCase.execute();
      res.status(200).json(UserView.renderMany(users));
    } catch (error) {
      next(error);
    } finally {
      this.prometheusCounter.inc({
        method: "GET",
        endpoint: "/users",
        status_code: res.statusCode.toString(),
      });
    }
  }

  async findUserById({ req, res, next }: ReqResNextFunction): Promise<void> {
    try {
      const userId = this.parseId(req.params.id);
      const user = await this.findOneByIdUserUseCase.execute(userId);
      res.status(200).json(UserView.render(user));
    } catch (error) {
      next(error);
    } finally {
      this.prometheusCounter.inc({
        method: req.method,
        endpoint: req.path,
        status_code: res.statusCode.toString(),
      });
    }
  }

  async updateUser({ req, res, next }: ReqResNextFunction): Promise<void> {
    try {
      const userId = this.parseId(req.params.id);
      const currentUserId = req.user?.userId;

      const dto = UpdateUserDTO.create(req.body);
      const updatedUser = await this.updateUserUseCase.execute(
        userId,
        dto,
        currentUserId,
      );
      res.status(200).json(UserView.render(updatedUser));
    } catch (error) {
      next(error);
    } finally {
      this.prometheusCounter.inc({
        method: req.method,
        endpoint: req.path,
        status_code: res.statusCode.toString(),
      });
    }
  }

  async deleteUser({ req, res, next }: ReqResNextFunction): Promise<void> {
    try {
      const userId = this.parseId(req.params.id);
      await this.deleteUserUseCase.execute(userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    } finally {
      this.prometheusCounter.inc({
        method: req.method,
        endpoint: req.path,
        status_code: res.statusCode.toString(),
      });
    }
  }
}
