import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { PORT } from './env/env'
import { startConsumers } from './kafka/consumer'
import { connectProducer } from './kafka/producer'
import { notifRouter } from './routes/notifRouter'


const app = express()

app.use(express.json())
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}))
app.use(morgan('dev'))
app.use(cookieParser())

app.use("/info", notifRouter)


app.listen(PORT, () => {
startConsumers()
connectProducer()
console.log(`Server corriendo en el puerto: ${PORT}🚀`)
})