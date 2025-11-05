# Arquitectura Event-Driven con Kafka (Microservicios)

Este repositorio muestra un ejemplo de arquitectura orientada a eventos usando Node.js + TypeScript, Docker y Kafka. Está pensado como referencia para microservicios que se comunican de forma asíncrona mediante topics de Kafka.

Resumen rápido
- Paradigma: Event-Driven
- Broker: Kafka
- Stack de ejemplo: Node.js, TypeScript, Docker Compose, nodemailer

## Descripción

Los servicios publican eventos (producers) y otros servicios los consumen (consumers). Esto reduce el acoplamiento, facilita la escalabilidad y permite construir pipelines de procesamiento asíncrono.

## Servicios en este ejemplo

- UserService: gestione usuarios y publica eventos (ej. USER_CREATED).
- CrudService: ejemplo de servicio que expone operaciones CRUD.
- NotificationsService: escucha eventos (p. ej. USER_CREATED) y envía notificaciones.

## Estructura del proyecto (resumen)

EVENT-DRIVEN/
- CrudService/
  - src/
    - controllers/
    - db/
    - env/
    - interface/
    - kafka/
    - middleware/
    - repositories/
    - routes/
    - services/
    - utils/
  - app.ts
- NotificationsService/
  - src/
    - controllers/
    - db/
    - env/
    - kafka/
    - repositories/
    - routes/
    - services/
    - utils/
  - app.ts
- UserService/
  - src/
    - controllers/
    - db/
    - env/
    - interfaces/
    - kafka/
    - middlewares/
    - repositories/
    - routes/
    - services/
    - utils/
  - app.ts
  - .env
  - docker-compose.yml
  - package.json
  - tsconfig.json

Adapta la organización interna de cada servicio según tus convenciones.

## Flujo de eventos (ejemplo)

1. UserService crea un usuario.
2. UserService publica el evento USER_CREATED en Kafka.
3. NotificationsService (consumer) recibe el evento y procesa la notificación.

Diagrama simplificado:

UserService ──► Kafka Topic "USER_CREATED" ──► NotificationsService

## Ejemplos de código (conceptuales)

Emitir evento (producer):

```ts
await kafkaProducer.send({
  topic: 'USER_CREATED',
  messages: [{ value: JSON.stringify({ id, name, email }) }]
});
```

Consumir evento (consumer):

```ts
await kafkaConsumer.subscribe({ topic: 'USER_CREATED' });

await kafkaConsumer.run({
  eachMessage: async ({ message }) => {
    const user = JSON.parse(message.value.toString());
    // lógica de notificación
    console.log(`Notificación enviada a: ${user.email}`);
  }
});
```

## Cómo levantar el entorno (orientativo)

Usando Docker Compose (suponiendo `docker-compose.yml` presente en la raíz de cada servicio o en la raíz monorepo):

```bash
docker compose up --build
```

Esto suele levantar al menos:

- Kafka
- Cada microservicio definido en el compose

Si prefieres ejecutar localmente sin Docker, arranca Kafka y ejecuta cada servicio con `npm run dev` o `npx ts-node`.

## Requisitos y suposiciones

- Node.js >= 16
- Docker & Docker Compose instalados (si vas a usar contenedores)
- Kafka (si no se arranca por Compose, necesitarás un cluster accesible)

## Beneficios de este enfoque

- Desacoplamiento entre servicios
- Escalabilidad horizontal sencilla
- Tolerancia a fallos por diseño (consumers desacoplados)
- Posibilidad de auditoría y replay si se persisten eventos

## Siguientes mejoras recomendadas

- Añadir un Event Store para persistencia y replay de eventos.
- Implementar DLQ (Dead Letter Queue) para mensajes no procesables.
- Añadir observabilidad: Prometheus + Grafana + tracing (OpenTelemetry).
- Implementar reintentos y backoff en consumers.
- Asegurar comunicación entre servicios (mTLS / JWT según necesidad).

