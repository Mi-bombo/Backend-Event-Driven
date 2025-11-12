import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import { PORT } from './env/env'
import { connectProducer } from './kafka/producer'
import { choferRouter } from './routes/choferRoute'
import { supervisorRouter } from './routes/supervisorRoute'
import { lineaRutaRouter } from './routes/lineasRutasRoute'
import { lineasRouter } from './routes/lineasRoute'

const app = express()

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', "http://localhost:5173"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }));
app.use(morgan('dev'))
app.use(express.json())
app.use(helmet())

app.use('/chofer', choferRouter)
app.use('/supervisor', supervisorRouter)
app.use('/lineas', lineasRouter)
app.use('/lineas', lineaRutaRouter)

app.listen(PORT, () => {
    connectProducer()
    console.log(`Server corriendo en el puerto: ${PORT}🚀`)
})