import { create } from 'zustand'
import { type PrintTemplate } from '../data/schema'

export type TemplateDialogMode =
  | 'add'
  | 'edit'
  | 'delete'
  | 'multi-delete'
  | null

type TemplatesDialogState = {
  mode: TemplateDialogMode
  target: PrintTemplate | null
  ids: string[]
  open: (
    mode: Exclude<TemplateDialogMode, null>,
    payload?: { target?: PrintTemplate; ids?: string[] }
  ) => void
  close: () => void
}

export const useTemplatesDialogStore = create<TemplatesDialogState>()((set) => ({
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
