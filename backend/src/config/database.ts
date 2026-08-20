import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

const env = process.env.NODE_ENV || "development";

const db = knex({
  client: "pg",
  connection:
    env === "production"
      ? process.env.DATABASE_URL
      : {
          host: process.env.DB_HOST || "localhost",
          port: Number(process.env.DB_PORT) || 5432,
          user: process.env.DB_USER || "postgres",
          password: process.env.DB_PASSWORD || "secret",
          database: process.env.DB_NAME || "event_planning",
        },
  pool:
    env === "production"
      ? {
          min: 2,
          max: 10,
        }
      : undefined,
});

export default db;
