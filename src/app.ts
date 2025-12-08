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

  // CORS configuration
  if (env.NODE_ENV === 'development') {
    // Allow all origins in development
    app.use(cors())
  } else {
    // In production, allow specific frontend URL(s)
    const frontendUrl = process.env.FRONTEND_URL
    const allowedOrigins = frontendUrl
      ? frontendUrl.split(',').map((url) => url.trim())
      : ['http://localhost:3000']

    app.use(
      cors({
        origin: (origin, callback) => {
          // Allow requests with no origin (like mobile apps or curl requests)
          if (!origin) return callback(null, true)

          // Check if origin exactly matches an allowed origin
          if (allowedOrigins.includes(origin)) {
            callback(null, true)
          } else {
            callback(new Error('Not allowed by CORS'))
          }
        },
        credentials: true,
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
