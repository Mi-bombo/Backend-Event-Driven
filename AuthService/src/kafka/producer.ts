import kafka from "./kafkaConfig";

const producer = kafka.producer();

export async function connectProducer() {
  await producer.connect();
  console.log("Kafka Producer conectado");
}

export async function sendEvent(topic: string, message: any) {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });

    console.log(`Evento enviado → ${topic}`, message);
  } catch (error) {
    console.error("Error enviando evento Kafka:", error);
  }
}
