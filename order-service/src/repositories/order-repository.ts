import { ResultSetHeader, RowDataPacket } from "mysql2";

import { pool } from "../lib/database";
import {
  CreateOrderRequest,
  GetOrderByIdRequest,
  UpdateOrderStatus,
} from "../models/order-model";

const OrderRepository = {
  createOrder: async (createOrderRequest: CreateOrderRequest) => {
    console.log("createOrderRequest", createOrderRequest);
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
  getOrderById: async (getOrderByIdRequest: GetOrderByIdRequest) => {
    console.log(getOrderByIdRequest);
    const query = `SELECT user_id, order_date, status, product_id, quantity FROM orders WHERE order_id = ${getOrderByIdRequest.order_id}`;
    const result = await pool.execute<RowDataPacket[]>(query);

    return result[0];
  },
  updateOrderStatus: async (updateOrderStatus: UpdateOrderStatus) => {
    const query = `UPDATE orders SET status = '${updateOrderStatus.status}' WHERE order_id = ${updateOrderStatus.order_id};`;

    const result = await pool.query<ResultSetHeader>(query);

    return result[0].insertId;
  },
};

export { OrderRepository };
