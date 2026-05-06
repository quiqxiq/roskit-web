import {
  filterDaySales,
  sumSelling,
  type VoucherSale,
} from '@/features/voucher/data/sales'
import { type DailyReport, type DailySaleFilters } from './schema'

export function buildDailyReport(
  sales: VoucherSale[],
  date: Date
): DailyReport {
  const day = filterDaySales(sales, date)
  return {
    date,
    sales: day,
    total: sumSelling(day),
    count: day.length,
  }
}

export function applyDailyFilters(
  sales: VoucherSale[],
  filters: DailySaleFilters
): VoucherSale[] {
  const term = filters.search.trim().toLowerCase()
  return sales.filter((s) => {
    if (filters.profile !== 'all' && s.profileName !== filters.profile) {
      return false
    }
    if (filters.server !== 'all' && s.server !== filters.server) {
      return false
    }
    if (term) {
      const haystack = [
        s.username,
        s.profileName,
        s.macAddress,
        s.ipAddress,
        s.server,
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(term)) return false
    }
    return true
  })
}

export function exportDailyCsv(report: DailyReport): string {
  const header = [
    'time',
    'username',
    'profile',
    'price',
    'sellingPrice',
    'validity',
    'server',
    'ip',
    'mac',
  ].join(',')
  const rows = report.sales.map((s) =>
    [
      s.soldAt.toISOString(),
      s.username,
      s.profileName,
      s.price,
      s.sellingPrice,
      s.validity,
      s.server,
      s.ipAddress,
      s.macAddress,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(',')
  )
  return [header, ...rows].join('\n')
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
