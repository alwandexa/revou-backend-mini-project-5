import { ResultSetHeader } from "mysql2";
import { pool } from "./database";

const migration = async () => {
  const query = `
  CREATE TABLE 'products' (
    'product_id' INT AUTO_INCREMENT PRIMARY KEY,
    'name' VARCHAR(100) NOT NULL,
    'description' TEXT,
    'price' INT NOT NULL,
    'stock' INT NOT NULL,
    'created_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    'updated_at' TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    'deleted_at' TIMESTAMP NULL
);
`;

  const result = await pool.query<ResultSetHeader>(query);

  console.log(result);
};

migration();
