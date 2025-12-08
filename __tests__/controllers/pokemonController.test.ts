import { describe, it, expect, beforeEach, vi } from 'vitest'
import request from 'supertest'
import { createApp } from '../../src/app'
import { pokemonService } from '../../src/services/pokemonService'
import { generateValidToken } from '../setup'
import { AxiosError } from 'axios'

// Mock pokemonService
vi.mock('../../src/services/pokemonService', () => ({
  pokemonService: {
    getList: vi.fn(),
    getById: vi.fn(),
  },
}))

// Mock authService to allow authenticated requests
vi.mock('../../src/services/authService', () => ({
  authService: {
    verifyToken: vi.fn(() => ({ username: 'admin' })),
  },
}))

describe('PokemonController', () => {
  const app = createApp()
  const validToken = generateValidToken('admin')

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /pokemons', () => {
    it('should return paginated list of pokemons', async () => {
      const mockResponse = {
        count: 1302,
        next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
        previous: null,
        results: [
          { id: 1, name: 'bulbasaur', image: 'https://example.com/1.png' },
          { id: 2, name: 'ivysaur', image: 'https://example.com/2.png' },
        ],
      }

      vi.mocked(pokemonService.getList).mockResolvedValue(mockResponse)

      const response = await request(app)
        .get('/pokemons')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200)

      expect(response.body).toEqual(mockResponse)
      expect(response.body.results).toHaveLength(2)
      expect(pokemonService.getList).toHaveBeenCalledWith(0, 20, undefined)
    })

    it('should respect limit parameter', async () => {
      const mockResponse = {
        count: 1302,
        next: null,
        previous: null,
        results: [{ id: 1, name: 'bulbasaur', image: 'https://example.com/1.png' }],
      }

      vi.mocked(pokemonService.getList).mockResolvedValue(mockResponse)

      const response = await request(app)
        .get('/pokemons?limit=1')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200)

      expect(pokemonService.getList).toHaveBeenCalledWith(0, 1, undefined)
      expect(response.body.results).toHaveLength(1)
    })

    it('should respect offset parameter', async () => {
      const mockResponse = {
        count: 1302,
        next: null,
        previous: null,
        results: [],
      }

      vi.mocked(pokemonService.getList).mockResolvedValue(mockResponse)

      await request(app)
        .get('/pokemons?offset=20')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200)

      expect(pokemonService.getList).toHaveBeenCalledWith(20, 20, undefined)
    })

    it('should include id, name, and image in response', async () => {
      const mockResponse = {
        count: 1302,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            name: 'bulbasaur',
            image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
          },
        ],
      }

      vi.mocked(pokemonService.getList).mockResolvedValue(mockResponse)

      const response = await request(app)
        .get('/pokemons')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200)

      const pokemon = response.body.results[0]
      expect(pokemon).toHaveProperty('id')
      expect(pokemon).toHaveProperty('name')
      expect(pokemon).toHaveProperty('image')
      expect(pokemon.id).toBe(1)
      expect(pokemon.name).toBe('bulbasaur')
      expect(typeof pokemon.image).toBe('string')
    })

    it('should cap limit at MAX_LIMIT', async () => {
      const mockResponse = {
        count: 1302,
        next: null,
        previous: null,
        results: [],
      }

      vi.mocked(pokemonService.getList).mockResolvedValue(mockResponse)

      await request(app)
        .get('/pokemons?limit=200')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200)

      expect(pokemonService.getList).toHaveBeenCalledWith(0, 100, undefined)
    })
  })

  describe('GET /pokemons/:id', () => {
    it('should return pokemon details', async () => {
      const mockResponse = {
        id: 1,
        name: 'bulbasaur',
        image: 'https://example.com/1.png',
        types: [{ name: 'grass' }, { name: 'poison' }],
        abilities: [
          { name: 'overgrow', isHidden: false },
          { name: 'chlorophyll', isHidden: true },
        ],
        moves: [{ name: 'razor-wind' }, { name: 'swords-dance' }],
        forms: [{ name: 'bulbasaur' }],
      }

      vi.mocked(pokemonService.getById).mockResolvedValue(mockResponse)

      const response = await request(app)
        .get('/pokemons/1')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200)

      expect(response.body).toEqual(mockResponse)
      expect(pokemonService.getById).toHaveBeenCalledWith(1)
    })

    it('should return 400 for invalid id (non-numeric)', async () => {
      const response = await request(app)
        .get('/pokemons/abc')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(400)

      expect(response.body).toEqual({
        error: 'Invalid Pokemon ID',
        statusCode: 400,
      })
      expect(pokemonService.getById).not.toHaveBeenCalled()
    })

    it('should return 400 for invalid id (zero)', async () => {
      const response = await request(app)
        .get('/pokemons/0')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(400)

      expect(response.body).toEqual({
        error: 'Invalid Pokemon ID',
        statusCode: 400,
      })
      expect(pokemonService.getById).not.toHaveBeenCalled()
    })

    it('should return 400 for invalid id (negative)', async () => {
      const response = await request(app)
        .get('/pokemons/-1')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(400)

      expect(response.body).toEqual({
        error: 'Invalid Pokemon ID',
        statusCode: 400,
      })
      expect(pokemonService.getById).not.toHaveBeenCalled()
    })

    it('should return 404 for non-existent pokemon', async () => {
      const axiosError = new AxiosError('Not Found')
      axiosError.response = {
        status: 404,
        statusText: 'Not Found',
        data: {},
        headers: {},
        config: {} as any,
      }

      vi.mocked(pokemonService.getById).mockRejectedValue(axiosError)

      const response = await request(app)
        .get('/pokemons/99999')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(404)

      expect(response.body).toEqual({
        error: 'Pokemon not found',
        statusCode: 404,
      })
    })

    it('should include isHidden flag in abilities', async () => {
      const mockResponse = {
        id: 1,
        name: 'bulbasaur',
        image: 'https://example.com/1.png',
        types: [{ name: 'grass' }],
        abilities: [
          { name: 'overgrow', isHidden: false },
          { name: 'chlorophyll', isHidden: true },
        ],
        moves: [],
        forms: [],
      }

      vi.mocked(pokemonService.getById).mockResolvedValue(mockResponse)

      const response = await request(app)
        .get('/pokemons/1')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200)

      expect(response.body.abilities).toHaveLength(2)
      expect(response.body.abilities[0]).toHaveProperty('isHidden')
      expect(response.body.abilities[0].isHidden).toBe(false)
      expect(response.body.abilities[1].isHidden).toBe(true)
    })
  })
})
