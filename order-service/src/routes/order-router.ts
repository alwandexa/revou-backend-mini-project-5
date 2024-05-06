import { Router } from "express";

import { OrderController } from "../controllers/order-controller";
import { makeOrder } from "../order-service";

const orderRouter = Router();
orderRouter.post("/order/create", makeOrder);

export default orderRouter;
