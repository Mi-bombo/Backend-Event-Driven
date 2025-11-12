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
                } else if (topic === "lineas-asignadas") {
                    // Evento enviado cuando un supervisor asigna líneas a un chofer
                    // Payload esperado: { chofer: { id, nombre, email? }, lineas: [{id,nombre}, ...], timestamp }
                    console.log("Evento lineas-asignadas recibido:", data);
                    try {
                        const choferEmail = data?.chofer?.email;
                        const nombre = data?.chofer?.nombre || `Chofer ${data?.chofer?.id || ''}`;
                        const lineas = Array.isArray(data?.lineas) ? data.lineas : [];
                        const lista = lineas.map((l: any) => `- ${l.nombre || l.id}`).join("<br/>");
                        const subject = `Asignación de líneas para ${nombre}`;
                        const message = `<p>Hola ${nombre},</p><p>Se te han asignado las siguientes líneas:</p><p>${lista || 'Sin líneas'}</p><p>Fecha: ${data?.timestamp || new Date().toISOString()}</p>`;

                        if (choferEmail) {
                            await notificationsService.sendEmail(choferEmail, subject, message);
                            console.log(`Email enviado a ${choferEmail} sobre lineas-asignadas`);
                        } else {
                            console.log("No hay email de chofer en el payload, no se envía correo.");
                        }
                    } catch (err) {
                        console.error("Error manejando lineas-asignadas:", err);
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
    await createConsumer("lineas-asignadas", "notification-lineas-group");
}
