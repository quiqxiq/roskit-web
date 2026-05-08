/**
 * @deprecated Server state should not live in Zustand. Replace usage with
 * `useHotspotHosts` (TanStack Query) once
 * `features/hotspot/hosts/api/queries.ts` is wired into the components.
 * Seed in `data/data.ts` remains valid for Storybook / unit tests.
 * See `web/docs/API_INTEGRATION_PLAN.md` §B.2.
 */
import { create } from 'zustand'
import { hotspotHostsSeed } from '@/features/hotspot/hosts/data/data'
import { type HotspotHost } from '@/features/hotspot/hosts/data/schema'

type HotspotHostsState = {
  items: HotspotHost[]
  update: (id: string, patch: Partial<HotspotHost>) => void
  bypass: (id: string) => void
  bypassMany: (ids: string[]) => void
  remove: (id: string) => void
  removeMany: (ids: string[]) => void
  reset: () => void
}

export const useHotspotHostsStore = create<HotspotHostsState>()((set) => ({
  items: [...hotspotHostsSeed],
  update: (id, patch) =>
    set((state) => ({
      items: state.items.map((h) => (h.id === id ? { ...h, ...patch } : h)),
    })),
  bypass: (id) =>
    set((state) => ({
      items: state.items.map((h) =>
        h.id === id ? { ...h, bypassed: true } : h
      ),
    })),
  bypassMany: (ids) =>
    set((state) => ({
      items: state.items.map((h) =>
        ids.includes(h.id) ? { ...h, bypassed: true } : h
      ),
    })),
  remove: (id) =>
    set((state) => ({ items: state.items.filter((h) => h.id !== id) })),
  removeMany: (ids) =>
    set((state) => ({
      items: state.items.filter((h) => !ids.includes(h.id)),
    })),
  reset: () => set({ items: [...hotspotHostsSeed] }),
}))
