import { z } from 'zod'

export const dailySummaryRowSchema = z.object({
  date: z.coerce.date(),
  count: z.number(),
  total: z.number(),
  price: z.number(),
})
export type DailySummaryRow = z.infer<typeof dailySummaryRowSchema>

export const monthlyReportSchema = z.object({
  year: z.number(),
  month: z.number(),
  rows: z.array(dailySummaryRowSchema),
  total: z.number(),
  count: z.number(),
  best: z.object({
    date: z.coerce.date().nullable(),
    total: z.number(),
  }),
})
export type MonthlyReport = z.infer<typeof monthlyReportSchema>

export const yearlySummaryRowSchema = z.object({
  month: z.number(),
  count: z.number(),
  total: z.number(),
})
export type YearlySummaryRow = z.infer<typeof yearlySummaryRowSchema>
