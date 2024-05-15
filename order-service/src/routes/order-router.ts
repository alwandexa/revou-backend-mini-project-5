import { Router } from "express";

import { OrderController } from "../controllers/order-controller";

const orderRouter = Router();
orderRouter.post("/order/create", OrderController.create);
orderRouter.post("/order/create/kafka", OrderController.createWithKafka);

export default orderRouter;
