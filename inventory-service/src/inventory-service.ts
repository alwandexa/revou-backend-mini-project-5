import { getRabbitMQChannel } from "./utils/util";

export const inventoryService = () => {
  const queue = "inventory_check_queue";
  const exchange = "notification_exchange";

  getRabbitMQChannel((channel) => {
    // Declare a queue for receiving messages from order service
    channel.assertQueue(queue, { durable: true });

    // Declare an exchange for publishing notification
    channel.assertExchange(exchange, "fanout", { durable: false });

    console.log("Inventory service waiting for messages...");

    // Consume messages from order service
    channel.consume(
      queue,
      (message) => {
        if (message) {
          const order = JSON.parse(message.content.toString());
          // Simulate checking inventory
          const isAvailable = checkInventory(order);
          if (isAvailable) {
            // Publish notification
            channel.publish(exchange, "", Buffer.from(JSON.stringify(order)));
            console.log("Notification sent for order:", order);
          } else {
            console.log("Inventory insufficient for order:", order);
          }
        }
      },
      { noAck: true }
    );
  });
};

const checkInventory = (order: any) => {
  if (order) return true;
};

inventoryService();
