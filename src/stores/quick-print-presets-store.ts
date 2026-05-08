/**
 * @deprecated Server state should not live in Zustand. Replace usage with
 * `useQuickPrintPackages` (TanStack Query) once
 * `features/voucher/print/api/queries.ts` is wired into the components.
 * Backend endpoint: `GET/POST/PUT/DELETE /routers/{routerId}/quick-print`.
 * Seed in `data/data.ts` remains valid for Storybook / unit tests.
 * See `web/docs/API_INTEGRATION_PLAN.md` §B.2.
 */
import { create } from 'zustand'
import { quickPrintPresetsSeed } from '@/features/voucher/print/data/data'
import { type QuickPrintPreset } from '@/features/voucher/print/data/schema'

type QuickPrintPresetsState = {
  items: QuickPrintPreset[]
  add: (preset: QuickPrintPreset) => void
  update: (id: string, patch: Partial<QuickPrintPreset>) => void
  duplicate: (id: string) => QuickPrintPreset | null
  remove: (id: string) => void
  reset: () => void
}

function nextPresetId(items: QuickPrintPreset[]): string {
  const used = new Set(items.map((p) => p.id))
  for (let n = 1; n < 1000; n++) {
    const id = `*qp${n.toString().padStart(2, '0')}`
    if (!used.has(id)) return id
  }
  return `*qp${Date.now()}`
}

export const useQuickPrintPresetsStore = create<QuickPrintPresetsState>()(
  (set, get) => ({
    items: [...quickPrintPresetsSeed],
    add: (preset) => set((state) => ({ items: [...state.items, preset] })),
    update: (id, patch) =>
      set((state) => ({
        items: state.items.map((p) =>
          p.id === id ? { ...p, ...patch } : p
        ),
      })),
    duplicate: (id) => {
      const current = get().items.find((p) => p.id === id)
      if (!current) return null
      const cloneId = nextPresetId(get().items)
      const clone: QuickPrintPreset = {
        ...current,
        id: cloneId,
        name: `${current.name}-copy`,
      }
      set((state) => ({ items: [...state.items, clone] }))
      return clone
    },
    remove: (id) =>
      set((state) => ({ items: state.items.filter((p) => p.id !== id) })),
    reset: () => set({ items: [...quickPrintPresetsSeed] }),
  })
)
