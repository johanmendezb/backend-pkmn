import { describe, it, expect, beforeEach, vi } from 'vitest'
import request from 'supertest'
import { createApp } from '../../src/app'
import { authService } from '../../src/services/authService'
import { generateValidToken, generateExpiredToken } from '../setup'

// Mock authService
vi.mock('../../src/services/authService', () => ({
  authService: {
    verifyToken: vi.fn(),
  },
}))

// Mock pokemonService to avoid actual API calls
vi.mock('../../src/services/pokemonService', () => ({
  pokemonService: {
    getList: vi.fn().mockResolvedValue({
      count: 0,
      next: null,
      previous: null,
      results: [],
    }),
    getById: vi.fn().mockResolvedValue({
      id: 1,
      name: 'test',
      image: null,
      abilities: [],
      moves: [],
      forms: [],
    }),
  },
}))

describe('AuthMiddleware', () => {
  const app = createApp()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Protected routes', () => {
    it('should allow request with valid token', async () => {
      const token = generateValidToken('admin')
      vi.mocked(authService.verifyToken).mockReturnValue({ username: 'admin' })

      const response = await request(app)
        .get('/pokemons')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(authService.verifyToken).toHaveBeenCalledWith(token)
    })

    it('should return 401 for missing token', async () => {
      const response = await request(app)
        .get('/pokemons')
        .expect(401)

      expect(response.body).toEqual({
        error: 'Authentication required',
        statusCode: 401,
      })
      expect(authService.verifyToken).not.toHaveBeenCalled()
    })

    it('should return 401 for invalid token', async () => {
      const invalidToken = 'invalid-token'
      vi.mocked(authService.verifyToken).mockImplementation(() => {
        throw new Error('Invalid or expired token')
      })

      const response = await request(app)
        .get('/pokemons')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401)

      expect(response.body).toHaveProperty('error')
      expect(response.body.statusCode).toBe(401)
      expect(authService.verifyToken).toHaveBeenCalledWith(invalidToken)
    })

    it('should return 401 for expired token', async () => {
      const expiredToken = generateExpiredToken('admin')
      vi.mocked(authService.verifyToken).mockImplementation(() => {
        throw new Error('Invalid or expired token')
      })

      const response = await request(app)
        .get('/pokemons')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401)

      expect(response.body).toHaveProperty('error')
      expect(response.body.statusCode).toBe(401)
    })

    it('should return 401 for malformed Authorization header', async () => {
      const response = await request(app)
        .get('/pokemons')
        .set('Authorization', 'InvalidFormat token')
        .expect(401)

      expect(response.body).toEqual({
        error: 'Authentication required',
        statusCode: 401,
      })
    })

    it('should return 401 when Authorization header is missing Bearer prefix', async () => {
      const response = await request(app)
        .get('/pokemons')
        .set('Authorization', 'some-token')
        .expect(401)

      expect(response.body).toEqual({
        error: 'Authentication required',
        statusCode: 401,
      })
    })
  })
})
