import { pool } from "../lib/database";
import { InventoryRepository } from "../repositories/inventory-repository";
import { getRabbitMQChannel } from "../utils/util";

export const InventoryService = {
  checkInventoryService: () => {
    const queue = "inventory_check_queue";

    getRabbitMQChannel((channel) => {
      // Declare a queue for receiving messages from order service
      channel.assertQueue(queue, { durable: true });

      console.log("Inventory service waiting for messages...");

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

              InventoryService.updateOrderStatus(params);

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
  updateOrderStatus: (params: any) => {
    getRabbitMQChannel((channel) => {
      const queue = "update_order_queue";

      channel.sendToQueue(queue, Buffer.from(JSON.stringify(params)));
    });
  },
  checkInventory: (order: any) => {
    if (order) return true;
  },
};
