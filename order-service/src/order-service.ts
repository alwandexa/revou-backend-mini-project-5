// order-service.ts
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import amqp from "amqplib/callback_api";
import { getRabbitMQChannel } from "./utils/util";

const app = express();
const PORT = process.env.PORT || 3100;

export function makeOrder(req: Request, res: Response) {
  const order = req.body;
  getRabbitMQChannel((channel) => {
    const queue = 'inventory_check_queue';
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(order)));
    res.send('Order placed successfully!');
  });
}

export function inventoryService() {
  getRabbitMQChannel((channel) => {
    // Your inventory service logic here
  });
}

export function notificationService() {
  getRabbitMQChannel((channel) => {
    // Your notification service logic here
  });
}

app.use(bodyParser.json());

// RabbitMQ connection URL
const rabbitMQUrl = "amqp://localhost";

// Establish connection to RabbitMQ
amqp.connect(rabbitMQUrl, (error, connection) => {
  if (error) {
    throw error;
  }
  // Create a channel
  connection.createChannel((error, channel) => {
    if (error) {
      throw error;
    }
    const queue = "inventory_check_queue";

    app.post("/order", (req: Request, res: Response) => {
      const order = req.body;
      // Simulate checking inventory
      // Assuming inventory service listens to 'inventory_check_queue'
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(order)));
      res.send("Order placed successfully!");
    });

    app.listen(PORT, () => {
      console.log(`Order service running on port ${PORT}`);
    });
  });
});
