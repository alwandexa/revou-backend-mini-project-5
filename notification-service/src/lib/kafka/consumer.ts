import { kafka } from "./client";

export const kafkaConsumer = kafka.consumer({ groupId: "alwan-notification" });
