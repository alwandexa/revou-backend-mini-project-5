import { Request, Response } from "express";

import { CreateOrderRequest, GetOrderByIdRequest } from "../models/order-model";
import { OrderService } from "../services/order-service";
import { onError, onSuccess } from "../utils/util";

const OrderController = {
  create: async (req: Request, res: Response) => {
    try {
      const createOrderRequest = req.body as CreateOrderRequest;
      const createOrderReponse = await OrderService.createOrderRabbit(
        createOrderRequest
      );

      onSuccess(res, createOrderReponse, "processed", 200);
    } catch (error: any) {
      onError(res, error.message);
    }
  },
  createWithKafka: async (req: Request, res: Response) => {
    try {
      const createOrderRequest = req.body as CreateOrderRequest;
      const createOrderReponse = await OrderService.createOrderKafka(
        createOrderRequest
      );

      onSuccess(res, createOrderReponse, "processed", 200);
    } catch (error: any) {
      onError(res, error.message);
    }
  },
  getOrderById: async (req: Request, res:Response) => {
    try {
      const getOrderRequest = req.body as GetOrderByIdRequest;
      const order = await OrderService.getOrderById(
        getOrderRequest
      );

      onSuccess(res, order, "fetched", 200);
    } catch (error: any) {
      onError(res, error.message);
    }
  }
};

export { OrderController };
