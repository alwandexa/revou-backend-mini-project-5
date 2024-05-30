import { PoolConnection } from "mysql2/promise";
import { pool } from "../lib/database";
import { kafkaConsumer } from "../lib/kafka/consumer";
import { kafkaProducer } from "../lib/kafka/producer";
import { CreateProductRequest } from "../models/inventory-model";
import { InventoryRepository } from "../repositories/inventory-repository";
import { getRabbitMQChannel } from "../utils/util";

export const InventoryService = {
  createInventory: async (
    createProductRequest: CreateProductRequest,
    connection: PoolConnection
  ) => {
    const createdProduct = await InventoryRepository.createProduct(
      createProductRequest,
      connection
    );

    return createdProduct;
  },
  getAllProducts: async () => {
    const allProducts = await InventoryRepository.getAllProducts();

    return allProducts;
  },
  checkInventoryRabbit: () => {
    const queue = "inventory_check_queue";

    getRabbitMQChannel((channel) => {
      // Declare a queue for receiving messages from order service
      channel.assertQueue(queue, { durable: true });

      console.log("Rabbit - Inventory service waiting for messages...");

      // Consume messages from order service
      channel.consume(
        queue,
        async (message) => {
          if (message) {
            const connection = await pool.getConnection();

            connection.beginTransaction();

            try {
              const order = JSON.parse(message.content.toString());
              const product = await InventoryRepository.lockProduct(
                order.product_id,
                connection
              );

              let params = {
                order_id: order.order_id,
                user_id: order.user_id,
                status: "",
              };

              if (order.quantity <= product.stock) {
                // UPDATE STATUS ORDER & REDUCE STOCK
                params.status = "done";
                const updatedStock = product.stock - order.quantity;

                await InventoryRepository.updateStock(
                  { product_id: order.product_id, stock: updatedStock },
                  connection
                );
                console.log("Order status set to Done", order);
              } else {
                // UPDATE STATUS ORDER FAILED
                params.status = "failed";
                console.log("Order status set to Failed", order);
              }

              InventoryService.updateOrderStatusRabbit(params);

              connection.commit();
              connection.release();
            } catch (error) {
              connection.rollback();
              connection.release();
            }
          }
        },
        { noAck: true }
      );
    });
  },
  checkInventoryKafka: async () => {
    console.log("Kafka - Inventory Service waiting for messages...");

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

            if (order.owner == "alwan" && order.type == "inventory_check") {
              console.log("checkInventoryKafka order", order);
              const orderData = order.payload;
              const connection = await pool.getConnection();

              await connection.beginTransaction();

              try {
                const product = await InventoryRepository.lockProduct(
                  orderData.product_id,
                  connection
                );

                let params = {
                  order_id: orderData.order_id,
                  user_id: orderData.user_id,
                  status: "",
                };

                if (orderData.quantity <= product.stock) {
                  // UPDATE STATUS ORDER & REDUCE STOCK
                  params.status = "done";
                  const updatedStock = product.stock - orderData.quantity;

                  await InventoryRepository.updateStock(
                    { product_id: orderData.product_id, stock: updatedStock },
                    connection
                  );
                  console.log("Order status set to Done", orderData);
                } else {
                  // UPDATE STATUS ORDER FAILED
                  params.status = "failed";
                  console.log("Order status set to Failed", orderData);
                }

                InventoryService.updateOrderStatusKafka(params);

                connection.commit();
                connection.release();
              } catch (error) {
                console.log("checkInventoryKafka error", error);
                connection.rollback();
                connection.release();
              }
            }
          }
        } catch (error) {
          console.log("checkInventoryKafka error", error);
        }
      },
    });
  },
  updateOrderStatusRabbit: (params: any) => {
    getRabbitMQChannel((channel) => {
      const queue = "update_order_queue";

      channel.sendToQueue(queue, Buffer.from(JSON.stringify(params)));
    });
  },
  updateOrderStatusKafka: async (params: any) => {
    await kafkaProducer.connect();

    console.log("updateOrderStatusKafka", params);

    await kafkaProducer.send({
      topic: "dxg-digicamp-microservices-test",
      messages: [
        {
          value: Buffer.from(
            JSON.stringify({
              owner: "alwan",
              type: "update_order",
              payload: { ...params },
            })
          ),
        },
      ],
    });
  },
};
