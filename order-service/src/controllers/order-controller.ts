import { Request, Response } from "express";

import { CreateUserRequest, LoginUserRequest } from "../models/order-model";
import { UserService } from "../services/order-service";
import { onError, onSuccess } from "../utils/util";

const OrderController = {
  create: async (req: Request, res: Response) => {
    try {
      const createUserRequest = req.body as CreateUserRequest;
      const createUserReponse = await UserService.register(createUserRequest);

      onSuccess(res, createUserReponse, "registered", 201);
    } catch (error: any) {
      onError(res, error.message);
    }
  },
};

export { OrderController };
