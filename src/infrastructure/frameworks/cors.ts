import cors, { type CorsOptions } from "cors";

const allowedOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Permite chamadas sem Origin (healthchecks, server-to-server, curl)
    if (!origin) {
      return callback(null, true);
    }

    // Sem whitelist definida, aceita origem e facilita o uso local.
    if (allowedOrigins.length === 0) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origin not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
