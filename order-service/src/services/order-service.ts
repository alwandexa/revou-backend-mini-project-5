import { orderProducer } from "../lib/kafka/order-producer";
import { CreateOrderRequest, CreateOrderResponse } from "../models/order-model";
import { OrderRepository } from "../repositories/order-repository";
import { getRabbitMQChannel } from "../utils/util";

const OrderService = {
  createOrderRabbit: async (
    createUserRequest: CreateOrderRequest
  ): Promise<CreateOrderResponse> => {
    const createdOrderId = await OrderRepository.createOrder(createUserRequest);

    getRabbitMQChannel((channel) => {
      const queue = "inventory_check_queue";

      channel.sendToQueue(
        queue,
        Buffer.from(
          JSON.stringify({ ...createUserRequest, order_id: createdOrderId })
        )
      );
    });

    return {
      order_id: createdOrderId,
    };
  },
  createOrderKafka: async (
    createUserRequest: CreateOrderRequest
  ): Promise<CreateOrderResponse> => {
    orderProducer();

    return {
      order_id: 1,
    };
  },
  updateOrderService: () => {
    const queue = "update_order_queue";
    const exchange = "notification_exchange";

    getRabbitMQChannel((channel) => {
      // Declare a queue for receiving messages from inventory service
      channel.assertQueue(queue, { durable: true });

      // Declare an exchange for publishing notification
      channel.assertExchange(exchange, "fanout", { durable: false });

      console.log("Inventory service waiting for messages...");

      // Consume messages from inventory service
      channel.consume(
        queue,
        (message) => {
          if (message) {
            const order = JSON.parse(message.content.toString());

            OrderRepository.updateOrderStatus({
              order_id: order.order_id,
              status: order.status,
            });

            // Publish notification
            channel.publish(exchange, "", Buffer.from(JSON.stringify(order)));
            console.log("Notification sent for order:", order.order_id);
          }
        },
        { noAck: true }
      );
    });
  },
};

export { OrderService };
