import { Router } from "express";

import { InventoryController } from "../controllers/inventory-controller";
import { authMiddleware } from "../middlewares/authorization";

const inventoryRouter = Router();
inventoryRouter.post(
  "/inventory/create",
  authMiddleware("admin"),
  InventoryController.create
);

export default inventoryRouter;
