import { Response, NextFunction } from 'express'
import { AuthenticatedRequest, ErrorResponse } from '../types'
import { authService } from '../services/authService'

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Authentication required',
        statusCode: 401,
      } as ErrorResponse)
      return
    }

    const token = authHeader.substring(7)
    const decoded = authService.verifyToken(token)

    req.user = { username: decoded.username }
    next()
  } catch (error) {
    res.status(401).json({
      error: error instanceof Error ? error.message : 'Invalid token',
      statusCode: 401,
    } as ErrorResponse)
  }
}
