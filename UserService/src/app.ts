import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { PORT } from './env/env'
import { connectProducer } from './kafka/producer'
import { authUserRoute } from './routes/userRoute'

const app = express()

app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
))
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(helmet())

app.use('/auth', authUserRoute)



app.listen(PORT, () => {
    connectProducer()
    console.log(`Server corriendo en el puerto: ${PORT}🚀`)
})