import { describe, it, expect, beforeEach, vi } from 'vitest'
import { PokemonService } from '../../src/services/pokemonService'
import { pokeApiRepository } from '../../src/externalApis/pokeApi/pokeApiRepository'
import { cache } from '../../src/cache/inMemoryCache'
import {
  mockPokemonListResponse,
  mockPokemonDetailResponse,
} from '../setup'

// Mock the repository
vi.mock('../../src/externalApis/pokeApi/pokeApiRepository', () => ({
  pokeApiRepository: {
    getPokemonList: vi.fn(),
    getPokemonById: vi.fn(),
  },
}))

// Mock cache
vi.mock('../../src/cache/inMemoryCache', () => ({
  cache: {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    clear: vi.fn(),
  },
}))

describe('PokemonService', () => {
  let pokemonService: PokemonService

  beforeEach(() => {
    pokemonService = new PokemonService()
    vi.clearAllMocks()
    cache.clear()
  })

  describe('getList', () => {
    it('should transform PokeAPI list response correctly', async () => {
      vi.mocked(cache.get).mockReturnValue(null)
      vi.mocked(pokeApiRepository.getPokemonList).mockResolvedValue(
        mockPokemonListResponse
      )

      const result = await pokemonService.getList(0, 20)

      expect(result.count).toBe(1302)
      expect(result.next).toBe('https://pokeapi.co/api/v2/pokemon?offset=20&limit=20')
      expect(result.previous).toBeNull()
      expect(result.results).toHaveLength(3)

      // Check transformation
      expect(result.results[0]).toEqual({
        id: 1,
        name: 'bulbasaur',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
      })
      expect(result.results[1]).toEqual({
        id: 2,
        name: 'ivysaur',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png',
      })
      expect(result.results[2]).toEqual({
        id: 3,
        name: 'venusaur',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png',
      })
    })

    it('should use cached data when available', async () => {
      const cachedData = {
        count: 1302,
        next: null,
        previous: null,
        results: [{ id: 1, name: 'bulbasaur', image: 'https://example.com/1.png' }],
      }

      vi.mocked(cache.get).mockReturnValue(cachedData)

      const result = await pokemonService.getList(0, 20)

      expect(result).toEqual(cachedData)
      expect(pokeApiRepository.getPokemonList).not.toHaveBeenCalled()
      expect(cache.get).toHaveBeenCalledWith('pokemon-list-0-20')
    })

    it('should cache the result after fetching', async () => {
      vi.mocked(cache.get).mockReturnValue(null)
      vi.mocked(pokeApiRepository.getPokemonList).mockResolvedValue(
        mockPokemonListResponse
      )

      await pokemonService.getList(0, 20)

      expect(cache.set).toHaveBeenCalledWith(
        'pokemon-list-0-20',
        expect.objectContaining({
          count: 1302,
          results: expect.any(Array),
        }),
        3600
      )
    })
  })

  describe('getById', () => {
    it('should transform PokeAPI detail response correctly', async () => {
      vi.mocked(cache.get).mockReturnValue(null)
      vi.mocked(pokeApiRepository.getPokemonById).mockResolvedValue(
        mockPokemonDetailResponse
      )

      const result = await pokemonService.getById(1)

      expect(result.id).toBe(1)
      expect(result.name).toBe('bulbasaur')
      expect(result.image).toBe(
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
      )

      // Check types transformation
      expect(result.types).toHaveLength(2)
      expect(result.types[0]).toEqual({ name: 'grass' })
      expect(result.types[1]).toEqual({ name: 'poison' })

      // Check abilities transformation
      expect(result.abilities).toHaveLength(2)
      expect(result.abilities[0]).toEqual({
        name: 'overgrow',
        isHidden: false,
      })
      expect(result.abilities[1]).toEqual({
        name: 'chlorophyll',
        isHidden: true,
      })

      // Check moves transformation
      expect(result.moves).toHaveLength(2)
      expect(result.moves[0]).toEqual({ name: 'razor-wind' })
      expect(result.moves[1]).toEqual({ name: 'swords-dance' })

      // Check forms transformation
      expect(result.forms).toHaveLength(1)
      expect(result.forms[0]).toEqual({ name: 'bulbasaur' })
    })

    it('should transform types correctly', async () => {
      const mockResponse = {
        ...mockPokemonDetailResponse,
        types: [
          {
            slot: 1,
            type: {
              name: 'fire',
              url: 'https://pokeapi.co/api/v2/type/10/',
            },
          },
          {
            slot: 2,
            type: {
              name: 'flying',
              url: 'https://pokeapi.co/api/v2/type/3/',
            },
          },
        ],
      }

      vi.mocked(cache.get).mockReturnValue(null)
      vi.mocked(pokeApiRepository.getPokemonById).mockResolvedValue(mockResponse)

      const result = await pokemonService.getById(1)

      expect(result.types).toHaveLength(2)
      expect(result.types[0]).toEqual({ name: 'fire' })
      expect(result.types[1]).toEqual({ name: 'flying' })
    })

    it('should use official-artwork image when available', async () => {
      const mockResponse = {
        ...mockPokemonDetailResponse,
        sprites: {
          front_default: 'https://example.com/default.png',
          other: {
            'official-artwork': {
              front_default: 'https://example.com/official.png',
            },
          },
        },
      }

      vi.mocked(cache.get).mockReturnValue(null)
      vi.mocked(pokeApiRepository.getPokemonById).mockResolvedValue(mockResponse)

      const result = await pokemonService.getById(1)

      expect(result.image).toBe('https://example.com/official.png')
    })

    it('should fallback to front_default when official-artwork is not available', async () => {
      const mockResponse = {
        ...mockPokemonDetailResponse,
        sprites: {
          front_default: 'https://example.com/default.png',
        },
      }

      vi.mocked(cache.get).mockReturnValue(null)
      vi.mocked(pokeApiRepository.getPokemonById).mockResolvedValue(mockResponse)

      const result = await pokemonService.getById(1)

      expect(result.image).toBe('https://example.com/default.png')
    })

    it('should return null image when no sprites available', async () => {
      const mockResponse = {
        ...mockPokemonDetailResponse,
        sprites: {
          front_default: null,
        },
      }

      vi.mocked(cache.get).mockReturnValue(null)
      vi.mocked(pokeApiRepository.getPokemonById).mockResolvedValue(mockResponse)

      const result = await pokemonService.getById(1)

      expect(result.image).toBeNull()
    })

    it('should use cached data when available', async () => {
      const cachedData = {
        id: 1,
        name: 'bulbasaur',
        image: 'https://example.com/1.png',
        types: [],
        abilities: [],
        moves: [],
        forms: [],
      }

      vi.mocked(cache.get).mockReturnValue(cachedData)

      const result = await pokemonService.getById(1)

      expect(result).toEqual(cachedData)
      expect(pokeApiRepository.getPokemonById).not.toHaveBeenCalled()
      expect(cache.get).toHaveBeenCalledWith('pokemon-detail-1')
    })

    it('should cache the result after fetching', async () => {
      vi.mocked(cache.get).mockReturnValue(null)
      vi.mocked(pokeApiRepository.getPokemonById).mockResolvedValue(
        mockPokemonDetailResponse
      )

      await pokemonService.getById(1)

      expect(cache.set).toHaveBeenCalledWith(
        'pokemon-detail-1',
        expect.objectContaining({
          id: 1,
          name: 'bulbasaur',
        }),
        3600
      )
    })
  })
})
