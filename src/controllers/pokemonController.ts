import { Request, Response, NextFunction } from 'express'
import { pokemonService } from '../services/pokemonService'
import { PAGINATION } from '../config'
import { ErrorResponse } from '../types'

export const getPokemons = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const offset = parseInt(req.query.offset as string, 10) || 0
    const limit = Math.min(
      parseInt(req.query.limit as string, 10) || PAGINATION.DEFAULT_LIMIT,
      PAGINATION.MAX_LIMIT
    )

    const result = await pokemonService.getList(offset, limit)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const getPokemonById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10)

    if (isNaN(id) || id < 1) {
      res.status(400).json({
        error: 'Invalid Pokemon ID',
        statusCode: 400,
      } as ErrorResponse)
      return
    }

    const result = await pokemonService.getById(id)
    res.json(result)
  } catch (error) {
    next(error)
  }
}
