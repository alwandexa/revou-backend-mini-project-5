import { Request, Response } from "express";

import { CreateProductRequest } from "../models/inventory-model";
import { InventoryService } from "../services/inventory-service";
import { onError, onSuccess } from "../utils/util";
import { pool } from "../lib/database";

const InventoryController = {
  create: async (req: Request, res: Response) => {
    const connection = await pool.getConnection();

    try {
      const createOrderRequest = req.body as CreateProductRequest;
      const createOrderReponse = await InventoryService.createInventory(
        createOrderRequest, connection
      );

      onSuccess(res, createOrderReponse, "created", 201, connection);
    } catch (error: any) {
      onError(res, error.message, connection);
    }
  },
  getAllProducts: async (req: Request, res: Response) => {
    try {
      const allProducts = await InventoryService.getAllProducts();

      onSuccess(res, allProducts, "fetched", 200);
    } catch (error: any) {
      onError(res, error.message);
    }
  },
};

export { InventoryController };
