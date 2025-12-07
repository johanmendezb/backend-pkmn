import { Router } from 'express'
import { login } from '../controllers/authController'

export const router = Router()

// Auth routes
router.post('/auth/login', login)
