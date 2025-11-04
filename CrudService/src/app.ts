import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import { PORT } from './env/env'
import { connectProducer } from './kafka/producer'

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(helmet())



app.listen(PORT, () => {
    connectProducer()
    console.log(`Server corriendo en el puerto: ${PORT}🚀`)
})