import { create } from 'zustand'
import { type VoucherSale } from '@/features/voucher/data/sales'

type DialogMode = 'delete' | 'multi-delete' | null

type SalesDialogState = {
  mode: DialogMode
  target: VoucherSale | null
  ids: number[]
  open: (
    mode: Exclude<DialogMode, null>,
    payload?: { target?: VoucherSale; ids?: number[] }
  ) => void
  close: () => void
}

export const useSalesDialogStore = create<SalesDialogState>()((set) => ({
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
