import kafka from "./kafkaConfig";
import { NotificationsService } from "../services/notifications.service";
const notificationsService = new NotificationsService();

async function createConsumer(topic: string, groupId: string) {
    const consumer = kafka.consumer({ groupId });
    await consumer.connect();

    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const value = message.value?.toString();

            try {
                const data = JSON.parse(value || "{}");
                if (topic === "user_registered") {
                    notificationsService.sendEmail(
                        data.email,
                        "Bienvenido a Nuestra Plataforma",
                        `<h1>Hola ${data.nombre}, bienvenido a nuestra plataforma!</h1><p>Gracias por registrarte.</p>`
                    );
                } else if (topic === "notifications_sent") {
                    console.log("Notificaciones enviadas");

                    for (const e of data.emails) {
                        const email = e.email
                        await notificationsService.sendEmail(
                            email,
                            data.subject,
                            `<h1>${data.message}</h1>`
                        );
                    }
                }
            } catch (err) {
                console.error("Error parseando el mensaje:", err);
            }
        },
    });
}

export async function startConsumers() {
    await createConsumer("user_registered", "notification-user-registered-group");
    await createConsumer("notifications_sent", "notification-sent-group");
}
