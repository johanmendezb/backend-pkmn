import { Request, Response, NextFunction } from 'express'
import { authService } from '../services/authService'
import { LoginRequest, ErrorResponse } from '../types'

export const login = async (
  req: Request<unknown, unknown, LoginRequest>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      res.status(400).json({
        error: 'Username and password are required',
        statusCode: 400,
      } as ErrorResponse)
      return
    }

    const result = authService.login({ username, password })
    res.json(result)
  } catch (error) {
    next(error)
  }
}
