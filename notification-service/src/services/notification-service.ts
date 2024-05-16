import { CreateNotification } from "../models/notification-model";
import { NotificationRepository } from "../repositories/notification-repository";
import { getRabbitMQChannel } from "../utils/util";

export const NotificationService = {
  createNotificationRabbit: () => {
    try{
      getRabbitMQChannel((channel) => {
        const exchange = "notification_exchange";
  
        // Declare an exchange for receiving notification
        channel.assertExchange(exchange, "direct", { durable: true });
  
        // Declare a queue for receiving notifications
        channel.assertQueue("", { exclusive: true }, (error, queue) => {
          if (error) {
            throw error;
          }
          console.log("Notification service waiting for messages...");
  
          // Bind queue to exchange
          channel.bindQueue(queue.queue, exchange, "");
  
          // Consume messages from order service
          channel.consume(
            queue.queue,
            async (message) => {
              if (message) {
                const order = JSON.parse(message.content.toString());
  
                const params = {
                  order_id: order.order_id,
                  user_id: order.user_id,
                  notification_type: "push",
                } as CreateNotification;
                await NotificationRepository.createNotification(params);
  
                console.log("Notification created for order:", order.order_id);
              }
            },
            { noAck: true }
          );
        });
      });
    } catch (error) {
      console.log("createNotificationRabbit error", error)
    }
  },
};
