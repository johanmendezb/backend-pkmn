# Product Requirements Document (PRD)
# Pokémon Technical Challenge - Ballast Lane

## Executive Summary

This document defines the requirements for a full-stack Pokémon application built as a technical interview exercise. The application consists of a React frontend (Next.js) and a Node.js backend that proxies the PokeAPI. The focus is on demonstrating clean architecture, testing discipline, code quality, and thoughtful technical decisions.

---

## Project Context

**Company:** Ballast Lane
**Position:** Full Stack Developer (Frontend-focused)
**Evaluation Criteria:**
1. Clean Architecture (separation of concerns, component independence)
2. Application Testing (sufficient coverage, TDD preferred)
3. Code Quality (organized, readable, best practices)
4. Functionality (works as expected, no console warnings)
5. Presentation (clear explanation of decisions)
6. GenAI Fluency (documented usage, critical thinking)

---

## Technical Stack

### Frontend
| Tool | Purpose |
|------|---------|
| Next.js 16 (App Router) | Framework, SSR, routing, middleware |
| React 19 | UI library with React Compiler |
| TypeScript | Type safety |
| Zustand | UI state only (search, sort, toggles) |
| TanStack Query v5 | Client-side data fetching (pagination, mutations) |
| js-cookie | Cookie management for auth token |
| Tailwind CSS | Styling |
| Vitest + React Testing Library | Testing |

### Backend
| Tool | Purpose |
|------|---------|
| Node.js + Express | Server framework |
| TypeScript | Type safety |
| jsonwebtoken (JWT) | Authentication tokens |
| node-cache or Map | In-memory caching |
| Vitest | Testing |

### Deployment
| Service | Target |
|---------|--------|
| Vercel | Frontend |
| Railway | Backend |

---

## Architecture Overview

### SSR-First Approach

This application uses a **hybrid SSR architecture**:

1. **Initial Load (SSR):** Server Components fetch data for SEO and fast initial render
2. **Subsequent Navigation (CSR):** React Query handles pagination, search, and mutations
3. **Auth Protection:** Next.js Middleware checks cookies at the edge

### Data Flow

| Page/Action | Where | Method | Why |
|-------------|-------|--------|-----|
| Initial Pokemon list | Server Component | `fetch` + `use` hook | SEO, fast initial load |
| Pokemon detail page | Server Component | `fetch` + `use` hook | SEO for each Pokemon |
| Pagination (next/prev) | Client Component | React Query | Fast navigation |
| Search/Filter | Client Component | React Query or local | Instant feedback |
| Login | Client Component | React Query mutation | User interaction |
| Logout | Client Component | Clear cookie + redirect | User interaction |

### Authentication Flow

```
1. User submits login form (Client Component)
2. React Query mutation calls POST /auth/login
3. Backend validates credentials, returns JWT
4. Frontend stores JWT in cookie (js-cookie)
5. Middleware sees cookie on next request → allows access
6. Server Components read cookie → fetch data with token
7. On logout: remove cookie → middleware redirects to /login
```

### Frontend Structure
```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Server: Root layout
│   ├── page.tsx                # Server: Root redirect
│   ├── login/
│   │   └── page.tsx            # Client: Login form
│   ├── pokemon/
│   │   ├── page.tsx            # Server: Prefetch list
│   │   ├── PokemonPageClient.tsx  # Client: Interactive list
│   │   └── [id]/
│   │       ├── page.tsx        # Server: Prefetch detail
│   │       └── PokemonDetailClient.tsx  # Client: If needed
│   ├── error.tsx               # Error boundary
│   └── not-found.tsx
│
├── features/                   # Feature modules
│   ├── auth/
│   │   ├── components/         # LoginForm.tsx
│   │   ├── services/           # authApi.ts (with cookie management)
│   │   └── types/              # auth.types.ts
│   │
│   └── pokemon/
│       ├── components/         # PokemonCard, PokemonList, etc.
│       ├── hooks/              # usePokemonList, usePokemonDetail
│       ├── services/           # pokemonApi.ts
│       └── types/              # pokemon.types.ts
│
├── shared/
│   ├── components/             # Button, Input, Layout, LoadingSpinner
│   ├── hooks/                  # useDebounce
│   ├── lib/                    # apiClient.ts
│   ├── stores/                 # uiStore.ts (Zustand - UI state only)
│   └── providers/              # QueryProvider.tsx
│
├── middleware.ts               # Auth protection at edge
│
└── styles/
    └── globals.css

### Backend Structure
```
src/
├── config/
│   ├── index.ts                # Main config export
│   ├── env.ts                  # Environment variables
│   ├── rateLimit.ts            # Rate limiting config
│   └── constants.ts            # App constants (pagination, cache TTL, auth)
│
├── controllers/
│   ├── authController.ts       # Login endpoint handler
│   └── pokemonController.ts    # Pokemon endpoints handler
│
├── services/
│   ├── authService.ts          # Auth business logic
│   └── pokemonService.ts       # Pokemon business logic
│
├── externalApis/
│   └── pokeApi/
│       ├── pokeApiClient.ts    # Axios instance for PokeAPI
│       ├── pokeApiRepository.ts # PokeAPI data fetching
│       └── pokeApi.types.ts    # PokeAPI response types
│
├── cache/
│   ├── inMemoryCache.ts        # Map-based cache with TTL
│   └── sqliteCache.ts          # [OPTIONAL] SQLite implementation
│
├── middleware/
│   ├── authMiddleware.ts       # JWT verification
│   ├── errorHandler.ts         # Global error handling
│   └── rateLimiter.ts          # Rate limiting
│
├── routes/
│   └── index.ts                # Route definitions
│
├── types/
│   └── index.ts                # Shared types
│
├── app.ts                      # Express app setup
└── server.ts                   # Entry point

__tests__/
├── controllers/
├── services/
├── externalApis/
└── middleware/
```

---

## Feature Requirements

### 1. Authentication

#### 1.1 Login Screen
**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "username": "admin",
  "password": "admin"
}
```

**Response (Success - 200):**
```json
{
  "token": "jwt-token-here",
  "user": {
    "username": "admin"
  }
}
```

**Response (Failure - 401):**
```json
{
  "error": "Invalid credentials"
}
```

**Frontend Requirements:**
- Username and password input fields
- Form validation:
  - Required field validation
  - Minimum length validation (optional enhancement)
- Error state display for invalid credentials
- Loading state during submission
- Redirect to `/pokemon` on success
- Store token in localStorage
- Store auth state in Zustand

#### 1.2 Protected Routes
- Unauthenticated users accessing `/pokemon` or `/pokemon/:id` → redirect to `/login`
- Authenticated users accessing `/login` → redirect to `/pokemon`
- JWT token attached to all API requests via Authorization header

#### 1.3 Session Persistence
- Token persisted in localStorage
- Zustand store rehydrates from localStorage on app load
- Logout clears token and redirects to `/login`

---

### 2. Pokemon List (Main Page)

#### 2.1 List Display
**Endpoint:** `GET /pokemons?offset=0&limit=20`

**Response:**
```json
{
  "count": 1302,
  "next": "...",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "bulbasaur",
      "image": "https://raw.githubusercontent.com/.../1.png"
    }
  ]
}
```

**Frontend Requirements:**
- Display Pokemon cards in a grid
- Each card shows: image, name, number (formatted as #001)
- Responsive grid (mobile-first, adapt for larger screens)
- Loading state with skeleton or spinner
- Error state with retry option

#### 2.2 Pagination
- Server-side pagination via offset/limit
- UI: Previous/Next buttons or page numbers
- Display current page and total count
- Disable Previous on first page, Next on last page

#### 2.3 Search
- Search input field with debounce (300ms)
- Client-side filtering of current results OR
- Search parameter sent to backend
- Clear search button
- Empty state when no results match

#### 2.4 Sorting
- Sort options: Name (A-Z, Z-A), Number (Low-High, High-Low)
- Client-side sorting of current page results
- Sort state persisted during pagination
- Visual indicator of current sort

---

### 3. Pokemon Detail

#### 3.1 Detail View
**Endpoint:** `GET /pokemons/:id`

**Response:**
```json
{
  "id": 1,
  "name": "bulbasaur",
  "image": "https://...",
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
  ],
  "types": [
    { "name": "grass" },
    { "name": "poison" }
  ],
  "stats": {
    "hp": 45,
    "attack": 49,
    "defense": 49,
    "specialAttack": 65,
    "specialDefense": 65,
    "speed": 45
  },
  "height": 7,
  "weight": 69
}
```

**Frontend Requirements:**
- Display Pokemon image prominently
- Show name and number
- Display abilities (indicate hidden abilities)
- Display moves (consider pagination or "show more" for long lists)
- Display forms
- Back navigation to list (preserve list state if possible)
- Loading and error states

---

### 4. Backend Requirements

#### 4.1 Endpoints Summary
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | /auth/login | No | Authenticate user |
| GET | /pokemons | Yes | Get paginated Pokemon list |
| GET | /pokemons/:id | Yes | Get Pokemon details |
| GET | /health | No | Health check |

#### 4.2 PokeAPI Integration
- Base URL: `https://pokeapi.co/api/v2`
- List endpoint: `/pokemon?offset=X&limit=Y`
- Detail endpoint: `/pokemon/{id}`
- Transform responses to match our API contract
- Handle PokeAPI errors gracefully

#### 4.3 Caching Strategy
- Cache PokeAPI responses in memory
- TTL: 5 minutes (configurable)
- Cache key: endpoint + params
- Log cache hits/misses for debugging

#### 4.4 Error Handling
- Consistent error response format
- Appropriate HTTP status codes
- Don't expose internal errors to client
- Log errors server-side

---

## Design Requirements

### Figma Reference
Follow the Figma design provided (mobile-first).

### Design Tokens to Extract
- Primary colors
- Typography (font family, sizes, weights)
- Spacing scale
- Border radius
- Shadows (if any)

### Responsive Breakpoints
- Mobile: < 768px (Figma design)
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## Testing Requirements

### Frontend Tests
| Component | Test Cases |
|-----------|------------|
| LoginForm | Renders inputs, validates required fields, shows errors, calls submit |
| ProtectedRoute | Redirects unauthenticated, allows authenticated |
| PokemonCard | Renders image/name/number correctly |
| PokemonList | Renders list, handles loading, handles error |
| SearchBar | Debounces input, clears search |
| Pagination | Disables buttons appropriately, navigates pages |

### Backend Tests
| Module | Test Cases |
|--------|------------|
| authController | Valid login returns token, invalid returns 401 |
| authMiddleware | Valid token passes, invalid/missing rejects |
| pokemonController | Returns paginated list, returns detail, handles not found |
| pokemonService | Transforms PokeAPI data correctly |
| cache | Sets and gets values, respects TTL |

---

## Non-Functional Requirements

### Performance
- Debounce search input (300ms)
- Cache API responses (TanStack Query + backend cache)
- Optimize images with next/image
- No unnecessary re-renders

### SEO
- Meaningful page titles
- Meta descriptions
- Semantic HTML

### Accessibility
- Form labels
- Button focus states
- Keyboard navigation
- Alt text for images

### Code Quality
- No `any` types (strict TypeScript)
- No console warnings in browser
- Consistent code formatting (Prettier)
- ESLint compliance
- Meaningful commit messages

---

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (.env)
```
PORT=3001
JWT_SECRET=your-secret-key-here
POKEAPI_BASE_URL=https://pokeapi.co/api/v2
NODE_ENV=development
CACHE_TTL_SECONDS=300
```

---
