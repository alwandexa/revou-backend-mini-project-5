import { getRabbitMQChannel } from "./utils/util";

export const notificationService = () => {
  getRabbitMQChannel((channel) => {
    // Declare a queue for receiving messages from order servic
    const exchange = "notification_exchange";

    // Declare an exchange for receiving notification
    channel.assertExchange(exchange, "fanout", { durable: false });

    // Declare a queue for receiving notifications
    channel.assertQueue("", { exclusive: true }, (error, queue) => {
      if (error) {
        throw error;
      }
      console.log("Notification service waiting for messages...");

      // Bind queue to exchange
      channel.bindQueue(queue.queue, exchange, "");

      // Consume messages from inventory service
      channel.consume(
        queue.queue,
        (message) => {
          if (message) {
            const order = JSON.parse(message.content.toString());
            console.log("Notification received for order:", order);
          }
        },
        { noAck: true }
      );
    });
  });
};


notificationService();
