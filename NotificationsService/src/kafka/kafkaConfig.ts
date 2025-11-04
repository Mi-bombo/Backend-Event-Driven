import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "notif-service",
  brokers: ["localhost:9094"],
});

export default kafka;
