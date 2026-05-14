# Auth Implementation: Route Guards, Real Login, Token Refresh

## TL;DR

> **Quick Summary**: Wire up real authentication in Roskit Web — add route guards so unauthenticated users are redirected to sign-in, replace mock login with real API calls, implement token refresh, and fix sign-out to call the server.
>
> **Deliverables**:
> - Auth guard on `_authenticated` route (beforeLoad + redirect)
> - Real sign-in form using `useLogin()` hook
> - Auto token refresh via Axios interceptor
> - Auth context in TanStack Router for guard access
> - Proper sign-out using `useLogout()` API
> - Refresh token storage in auth-store
> - Setup detection (redirect to /sign-in if no users exist)
> - "Coming Soon" badges on forgot-password/OTP
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES — 3 waves
> **Critical Path**: Task 1 → Task 2 → Task 5 → Task 6

---

## Context

### Original Request
Sign-in/auth is not properly implemented — the app goes directly to the dashboard without requiring login. The sign-in form uses mock data (`sleep(2000)`, `mock-access-token`).

### Interview Summary
**Key Discussions**:
- Sign-up: Backend only has `/auth/setup` (one-shot first admin). Decided to disable sign-up link, no setup page.
- Token storage: Access token in cookie (current pattern), refresh token in Zustand persist with localStorage.
- Testing: TDD approach — write tests first, then implement.
- Unimplemented pages (forgot-password, OTP): Keep with mock, add "coming soon" badge.

**Research Findings**:
- TanStack Router provides `beforeLoad` + `throw redirect()` pattern for auth guards
- The API layer (`service.ts`, `queries.ts`, `schema.ts`) is already complete and working
- Auth store only stores `accessToken` — needs `refreshToken` field added
- `main.tsx` has 401 handler that resets auth + redirects, but doesn't attempt refresh first
- SignOutDialog only calls `auth.reset()` locally, doesn't call `useLogout()` API

### Metis Review
**Identified Gaps** (addressed):
- Cookie name `thisisjustarandomstring` is a placeholder — will replace with proper name
- Flash of unauthenticated content (FOUC) — will handle with loading state in beforeLoad
- Password validation mismatch (form min 7 vs backend min 1) — backend is lenient, form is strict (acceptable)
- ProfileDropdown has hardcoded user — will wire to auth store
- Test mocks need updating after auth-store shape changes

---

## Work Objectives

### Core Objective
Implement complete authentication flow so users must sign in before accessing protected routes, with real API integration, token refresh, and proper sign-out.

### Concrete Deliverables
- Route guard that redirects unauthenticated users to `/sign-in`
- Sign-in form calling real `/auth/login` endpoint via `useLogin()` hook
- Auto token refresh when access token expires
- Sign-out calling `/auth/logout` API
- Auth context accessible in TanStack Router `beforeLoad`
- Refresh token persisted alongside access token

### Definition of Done
- [ ] Navigating to any `/` route without auth redirects to `/sign-in`
- [ ] Signing in with valid credentials navigates to dashboard
- [ ] Signing in with invalid credentials shows error toast
- [ ] Expired access token triggers transparent refresh
- [ ] Failed refresh redirects to `/sign-in`
- [ ] Sign-out calls `/auth/logout` API and clears local state
- [ ] Protected routes never flash unauthenticated content
- [ ] All auth tests pass (`pnpm test`)

### Must Have
- Route guard on `_authenticated` route
- Real login via `useLogin()` hook replacing mock
- Token refresh via Axios response interceptor
- Sign-out via `useLogout()` API call
- Refresh token added to auth-store
- Auth context in TanStack Router

### Must NOT Have (Guardrails)
- NO new sign-up/registration page (backend doesn't support it)
- NO changes to the sign-in form's visual design
- NO removal of forgot-password/OTP pages (just add "coming soon")
- NO changes to the existing API endpoint paths
- NO httpOnly cookies (SPA cannot set them — backend must do that)
- NO storing sensitive tokens in URL params

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES (Vitest + Playwright browser mode)
- **Automated tests**: YES (TDD)
- **Framework**: Vitest (browser mode with Playwright)
- **If TDD**: Each task follows RED (failing test) → GREEN (minimal impl) → REFACTOR

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, interact, assert DOM, screenshot
- **API/Backend**: Use Bash (curl) — Send requests, assert status + response fields
- **Library/Module**: Use Bash (node REPL / vitest) — Import, call functions, compare output

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation — sequential, blocks everything):
├── Task 1: Auth store refactor + refresh token storage [deep]
└── Task 2: Auth context + route guard in _authenticated route [deep]

Wave 2 (Core auth flow — depends on Wave 1):
├── Task 3: Wire useLogin() into sign-in form (replace mock) [unspecified-high]
├── Task 4: Token refresh Axios interceptor [deep]
└── Task 5: Sign-out: wire useLogout() into SignOutDialog [quick]

Wave 3 (Polish + testing — depends on Wave 2):
├── Task 6: Setup detection + first-run redirect [unspecified-high]
├── Task 7: Disable sign-up link + "coming soon" badges on forgot-password/OTP [quick]
└── Task 8: Wire ProfileDropdown to auth store instead of hardcoded [quick]

Wave FINAL (After ALL tasks — 4 parallel reviews):
├── F1: Plan compliance audit (oracle)
├── F2: Code quality review (unspecified-high)
├── F3: Real manual QA (unspecified-high)
└── F4: Scope fidelity check (deep)
→ Present results → Get explicit user okay

Critical Path: Task 1 → Task 2 → Task 3 → Task 6
Parallel Speedup: ~50% faster than sequential
Max Concurrent: 3 (Wave 2)
```

### Dependency Matrix

| Task | Depends On | Blocks |
|------|-----------|--------|
| 1 | — | 2, 3, 4, 5 |
| 2 | 1 | 3, 6 |
| 3 | 1, 2 | 6 |
| 4 | 1 | — |
| 5 | 1 | — |
| 6 | 2, 3 | — |
| 7 | — | — |
| 8 | 1 | — |

### Agent Dispatch Summary

- **Wave 1**: 2 tasks — T1 `deep`, T2 `deep`
- **Wave 2**: 3 tasks — T3 `unspecified-high`, T4 `deep`, T5 `quick`
- **Wave 3**: 3 tasks — T6 `unspecified-high`, T7 `quick`, T8 `quick`
- **FINAL**: 4 tasks — F1 `oracle`, F2 `unspecified-high`, F3 `unspecified-high`, F4 `deep`

---

## TODOs

- [x] 1. **Refactor auth-store to support refresh token**

  **What to do**:
  - Add `refreshToken` field to auth-store alongside `accessToken`
  - Change cookie name from `thisisjustarandomstring` to `roskit-access-token`
  - Add `setRefreshToken` and `resetRefreshToken` methods
  - Update `reset()` to also clear refresh token
  - Persist refresh token via Zustand `persist` middleware (localStorage, like `active-router-store.ts`)
  - Update `hydrateSession` in `features/auth/api/queries.ts` to also set refresh token
  - Write test for auth-store: verify setAccessToken, setRefreshToken, reset, and persist behavior

  **Must NOT do**:
  - Do NOT change the existing `accessToken` storage mechanism (cookie)
  - Do NOT remove existing `setUser`, `setAccessToken`, `reset` methods
  - Do NOT change the `AuthUser` type shape

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Auth store refactoring touches state management, persistence, and multiple consumers
  - **Skills**: [`systematic-debugging`, `test-driven-development`]
    - `test-driven-development`: TDD approach — write auth-store tests first
    - `systematic-debugging`: For verifying store behavior edge cases

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1 (sequential, blocks everything)
  - **Blocks**: Tasks 2, 3, 4, 5, 8
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `src/stores/auth-store.ts` — Current auth store shape, cookie usage, reset logic
  - `src/stores/active-router-store.ts` — Zustand persist with localStorage pattern (FOLLOW THIS)
  - `src/features/auth/api/queries.ts:hydrateSession` — Must update to set refresh token too

  **API/Type References**:
  - `src/features/auth/data/schema.ts:LoginResult` — Has `refresh_token` field to store
  - `src/features/auth/data/schema.ts:RefreshRequest` — Needs `refresh_token` field to read from store

  **Test References**:
  - `src/stores/auth-store.test.ts` — Existing test, must update for new shape
  - `src/test-utils/cookies.ts` — Cookie test helpers

  **External References**:
  - Zustand persist middleware: `https://zustand.docs.pmnd.rs/middlewares/persist`

  **WHY Each Reference Matters**:
  - `active-router-store.ts` is the CANONICAL pattern for persisting Zustand state to localStorage — copy it exactly
  - `hydrateSession` in queries.ts is where token + user are stored after login — must add refresh token there
  - The cookie name `thisisjustarandomstring` is a placeholder — replace with `roskit-access-token`

  **Acceptance Criteria**:

  **If TDD (tests enabled)**:
  - [ ] Auth-store test updated: `src/stores/auth-store.test.ts`
  - [ ] `pnpm test src/stores/auth-store.test.ts` → PASS

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Auth store persists refresh token to localStorage
    Tool: Bash (vitest)
    Preconditions: Fresh browser state
    Steps:
      1. Run `pnpm test src/stores/auth-store.test.ts`
      2. Verify tests cover: setRefreshToken saves to localStorage
      3. Verify tests cover: reset clears both accessToken and refreshToken
      4. Verify tests cover: hydrateSession sets both tokens + user
    Expected Result: All tests pass, no regressions
    Failure Indicators: Any test failure or missing test case
    Evidence: .sisyphus/evidence/task-1-auth-store-tests.txt

  Scenario: Auth store cookie name is not placeholder
    Tool: Bash (grep)
    Preconditions: Source code exists
    Steps:
      1. Run `grep -r "thisisjustarandomstring" src/`
      2. Verify the placeholder cookie name is NOT found
      3. Run `grep -r "roskit-access-token" src/stores/auth-store.ts`
      4. Verify the new cookie name IS found
    Expected Result: Placeholder name eliminated, new name present
    Failure Indicators: Placeholder name still found anywhere in src/
    Evidence: .sisyphus/evidence/task-1-cookie-name-check.txt
  ```

  **Commit**: YES (group with Task 1)
  - Message: `feat(auth): refactor auth-store to support refresh token`
  - Files: `src/stores/auth-store.ts`, `src/stores/auth-store.test.ts`, `src/features/auth/api/queries.ts`
  - Pre-commit: `pnpm test src/stores/auth-store.test.ts`

- [x] 2. **Add route guard with beforeLoad on _authenticated route**

  **What to do**:
  - Add auth context to TanStack Router in `main.tsx` (pass `isAuthenticated` and `hasToken` via router context)
  - Add `beforeLoad` guard to `src/routes/_authenticated/route.tsx` that checks if user has an access token
  - If not authenticated, `throw redirect({ to: '/sign-in', search: { redirect: location.href } })`
  - Add loading/splash state to prevent flash of unauthenticated content while `/auth/me` resolves
  - Wire `useCurrentUser()` query in authenticated layout to hydrate user identity on page load
  - Write test: verify redirect works when no token, verify no redirect when token exists

  **Must NOT do**:
  - Do NOT add role-based guards yet (admin/staff) — only isAuthenticated check
  - Do NOT remove the Clerk routes
  - Do NOT change the visual appearance of any page

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Route guard architecture affects the entire app's navigation flow
  - **Skills**: [`test-driven-development`]
    - `test-driven-development`: TDD for the route guard behavior

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 1)
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 3, 6
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `src/routes/_authenticated/route.tsx` — Current unprotected route (only 6 lines)
  - `src/routes/(auth)/sign-in.tsx` — Sign-in route with `validateSearch` for redirect param
  - `src/main.tsx:21-73` — QueryClient config with 401 handler (EXISTING — needs update)
  - `src/main.tsx:76-81` — Router creation with `context` (ADD auth info here)

  **API/Type References**:
  - `src/stores/auth-store.ts` — Auth store with `accessToken` and `isAuthenticated` concept
  - `src/features/auth/api/queries.ts:useCurrentUser` — Query to hydrate user on load

  **External References**:
  - TanStack Router auth guard pattern: `https://tanstack.com/router/latest/docs/framework/react/guide/authenticated-routes`
  - Context7 shows `beforeLoad` + `throw redirect()` pattern

  **WHY Each Reference Matters**:
  - `_authenticated/route.tsx` is WHERE the guard goes — currently only has `component: AuthenticatedLayout`
  - `main.tsx:76-81` router creation is WHERE auth context gets injected into router
  - `main.tsx:21-73` 401 handler is WHERE we currently handle expired tokens — must update to try refresh first
  - TanStack Router docs confirm `beforeLoad` is the official pattern for auth guards

  **Acceptance Criteria**:

  **If TDD (tests enabled)**:
  - [ ] Route guard test created
  - [ ] `pnpm test` → PASS (all tests including new ones)

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Unauthenticated user redirected to sign-in
    Tool: Playwright
    Preconditions: No access token in cookie/store
    Steps:
      1. Navigate to `http://localhost:5173/`
      2. Wait for page load
      3. Assert URL is `/sign-in` (not `/` or dashboard)
      4. Assert no flash of dashboard content
    Expected Result: User is on /sign-in, no dashboard visible
    Failure Indicators: URL shows `/` or dashboard elements visible
    Evidence: .sisyphus/evidence/task-2-unauthenticated-redirect.png

  Scenario: Authenticated user reaches dashboard
    Tool: Playwright
    Preconditions: Valid access token set in cookie
    Steps:
      1. Set cookie `roskit-access-token` with a valid token value
      2. Navigate to `http://localhost:5173/`
      3. Assert URL is `/` (dashboard)
      4. Assert dashboard content is visible
    Expected Result: Dashboard loads without redirect to sign-in
    Failure Indicators: Redirected to /sign-in or 401 error
    Evidence: .sisyphus/evidence/task-2-authenticated-dashboard.png
  ```

  **Commit**: YES (group with Task 2)
  - Message: `feat(auth): add route guard with beforeLoad on _authenticated`
  - Files: `src/routes/_authenticated/route.tsx`, `src/main.tsx`
  - Pre-commit: `pnpm test`

- [x] 3. **Wire real login API into sign-in form (replace mock)**

  **What to do**:
  - Replace `sleep(2000)` + mock token/user in `user-auth-form.tsx` with `useLogin()` mutation
  - Remove `mock-access-token` and hardcoded mock user
  - On successful login: navigate to `redirectTo` or `/`
  - On login error: show toast with parseAPIError message
  - Handle loading state from mutation (`isPending`)
  - Remove social login buttons (Facebook, GitHub) — keep only username/password
  - Update the form schema password validation to match backend (min 1, currently min 7)
  - Write test: verify form calls useLogin on submit, shows error on failure

  **Must NOT do**:
  - Do NOT change the visual design of the sign-in form
  - Do NOT remove the "Sign Up" link YET (Task 7 handles that)
  - Do NOT add new fields to the form

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Requires understanding of existing form, hook wiring, and error handling
  - **Skills**: [`test-driven-development`]
    - `test-driven-development`: TDD for form submission behavior

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 4, 5 after Wave 1)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 6
  - **Blocked By**: Tasks 1, 2

  **References**:

  **Pattern References**:
  - `src/features/auth/sign-in/components/user-auth-form.tsx` — Current mock form (REPLACE mock logic)
  - `src/features/auth/api/queries.ts:useLogin` — Hook to USE (already exists, already handles token+user storage)
  - `src/features/auth/api/queries.ts:hydrateSession` — Called by useLogin.onSuccess

  **API/Type References**:
  - `src/features/auth/data/schema.ts:LoginRequest` — Request shape: `{ username, password }`
  - `src/features/auth/data/schema.ts:LoginResult` — Response shape: `{ access_token, refresh_token, expires_in, user }`
  - `src/lib/api/errors.ts:parseAPIError` — Error parser for showing toast messages

  **Test References**:
  - `src/features/auth/sign-in/components/user-auth-form.test.tsx` — Existing test (needs update to test real hook)

  **WHY Each Reference Matters**:
  - `user-auth-form.tsx` is the MAIN file to change — replace mock `onSubmit` with `useLogin` mutation
  - `useLogin` already exists and handles `hydrateSession` — we just need to call it from the form
  - `parseAPIError` is how errors are displayed — use it in the mutation's `onError`

  **Acceptance Criteria**:

  **If TDD**:
  - [ ] Test updated: `src/features/auth/sign-in/components/user-auth-form.test.tsx`
  - [ ] `pnpm test src/features/auth/sign-in/components/user-auth-form.test.tsx` → PASS

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Login with valid credentials succeeds
    Tool: Playwright
    Preconditions: Backend running at localhost:8080, user exists
    Steps:
      1. Navigate to `/sign-in`
      2. Type valid username into username field
      3. Type valid password into password field
      4. Click "Sign in" button
      5. Wait for navigation to complete
      6. Assert URL is `/` (dashboard)
      7. Assert auth store has user info
    Expected Result: Redirected to dashboard, user authenticated
    Failure Indicators: Stays on /sign-in, error toast shown, mock data visible
    Evidence: .sisyphus/evidence/task-3-login-success.png

  Scenario: Login with invalid credentials shows error
    Tool: Playwright
    Preconditions: Backend running at localhost:8080
    Steps:
      1. Navigate to `/sign-in`
      2. Type "wronguser" into username field
      3. Type "wrongpassword" into password field
      4. Click "Sign in" button
      5. Wait for error response
      6. Assert error toast is visible
      7. Assert URL is still `/sign-in`
    Expected Result: Error toast displayed, stays on sign-in page
    Failure Indicators: Navigates away, no error shown, or crash
    Evidence: .sisyphus/evidence/task-3-login-failure.png
  ```

  **Commit**: YES
  - Message: `feat(auth): wire real login API into sign-in form`
  - Files: `src/features/auth/sign-in/components/user-auth-form.tsx`, `src/features/auth/sign-in/components/user-auth-form.test.tsx`
  - Pre-commit: `pnpm test src/features/auth/sign-in/`

- [x] 4. **Add auto token refresh via Axios interceptor**

  **What to do**:
  - Add response interceptor to `apiClient` that catches 401 errors
  - On 401: attempt to refresh using `refreshToken` from auth store
  - If refresh succeeds: retry original request with new token
  - If refresh fails: call `auth.reset()` and redirect to `/sign-in`
  - Prevent refresh race condition (multiple simultaneous 401s = only one refresh call)
  - Update `main.tsx` QueryCache 401 handler to NOT redirect (let interceptor handle it)
  - Write test: verify refresh on 401, verify redirect on failed refresh

  **Must NOT do**:
  - Do NOT remove the existing QueryCache 401 handler entirely — it's still needed for non-axios errors
  - Do NOT change any API endpoint paths

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Token refresh is a complex async flow with race conditions
  - **Skills**: [`test-driven-development`]
    - `test-driven-development`: TDD for interceptor behavior

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 3, 5 after Task 1)
  - **Parallel Group**: Wave 2
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `src/lib/api/client.ts` — Axios instance, currently only has request interceptor
  - `src/main.tsx:51-60` — QueryCache 401 handler that resets auth + redirects (NEEDS UPDATE)

  **API/Type References**:
  - `src/features/auth/api/service.ts:refreshToken` — Refresh API call
  - `src/stores/auth-store.ts` — Store with refresh token (after Task 1)

  **Test References**:
  - `src/lib/api/errors.test.ts` — Existing API error test

  **WHY Each Reference Matters**:
  - `client.ts` is WHERE the response interceptor goes
  - `main.tsx:51-60` currently redirects on 401 — must update to not conflict with interceptor
  - `refreshToken` service function already exists — the interceptor calls it

  **Acceptance Criteria**:

  **If TDD**:
  - [ ] Test created: `src/lib/api/client.test.ts`
  - [ ] `pnpm test src/lib/api/client.test.ts` → PASS

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Expired access token triggers refresh and retries request
    Tool: Bash (curl + vitest)
    Preconditions: Backend running, valid refresh token stored
    Steps:
      1. Run `pnpm test src/lib/api/client.test.ts`
      2. Verify test: on 401, refresh is called before retry
      3. Verify test: original request is retried with new token
    Expected Result: Refresh flow works transparently, request succeeds after refresh
    Failure Indicators: Refresh not called, request not retried, or infinite loop
    Evidence: .sisyphus/evidence/task-4-refresh-test.txt

  Scenario: Failed refresh redirects to sign-in
    Tool: Bash (vitest)
    Preconditions: No valid refresh token
    Steps:
      1. Verify test: when refresh also fails (401), auth.reset() is called
      2. Verify test: navigation to /sign-in is triggered
    Expected Result: User redirected to sign-in when both tokens expired
    Failure Indicators: User stays on page, or infinite refresh loop
    Evidence: .sisyphus/evidence/task-4-refresh-failure.txt
  ```

  **Commit**: YES
  - Message: `feat(auth): add auto token refresh via Axios interceptor`
  - Files: `src/lib/api/client.ts`, `src/main.tsx`
  - Pre-commit: `pnpm test`

- [x] 5. **Wire real logout API into sign-out dialog**

  **What to do**:
  - Update `SignOutDialog` to import and use `useLogout()` mutation
  - Call `logout(refreshToken)` before clearing local auth state
  - Even if API call fails, still clear local state (per existing comment in queries.ts)
  - Pass refresh token from auth store to the logout mutation
  - Write test: verify logout API is called, verify local state is cleared

  **Must NOT do**:
  - Do NOT change the dialog's visual appearance
  - Do NOT remove the ConfirmDialog pattern

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Small, well-scoped change to existing component
  - **Skills**: [`test-driven-development`]

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 3, 4 after Task 1)
  - **Parallel Group**: Wave 2
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `src/components/sign-out-dialog.tsx` — Current dialog (ONLY calls `auth.reset()`)
  - `src/features/auth/api/queries.ts:useLogout` — Mutation hook (ACCEPTS optional refresh_token)

  **API/Type References**:
  - `src/features/auth/data/schema.ts:LogoutRequest` — `{ refresh_token?: string }`

  **Test References**:
  - `src/components/sign-out-dialog.test.tsx` — Existing test (needs update for API call)

  **WHY Each Reference Matters**:
  - `sign-out-dialog.tsx` is the ONLY file to modify — add `useLogout` hook call
  - `useLogout` already handles `onSettled: clearSession() + removeQueries()` — we just need to pass the refresh token

  **Acceptance Criteria**:

  **If TDD**:
  - [ ] Test updated: `src/components/sign-out-dialog.test.tsx`
  - [ ] `pnpm test src/components/sign-out-dialog.test.tsx` → PASS

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Sign out calls API and clears state
    Tool: Playwright
    Preconditions: User is logged in
    Steps:
      1. Click profile dropdown
      2. Click "Sign out" button
      3. Confirm in dialog
      4. Assert redirect to /sign-in
      5. Assert auth store is cleared (no token, no user)
    Expected Result: User signed out, redirected to sign-in
    Failure Indicators: Stays on dashboard, auth state not cleared
    Evidence: .sisyphus/evidence/task-5-signout-success.png

  Scenario: Sign out works even if API call fails
    Tool: Vitest
    Preconditions: Logout API returns 500
    Steps:
      1. Run test with mocked 500 response from /auth/logout
      2. Verify local auth state is STILL cleared (onSettled, not onSuccess)
    Expected Result: Local state cleared regardless of API success
    Failure Indicators: Auth state persists when API fails
    Evidence: .sisyphus/evidence/task-5-signout-api-failure.txt
  ```

  **Commit**: YES
  - Message: `feat(auth): wire real logout API into sign-out dialog`
  - Files: `src/components/sign-out-dialog.tsx`, `src/components/sign-out-dialog.test.tsx`
  - Pre-commit: `pnpm test src/components/sign-out-dialog.test.tsx`

- [x] 6. **Setup detection and first-run redirect**

  **What to do**:
  - Add a `useSetupCheck()` query or mutation that attempts to detect if setup has been completed
  - On the sign-in page, check if setup is needed: try `GET /auth/me` with a stored token, if 401 and no users exist, redirect to... actually, the setup endpoint returns 403 if already done
  - Simpler approach: In the sign-in page or authenticated guard, detect when the backend returns "no users" / "setup required" and show appropriate UI
  - Add detection: if `/auth/login` returns 401 with specific error (or if backend indicates "setup required"), show a "No admin user exists yet" message pointing to setup via API
  - Actually: The simplest UX is — if all auth fails, just show sign-in. Setup is done via API/curl. No UI page needed.

  **Revised What to do** (simplified):
  - Add error handling in sign-in form for "setup not completed" scenario
  - If `/auth/login` returns 403 (Forbidden — indicating setup may not be done), show specific error message
  - Keep sign-up link disabled (Task 7) — setup is via API only

  **Must NOT do**:
  - Do NOT create a `/setup` route or page
  - Do NOT add any "first-run setup" UI beyond the error message

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Error handling UX needs care
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Tasks 2, 3)
  - **Parallel Group**: Wave 3
  - **Blocks**: None
  - **Blocked By**: Tasks 2, 3

  **References**:

  **Pattern References**:
  - `src/features/auth/sign-in/components/user-auth-form.tsx` — Where login error is handled
  - `src/lib/api/errors.ts:parseAPIError` — Error parser for extracting messages

  **API/Type References**:
  - `docs/openapi/paths/auth.yaml:login` — Returns 401/403 with error codes
  - `src/features/auth/data/schema.ts` — Zod schemas for request/response shapes

  **WHY Each Reference Matters**:
  - `user-auth-form.tsx` is WHERE error messages are shown — add 403 handling here
  - `parseAPIError` is HOW errors are parsed — may need to extract specific error codes

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Login error shows appropriate message
    Tool: Playwright
    Preconditions: Backend at localhost:8080
    Steps:
      1. Navigate to `/sign-in`
      2. Type "nonexistent" as username and "wrong" as password
      3. Click "Sign in"
      4. Assert error toast is visible with a message
      5. Assert no crash or redirect
    Expected Result: Error message displayed, user can retry
    Failure Indicators: Generic error, crash, or stuck loading
    Evidence: .sisyphus/evidence/task-6-login-error.png
  ```

  **Commit**: YES
  - Message: `feat(auth): add setup detection and error handling on sign-in`
  - Files: `src/features/auth/sign-in/components/user-auth-form.tsx`
  - Pre-commit: `pnpm test`

- [x] 7. **Disable sign-up link and add coming-soon badges on unimplemented pages**

  **What to do**:
  - Remove or disable the "Sign Up" link from sign-in page
  - Add a "Coming Soon" badge/disabled state to forgot-password form submit button
  - Add a "Coming Soon" badge/disabled state to OTP form submit button
  - Keep the pages/routes accessible but forms won't actually submit

  **Must NOT do**:
  - Do NOT delete any existing component files
  - Do NOT remove any routes from TanStack Router

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple UI changes, no complex logic
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (independent task)
  - **Parallel Group**: Wave 3
  - **Blocks**: None
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `src/features/auth/sign-in/index.tsx:28-30` — "Sign Up" link to remove/disable
  - `src/features/auth/forgot-password/components/forgot-password-form.tsx` — Form to badge
  - `src/features/auth/otp/components/otp-form.tsx` — Form to badge

  **WHY Each Reference Matters**:
  - `sign-in/index.tsx` has the Sign Up link that needs to be removed
  - `forgot-password-form.tsx` and `otp-form.tsx` are where badges go

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Sign-up link removed from sign-in page
    Tool: Playwright
    Preconditions: App running
    Steps:
      1. Navigate to `/sign-in`
      2. Assert NO link with text "Sign Up" or "sign-up" href exists
    Expected Result: No sign-up link visible
    Failure Indicators: Sign-up link still visible/clickable
    Evidence: .sisyphus/evidence/task-7-no-signup-link.png

  Scenario: Forgot-password and OTP show coming-soon badge
    Tool: Playwright
    Preconditions: App running
    Steps:
      1. Navigate to `/forgot-password`
      2. Assert "Coming Soon" badge or disabled submit button is visible
      3. Navigate to `/otp`
      4. Assert "Coming Soon" badge or disabled submit button is visible
    Expected Result: Both pages show they're not fully implemented
    Failure Indicators: Forms look fully functional with no indication
    Evidence: .sisyphus/evidence/task-7-coming-soon-badges.png
  ```

  **Commit**: YES
  - Message: `feat(auth): disable sign-up link and add coming-soon badges`
  - Files: `src/features/auth/sign-in/index.tsx`, `src/features/auth/forgot-password/components/forgot-password-form.tsx`, `src/features/auth/otp/components/otp-form.tsx`
  - Pre-commit: `pnpm test`

- [x] 8. **Wire ProfileDropdown to auth store instead of hardcoded values**

  **What to do**:
  - Read `useCurrentUser()` in `ProfileDropdown` component instead of hardcoded user info
  - Show real user name and role from auth store
  - Update `NavUser` component if it also has hardcoded values
  - Handle loading state (show skeleton while user data loads)

  **Must NOT do**:
  - Do NOT change the dropdown visual design
  - Do NOT remove any dropdown menu items

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Small, focused change to existing component
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (after Task 1)
  - **Parallel Group**: Wave 3
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `src/components/profile-dropdown.tsx` — Has hardcoded user values
  - `src/features/auth/api/queries.ts:useCurrentUser` — Hook to use for real user data

  **WHY Each Reference Matters**:
  - `profile-dropdown.tsx` is the file to update
  - `useCurrentUser` provides reactive user data from `/auth/me`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Profile dropdown shows logged-in user info
    Tool: Playwright
    Preconditions: User is logged in as "alice" (admin)
    Steps:
      1. Navigate to `/` (dashboard)
      2. Click profile dropdown in header
      3. Assert displayed username matches "alice"
      4. Assert displayed role matches "admin"
    Expected Result: Real user info displayed, not hardcoded placeholder
    Failure Indicators: Shows "satnaing" or other hardcoded values
    Evidence: .sisyphus/evidence/task-8-profile-dropdown.png
  ```

  **Commit**: YES
  - Message: `feat(auth): wire profile dropdown to auth store`
  - Files: `src/components/profile-dropdown.tsx`
  - Pre-commit: `pnpm test`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.

- [x] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`
  Run `pnpm tsc --noEmit` + `pnpm lint` + `pnpm test`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names.
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | VERDICT`

- [x] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill if UI)
  Start from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration (features working together, not isolation). Test edge cases: empty state, invalid input, rapid actions. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [x] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect cross-task contamination: Task N touching Task M's files. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- **1**: `feat(auth): refactor auth-store to support refresh token` - stores/auth-store.ts, stores/auth-store.test.ts
- **2**: `feat(auth): add route guard with beforeLoad on _authenticated` - routes/_authenticated/route.tsx, main.tsx, routes/__root.tsx
- **3**: `feat(auth): wire real login API into sign-in form` - features/auth/sign-in/components/user-auth-form.tsx, features/auth/sign-in/components/user-auth-form.test.tsx
- **4**: `feat(auth): add auto token refresh via Axios interceptor` - lib/api/client.ts, features/auth/api/service.ts
- **5**: `feat(auth): wire real logout API into sign-out dialog` - components/sign-out-dialog.tsx
- **6**: `feat(auth): add setup detection and first-run redirect` - features/auth/api/queries.ts, routes/(auth)/sign-in.tsx
- **7**: `feat(auth): disable sign-up link and add coming-soon badges` - features/auth/sign-in/index.tsx, features/auth/forgot-password/index.tsx, features/auth/otp/index.tsx
- **8**: `feat(auth): wire profile dropdown to auth store` - components/profile-dropdown.tsx

---

## Success Criteria

### Verification Commands
```bash
pnpm tsc --noEmit                             # Expected: No errors
pnpm lint                                     # Expected: No errors
pnpm test                                     # Expected: All tests pass
pnpm dev                                      # Expected: App starts, redirects to /sign-in
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] All tests pass