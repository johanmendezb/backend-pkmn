import { Router } from 'express'
import { login } from '../controllers/authController'
import { getPokemons, getPokemonById } from '../controllers/pokemonController'
import { authMiddleware } from '../middleware/authMiddleware'

export const router = Router()

// Auth routes
router.post('/auth/login', login)

// Pokemon routes (protected)
router.get('/pokemons', authMiddleware, getPokemons)
router.get('/pokemons/:id', authMiddleware, getPokemonById)
