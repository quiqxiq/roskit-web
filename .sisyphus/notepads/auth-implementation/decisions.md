# Decisions - Auth Implementation

## Token Storage
- Access token: Cookie (`roskit-access-token`) — consistent with existing pattern
- Refresh token: Zustand persist + localStorage — consistent with active-router-store.ts

## Auth Guard Strategy
- Pattern: `beforeLoad` + `throw redirect()` on `_authenticated` layout route
- Context: Pass auth state via `router.context` (created as `createRootRouteWithContext`)
- Flash prevention: Loading state in `beforeLoad` while `/auth/me` resolves

## Token Refresh
- Implemented as Axios response interceptor (transparent to consumers)
- Race condition: Single in-flight refresh, queue concurrent 401s
- On refresh failure: `auth.reset()` + redirect to `/sign-in`

## Setup Flow
- No UI page — setup via API/curl only
- Sign-in form shows specific error if setup not completed (403 from `/auth/login`)
- Sign-up link disabled

## Sign-out
- Call `/auth/logout` API with refresh token (if available)
- Clear local state even on API failure (onSettled, not onSuccess)
