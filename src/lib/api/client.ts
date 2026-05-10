import axios, { type AxiosInstance } from 'axios'
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

// Inject auth on every request. Backend is single-tenant — no tenant scoping.
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().auth.accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 401 / 500 handling lives in the QueryClient `queryCache.onError` in
// `main.tsx` (toast + reset + redirect). We deliberately do NOT duplicate
// that here — the response interceptor stays a pass-through so axios errors
// surface to mutation/query consumers untouched.
