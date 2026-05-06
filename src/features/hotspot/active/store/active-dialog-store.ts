import { create } from 'zustand'
import { type HotspotActive } from '../data/schema'

type DialogMode = 'disconnect' | 'disconnect-many' | 'disconnect-all' | null

type ActiveDialogState = {
  mode: DialogMode
  target: HotspotActive | null
  ids: string[]
  open: (
    mode: Exclude<DialogMode, null>,
    payload?: { target?: HotspotActive; ids?: string[] }
  ) => void
  close: () => void
}

export const useActiveDialogStore = create<ActiveDialogState>()((set) => ({
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
