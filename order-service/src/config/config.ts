import dotenv from "dotenv";

dotenv.config();

export const appConfig = {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "root",
  PASSWORD: process.env.DB_PASSWORD || "123456",
  DB_NAME: process.env.DB_NAME || "order_db",
  DB_PORT: process.env.DB_PORT || 3309,
  APP_PORT: process.env.APP_PORT || 3100,
  RABBITMQ_URL : process.env.RABBITMQ_URL || "",
  KAFKA_URL : process.env.KAFKA_SERVER || "",
  KAFKA_API_KEY : process.env.KAFKA_API_KEY || "",
  KAFKA_API_SECRET : process.env.KAFKA_API_SECRET || "",
  KAFKA_RESOURCE : process.env.KAFKA_RESOURCE || "",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
