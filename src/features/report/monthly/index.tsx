import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useVoucherSalesStore } from '@/stores/voucher-sales-store'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Main } from '@/components/layout/main'
import { MonthlyBarChart } from './components/monthly-bar-chart'
import { MonthlyDailyTable } from './components/monthly-daily-table'
import { MonthlyPeriodPicker } from './components/monthly-period-picker'
import { MonthlySummaryCards } from './components/monthly-summary-cards'
import { YearlyResumeChart } from './components/yearly-resume-chart'
import {
  buildMonthlyReport,
  buildYearlySummary,
  dateToDailyParam,
  MONTH_NAMES,
} from './data/data'

export function MonthlyReport() {
  const navigate = useNavigate()
  const sales = useVoucherSalesStore((s) => s.items)
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [showResume, setShowResume] = useState(true)

  const report = useMemo(
    () => buildMonthlyReport(sales, year, month),
    [sales, year, month]
  )
  const yearly = useMemo(() => buildYearlySummary(sales, year), [sales, year])

  const drillToDaily = (date: Date) => {
    void navigate({
      to: '/report/daily',
      search: { date: dateToDailyParam(date) },
    })
  }

  return (
    <Main className='flex flex-1 flex-col gap-3 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-xl font-bold tracking-tight sm:text-2xl'>
            Monthly Report
          </h2>
          <p className='text-sm text-muted-foreground sm:text-base'>
            {MONTH_NAMES[month]} {year} · daily breakdown and yearly trend
          </p>
        </div>
        <MonthlyPeriodPicker
          year={year}
          month={month}
          onChange={(y, m) => {
            setYear(y)
            setMonth(m)
          }}
        />
      </div>

      <MonthlySummaryCards report={report} />

      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-base'>
            {MONTH_NAMES[month]} Revenue by Day
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyBarChart rows={report.rows} onSelectDay={drillToDaily} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-base'>{year} Year Overview</CardTitle>
          <Button
            variant='ghost'
            size='sm'
            className='h-7 gap-1.5 text-xs'
            onClick={() => setShowResume((v) => !v)}
          >
            {showResume ? (
              <>
                <ChevronUp className='size-3.5' />
                Hide
              </>
            ) : (
              <>
                <ChevronDown className='size-3.5' />
                Show
              </>
            )}
          </Button>
        </CardHeader>
        {showResume && (
          <CardContent>
            <YearlyResumeChart
              rows={yearly}
              selectedMonth={month}
              onSelectMonth={(m) => setMonth(m)}
            />
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-base'>Daily Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyDailyTable rows={report.rows} onSelectDay={drillToDaily} />
        </CardContent>
      </Card>
    </Main>
  )
}
