import type { Request, Response, NextFunction } from "express";

export default function ErrorHandlerMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
}
