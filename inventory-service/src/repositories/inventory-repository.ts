import { RowDataPacket } from "mysql2";

import { PoolConnection } from "mysql2/promise";
import {
  GetProduct,
  InventoryModel,
  UpdateStock,
} from "../models/inventory-model";

const InventoryRepository = {
  lockProduct: async (product_id: number, connection: PoolConnection) => {
    const query = `SELECT product_id, name, description, price, stock FROM products WHERE product_id = ${product_id} FOR UPDATE;`;

    const [rows] = await connection.query<RowDataPacket[]>(query);

    return rows[0] as InventoryModel;
  },
  getProduct: async (getProduct: GetProduct, connection: PoolConnection) => {
    const query = `SELECT product_id, name, description, price, stock FROM products WHERE product_id = ${getProduct.product_id};`;

    const [rows] = await connection.query<RowDataPacket[]>(query);

    return rows[0];
  },
  updateStock: async (updateStock: UpdateStock, connection: PoolConnection) => {
    const query = `UPDATE products SET stock = ${updateStock.stock} WHERE product_id = ${updateStock.product_id};`;

    const [rows] = await connection.query<RowDataPacket[]>(query);

    return rows[0];
  },
};

export { InventoryRepository };

