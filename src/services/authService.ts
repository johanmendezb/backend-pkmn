import jwt from 'jsonwebtoken'
import { env, AUTH, JWT_EXPIRY } from '../config'
import { LoginRequest, LoginResponse } from '../types'

export class AuthService {
  validateCredentials(username: string, password: string): boolean {
    return username === AUTH.USERNAME && password === AUTH.PASSWORD
  }

  generateToken(username: string): string {
    return jwt.sign({ username }, env.JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    })
  }

  verifyToken(token: string): { username: string } {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as { username: string }
      return decoded
    } catch (error) {
      throw new Error('Invalid or expired token')
    }
  }

  login(credentials: LoginRequest): LoginResponse {
    if (!this.validateCredentials(credentials.username, credentials.password)) {
      throw new Error('Invalid credentials')
    }

    const token = this.generateToken(credentials.username)

    return {
      token,
      user: {
        username: credentials.username,
      },
    }
  }
}

export const authService = new AuthService()
