import { kafka } from "./client";

const producer = kafka.producer();
// producer.connect();

producer.on("producer.connect", () => {
  console.log(`KafkaProvider: connected`);
});

producer.on("producer.disconnect", () => {
  console.log(`KafkaProvider: could not connect`);
});

producer.on("producer.network.request_timeout", (payload) => {
  // console.log(`KafkaProvider: request timeout ${payload}`);
});

export const orderProducer = async () => {
  // Producing
  await producer.send({
    topic: "dxg-digicamp-microservices-test",
    messages: [
      {
        value: Buffer.from(
          JSON.stringify({
            owner: "alwan",
            payload: {
              order_id: 1,
              product_id: 1,
              quantity: 2,
            },
          })
        ),
      },
    ],
  });
};
