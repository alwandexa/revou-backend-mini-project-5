import { ResultSetHeader } from "mysql2";
import { pool } from "./database";

const migration = async () => {
  const query = `
CREATE TABLE users (
  user_id integer PRIMARY KEY AUTO_INCREMENT,
  email varchar(255) UNIQUE,
  password varchar(255),
  name varchar(255),
  role ENUM ('admin', 'user'),
  birthdate date,
  created_at timestamp DEFAULT (now()),
  updated_at timestamp DEFAULT (now()),
  deleted_at timestamp
);
`;

  const result = await pool.query<ResultSetHeader>(query);

  console.log(result);
};

migration();
