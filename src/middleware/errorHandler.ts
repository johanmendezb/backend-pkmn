import { Request, Response, NextFunction } from 'express'
import { AxiosError } from 'axios'
import { ErrorResponse } from '../types'

export const errorHandler = (
  err: Error | AxiosError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Handle Axios errors (from PokeAPI)
  if (err instanceof AxiosError) {
    if (err.response?.status === 404) {
      res.status(404).json({
        error: 'Pokemon not found',
        statusCode: 404,
      } as ErrorResponse)
      return
    }

    if (err.response) {
      res.status(err.response.status).json({
        error: err.response.statusText || 'External API error',
        statusCode: err.response.status,
      } as ErrorResponse)
      return
    }

    if (err.request) {
      res.status(503).json({
        error: 'External API unavailable',
        statusCode: 503,
      } as ErrorResponse)
      return
    }
  }

  // Handle authentication errors
  if (err.message === 'Invalid credentials') {
    res.status(401).json({
      error: 'Invalid credentials',
      statusCode: 401,
    } as ErrorResponse)
    return
  }

  // Handle other errors
  const statusCode = (err as Error & { statusCode?: number }).statusCode || 500
  const message = err.message || 'Internal server error'

  res.status(statusCode).json({
    error: message,
    statusCode,
  } as ErrorResponse)
}
