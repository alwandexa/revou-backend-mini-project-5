import { Router } from "express";

import { OrderController } from "../controllers/order-controller";
import { authMiddleware } from "../middlewares/authorization";

const orderRouter = Router();
orderRouter.post(
  "/order/create",
  authMiddleware("user"),
  OrderController.create
);
orderRouter.post(
  "/order/create/kafka",
  authMiddleware("user"),
  OrderController.createWithKafka
);
orderRouter.post(
  "/order",
  authMiddleware("user"),
  OrderController.getOrderById
);

export default orderRouter;
