import { Request, Response } from "express";
import { getRabbitMQChannel } from "./utils/util";

export function makeOrder(req: Request, res: Response) {
  const order = req.body;

  try {
    getRabbitMQChannel((channel) => {
      const queue = "inventory_check_queue";

      channel.sendToQueue(queue, Buffer.from(JSON.stringify(order)));
    });
  } catch (error) {}
}

// trial
