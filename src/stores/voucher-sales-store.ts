/**
 * @deprecated Server state should not live in Zustand. Replace usage with
 * `useVoucherSales` (TanStack Query, sourced from the reports endpoint —
 * `GET /routers/{routerId}/reports/...`) once
 * `features/voucher/sales/api/queries.ts` is wired into the components.
 * Seed in `features/voucher/data/sales.ts` remains valid for Storybook /
 * unit tests. See `web/docs/API_INTEGRATION_PLAN.md` §B.2.
 */
import { create } from 'zustand'
import {
  voucherSalesSeed,
  type VoucherSale,
} from '@/features/voucher/data/sales'

type VoucherSalesState = {
  items: VoucherSale[]
  add: (sale: VoucherSale) => void
  addMany: (sales: VoucherSale[]) => void
  remove: (id: number) => void
  removeMany: (ids: number[]) => void
  reset: () => void
}

export const useVoucherSalesStore = create<VoucherSalesState>()((set) => ({
  items: [...voucherSalesSeed],
  add: (sale) =>
    set((state) => ({
      items: [sale, ...state.items].sort(
        (a, b) => b.soldAt.getTime() - a.soldAt.getTime()
      ),
    })),
  addMany: (sales) =>
    set((state) => ({
      items: [...sales, ...state.items].sort(
        (a, b) => b.soldAt.getTime() - a.soldAt.getTime()
      ),
    })),
  remove: (id) =>
    set((state) => ({ items: state.items.filter((s) => s.id !== id) })),
  removeMany: (ids) =>
    set((state) => ({
      items: state.items.filter((s) => !ids.includes(s.id)),
    })),
  reset: () => set({ items: [...voucherSalesSeed] }),
}))
