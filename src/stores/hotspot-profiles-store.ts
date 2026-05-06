import { create } from 'zustand'
import { hotspotProfilesSeed } from '@/features/hotspot/profiles/data/data'
import { type HotspotProfile } from '@/features/hotspot/profiles/data/schema'

type HotspotProfilesState = {
  items: HotspotProfile[]
  add: (profile: HotspotProfile) => void
  update: (id: string, patch: Partial<HotspotProfile>) => void
  remove: (id: string) => void
  removeMany: (ids: string[]) => void
  setMonitor: (id: string, value: boolean) => void
  reset: () => void
}

export const useHotspotProfilesStore = create<HotspotProfilesState>()((set) => ({
  items: [...hotspotProfilesSeed],
  add: (profile) => set((state) => ({ items: [profile, ...state.items] })),
  update: (id, patch) =>
    set((state) => ({
      items: state.items.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })),
  remove: (id) =>
    set((state) => ({ items: state.items.filter((p) => p.id !== id) })),
  removeMany: (ids) =>
    set((state) => ({
      items: state.items.filter((p) => !ids.includes(p.id)),
    })),
  setMonitor: (id, value) =>
    set((state) => ({
      items: state.items.map((p) =>
        p.id === id ? { ...p, hasExpiredMonitor: value } : p
      ),
    })),
  reset: () => set({ items: [...hotspotProfilesSeed] }),
}))
