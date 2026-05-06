import { type VoucherSale } from '@/features/voucher/data/sales'
import {
  type DailySummaryRow,
  type MonthlyReport,
  type YearlySummaryRow,
} from './schema'

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function buildMonthlyReport(
  sales: VoucherSale[],
  year: number,
  month: number
): MonthlyReport {
  const start = new Date(year, month, 1)
  const end = new Date(year, month + 1, 1)
  const inRange = sales.filter((s) => s.soldAt >= start && s.soldAt < end)

  const totalDays = daysInMonth(year, month)
  const rows: DailySummaryRow[] = []
  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, month, day)
    rows.push({ date, count: 0, total: 0, price: 0 })
  }

  for (const sale of inRange) {
    const day = sale.soldAt.getDate()
    const row = rows[day - 1]
    if (row) {
      row.count += 1
      row.total += sale.sellingPrice
      row.price += sale.price
    }
  }

  const total = rows.reduce((sum, r) => sum + r.total, 0)
  const count = rows.reduce((sum, r) => sum + r.count, 0)
  const bestRow = rows.reduce<DailySummaryRow | null>(
    (best, r) => (best === null || r.total > best.total ? r : best),
    null
  )

  return {
    year,
    month,
    rows,
    total,
    count,
    best: {
      date: bestRow && bestRow.total > 0 ? bestRow.date : null,
      total: bestRow?.total ?? 0,
    },
  }
}

export function buildYearlySummary(
  sales: VoucherSale[],
  year: number
): YearlySummaryRow[] {
  const rows: YearlySummaryRow[] = Array.from({ length: 12 }, (_, m) => ({
    month: m,
    count: 0,
    total: 0,
  }))
  for (const sale of sales) {
    if (sale.soldAt.getFullYear() !== year) continue
    const m = sale.soldAt.getMonth()
    const row = rows[m]
    if (row) {
      row.count += 1
      row.total += sale.sellingPrice
    }
  }
  return rows
}

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const SHORT_MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export function dateToDailyParam(date: Date): string {
  return [
    date.getFullYear(),
    (date.getMonth() + 1).toString().padStart(2, '0'),
    date.getDate().toString().padStart(2, '0'),
  ].join('-')
}
