// kafkaSSEConsumer.ts
import kafka from "./kafkaConfig";
import { sendSSE } from "../services/sse.Service";

async function createConsumer(topics: string[], groupId: string) {
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();

  // Suscribirse a todos los topics
  for (const topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: false });
  }

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const value = message.value?.toString();
      if (!value) return;

      try {
        const data = JSON.parse(value);
        const userId = data.id_user;

        if (topic === "turno-creado") {
          sendSSE(userId, "turno-creado", data);
        } else if (topic === "turno-actualizado") {
          sendSSE(userId, "turno-actualizado", data);
        }
      } catch (err) {
        console.error("Error parseando mensaje Kafka:", err);
      }
    },
  });
}

export async function startKafkaSSEConsumer() {
  await createConsumer(["turno-creado", "turno-actualizado"], "auth-sse-consumer-group");
  console.log("Kafka SSE consumer corriendo...");
}
