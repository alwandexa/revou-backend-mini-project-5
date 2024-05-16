import { Kafka } from "kafkajs";
import { appConfig } from "../../config/config";

export const kafka = new Kafka({
  clientId: appConfig.KAFKA_RESOURCE,
  brokers: [appConfig.KAFKA_URL],
  ssl: true,
  sasl: {
    mechanism: "plain",
    username: appConfig.KAFKA_API_KEY,
    password: appConfig.KAFKA_API_SECRET,
  },
});

