/**
 * @deprecated Server state should not live in Zustand. Replace usage with
 * `useHotspotUsers` (TanStack Query) once `features/hotspot/users/api/queries.ts`
 * is wired into the components. The seed in `data/data.ts` remains valid
 * for Storybook / unit tests. See `web/docs/API_INTEGRATION_PLAN.md` §B.2.
 */
import { create } from 'zustand'
import { hotspotUsersSeed } from '@/features/hotspot/users/data/data'
import { type HotspotUser } from '@/features/hotspot/users/data/schema'

type HotspotUsersState = {
  items: HotspotUser[]
  add: (user: HotspotUser) => void
  update: (id: string, patch: Partial<HotspotUser>) => void
  remove: (id: string) => void
  removeMany: (ids: string[]) => void
  reset: () => void
}

export const useHotspotUsersStore = create<HotspotUsersState>()((set) => ({
  items: [...hotspotUsersSeed],
  add: (user) => set((state) => ({ items: [user, ...state.items] })),
  update: (id, patch) =>
    set((state) => ({
      items: state.items.map((u) => (u.id === id ? { ...u, ...patch } : u)),
    })),
  remove: (id) =>
    set((state) => ({ items: state.items.filter((u) => u.id !== id) })),
  removeMany: (ids) =>
    set((state) => ({
      items: state.items.filter((u) => !ids.includes(u.id)),
    })),
  reset: () => set({ items: [...hotspotUsersSeed] }),
}))
