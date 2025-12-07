import { describe, it, expect, beforeEach, vi } from 'vitest'
import request from 'supertest'
import { createApp } from '../../src/app'
import { authService } from '../../src/services/authService'

// Mock authService
vi.mock('../../src/services/authService', () => ({
  authService: {
    login: vi.fn(),
  },
}))

describe('AuthController', () => {
  const app = createApp()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /auth/login', () => {
    it('should return 200 with token and user for valid credentials', async () => {
      const mockResponse = {
        token: 'valid-jwt-token',
        user: { username: 'admin' },
      }

      vi.mocked(authService.login).mockReturnValue(mockResponse)

      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'admin', password: 'admin' })
        .expect(200)

      expect(response.body).toEqual(mockResponse)
      expect(response.body.token).toBeDefined()
      expect(response.body.user.username).toBe('admin')
      expect(authService.login).toHaveBeenCalledWith({
        username: 'admin',
        password: 'admin',
      })
    })

    it('should return 401 for invalid username', async () => {
      vi.mocked(authService.login).mockImplementation(() => {
        throw new Error('Invalid credentials')
      })

      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'wrong', password: 'admin' })
        .expect(401)

      expect(response.body).toHaveProperty('error')
      expect(response.body.statusCode).toBe(401)
    })

    it('should return 401 for invalid password', async () => {
      vi.mocked(authService.login).mockImplementation(() => {
        throw new Error('Invalid credentials')
      })

      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'admin', password: 'wrong' })
        .expect(401)

      expect(response.body).toHaveProperty('error')
      expect(response.body.statusCode).toBe(401)
    })

    it('should return 400 for missing username', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ password: 'admin' })
        .expect(400)

      expect(response.body).toEqual({
        error: 'Username and password are required',
        statusCode: 400,
      })
      expect(authService.login).not.toHaveBeenCalled()
    })

    it('should return 400 for missing password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'admin' })
        .expect(400)

      expect(response.body).toEqual({
        error: 'Username and password are required',
        statusCode: 400,
      })
      expect(authService.login).not.toHaveBeenCalled()
    })

    it('should return valid JWT token', async () => {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      const mockResponse = {
        token: mockToken,
        user: { username: 'admin' },
      }

      vi.mocked(authService.login).mockReturnValue(mockResponse)

      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'admin', password: 'admin' })
        .expect(200)

      // JWT tokens have 3 parts separated by dots
      const tokenParts = response.body.token.split('.')
      expect(tokenParts).toHaveLength(3)
      expect(response.body.token).toBe(mockToken)
    })
  })
})
