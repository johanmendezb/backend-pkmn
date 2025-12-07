import axios, { AxiosInstance } from 'axios'
import { env } from '../../config'

export const pokeApiClient: AxiosInstance = axios.create({
  baseURL: env.POKEAPI_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})
