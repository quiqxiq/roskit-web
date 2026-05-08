import axios, { type AxiosInstance } from 'axios'
import {
  PLATFORM_TENANT_SLUG,
  useActiveTenantStore,
} from '@/stores/active-tenant-store'
import { useAuthStore } from '@/stores/auth-store'

// `VITE_API_URL` should point to the backend host (no `/api/v1` suffix).
// We append `/api/v1` here so per-feature service calls use bare paths
// like `/auth/login`, `/routers/:id/hotspot/users`, etc.
const rawBase = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
const baseURL = `${rawBase.replace(/\/+$/, '')}/api/v1`

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
})

// Inject auth + tenant scope on every request.
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().auth.accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Only forward an explicit tenant header when the user is operating outside
  // the platform scope. For superadmins on `__platform__`, we send no header
  // and let the backend resolve from JWT claims.
  const slug = useActiveTenantStore.getState().slug
  if (slug && slug !== PLATFORM_TENANT_SLUG) {
    config.headers['X-Tenant-Slug'] = slug
  }

  return config
})

// 401 / 500 handling lives in the QueryClient `queryCache.onError` in
// `main.tsx` (toast + reset + redirect). We deliberately do NOT duplicate
// that here — the response interceptor stays a pass-through so axios errors
// surface to mutation/query consumers untouched.
