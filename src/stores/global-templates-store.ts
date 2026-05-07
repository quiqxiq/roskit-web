import { create } from 'zustand'
import { globalTemplatesSeed } from '@/features/admin/templates/data/data'
import { type PrintTemplate } from '@/features/admin/templates/data/schema'

type GlobalTemplatesState = {
  items: PrintTemplate[]
  add: (tpl: PrintTemplate) => void
  update: (id: string, patch: Partial<PrintTemplate>) => void
  remove: (id: string) => void
  removeMany: (ids: string[]) => void
  reset: () => void
}

export const useGlobalTemplatesStore = create<GlobalTemplatesState>()((set) => ({
  items: [...globalTemplatesSeed],
  add: (tpl) => set((state) => ({ items: [tpl, ...state.items] })),
  update: (id, patch) =>
    set((state) => ({
      items: state.items.map((t) =>
        t.id === id ? { ...t, ...patch, updatedAt: new Date() } : t
      ),
    })),
  remove: (id) =>
    set((state) => ({ items: state.items.filter((t) => t.id !== id) })),
  removeMany: (ids) =>
    set((state) => ({
      items: state.items.filter((t) => !ids.includes(t.id)),
    })),
  reset: () => set({ items: [...globalTemplatesSeed] }),
}))
