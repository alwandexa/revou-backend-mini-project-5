import { UserController } from "./user-controller";
import { CreateUserRequest, LoginUserRequest } from "../models/user-model";
import { Request, Response } from "express";
import { UserService } from "../services/user-service";
import dayjs from "dayjs";

const now: Date = new Date();
const formattedNow = dayjs(now).format("YYYY-MM-DD HH:mm:ss");

jest.mock("../services/user-service");
jest.mock("../utils/util", () => ({
  ...jest.requireActual("../utils/util"),
  onSuccess: jest.fn((res, data, message, statusCode) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: formattedNow,
    });
  }),
  onError: jest.fn((res, message) => {
    return res.status(200).json({
      success: false,
      message,
      timestamp: formattedNow,
    });
  }),
}));

describe("UserController", () => {
  describe("register", () => {
    it("should register a new user", async () => {
      const mockRequest: Partial<Request> = {
        body: {
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
          birthdate: new Date("1990-01-01"),
        } as CreateUserRequest,
      };

      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        contentType: jest.fn(),
      };

      const mockRegisterResponse = {
        user_id: 1,
      };
      (UserService.register as jest.Mock).mockResolvedValue(
        mockRegisterResponse
      );

      await UserController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "registered",
        data: {
          user_id: 1,
        },
        timestamp: formattedNow,
      });
    });

    it("should handle errors", async () => {
      const mockReq = {
        body: {
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
        } as CreateUserRequest,
      };

      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        contentType: jest.fn(),
      };

      const errorMessage = "Error registering user";

      (UserService.register as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      await UserController.register(
        mockReq as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        timestamp: formattedNow,
        message: errorMessage,
      });
    });
  });

  describe("login", () => {
    it("should login an existing user", async () => {
      const mockRequest: Partial<Request> = {
        body: {
          email: "john@example.com",
          password: "password123",
        } as LoginUserRequest,
      };

      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        contentType: jest.fn(),
      };

      const mockLoginResponse = {
        token: "asdfoij091091283980",
      };

      (UserService.login as jest.Mock).mockResolvedValue(mockLoginResponse);

      await UserController.login(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          token: mockLoginResponse.token,
        },
        message: "logged in",
        timestamp: formattedNow,
      });
    });

    it("should handle login errors", async () => {
      const mockRequest: Partial<Request> = {
        body: {
          email: "john@example.com",
          password: "wrongpassword",
        } as LoginUserRequest,
      };

      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        contentType: jest.fn(),
      };

      const errorMessage = "Invalid email or password";

      (UserService.login as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      await UserController.login(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
        timestamp: formattedNow,
      });
    });
  });
});
