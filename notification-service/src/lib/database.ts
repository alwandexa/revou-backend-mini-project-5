import mysql, { Pool } from "mysql2/promise";
import { appConfig } from "../config/config";

export const pool: Pool = mysql.createPool({
  connectionLimit: 10,
  host: appConfig.HOST,
  port: appConfig.DB_PORT as unknown as number,
  user: appConfig.USER,
  password: appConfig.PASSWORD,
  database: appConfig.DB_NAME,
});
