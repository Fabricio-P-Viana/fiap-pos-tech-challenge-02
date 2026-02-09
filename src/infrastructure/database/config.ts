export interface DbConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: string;
}

const config: DbConfig = {
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "postgres",
  database: process.env.DB_NAME || "blog",
  host: process.env.DB_HOST || "db",
  dialect: "postgres",
};

export default config;
