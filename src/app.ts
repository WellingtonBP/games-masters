import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { connect } from 'mongoose'
import dotenv from 'dotenv'

import routes from './routes'
import { CustomError } from './types'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

app.use(routes)

app.use((req, res, next) => {
  const notFoundError: CustomError = new Error()
  notFoundError.customMessage = 'Not Found'
  notFoundError.status = 404
  next(notFoundError)
})

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.log(err)
  res.status(err.status || 500).json({
    error: err.customMessage || 'Something went wrong'
  })
})

connect(process.env.MONGO_URI!, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  app.listen(process.env.PORT || 3000, () => console.log('Server Running'))
})
