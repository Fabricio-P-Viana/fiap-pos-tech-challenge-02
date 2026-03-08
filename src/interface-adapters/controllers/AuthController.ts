import type { ReqResNextFunction } from "../types/index.ts";
import type { Login as LoginUseCase } from "../../application/auth/use-cases/index.ts";
import { LoginDTO } from "../../application/auth/dtos/LoginDTO.ts";
import * as prometheus from "prom-client";

export default class AuthController {
  private loginUseCase: LoginUseCase;
  private prometheusCounter: prometheus.Counter<string>;

  constructor(loginUseCase: LoginUseCase) {
    this.loginUseCase = loginUseCase;

    this.prometheusCounter = new prometheus.Counter({
      name: "auth_controller_requests_total",
      help: "Total number of requests to AuthController",
      labelNames: ["method", "endpoint", "status_code"],
    });
  }

  async login({ req, res, next }: ReqResNextFunction): Promise<void> {
    try {
      const dto = LoginDTO.create(req.body);
      const result = await this.loginUseCase.execute(dto);
      res.status(200).json(result);
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
