module.exports = {
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "postgres",
  database: process.env.DB_NAME || "blog",
  host: process.env.DB_HOST || "db",
  dialect: "postgres",
};
