import type { Request, Response, NextFunction } from "express";
import { ValidationError } from "../../domain/errors/ValidationError.ts";
import { PostNotFoundError } from "../../domain/errors/PostNotFoundError.ts";

export default function ErrorHandlerMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
    return;
  }

  if (err instanceof PostNotFoundError) {
    res.status(404).json({ error: err.message });
    return;
  }

  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
}
