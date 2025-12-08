## Milestones

### Milestone 1: Backend Foundation
- [x] Add project documentation
- [x] Initialize Node.js + Express + TypeScript project
- [x] Configure ESLint, Prettier, tsconfig
- [x] Set up project folder structure
- [x] Configure environment variables (dotenv)
- [x] Set up Vitest for testing (TDD approach)
- [x] Create test setup file with helpers

### Milestone 2: Backend Core Features - TDD
- [x] **Auth Feature**
  - [x] Write tests for authController (login endpoint)
  - [x] Write tests for authMiddleware (JWT verification)
  - [x] Implement authService and authController
  - [x] Implement authMiddleware
- [x] **Pokemon Feature**
  - [x] Write tests for pokemonController
  - [x] Write tests for pokemonService
  - [x] Implement pokeApiRepository (external API integration)
  - [x] Implement pokemonService with caching
  - [x] Implement pokemonController
- [x] **Infrastructure**
  - [x] Implement inMemoryCache with TTL
  - [x] Implement global error handler
  - [x] Add request logging (optional)

### Milestone 3: Frontend Foundation
- [x] Add project documentation
- [x] Initialize Next.js 16 + TypeScript project
- [x] Configure Tailwind CSS
- [x] Set up project folder structure (feature-based)
- [x] Configure TanStack Query provider
- [x] Set up Zustand auth store with persistence
- [x] Create API client (axios with interceptors)
- [x] Implement ProtectedRoute component
- [x] Set up app routing structure

### Milestone 4: Frontend Core Features
- [x] **Auth Feature**
  - [x] LoginForm component with validation
  - [x] Login page with error handling
  - [x] Logout functionality in Layout
- [x] **Pokemon List Feature**
  - [x] PokemonCard component
  - [x] PokemonList component with grid
  - [x] SearchBar with debounce
  - [x] SortControls component
  - [x] Pagination component
  - [x] usePokemonList hook
- [x] **Pokemon Detail Feature**
  - [x] PokemonDetail component
  - [x] Detail page with abilities, moves, forms
  - [x] usePokemonDetail hook
  - [x] Back navigation
- [x] **Backend Integration**
  - [x] Connect all API endpoints
  - [x] Test full user flows manually
  - [x] Fix any integration issues

### Milestone 5: Frontend Testing
- [x] Configure Vitest + React Testing Library
- [x] Create test setup and mocks
- [x] **Unit Tests**
  - [x] LoginForm tests
  - [x] PokemonCard tests
  - [x] SearchBar tests
  - [x] Pagination tests
  - [x] ProtectedRoute tests
- [x] **Integration Tests**
  - [x] Login flow integration
  - [x] Pokemon list with search/sort
  - [x] Navigation between list and detail

### Milestone 6: Polish
- [x] **Backend Polish**
  - [x] Review error messages
  - [x] Add rate limiting (optional)
  - [x] Optimize caching strategy
  - [x] Remove all console.logs
- [x] **Frontend Polish**
  - [x] Apply Figma design tokens
  - [x] Responsive layouts (mobile, tablet, desktop)
  - [x] Loading skeletons
  - [x] Error states with retry
  - [x] Accessibility audit (focus states, aria labels)
  - [x] Eliminate ALL console warnings
  - [x] SEO meta tags

### Milestone 7: Deployment
- [x] **Backend Deployment (Railway)**
  - [x] Configure production environment
  - [x] Set up environment variables
  - [x] Deploy and test endpoints
- [x] **Frontend Deployment (Vercel)**
  - [x] Configure production environment
  - [x] Set up environment variables
  - [x] Deploy and test full flow
- [x] **Documentation**
  - [x] Update README with live URLs
  - [x] Complete GENAI_USAGE.md
  - [x] Final code review

### Milestone 8: Optional Enhancements
- [ ] **CI/CD Pipeline**
  - [ ] GitHub Actions for backend (lint, test, deploy)
  - [ ] GitHub Actions for frontend (lint, test, deploy)
  - [ ] Branch protection rules
- [ ] **Extra Features (if time)**
  - [ ] SQLite cache implementation
  - [ ] E2E tests with Playwright
  - [ ] Error boundary component
  - [ ] Skeleton loaders
- [ ] **Presentation Prep**
  - [ ] Practice demo flow
  - [ ] Prepare architecture walkthrough
  - [ ] Anticipate technical questions

-### Milestone 9: Add GEN_AI.md
- [x] **Share prompts**
  - [x] Backend
  - [x] Frontend

---

## Success Criteria

1. ✅ User can log in with admin/admin
2. ✅ Invalid credentials show error
3. ✅ Routes are protected
4. ✅ Pokemon list displays with images, names, numbers
5. ✅ Pagination works correctly
6. ✅ Search filters results
7. ✅ Sort orders results
8. ✅ Detail page shows abilities, moves, forms
9. ✅ No console warnings or errors
10. ✅ Tests pass
11. ✅ Deployed and accessible via URLs
12. ✅ README documents setup and architecture
13. ✅ GenAI usage documented

---

## Out of Scope

- Full authentication (registration, password reset, etc.)
- Production database
- SSR/ISR (using Next.js as SPA)
- E2E tests (nice to have if time)
- Favorites/Teams features
- Offline support

---
