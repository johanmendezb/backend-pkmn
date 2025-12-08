import { beforeAll, vi } from 'vitest'
import jwt from 'jsonwebtoken'
import {
  PokeApiPokemonListResponse,
  PokeApiPokemonDetail,
} from '../src/externalApis/pokeApi/pokeApi.types'

// Set test environment variables before any imports
process.env.PORT = '3001'
process.env.JWT_SECRET = 'test-secret-key'
process.env.POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2'
process.env.NODE_ENV = 'test'
process.env.CACHE_TTL_SECONDS = '3600'

// Helper function to generate valid JWT token
export function generateValidToken(username: string = 'admin'): string {
  return jwt.sign({ username }, process.env.JWT_SECRET!, {
    expiresIn: '24h',
  })
}

// Helper function to generate expired token
export function generateExpiredToken(username: string = 'admin'): string {
  return jwt.sign({ username }, process.env.JWT_SECRET!, {
    expiresIn: '-1h', // Expired 1 hour ago
  })
}

// Mock PokeAPI responses
export const mockPokemonListResponse: PokeApiPokemonListResponse = {
  count: 1302,
  next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
  previous: null,
  results: [
    {
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon/1/',
    },
    {
      name: 'ivysaur',
      url: 'https://pokeapi.co/api/v2/pokemon/2/',
    },
    {
      name: 'venusaur',
      url: 'https://pokeapi.co/api/v2/pokemon/3/',
    },
  ],
}

export const mockPokemonDetailResponse: PokeApiPokemonDetail = {
  id: 1,
  name: 'bulbasaur',
  sprites: {
    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    other: {
      'official-artwork': {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
      },
    },
  },
  types: [
    {
      slot: 1,
      type: {
        name: 'grass',
        url: 'https://pokeapi.co/api/v2/type/12/',
      },
    },
    {
      slot: 2,
      type: {
        name: 'poison',
        url: 'https://pokeapi.co/api/v2/type/4/',
      },
    },
  ],
  abilities: [
    {
      ability: {
        name: 'overgrow',
        url: 'https://pokeapi.co/api/v2/ability/65/',
      },
      is_hidden: false,
      slot: 1,
    },
    {
      ability: {
        name: 'chlorophyll',
        url: 'https://pokeapi.co/api/v2/ability/34/',
      },
      is_hidden: true,
      slot: 3,
    },
  ],
  moves: [
    {
      move: {
        name: 'razor-wind',
        url: 'https://pokeapi.co/api/v2/move/13/',
      },
      version_group_details: [
        {
          level_learned_at: 0,
          move_learn_method: {
            name: 'machine',
            url: 'https://pokeapi.co/api/v2/move-learn-method/4/',
          },
          version_group: {
            name: 'red-blue',
            url: 'https://pokeapi.co/api/v2/version-group/1/',
          },
        },
      ],
    },
    {
      move: {
        name: 'swords-dance',
        url: 'https://pokeapi.co/api/v2/move/14/',
      },
      version_group_details: [
        {
          level_learned_at: 0,
          move_learn_method: {
            name: 'machine',
            url: 'https://pokeapi.co/api/v2/move-learn-method/4/',
          },
          version_group: {
            name: 'red-blue',
            url: 'https://pokeapi.co/api/v2/version-group/1/',
          },
        },
      ],
    },
  ],
  forms: [
    {
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon-form/1/',
    },
  ],
}
