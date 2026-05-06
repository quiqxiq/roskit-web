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
