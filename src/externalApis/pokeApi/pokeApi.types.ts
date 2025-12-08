export interface PokeApiPokemonListItem {
  name: string
  url: string
}

export interface PokeApiPokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokeApiPokemonListItem[]
}

export interface PokeApiAbility {
  ability: {
    name: string
    url: string
  }
  is_hidden: boolean
  slot: number
}

export interface PokeApiMove {
  move: {
    name: string
    url: string
  }
  version_group_details: Array<{
    level_learned_at: number
    move_learn_method: {
      name: string
      url: string
    }
    version_group: {
      name: string
      url: string
    }
  }>
}

export interface PokeApiForm {
  name: string
  url: string
}

export interface PokeApiType {
  slot: number
  type: {
    name: string
    url: string
  }
}

export interface PokeApiPokemonDetail {
  id: number
  name: string
  sprites: {
    front_default: string | null
    other?: {
      'official-artwork'?: {
        front_default: string | null
      }
    }
  }
  types: PokeApiType[]
  abilities: PokeApiAbility[]
  moves: PokeApiMove[]
  forms: Array<{
    name: string
    url: string
  }>
}
