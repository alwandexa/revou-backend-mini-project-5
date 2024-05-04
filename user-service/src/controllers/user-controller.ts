import { Request, Response } from "express";

import { CreateUserRequest, LoginUserRequest } from "../models/user-model";
import { UserService } from "../services/user-service";
import { onError, onSuccess } from "../utils/util";

const UserController = {
  register: async (req: Request, res: Response) => {
    try {
      const createUserRequest = req.body as CreateUserRequest;
      const createUserReponse = await UserService.register(createUserRequest);

      onSuccess(res, createUserReponse, "registered", 201);
    } catch (error: any) {
      onError(res, error.message);
    }
  },
  login: async (req: Request, res: Response) => {
    try {
      const loginUserRequest = req.body as LoginUserRequest;
      const loginUserReponse = await UserService.login(loginUserRequest);

      onSuccess(res, loginUserReponse, "logged in", 200);
    } catch (error: any) {
      onError(res, error.message);
    }
  },
};

export { UserController };
