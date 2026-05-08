/**
 * @deprecated Server state should not live in Zustand. Replace usage with
 * `useHotspotActive` + `useHotspotActiveStream` (TanStack Query + SSE) once
 * `features/hotspot/active/api/queries.ts` is wired into the components.
 * Seed in `data/data.ts` remains valid for Storybook / unit tests.
 * See `web/docs/API_INTEGRATION_PLAN.md` §B.2.
 */
import { create } from 'zustand'
import { hotspotActivesSeed } from '@/features/hotspot/active/data/data'
import { type HotspotActive } from '@/features/hotspot/active/data/schema'

type HotspotActiveState = {
  items: HotspotActive[]
  remove: (id: string) => void
  removeMany: (ids: string[]) => void
  reset: () => void
}

export const useHotspotActiveStore = create<HotspotActiveState>()((set) => ({
  items: [...hotspotActivesSeed],
  remove: (id) =>
    set((state) => ({ items: state.items.filter((s) => s.id !== id) })),
  removeMany: (ids) =>
    set((state) => ({
      items: state.items.filter((s) => !ids.includes(s.id)),
    })),
  reset: () => set({ items: [...hotspotActivesSeed] }),
}))
