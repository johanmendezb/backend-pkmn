# Pokemon API Backend

A lightweight Node.js/Express backend that proxies the PokeAPI, providing authentication and optimized endpoints for a Pokemon browser application.

## Table of Contents

- [Requirements](#requirements)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Architecture Decisions](#architecture-decisions)
- [Development Guidelines](#development-guidelines)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Requirements

### System Requirements

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | >= v20.19.4 | LTS recommended |
| npm | >= 10.8.2 | Comes with Node.js |

### Verify Installation

```bash
node --version  # Should output v20.19.4 or higher
npm --version   # Should output 10.8.2 higher
```

---

## Tech Stack

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18.2 | Web framework |
| jsonwebtoken | ^9.0.2 | JWT authentication |
| axios | ^1.6.2 | HTTP client for PokeAPI |
| cors | ^2.8.5 | Cross-origin resource sharing |
| dotenv | ^16.3.1 | Environment variables |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| typescript | ^5.3.3 | Type safety |
| vitest | ^1.1.0 | Testing framework |
| supertest | ^6.3.3 | HTTP testing |
| ts-node-dev | ^2.0.0 | Development server with hot reload |
| @types/express | ^4.17.21 | Express type definitions |
| @types/jsonwebtoken | ^9.0.5 | JWT type definitions |
| @types/cors | ^2.8.17 | CORS type definitions |
| @types/supertest | ^6.0.2 | Supertest type definitions |
| @types/node | ^20.10.5 | Node.js type definitions |

### Full package.json

```json
{
  "name": "backend-pkmn",
  "version": "1.0.0",
  "description": "Pokemon browser application backend",
  "main": "dist/server.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "vitest"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

---

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone git@github.com:johanmendezb/backend-pkmn.git
cd backend-pkmn

# Install dependencies
npm install
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your values
nano .env  # or use your preferred editor
```

### 3. Run Development Server

```bash
# Start with hot reload
npm run dev

# Server runs on http://localhost:3001
```

### 4. Verify Setup

```bash
# Health check
curl http://localhost:3001/health

# Expected response: {"status":"ok"}
```

---

## Project Structure

```
src/
├── config/                     # Configuration
│   ├── index.ts               # Main config export
│   ├── env.ts                 # Environment validation
│   └── constants.ts           # App constants
│
├── controllers/               # HTTP request handlers
│   ├── authController.ts      # Login endpoint
│   └── pokemonController.ts   # Pokemon endpoints
│
├── services/                  # Business logic
│   ├── authService.ts         # Authentication logic
│   └── pokemonService.ts      # Pokemon data logic
│
├── externalApis/              # Third-party API integrations
│   └── pokeApi/
│       ├── pokeApiClient.ts   # Axios instance
│       ├── pokeApiRepository.ts # Data fetching
│       └── pokeApi.types.ts   # Response types
│
├── cache/                     # Caching implementations
│   └── inMemoryCache.ts       # Map-based cache with TTL
│
├── middleware/                # Express middleware
│   ├── authMiddleware.ts      # JWT verification
│   └── errorHandler.ts        # Global error handling
│
├── routes/                    # Route definitions
│   └── index.ts               # All routes
│
├── types/                     # Shared TypeScript types
│   └── index.ts
│
├── app.ts                     # Express app setup
└── server.ts                  # Server entry point

__tests__/                     # Test files
├── controllers/
│   ├── authController.test.ts
│   └── pokemonController.test.ts
├── middleware/
│   └── authMiddleware.test.ts
├── services/
│   └── pokemonService.test.ts
└── setup.ts                   # Test configuration
```

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `JWT_SECRET` | Secret for JWT signing | `your-secret-key-change-in-production` |
| `POKEAPI_BASE_URL` | PokeAPI base URL | `https://pokeapi.co/api/v2` |
| `NODE_ENV` | Environment mode | `development`, `production`, or `test` |
| `CACHE_TTL_SECONDS` | Cache time-to-live in seconds | `3600` |

### .env.example

```env
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
POKEAPI_BASE_URL=https://pokeapi.co/api/v2
NODE_ENV=development
CACHE_TTL_SECONDS=3600
```

---

## API Documentation

### Base URL

- **Development:** `http://localhost:3001`
- **Production:** `https://your-app.railway.app`

### Authentication

All endpoints except `/auth/login` and `/health` require a JWT token.

**Header format:**
```
Authorization: Bearer <token>
```

---

### Endpoints

#### Health Check

```
GET /health
```

**Response (200):**
```json
{
  "status": "ok"
}
```

---

#### Login

```
POST /auth/login
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "admin"
  }
}
```

**Response (400) - Missing fields:**
```json
{
  "error": "Username and password are required",
  "statusCode": 400
}
```

**Response (401) - Invalid credentials:**
```json
{
  "error": "Invalid credentials",
  "statusCode": 401
}
```

---

#### Get Pokemon List

```
GET /pokemons
```

**Query Parameters:**
| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `offset` | number | 0 | - | Starting index |
| `limit` | number | 20 | 100 | Items per page |

**Request:**
```
GET /pokemons?offset=0&limit=20
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "count": 1302,
  "next": "https://your-api.com/pokemons?offset=20&limit=20",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "bulbasaur",
      "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
    },
    {
      "id": 2,
      "name": "ivysaur",
      "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png"
    }
  ]
}
```

**Response (401) - Unauthorized:**
```json
{
  "error": "Authentication required",
  "statusCode": 401
}
```

---

#### Get Pokemon Detail

```
GET /pokemons/:id
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Pokemon ID (1-1302+) |

**Request:**
```
GET /pokemons/1
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "name": "bulbasaur",
  "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
  "types": [
    { "name": "grass" },
    { "name": "poison" }
  ],
  "abilities": [
    { "name": "overgrow", "isHidden": false },
    { "name": "chlorophyll", "isHidden": true }
  ],
  "moves": [
    { "name": "razor-wind" },
    { "name": "swords-dance" }
  ],
  "forms": [
    { "name": "bulbasaur" }
  ]
}
```

**Response (400) - Invalid ID:**
```json
{
  "error": "Invalid Pokemon ID",
  "statusCode": 400
}
```

**Response (404) - Not Found:**
```json
{
  "error": "Pokemon not found",
  "statusCode": 404
}
```

---

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage report
npm run test:coverage

# Run tests with coverage (CI format)
npm run test:coverage:ci
```

### Test Structure

Tests follow TDD approach and are organized to mirror the source structure:

```
__tests__/
├── setup.ts                    # Global test setup
├── controllers/
│   ├── authController.test.ts  # Auth endpoint tests
│   └── pokemonController.test.ts # Pokemon endpoint tests
├── middleware/
│   └── authMiddleware.test.ts  # Auth middleware tests
└── services/
    └── pokemonService.test.ts  # Service logic tests
```

### Test Helpers

The `setup.ts` file provides helpers:

```typescript
// Generate valid JWT for tests
const token = generateValidToken('admin')

// Generate expired JWT for tests
const expiredToken = generateExpiredToken('admin')

// Mock PokeAPI responses
import { mockPokemonListResponse, mockPokemonDetailResponse } from '../__tests__/setup'
```

### Coverage Goals

| Area | Target | Status |
|------|--------|--------|
| Controllers | 90% | ✅ Met |
| Services | 95% | ✅ Met |
| Middleware | 95% | ✅ Met |

### Coverage Report

Run `npm run test:coverage` to generate a detailed coverage report. The coverage report includes:

- **Text output** in the terminal
- **HTML report** in `coverage/index.html` (open in browser for detailed view)
- **JSON report** in `coverage/coverage-summary.json` (for CI/CD integration)

**Current Coverage Summary:**
- All test suites are passing (33 tests across 4 test files)
- Controllers: Comprehensive coverage of auth and pokemon endpoints
- Services: Full coverage of business logic including transformations and caching
- Middleware: Complete coverage of authentication and error handling

To view the detailed HTML coverage report:
```bash
npm run test:coverage
open coverage/index.html  # macOS
# or
xdg-open coverage/index.html  # Linux
```

---

## Architecture Decisions

### Why Express over Fastify/Koa?

Express was chosen for its:
- Extensive ecosystem and middleware
- Widespread familiarity (easier to discuss in interview)
- Sufficient performance for this use case
- Simple learning curve for reviewers

### Why In-Memory Cache over Redis?

For this technical challenge:
- Faster setup time
- Sufficient for single-instance deployment
- Demonstrates caching pattern (easily swappable to Redis)

**Trade-off:** Cache is lost on server restart. For production, Redis would be recommended.

### Why JWT over Sessions?

- Stateless authentication (no server-side session storage)
- Works well with separate frontend deployment
- Industry standard for API authentication
- Easy to implement and validate

### Layered Architecture

```
Controller → Service → Repository → External API
     ↓           ↓
  Middleware   Cache
```

**Benefits:**
- Clear separation of concerns
- Each layer is independently testable
- Easy to swap implementations (e.g., cache strategy)
- Follows SOLID principles

---

## Development Guidelines

### Code Style

Follow TypeScript best practices and maintain consistent formatting.

### Commit Messages

Follow conventional commits:

```
feat: add pokemon search endpoint
fix: handle PokeAPI timeout errors
test: add auth middleware tests
docs: update API documentation
refactor: extract cache interface
```

### TypeScript Guidelines

- **No `any` types** - use `unknown` and narrow
- **Explicit return types** for public functions
- **Interface over type** for object shapes
- **Strict null checks** enabled

### Error Handling

All errors should go through the global error handler:

```typescript
// In controller - throw errors, don't catch
const getPokemon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pokemonService.getById(id)
    res.json(result)
  } catch (error) {
    next(error) // Let error handler deal with it
  }
}
```

### Adding New Features

1. Write tests first (TDD)
2. Create types/interfaces
3. Implement service logic
4. Create controller
5. Add route
6. Document in README

---

## Deployment

### Railway Deployment

1. **Connect Repository**
   ```
   Railway Dashboard → New Project → Deploy from GitHub
   ```

2. **Set Environment Variables**
   ```
   PORT=3001
   JWT_SECRET=<generate-secure-secret>
   NODE_ENV=production
   POKEAPI_BASE_URL=https://pokeapi.co/api/v2
   CACHE_TTL_SECONDS=3600
   FRONTEND_URL=https://frontend-pkmn.vercel.app/
   ```

   **Important:** Set `FRONTEND_URL` to your Vercel frontend URL (e.g., `https://frontend-pkmn.vercel.app`) to allow CORS requests. You can specify multiple origins separated by commas if needed.

3. **Configure Build**
   - Build Command: `npm run build`
   - Start Command: `npm start`

4. **Deploy**
   - Railway auto-deploys on push to main branch

### Generate JWT Secret

```bash
# Generate a secure random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Health Check Configuration

Configure Railway/hosting to ping `/health` endpoint for uptime monitoring.

---

## Troubleshooting

### Common Issues

#### "Cannot find module" errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

#### TypeScript compilation errors

```bash
# Clear TypeScript cache and rebuild
rm -rf dist
npm run build
```

#### Tests failing on CI but passing locally

- Check Node.js version matches
- Ensure all env variables are set
- Check for timezone-dependent tests

#### PokeAPI rate limiting

The PokeAPI has rate limits. If you see 429 errors:
- Increase cache TTL
- Add retry logic with exponential backoff
- Use the cache layer effectively

### Debug Mode

For verbose logging during development:

```bash
DEBUG=app:* npm run dev
```

### Getting Help

1. Check existing tests for usage examples
2. Review the PRD.md for requirements
3. Check PokeAPI documentation: https://pokeapi.co/docs/v2

---

## License

This project is created for a technical interview exercise.

---

## Author

[Your Name]

---

## Acknowledgments

- [PokeAPI](https://pokeapi.co/) for the Pokemon data
- Ballast Lane for the technical challenge
