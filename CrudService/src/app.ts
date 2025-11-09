import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors, { CorsOptions } from "cors";
import { CORS_ORIGINS, PORT } from "./env/env";
import { connectProducer } from "./kafka/producer";
import { choferRouter } from "./routes/choferRoute";
import { supervisorRouter } from "./routes/supervisorRoute";

const app = express();

const defaultOrigins = [
  "http://127.0.0.1:5173",
  "http://localhost:5173",
  "http://127.0.0.1:4173",
  "http://localhost:4173",
];

const envOrigins = (CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn(`CORS blocked origin: ${origin}`);
    return callback(new Error("Origin not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(helmet());

app.use("/chofer", choferRouter);
app.use("/supervisor", supervisorRouter);

app.listen(PORT, () => {
  connectProducer();
  console.log(`Server corriendo en el puerto: ${PORT}🚀`);
});
