import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { qk } from '@/lib/api/query-keys'
import {
  PLATFORM_TENANT_SLUG,
  useActiveTenantStore,
} from '@/stores/active-tenant-store'
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
  setupFirstTenant,
} from './service'

// After a successful login or first-tenant setup, hydrate both stores.
// - auth-store: persist token + identity
// - active-tenant-store: scope tenant for subsequent X-Tenant-Slug header.
//   Superadmins (tenant_id === null) stay on PLATFORM_TENANT_SLUG so the
//   client interceptor omits the header.
function hydrateSession(token: string, user: AuthUser): void {
  const auth = useAuthStore.getState().auth
  auth.setAccessToken(token)
  auth.setUser(user)

  const tenantStore = useActiveTenantStore.getState()
  if (user.role === 'superadmin' || user.tenant_id === null) {
    tenantStore.resetToPlatform()
  } else {
    tenantStore.setSlug(user.tenant_slug)
  }
}

function clearSession(): void {
  useAuthStore.getState().auth.reset()
  useActiveTenantStore.getState().resetToPlatform()
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

export function useSetupFirstTenant() {
  const qc = useQueryClient()
  return useMutation<SetupResult, Error, SetupRequest>({
    mutationFn: (payload) => setupFirstTenant(payload),
    onSuccess: (data) => {
      // Backend auto-issues tokens for the new owner. Hydrate so the SPA
      // is immediately authenticated without a second /auth/login call.
      const user: AuthUser = {
        id: data.user.id,
        username: data.user.username,
        role: data.user.role,
        tenant_id: data.tenant.id,
        tenant_slug: data.tenant.slug,
      }
      hydrateSession(data.access_token, user)
      qc.setQueryData(qk.currentUser(), user)

      // The user just created their tenant — scope subsequent reads to it.
      // (hydrateSession already handles this for non-superadmin roles, but
      // explicit is clearer here since `setup` is always for an owner.)
      if (data.tenant.slug !== PLATFORM_TENANT_SLUG) {
        useActiveTenantStore.getState().setSlug(data.tenant.slug)
      }
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
