import { Router } from "express";

import { InventoryController } from "../controllers/inventory-controller";
import { authMiddleware } from "../middlewares/authorization";

const inventoryRouter = Router();

inventoryRouter.post(
  "/inventory/create",
  authMiddleware("admin"),
  InventoryController.create
);
inventoryRouter.get(
  "/inventory",
  InventoryController.getAllProducts
);

export default inventoryRouter;
