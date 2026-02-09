import type { Request, Response, NextFunction } from "express";

export default function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (token !== "valid-token") {
    res.status(403).json({ error: "Invalid token" });
    return;
  }

  next();
}
