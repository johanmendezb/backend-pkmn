import { pokeApiRepository } from '../externalApis/pokeApi/pokeApiRepository'
import { cache } from '../cache/inMemoryCache'
import { env } from '../config'
import {
  PokeApiPokemonListResponse,
  PokeApiPokemonDetail,
} from '../externalApis/pokeApi/pokeApi.types'

export interface PokemonListItem {
  id: number
  name: string
  image: string | null
}

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokemonListItem[]
}

export interface PokemonAbility {
  name: string
  isHidden: boolean
}

export interface PokemonMove {
  name: string
}

export interface PokemonForm {
  name: string
}

export interface PokemonDetail {
  id: number
  name: string
  image: string | null
  abilities: PokemonAbility[]
  moves: PokemonMove[]
  forms: PokemonForm[]
}

export class PokemonService {
  private extractIdFromUrl(url: string): number {
    const match = url.match(/\/pokemon\/(\d+)\//)
    return match ? parseInt(match[1], 10) : 0
  }

  private transformPokemonListItem(
    item: { name: string; url: string }
  ): PokemonListItem {
    const id = this.extractIdFromUrl(item.url)
    return {
      id,
      name: item.name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    }
  }

  private transformPokemonDetail(
    data: PokeApiPokemonDetail
  ): PokemonDetail {
    return {
      id: data.id,
      name: data.name,
      image:
        data.sprites.other?.['official-artwork']?.front_default ||
        data.sprites.front_default ||
        null,
      abilities: data.abilities.map((ability) => ({
        name: ability.ability.name,
        isHidden: ability.is_hidden,
      })),
      moves: data.moves.map((move) => ({
        name: move.move.name,
      })),
      forms: data.forms.map((form) => ({
        name: form.name,
      })),
    }
  }

  async getList(offset: number = 0, limit: number = 20): Promise<PokemonListResponse> {
    const cacheKey = `pokemon-list-${offset}-${limit}`
    const cached = cache.get<PokemonListResponse>(cacheKey)

    if (cached) {
      return cached
    }

    const response = await pokeApiRepository.getPokemonList(offset, limit)

    const transformed: PokemonListResponse = {
      count: response.count,
      next: response.next,
      previous: response.previous,
      results: response.results.map((item) => this.transformPokemonListItem(item)),
    }

    cache.set(cacheKey, transformed, env.CACHE_TTL_SECONDS)
    return transformed
  }

  async getById(id: number): Promise<PokemonDetail> {
    const cacheKey = `pokemon-detail-${id}`
    const cached = cache.get<PokemonDetail>(cacheKey)

    if (cached) {
      return cached
    }

    const data = await pokeApiRepository.getPokemonById(id)
    const transformed = this.transformPokemonDetail(data)

    cache.set(cacheKey, transformed, env.CACHE_TTL_SECONDS)
    return transformed
  }
}

export const pokemonService = new PokemonService()
