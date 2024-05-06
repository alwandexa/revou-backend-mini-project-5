import dotenv from "dotenv";

dotenv.config();

export const appConfig = {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "root",
  PASSWORD: process.env.DB_PASSWORD || "root",
  DB: process.env.DB_NAME || "user_database",
  port: process.env.DB_PORT || 3306,
  APP_PORT: process.env.APP_PORT || 3000,
  RABBITMQ_URL : process.env.RABBITMQ_URL || "",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
