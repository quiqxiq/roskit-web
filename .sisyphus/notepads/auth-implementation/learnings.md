# Learnings - Auth Implementation

## Codebase Patterns
- Zustand stores use `persist` middleware with `createJSONStorage(() => localStorage)` (see active-router-store.ts)
- TanStack Router uses file-based routing with `createFileRoute`, `createRootRouteWithContext`
- Auth API layer is already complete: service.ts has all endpoints, queries.ts has all hooks
- Auth store uses cookies for access token (getCookie/setCookie from @/lib/cookies)
- `hydrateSession()` in queries.ts sets access token + user after login — must also set refresh token
- `unwrap()` helper handles Envelope<T> pattern (throws if data is null)
- SignOutDialog uses ConfirmDialog pattern with destructive prop

## Conventions
- TDD: RED (failing test) → GREEN (minimal impl) → REFACTOR
- Cookie naming: descriptive names (not placeholders)
- Error handling: `parseAPIError()` + toast via sonner
- Navigation: `useNavigate()` from @tanstack/react-router
- State persistence: Cookies for access tokens, localStorage for non-sensitive client state
