import { ResultSetHeader } from "mysql2";

import { pool } from "../lib/database";
import { CheckStockRequest } from "../models/inventory-model";

const InventoryRepository = {
  lockProduct: async (product_id :number) => {
    const query = ``;

    const result = await pool.query<ResultSetHeader>(query, {
      product_id: product_id,
    });

    return result[0].insertId;
  },
  checkStock: async (checkStockRequest: CheckStockRequest) => {
    const query = ``;

    const result = await pool.query<ResultSetHeader>(query, checkStockRequest);

    return result[0].insertId;
  },
};

export { InventoryRepository };
