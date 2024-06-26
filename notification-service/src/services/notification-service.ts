import { kafkaConsumer } from "../lib/kafka/consumer";
import { CreateNotification } from "../models/notification-model";
import { NotificationRepository } from "../repositories/notification-repository";
import { getRabbitMQChannel } from "../utils/util";

export const NotificationService = {
  createNotificationRabbit: () => {
    try {
      getRabbitMQChannel((channel) => {
        const EXCHANGE = "notification_exchange";

        // Declare an EXCHANGE for receiving notification
        channel.assertExchange(EXCHANGE, "direct", { durable: true });

        // Declare a queue for receiving notifications
        channel.assertQueue("", { exclusive: true }, (error, queue) => {
          if (error) {
            throw error;
          }
          console.log("Rabbit - Notification service waiting for messages...");

          channel.bindQueue(queue.queue, EXCHANGE, "");

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

                console.log(
                  "Rabbit - Notification created for order:",
                  order.order_id
                );
              }
            },
            { noAck: true }
          );
        });
      });
    } catch (error) {
      console.log("Rabbit - createNotificationRabbit error", error);
    }
  },
  createNotificationKafka: async () => {
    console.log("Kafka - Notification service waiting for messages...");

    await kafkaConsumer.connect();

    await kafkaConsumer.subscribe({
      topic: "dxg-digicamp-microservices-test",
      fromBeginning: true,
    });

    await kafkaConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          if (message.value !== null) {
            const order = JSON.parse(
              message.value?.toString() as string
            ) as any;

            if (order.owner == "alwan" && order.type == "create_notification") {
              const params = {
                order_id: order.payload.order_id,
                user_id: order.payload.user_id,
                notification_type: "push",
              } as CreateNotification;
              await NotificationRepository.createNotification(params);

              console.log(
                "Kafka - Notification created for order:",
                order.payload.order_id
              );
            }
          }
        } catch (error) {
          console.log("createNotificationKafka error", error);
        }
      },
    });
  },
};
