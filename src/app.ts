import express from 'express'
import dotenv from 'dotenv'
import { deployRouter } from './routes/deploy.routes'

const app = express()

app.use(express.json())

dotenv.config()

app.listen(process.env.PORT, ()=>{
    console.log(`[⚡️INFO⚡️] Server Listening on PORT ${process.env.PORT}`)
})

app.use('/deploy', deployRouter)
