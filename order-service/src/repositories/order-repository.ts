import { ResultSetHeader } from "mysql2";

import { pool } from "../lib/database";
import { CreateOrderRequest } from "../models/order-model";

const OrderRepository = {
  createOrder: async (createOrderRequest: CreateOrderRequest) => {
    console.log("createOrderRequest", createOrderRequest)
    const query = `INSERT
    INTO
    orders(
      user_id,
      order_date,
      status,
      product_id,
      quantity
    )
  VALUES (
    ${createOrderRequest.user_id},
    now(),
    'processing',
    ${createOrderRequest.product_id},
    ${createOrderRequest.quantity}
  )`;

    const result = await pool.query<ResultSetHeader>(query);

    return result[0].insertId;
  },
};

export { OrderRepository };
