import { kafka } from "./client";

export const consumer = kafka.consumer({ groupId: "alwan-order" });

export const orderConsumer = async () => {
  // Producing
  await consumer.connect();

  await consumer.subscribe({
    topic: "dxg-digicamp-microservices-test",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("consumer", {
        value: message.value?.toString(),
      });
    },
  });
};
