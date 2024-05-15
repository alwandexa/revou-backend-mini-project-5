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
};

export { OrderService };
