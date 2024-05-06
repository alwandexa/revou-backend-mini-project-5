import amqp from "amqplib/callback_api";
import dayjs from "dayjs";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { PoolConnection } from "mysql2/promise";
import dotenv from "dotenv";

import { appConfig } from "../config/config";

dotenv.config();

export const getRabbitMQChannel = (
  callback: (channel: amqp.Channel) => void
) => {
  amqp.connect(appConfig.RABBITMQ_URL, (error, connection) => {
    if (error) {
      throw error;
    }
    connection.createChannel((error, channel) => {
      if (error) {
        throw error;
      }
      callback(channel);
    });
  });
};

export const generateJwtToken = (
  userId: number,
  role: string
): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const currentDate = new Date();
    const fiveMinutesLater = currentDate.setMinutes(
      currentDate.getMinutes() + 480
    );

    const payload = {
      sub: userId,
      role: role,
      exp: Math.floor(fiveMinutesLater / 1000),
    };

    jwt.sign(payload, process.env.JWT_KEYWORD as string, (err, token) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(token as string);
    });
  });
};

export const verifyJwtToken = (token: string): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    jwt.verify(token, process.env.JWT_KEYWORD as string, (err, payload) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(payload);
    });
  });
};

export const onError = (
  res: Response,
  message: string,
  connection?: PoolConnection
) => {
  if (connection) {
    connection.rollback();
    connection.release();
  }

  res.contentType("application/json");
  res.status(200);
  res.json({
    success: false,
    message: message,
    timestamp: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  });
};

export const onSuccess = (
  res: Response,
  data: any,
  message: string,
  status: number = 200,
  connection?: PoolConnection
) => {
  if (connection) {
    connection.commit();
    connection.release();
  }

  res.contentType("application/json");
  res.status(status);
  res.json({
    success: true,
    data: data,
    message: message,
    timestamp: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  });
};

export const validateRequiredKeys = (request: any, requiredKeys: string[]) => {
  for (const key of requiredKeys) {
    if (!request.hasOwnProperty(key)) {
      throw new Error(`Missing required key: ${key}`);
    }
  }
};
