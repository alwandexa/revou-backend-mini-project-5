import mysql, { Pool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool: Pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT as unknown as number,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});
