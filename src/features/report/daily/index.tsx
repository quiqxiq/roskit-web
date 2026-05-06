import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useVoucherSalesStore } from '@/stores/voucher-sales-store'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Main } from '@/components/layout/main'
import { SalesDialogs } from '@/features/voucher/sales/dialogs/sales-dialogs'
import { DailyDatePicker } from './components/daily-date-picker'
import { DailyExportMenu } from './components/daily-export-menu'
import { DailySalesTable } from './components/daily-sales-table'
import { DailySummaryCards } from './components/daily-summary-cards'
import { applyDailyFilters, buildDailyReport } from './data/data'
import { type DailySaleFilters } from './data/schema'

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function parseDateParam(value: unknown): Date {
  if (typeof value === 'string') {
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) return startOfDay(parsed)
  }
  return startOfDay(new Date())
}

export function DailyReport() {
  const navigate = useNavigate()
  const sales = useVoucherSalesStore((s) => s.items)
  const [date, setDate] = useState<Date>(() => {
    if (typeof window === 'undefined') return startOfDay(new Date())
    const params = new URLSearchParams(window.location.search)
    return parseDateParam(params.get('date'))
  })
  const [filters, setFilters] = useState<DailySaleFilters>({
    search: '',
    profile: 'all',
    server: 'all',
  })

  const report = useMemo(() => buildDailyReport(sales, date), [sales, date])
  const filtered = useMemo(
    () => applyDailyFilters(report.sales, filters),
    [report.sales, filters]
  )
  const filteredTotal = filtered.reduce((sum, s) => sum + s.sellingPrice, 0)

  const handleDateChange = (next: Date) => {
    const start = startOfDay(next)
    setDate(start)
    void navigate({
      to: '/report/daily',
      search: { date: start.toISOString().slice(0, 10) },
      replace: true,
    })
  }

  return (
    <>
      <Main className='flex flex-1 flex-col gap-3 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-xl font-bold tracking-tight sm:text-2xl'>
              Daily Report
            </h2>
            <p className='text-sm text-muted-foreground sm:text-base'>
              Voucher sales detail for the selected date
            </p>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <DailyDatePicker date={date} onChange={handleDateChange} />
            <DailyExportMenu report={report} />
          </div>
        </div>

        <DailySummaryCards
          report={report}
          filteredCount={filtered.length}
          filteredTotal={filteredTotal}
        />

        <Card>
          <CardHeader className='pb-2'>
            <h3 className='font-semibold'>Sales Detail</h3>
          </CardHeader>
          <CardContent>
            <DailySalesTable
              sales={report.sales}
              filteredSales={filtered}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </CardContent>
        </Card>
      </Main>
      <SalesDialogs />
    </>
  )
}
