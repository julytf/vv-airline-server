import 'module-alias/register'

import express from 'express'

import cookieParser from 'cookie-parser'
import cors from 'cors'

import router from '@/routes'

const app = express()

// app middlewares
// app.use(morgan('dev'))

app.use(cors())
app.use(cookieParser())

// app.use(express.json({ limit: '10kb' }))
// app.use(express.urlencoded({ extended: true, limit: '10kb' }))
// app.use(upload.array());

app.use(express.static(`${__dirname}/../public`))

// test
// app.use('/test', function (req, res, next) {
//   throw new Error('test error')
//   res.send('test')
// })

// router
app.use(router)

// app error handler
// app.use(errorHandler)

export default app
