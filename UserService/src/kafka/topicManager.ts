import kafka from "./kafkaConfig";

type TopicDefinition = {
  topic: string;
  numPartitions?: number;
  replicationFactor?: number;
};

export async function ensureKafkaTopics(topics: TopicDefinition[]) {
  if (!topics.length) {
    return;
  }

  const admin = kafka.admin();

  try {
    await admin.connect();

    const existingTopics = await admin.listTopics();
    const topicsToCreate = topics.filter(
      ({ topic }) => !existingTopics.includes(topic),
    );

    if (!topicsToCreate.length) {
      return;
    }

    await admin.createTopics({
      waitForLeaders: true,
      topics: topicsToCreate.map(
        ({ topic, numPartitions = 1, replicationFactor = 1 }) => ({
          topic,
          numPartitions,
          replicationFactor,
        }),
      ),
    });

    console.log(
      `Kafka topics creados: ${topicsToCreate
        .map(({ topic }) => topic)
        .join(", ")}`,
    );
  } finally {
    await admin.disconnect();
  }
}
