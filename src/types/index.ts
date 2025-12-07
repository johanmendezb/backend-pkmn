import { Request } from 'express'

export interface AuthenticatedRequest extends Request {
  user?: {
    username: string
  }
}

export interface ErrorResponse {
  error: string
  statusCode: number
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    username: string
  }
}
