import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { qk } from '@/lib/api/query-keys'
import { useAuthStore, type AuthUser } from '@/stores/auth-store'
import type {
  ChangePasswordRequest,
  LoginRequest,
  LoginResult,
  SetupRequest,
  SetupResult,
  UserView,
} from '../data/schema'
import {
  changePassword,
  getMe,
  login,
  logout,
  setup,
} from './service'

// After a successful login or first-admin setup, persist token + identity.
// Backend is single-tenant — no tenant scope to track separately.
function hydrateSession(token: string, user: AuthUser): void {
  const auth = useAuthStore.getState().auth
  auth.setAccessToken(token)
  auth.setUser(user)
}

function clearSession(): void {
  useAuthStore.getState().auth.reset()
}

// ────────────────────── Mutations ──────────────────────

export function useLogin() {
  const qc = useQueryClient()
  return useMutation<LoginResult, Error, LoginRequest>({
    mutationFn: (payload) => login(payload),
    onSuccess: (data) => {
      hydrateSession(data.access_token, data.user)
      // Pre-seed the /auth/me query so consumers can read identity without
      // a second round-trip immediately after login.
      qc.setQueryData(qk.currentUser(), data.user)
    },
  })
}

// `useLogout` accepts an optional refresh token. Pass it from the same
// device to log out everywhere; omit to log out only this access token.
export function useLogout() {
  const qc = useQueryClient()
  return useMutation<void, Error, string | undefined>({
    mutationFn: (refreshToken) => logout(refreshToken),
    // Always clear local state, even if the server call fails — a stale
    // token that survives client reset is the worse failure mode.
    onSettled: () => {
      clearSession()
      qc.removeQueries({ queryKey: ['auth', 'me'] })
    },
  })
}

export function useChangePassword() {
  return useMutation<void, Error, ChangePasswordRequest>({
    mutationFn: (payload) => changePassword(payload),
  })
}

// Bootstrap the first admin user (only succeeds when users table is empty).
// Backend auto-issues tokens, so the SPA is immediately authenticated
// without a second /auth/login call.
export function useSetup() {
  const qc = useQueryClient()
  return useMutation<SetupResult, Error, SetupRequest>({
    mutationFn: (payload) => setup(payload),
    onSuccess: (data) => {
      hydrateSession(data.access_token, data.user)
      qc.setQueryData(qk.currentUser(), data.user)
    },
  })
}

// ────────────────────── Queries ──────────────────────

// Hydrate the SPA identity on page load. Only fires when an access token
// is present in the store — anonymous loads don't ping /auth/me.
export function useCurrentUser() {
  const hasToken = useAuthStore((s) => Boolean(s.auth.accessToken))
  return useQuery<UserView, Error>({
    queryKey: qk.currentUser(),
    queryFn: getMe,
    enabled: hasToken,
    staleTime: 60_000,
  })
}
