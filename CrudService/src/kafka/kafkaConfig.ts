import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "crud-service",
  brokers: ["localhost:9094"],
});

export default kafka;
