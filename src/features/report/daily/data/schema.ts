import { z } from 'zod'
import { voucherSaleSchema } from '@/features/voucher/data/sales'

export const dailyReportSchema = z.object({
  date: z.coerce.date(),
  sales: z.array(voucherSaleSchema),
  total: z.number(),
  count: z.number(),
})
export type DailyReport = z.infer<typeof dailyReportSchema>

export type DailySaleFilters = {
  search: string
  profile: string
  server: string
}
