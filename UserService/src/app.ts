import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { PORT } from './env/env'
import { connectProducer } from './kafka/producer'
import { authUserRoute } from './routes/userRoute'
import { startKafkaSSEConsumer } from './kafka/consumer'

const app = express()

app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(helmet())

app.use('/auth', authUserRoute)



app.listen(PORT, () => {
    connectProducer()
    startKafkaSSEConsumer()
    console.log(`Server corriendo en el puerto: ${PORT}🚀`)
})