import { pokeApiClient } from './pokeApiClient'
import {
  PokeApiPokemonListResponse,
  PokeApiPokemonDetail,
} from './pokeApi.types'

export class PokeApiRepository {
  async getPokemonList(
    offset: number = 0,
    limit: number = 20
  ): Promise<PokeApiPokemonListResponse> {
    const { data } = await pokeApiClient.get<PokeApiPokemonListResponse>(
      '/pokemon',
      {
        params: { offset, limit },
      }
    )
    return data
  }

  async getPokemonById(id: number): Promise<PokeApiPokemonDetail> {
    const { data } = await pokeApiClient.get<PokeApiPokemonDetail>(
      `/pokemon/${id}`
    )
    return data
  }

  async getPokemonByName(name: string): Promise<PokeApiPokemonDetail> {
    const { data } = await pokeApiClient.get<PokeApiPokemonDetail>(
      `/pokemon/${name}`
    )
    return data
  }
}

export const pokeApiRepository = new PokeApiRepository()
