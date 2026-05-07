import { create } from 'zustand'
import { BUILTIN_TEMPLATES } from '@/features/admin/templates/data/builtin-defaults'
import { globalTemplatesSeed } from '@/features/admin/templates/data/data'
import { type PrintTemplate } from '@/features/admin/templates/data/schema'

type GlobalTemplatesState = {
  items: PrintTemplate[]
  add: (tpl: PrintTemplate) => void
  update: (id: string, patch: Partial<PrintTemplate>) => void
  /** Hapus template (guard: built-in tidak bisa dihapus). Returns false jika ditolak. */
  remove: (id: string) => boolean
  removeMany: (ids: string[]) => { removed: number; skipped: number }
  /** Reset built-in template ke source content; no-op untuk custom. */
  resetToDefault: (id: string) => boolean
  resetAll: () => void
}

export const useGlobalTemplatesStore = create<GlobalTemplatesState>()(
  (set, get) => ({
    items: [...globalTemplatesSeed],
    add: (tpl) => set((state) => ({ items: [tpl, ...state.items] })),
    update: (id, patch) =>
      set((state) => ({
        items: state.items.map((t) =>
          t.id === id ? { ...t, ...patch, updatedAt: new Date() } : t
        ),
      })),
    remove: (id) => {
      const target = get().items.find((t) => t.id === id)
      if (!target || target.isBuiltin) return false
      set((state) => ({ items: state.items.filter((t) => t.id !== id) }))
      return true
    },
    removeMany: (ids) => {
      const items = get().items
      const targets = items.filter((t) => ids.includes(t.id))
      const removable = targets.filter((t) => !t.isBuiltin)
      const removableIds = new Set(removable.map((t) => t.id))
      set({
        items: items.filter((t) => !removableIds.has(t.id)),
      })
      return {
        removed: removable.length,
        skipped: targets.length - removable.length,
      }
    },
    resetToDefault: (id) => {
      const target = get().items.find((t) => t.id === id)
      if (!target || !target.isBuiltin) return false
      const source = BUILTIN_TEMPLATES.find((b) => b.id === id)
      if (!source) return false
      set((state) => ({
        items: state.items.map((t) =>
          t.id === id
            ? {
                ...t,
                name: source.name,
                type: source.type,
                header: source.header,
                row: source.row,
                footer: source.footer,
                updatedAt: new Date(),
              }
            : t
        ),
      }))
      return true
    },
    resetAll: () => set({ items: [...globalTemplatesSeed] }),
  })
)
