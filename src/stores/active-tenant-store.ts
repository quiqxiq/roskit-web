import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Slug khusus untuk scope platform-level (akses /admin/*).
// Match dengan models.PlatformTenantSlug di backend (@/internal/models/tenant.go).
export const PLATFORM_TENANT_SLUG = '__platform__'

type ActiveTenantState = {
  slug: string
  setSlug: (slug: string) => void
  resetToPlatform: () => void
}

export const useActiveTenantStore = create<ActiveTenantState>()(
  persist(
    (set) => ({
      slug: PLATFORM_TENANT_SLUG,
      setSlug: (slug) => set({ slug }),
      resetToPlatform: () => set({ slug: PLATFORM_TENANT_SLUG }),
    }),
    { name: 'roskit-active-tenant' }
  )
)

export function useActiveTenantSlug(): string {
  return useActiveTenantStore((s) => s.slug)
}

export function isPlatformScope(slug: string): boolean {
  return slug === PLATFORM_TENANT_SLUG
}
