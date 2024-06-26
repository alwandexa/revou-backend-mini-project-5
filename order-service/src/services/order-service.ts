import { consumer } from "../lib/kafka/consumer";
import { kafkaProducer } from "../lib/kafka/producer";
import { CreateOrderRequest, CreateOrderResponse, GetOrderByIdRequest } from "../models/order-model";
import { OrderRepository } from "../repositories/order-repository";
import { getRabbitMQChannel } from "../utils/util";

const OrderService = {
  createOrderRabbit: async (
    createOrderRequest: CreateOrderRequest
  ): Promise<CreateOrderResponse> => {
    const createdOrderId = await OrderRepository.createOrder(
      createOrderRequest
    );

    getRabbitMQChannel((channel) => {
      const QUEUE = "inventory_check_queue";

      channel.sendToQueue(
        QUEUE,
        Buffer.from(
          JSON.stringify({ ...createOrderRequest, order_id: createdOrderId })
        )
      );
    });

    return {
      order_id: createdOrderId,
    };
  },
  createOrderKafka: async (
    createOrderRequest: CreateOrderRequest
  ): Promise<CreateOrderResponse> => {
    const createdOrderId = await OrderRepository.createOrder(
      createOrderRequest
    );

    await kafkaProducer.connect();

    await kafkaProducer.send({
      topic: "dxg-digicamp-microservices-test",
      messages: [
        {
          value: Buffer.from(
            JSON.stringify({
              owner: "alwan",
              type: "inventory_check",
              payload: { ...createOrderRequest, order_id: createdOrderId },
            })
          ),
        },
      ],
    });

    return {
      order_id: createdOrderId,
    };
  },
  updateOrderService: () => {
    const QUEUE = "update_order_queue";
    const EXCHANGE = "notification_exchange";

    getRabbitMQChannel((channel) => {
      // Declare a queue for receiving messages from inventory service
      channel.assertQueue(QUEUE, { durable: true });

      // Declare an EXCHANGE for publishing notification
      channel.assertExchange(EXCHANGE, "direct", { durable: true });

      console.log("RabbitMQ - Update Order Service waiting for messages...");

      // Consume messages from inventory service
      channel.consume(
        QUEUE,
        async (message) => {
          if (message) {
            const order = JSON.parse(message.content.toString());

            await OrderRepository.updateOrderStatus({
              order_id: order.order_id,
              status: order.status,
            });

            // Publish notification
            channel.publish(EXCHANGE, "", Buffer.from(JSON.stringify(order)));
            console.log(
              "RabbitMQ - Notification sent for order using:",
              order.order_id
            );
          }
        },
        { noAck: true }
      );
    });
  },
  updateOrderKafka: async () => {
    console.log("Kafka - Update Order Service waiting for messages...");

    await consumer.connect();

    await consumer.subscribe({
      topic: "dxg-digicamp-microservices-test",
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          if (message.value !== null) {
            console.log("message value", message.value.toString())
            const order = JSON.parse(message.value?.toString() as string) as any;
  
            if (order.owner == "alwan" && order.type == "update_order") {
              console.log("update order kafka", order);
              await OrderRepository.updateOrderStatus({
                order_id: order.payload.order_id,
                status: order.payload.status,
              });
  
              OrderService.createOrderNotificationKafka(order.payload);
              console.log(
                "Kafka - Notification sent for order ",
                order.payload.order_id
              );
            }
          }
        } catch (error) {
          console.log("updateOrderKafka error", error)
        }
      },
    });
  },
  createOrderNotificationKafka: async (params: any) => {
    await kafkaProducer.connect();

    await kafkaProducer.send({
      topic: "dxg-digicamp-microservices-test",
      messages: [
        {
          value: Buffer.from(
            JSON.stringify({
              owner: "alwan",
              type: "create_notification",
              payload: params,
            })
          ),
        },
      ],
    });
  },
  getOrderById: async (getOrderByIdRequest: GetOrderByIdRequest) => {
    const result = await OrderRepository.getOrderById(getOrderByIdRequest)

    return result;
  }
};

export { OrderService };
