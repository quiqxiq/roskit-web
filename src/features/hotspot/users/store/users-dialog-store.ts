import { create } from 'zustand'
import { type HotspotUser } from '../data/schema'

type DialogMode = 'add' | 'edit' | 'delete' | 'multi-delete' | null

type UsersDialogState = {
  mode: DialogMode
  target: HotspotUser | null
  ids: string[]
  open: (
    mode: Exclude<DialogMode, null>,
    payload?: { target?: HotspotUser; ids?: string[] }
  ) => void
  close: () => void
}

export const useUsersDialogStore = create<UsersDialogState>()((set) => ({
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
