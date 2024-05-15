import { ResultSetHeader } from "mysql2";

import { pool } from "../lib/database";
import { CreateOrderRequest } from "../models/order-model";

const OrderRepository = {
  createOrder: async (createOrderRequest: CreateOrderRequest) => {
    const query = `INSERT INTO orders(user_id, order_date, status, product_id, quantity) VALUES (:user_id, now(), 'processing', :product_id, :quantity)`;

    const result = await pool.query<ResultSetHeader>(query, createOrderRequest);

    return result[0].insertId;
  },
};

export { OrderRepository };
