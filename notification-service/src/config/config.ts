import dotenv from "dotenv";

dotenv.config();

export const appConfig = {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "root",
  PASSWORD: process.env.DB_PASSWORD || "123456",
  DB_NAME: process.env.DB_NAME || "notification_db",
  DB_PORT: process.env.DB_PORT || 3310,
  APP_PORT: process.env.APP_PORT || 3101,
  RABBITMQ_URL : process.env.RABBITMQ_URL || "amqp://localhost",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
