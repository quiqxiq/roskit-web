import { create } from 'zustand'
import { type HotspotHost } from '../data/schema'

type DialogMode = 'bind' | 'bind-many' | 'delete' | 'multi-delete' | null

type HostsDialogState = {
  mode: DialogMode
  target: HotspotHost | null
  ids: string[]
  open: (
    mode: Exclude<DialogMode, null>,
    payload?: { target?: HotspotHost; ids?: string[] }
  ) => void
  close: () => void
}

export const useHostsDialogStore = create<HostsDialogState>()((set) => ({
  mode: null,
  target: null,
  ids: [],
  open: (mode, payload) =>
    set({
      mode,
      target: payload?.target ?? null,
      ids: payload?.ids ?? [],
    }),
  close: () => set({ mode: null, target: null, ids: [] }),
}))
