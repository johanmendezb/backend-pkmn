import express, { Express } from 'express'
import cors from 'cors'
import { env } from './config'
import { router } from './routes'
import { errorHandler } from './middleware/errorHandler'

export function createApp(): Express {
  const app = express()

  // Middleware
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // CORS - enable for all origins in development
  if (env.NODE_ENV === 'development') {
    app.use(cors())
  } else {
    app.use(
      cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      })
    )
  }

  // Routes
  app.use(router)

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  // Error handler (must be last)
  app.use(errorHandler)

  return app
}
