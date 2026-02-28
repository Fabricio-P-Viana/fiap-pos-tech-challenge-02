import {
  AuthService,
  TokenPayload,
} from "../../domain/services/AuthService.ts";

import { Request, Response, NextFunction } from "express";

export const authMiddleware = (authService: AuthService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    const payload = authService.verifyToken(token);
    if (!payload) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Adiciona usuário ao request para uso posterior
    req.user = payload;
    next();
  };
};
