# Test Cases
# Pokémon Technical Challenge

## Overview

This document contains test cases for both frontend and backend testing. Tests are organized by feature and include unit tests, integration tests, and component tests.

**Testing Stack:**
- Frontend: Vitest + React Testing Library + @testing-library/jest-dom
- Backend: Vitest + Supertest

---

## Frontend Test Cases

### 1. Authentication Feature

#### 1.1 LoginForm Component

```typescript
// __tests__/features/auth/components/LoginForm.test.tsx

describe('LoginForm', () => {
  // Rendering Tests
  describe('rendering', () => {
    it('should render username input field')
    it('should render password input field')
    it('should render login button')
    it('should have password field with type="password"')
    it('should have proper labels for accessibility')
  })

  // Validation Tests
  describe('validation', () => {
    it('should show error when username is empty on submit')
    it('should show error when password is empty on submit')
    it('should show both errors when both fields are empty')
    it('should clear validation error when user starts typing')
    it('should not submit form when validation fails')
  })

  // Submission Tests
  describe('submission', () => {
    it('should call onSubmit with username and password')
    it('should show loading state during submission')
    it('should disable button during submission')
    it('should clear password field after failed submission')
  })

  // Error Handling Tests
  describe('error handling', () => {
    it('should display API error message')
    it('should allow retry after error')
  })

  // Accessibility Tests
  describe('accessibility', () => {
    it('should have no accessibility violations')
    it('should support keyboard navigation')
    it('should announce errors to screen readers')
  })
})
```

**Sample Test Implementation:**
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { vi } from 'vitest'

describe('LoginForm', () => {
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render username and password inputs', () => {
    render(<LoginForm onSubmit={mockOnSubmit} />)
    
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('should show error when username is empty on submit', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={mockOnSubmit} />)
    
    await user.click(screen.getByRole('button', { name: /login/i }))
    
    expect(screen.getByText(/username is required/i)).toBeInTheDocument()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('should call onSubmit with credentials', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={mockOnSubmit} />)
    
    await user.type(screen.getByLabelText(/username/i), 'admin')
    await user.type(screen.getByLabelText(/password/i), 'admin')
    await user.click(screen.getByRole('button', { name: /login/i }))
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      username: 'admin',
      password: 'admin'
    })
  })

  it('should show loading state during submission', async () => {
    mockOnSubmit.mockImplementation(() => new Promise(() => {})) // Never resolves
    const user = userEvent.setup()
    render(<LoginForm onSubmit={mockOnSubmit} />)
    
    await user.type(screen.getByLabelText(/username/i), 'admin')
    await user.type(screen.getByLabelText(/password/i), 'admin')
    await user.click(screen.getByRole('button', { name: /login/i }))
    
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should display API error message', async () => {
    render(<LoginForm onSubmit={mockOnSubmit} error="Invalid credentials" />)
    
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
  })
})
```

---

#### 1.2 useAuth Hook

```typescript
// __tests__/features/auth/hooks/useAuth.test.tsx

describe('useAuth', () => {
  describe('login', () => {
    it('should set token and user on successful login')
    it('should set isAuthenticated to true on success')
    it('should throw error on invalid credentials')
    it('should store token in localStorage')
  })

  describe('logout', () => {
    it('should clear token and user')
    it('should set isAuthenticated to false')
    it('should remove token from localStorage')
  })

  describe('initialization', () => {
    it('should restore auth state from localStorage')
    it('should handle missing localStorage data')
    it('should handle corrupted localStorage data')
  })
})
```

---

#### 1.3 ProtectedRoute Component

```typescript
// __tests__/shared/components/ProtectedRoute.test.tsx

describe('ProtectedRoute', () => {
  it('should render children when authenticated')
  it('should redirect to /login when not authenticated')
  it('should show loading state while checking auth')
  it('should preserve intended destination for redirect back')
})
```

**Sample Test Implementation:**
```typescript
import { render, screen } from '@testing-library/react'
import { ProtectedRoute } from '@/shared/components/ProtectedRoute'
import { useAuthStore } from '@/features/auth/store/authStore'

// Mock the auth store
vi.mock('@/features/auth/store/authStore')

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/pokemon'
}))

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render children when authenticated', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      isLoading: false
    })

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('should redirect to /login when not authenticated', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: false,
      isLoading: false
    })

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(mockPush).toHaveBeenCalledWith('/login')
  })
})
```

---

### 2. Pokemon Feature

#### 2.1 PokemonCard Component

```typescript
// __tests__/features/pokemon/components/PokemonCard.test.tsx

describe('PokemonCard', () => {
  const mockPokemon = {
    id: 1,
    name: 'bulbasaur',
    image: 'https://example.com/bulbasaur.png'
  }

  describe('rendering', () => {
    it('should render pokemon image')
    it('should render pokemon name capitalized')
    it('should render pokemon number formatted as #001')
    it('should have alt text for image')
  })

  describe('interaction', () => {
    it('should call onClick when clicked')
    it('should be keyboard accessible')
    it('should have hover state')
  })

  describe('edge cases', () => {
    it('should handle missing image gracefully')
    it('should handle long pokemon names')
    it('should handle number > 999')
  })
})
```

**Sample Test Implementation:**
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PokemonCard } from '@/features/pokemon/components/PokemonCard'

describe('PokemonCard', () => {
  const mockPokemon = {
    id: 1,
    name: 'bulbasaur',
    image: 'https://example.com/bulbasaur.png'
  }
  const mockOnClick = vi.fn()

  it('should render pokemon name capitalized', () => {
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)
    
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
  })

  it('should render pokemon number formatted as #001', () => {
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)
    
    expect(screen.getByText('#001')).toBeInTheDocument()
  })

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup()
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)
    
    await user.click(screen.getByRole('article'))
    
    expect(mockOnClick).toHaveBeenCalledWith(1)
  })

  it('should handle number > 999', () => {
    const pokemon = { ...mockPokemon, id: 1025 }
    render(<PokemonCard pokemon={pokemon} onClick={mockOnClick} />)
    
    expect(screen.getByText('#1025')).toBeInTheDocument()
  })
})
```

---

#### 2.2 PokemonList Component

```typescript
// __tests__/features/pokemon/components/PokemonList.test.tsx

describe('PokemonList', () => {
  describe('rendering', () => {
    it('should render grid of pokemon cards')
    it('should render correct number of cards')
    it('should render loading skeleton when loading')
    it('should render error state with retry button')
    it('should render empty state when no pokemon')
  })

  describe('interaction', () => {
    it('should navigate to detail page on card click')
    it('should call retry function on error retry click')
  })

  describe('responsive', () => {
    it('should show 2 columns on mobile')
    it('should show 4 columns on desktop')
  })
})
```

---

#### 2.3 SearchBar Component

```typescript
// __tests__/features/pokemon/components/SearchBar.test.tsx

describe('SearchBar', () => {
  describe('rendering', () => {
    it('should render search input')
    it('should render search icon')
    it('should render clear button when has value')
    it('should not render clear button when empty')
  })

  describe('debouncing', () => {
    it('should not call onSearch immediately on type')
    it('should call onSearch after debounce delay')
    it('should only call onSearch once for rapid typing')
  })

  describe('clearing', () => {
    it('should clear input on clear button click')
    it('should call onSearch with empty string on clear')
  })
})
```

**Sample Test Implementation:**
```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from '@/features/pokemon/components/SearchBar'

describe('SearchBar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should debounce search calls', async () => {
    const mockOnSearch = vi.fn()
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    
    render(<SearchBar onSearch={mockOnSearch} debounceMs={300} />)
    
    await user.type(screen.getByRole('textbox'), 'pika')
    
    expect(mockOnSearch).not.toHaveBeenCalled()
    
    vi.advanceTimersByTime(300)
    
    expect(mockOnSearch).toHaveBeenCalledWith('pika')
    expect(mockOnSearch).toHaveBeenCalledTimes(1)
  })
})
```

---

#### 2.4 Pagination Component

```typescript
// __tests__/features/pokemon/components/Pagination.test.tsx

describe('Pagination', () => {
  describe('rendering', () => {
    it('should render previous and next buttons')
    it('should render current page and total')
    it('should disable previous on first page')
    it('should disable next on last page')
  })

  describe('navigation', () => {
    it('should call onPrevious when previous clicked')
    it('should call onNext when next clicked')
  })

  describe('edge cases', () => {
    it('should handle single page')
    it('should handle zero total')
  })
})
```

---

#### 2.5 SortControls Component

```typescript
// __tests__/features/pokemon/components/SortControls.test.tsx

describe('SortControls', () => {
  describe('rendering', () => {
    it('should render sort dropdown or buttons')
    it('should show current sort option as selected')
  })

  describe('sorting', () => {
    it('should call onSort with "name-asc" option')
    it('should call onSort with "name-desc" option')
    it('should call onSort with "number-asc" option')
    it('should call onSort with "number-desc" option')
  })
})
```

---

#### 2.6 usePokemonList Hook

```typescript
// __tests__/features/pokemon/hooks/usePokemonList.test.tsx

describe('usePokemonList', () => {
  describe('fetching', () => {
    it('should fetch pokemon list on mount')
    it('should return loading state while fetching')
    it('should return data on success')
    it('should return error on failure')
  })

  describe('pagination', () => {
    it('should fetch with correct offset and limit')
    it('should update when page changes')
  })

  describe('caching', () => {
    it('should use cached data on subsequent calls')
    it('should refetch when cache is stale')
  })
})
```

---

#### 2.7 PokemonDetail Page

```typescript
// __tests__/features/pokemon/components/PokemonDetail.test.tsx

describe('PokemonDetail', () => {
  describe('rendering', () => {
    it('should render pokemon image')
    it('should render pokemon name and number')
    it('should render abilities list')
    it('should indicate hidden abilities')
    it('should render moves list')
    it('should render forms')
  })

  describe('loading', () => {
    it('should show loading state')
  })

  describe('error', () => {
    it('should show error for non-existent pokemon')
    it('should show retry button')
  })

  describe('navigation', () => {
    it('should render back button')
    it('should navigate back on click')
  })
})
```

---

### 3. Shared Components

#### 3.1 Button Component

```typescript
// __tests__/shared/components/Button.test.tsx

describe('Button', () => {
  it('should render children')
  it('should call onClick when clicked')
  it('should be disabled when disabled prop is true')
  it('should show loading spinner when loading')
  it('should apply variant styles correctly')
  it('should support different sizes')
})
```

---

#### 3.2 Input Component

```typescript
// __tests__/shared/components/Input.test.tsx

describe('Input', () => {
  it('should render with label')
  it('should show error message when error prop provided')
  it('should apply error styles when error')
  it('should forward ref correctly')
  it('should support different types')
})
```

---

### 4. Integration Tests

#### 4.1 Login Flow

```typescript
// __tests__/integration/loginFlow.test.tsx

describe('Login Flow Integration', () => {
  it('should complete full login flow', async () => {
    // 1. Render app at /login
    // 2. Fill in credentials
    // 3. Submit form
    // 4. Verify redirect to /pokemon
    // 5. Verify auth state is set
  })

  it('should handle invalid credentials flow', async () => {
    // 1. Render app at /login
    // 2. Fill in wrong credentials
    // 3. Submit form
    // 4. Verify error message displayed
    // 5. Verify still on login page
  })

  it('should redirect unauthenticated user to login', async () => {
    // 1. Render app at /pokemon
    // 2. Verify redirect to /login
  })
})
```

---

## Backend Test Cases

### 1. Auth Controller

```typescript
// __tests__/controllers/authController.test.ts

describe('AuthController', () => {
  describe('POST /auth/login', () => {
    it('should return 200 and token for valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'admin', password: 'admin' })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('token')
      expect(response.body).toHaveProperty('user')
      expect(response.body.user.username).toBe('admin')
    })

    it('should return 401 for invalid username', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'wrong', password: 'admin' })

      expect(response.status).toBe(401)
      expect(response.body).toHaveProperty('error')
    })

    it('should return 401 for invalid password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'admin', password: 'wrong' })

      expect(response.status).toBe(401)
    })

    it('should return 400 for missing username', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ password: 'admin' })

      expect(response.status).toBe(400)
    })

    it('should return 400 for missing password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'admin' })

      expect(response.status).toBe(400)
    })

    it('should return valid JWT token', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'admin', password: 'admin' })

      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET!)
      expect(decoded).toHaveProperty('username', 'admin')
    })
  })
})
```

---

### 2. Auth Middleware

```typescript
// __tests__/middleware/authMiddleware.test.ts

describe('AuthMiddleware', () => {
  it('should allow request with valid token', async () => {
    const token = generateValidToken()

    const response = await request(app)
      .get('/pokemons')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).not.toBe(401)
  })

  it('should reject request without token', async () => {
    const response = await request(app)
      .get('/pokemons')

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('No token provided')
  })

  it('should reject request with invalid token', async () => {
    const response = await request(app)
      .get('/pokemons')
      .set('Authorization', 'Bearer invalid-token')

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Invalid token')
  })

  it('should reject request with expired token', async () => {
    const token = generateExpiredToken()
    
    const response = await request(app)
      .get('/pokemons')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(401)
  })

  it('should reject request with malformed Authorization header', async () => {
    const response = await request(app)
      .get('/pokemons')
      .set('Authorization', 'NotBearer token')

    expect(response.status).toBe(401)
  })
})
```

---

### 3. Pokemon Controller

```typescript
// __tests__/controllers/pokemonController.test.ts

describe('PokemonController', () => {
  const validToken = generateValidToken()

  describe('GET /pokemons', () => {
    it('should return paginated pokemon list', async () => {
      const response = await request(app)
        .get('/pokemons')
        .set('Authorization', `Bearer ${validToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('count')
      expect(response.body).toHaveProperty('results')
      expect(Array.isArray(response.body.results)).toBe(true)
    })

    it('should respect limit parameter', async () => {
      const response = await request(app)
        .get('/pokemons?limit=10')
        .set('Authorization', `Bearer ${validToken}`)

      expect(response.body.results.length).toBeLessThanOrEqual(10)
    })

    it('should respect offset parameter', async () => {
      const response = await request(app)
        .get('/pokemons?offset=20')
        .set('Authorization', `Bearer ${validToken}`)

      expect(response.status).toBe(200)
      // Verify first pokemon is not #1
    })

    it('should return pokemon with id, name, and image', async () => {
      const response = await request(app)
        .get('/pokemons?limit=1')
        .set('Authorization', `Bearer ${validToken}`)

      const pokemon = response.body.results[0]
      expect(pokemon).toHaveProperty('id')
      expect(pokemon).toHaveProperty('name')
      expect(pokemon).toHaveProperty('image')
    })

    it('should handle invalid limit gracefully', async () => {
      const response = await request(app)
        .get('/pokemons?limit=-1')
        .set('Authorization', `Bearer ${validToken}`)

      expect(response.status).toBe(400)
    })
  })

  describe('GET /pokemons/:id', () => {
    it('should return pokemon details', async () => {
      const response = await request(app)
        .get('/pokemons/1')
        .set('Authorization', `Bearer ${validToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id', 1)
      expect(response.body).toHaveProperty('name')
      expect(response.body).toHaveProperty('abilities')
      expect(response.body).toHaveProperty('moves')
      expect(response.body).toHaveProperty('forms')
    })

    it('should return 404 for non-existent pokemon', async () => {
      const response = await request(app)
        .get('/pokemons/99999')
        .set('Authorization', `Bearer ${validToken}`)

      expect(response.status).toBe(404)
    })

    it('should return 400 for invalid id', async () => {
      const response = await request(app)
        .get('/pokemons/invalid')
        .set('Authorization', `Bearer ${validToken}`)

      expect(response.status).toBe(400)
    })

    it('should return abilities with hidden flag', async () => {
      const response = await request(app)
        .get('/pokemons/1')
        .set('Authorization', `Bearer ${validToken}`)

      const abilities = response.body.abilities
      expect(abilities[0]).toHaveProperty('name')
      expect(abilities[0]).toHaveProperty('isHidden')
    })
  })
})
```

---

### 4. Pokemon Service

```typescript
// __tests__/services/pokemonService.test.ts

describe('PokemonService', () => {
  describe('getList', () => {
    it('should transform PokeAPI response correctly')
    it('should add image URLs to results')
    it('should extract pokemon ID from URL')
  })

  describe('getById', () => {
    it('should transform pokemon detail correctly')
    it('should map abilities with hidden flag')
    it('should map moves correctly')
    it('should map forms correctly')
  })

  describe('caching', () => {
    it('should cache list responses')
    it('should cache detail responses')
    it('should return cached data on subsequent calls')
  })
})
```

---

### 5. Cache Service

```typescript
// __tests__/cache/inMemoryCache.test.ts

describe('InMemoryCache', () => {
  describe('set and get', () => {
    it('should store and retrieve value')
    it('should return undefined for missing key')
  })

  describe('TTL', () => {
    it('should return value before TTL expires')
    it('should return undefined after TTL expires')
  })

  describe('delete', () => {
    it('should remove value from cache')
  })

  describe('clear', () => {
    it('should remove all values from cache')
  })
})
```

---

### 6. PokeAPI Repository

```typescript
// __tests__/externalApis/pokeApiRepository.test.ts

describe('PokeApiRepository', () => {
  describe('fetchList', () => {
    it('should call PokeAPI with correct parameters')
    it('should handle API errors gracefully')
    it('should timeout after configured duration')
  })

  describe('fetchById', () => {
    it('should call PokeAPI with correct ID')
    it('should handle 404 from PokeAPI')
    it('should handle network errors')
  })
})
```

---

## Test Coverage Goals

| Area | Target Coverage |
|------|-----------------|
| Frontend Components | 80% |
| Frontend Hooks | 90% |
| Frontend Services | 90% |
| Backend Controllers | 90% |
| Backend Services | 95% |
| Backend Middleware | 95% |

---

## Running Tests

### Frontend
```bash
cd frontend
npm run test           # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # With coverage
```

### Backend
```bash
cd backend
npm run test           # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # With coverage
```

---

## Test Utilities

### Frontend Test Setup
```typescript
// __tests__/setup.ts
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn()
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams()
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />
}))
```

### Backend Test Setup
```typescript
// __tests__/setup.ts
import { vi } from 'vitest'

// Set test environment variables
process.env.JWT_SECRET = 'test-secret'
process.env.NODE_ENV = 'test'

// Helper to generate valid token
export function generateValidToken() {
  return jwt.sign({ username: 'admin' }, process.env.JWT_SECRET!, { expiresIn: '1h' })
}

// Helper to generate expired token
export function generateExpiredToken() {
  return jwt.sign({ username: 'admin' }, process.env.JWT_SECRET!, { expiresIn: '-1h' })
}
```
