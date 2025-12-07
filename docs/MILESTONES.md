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
- [ ] Configure Tailwind CSS
- [ ] Set up project folder structure (feature-based)
- [ ] Configure TanStack Query provider
- [ ] Set up Zustand auth store with persistence
- [ ] Create API client (axios with interceptors)
- [ ] Implement ProtectedRoute component
- [ ] Set up app routing structure

### Milestone 4: Frontend Core Features
- [ ] **Auth Feature**
  - [ ] LoginForm component with validation
  - [ ] Login page with error handling
  - [ ] Logout functionality in Layout
- [ ] **Pokemon List Feature**
  - [ ] PokemonCard component
  - [ ] PokemonList component with grid
  - [ ] SearchBar with debounce
  - [ ] SortControls component
  - [ ] Pagination component
  - [ ] usePokemonList hook
- [ ] **Pokemon Detail Feature**
  - [ ] PokemonDetail component
  - [ ] Detail page with abilities, moves, forms
  - [ ] usePokemonDetail hook
  - [ ] Back navigation
- [ ] **Backend Integration**
  - [ ] Connect all API endpoints
  - [ ] Test full user flows manually
  - [ ] Fix any integration issues

### Milestone 5: Frontend Testing
- [ ] Configure Vitest + React Testing Library
- [ ] Create test setup and mocks
- [ ] **Unit Tests**
  - [ ] LoginForm tests
  - [ ] PokemonCard tests
  - [ ] SearchBar tests
  - [ ] Pagination tests
  - [ ] ProtectedRoute tests
- [ ] **Integration Tests**
  - [ ] Login flow integration
  - [ ] Pokemon list with search/sort
  - [ ] Navigation between list and detail

### Milestone 6: Polish
- [ ] **Backend Polish**
  - [ ] Review error messages
  - [ ] Add rate limiting (optional)
  - [ ] Optimize caching strategy
  - [ ] Remove all console.logs
- [ ] **Frontend Polish**
  - [ ] Apply Figma design tokens
  - [ ] Responsive layouts (mobile, tablet, desktop)
  - [ ] Loading skeletons
  - [ ] Error states with retry
  - [ ] Accessibility audit (focus states, aria labels)
  - [ ] Eliminate ALL console warnings
  - [ ] SEO meta tags

### Milestone 7: Deployment
- [ ] **Backend Deployment (Railway)**
  - [ ] Configure production environment
  - [ ] Set up environment variables
  - [ ] Deploy and test endpoints
- [ ] **Frontend Deployment (Vercel)**
  - [ ] Configure production environment
  - [ ] Set up environment variables
  - [ ] Deploy and test full flow
- [ ] **Documentation**
  - [ ] Update README with live URLs
  - [ ] Complete GENAI_USAGE.md
  - [ ] Final code review

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
- [ ] **Share prompts**
  - [ ] Backend
  - [ ] Frontend

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
