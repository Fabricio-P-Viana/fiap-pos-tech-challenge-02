module.exports = function AuthMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (token !== "valid-token") {
    return res.status(403).json({ error: "Invalid token" });
  }

  next();
};
