import { NextFunction, Request, Response } from "express";
import { verifyJwtToken } from "../utils/util";

export const authMiddleware = (role: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(200).json({ message: "No token provided" });
    }

    try {
      const decoded = await verifyJwtToken(token);

      if (decoded.role === "admin") {
        next();
      } else if (decoded.role !== role) {
        return res.status(200).json({ message: "Not authorized" });
      }

      next();
    } catch (error) {
      return res.status(200).json({ message: "Invalid token" });
    }
  };
};
