import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(helmet())



app.listen(3000, () => {
    console.log(`Server corriendo en el puerto: 3000🚀`)
})