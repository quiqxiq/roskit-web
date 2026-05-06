import { Link } from '@tanstack/react-router'
import {
  BarChart3,
  CalendarDays,
  Plus,
  Printer,
  RefreshCw,
  Ticket,
  TrendingUp,
} from 'lucide-react'
import { toast } from 'sonner'
import { useQuickPrintPresetsStore } from '@/stores/quick-print-presets-store'
import { useVoucherSalesStore } from '@/stores/voucher-sales-store'
import { formatIDR } from '@/lib/format'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Main } from '@/components/layout/main'
import {
  filterMonthSales,
  filterTodaySales,
  recentSales,
  sumSelling,
} from './data/sales'

type KPI = {
  title: string
  value: string
  subtitle: string
  icon: React.ElementType
  to: string
  iconClass: string
}

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'short',
  timeStyle: 'short',
})

export function VoucherOverview() {
  const voucherSales = useVoucherSalesStore((s) => s.items)
  const presetCount = useQuickPrintPresetsStore((s) => s.items.length)
  const today = filterTodaySales(voucherSales)
  const month = filterMonthSales(voucherSales)
  const recent = recentSales(voucherSales, 10)

  const todaySum = sumSelling(today)
  const monthSum = sumSelling(month)
  const totalSum = sumSelling(voucherSales)

  const kpis: KPI[] = [
    {
      title: "Today's Sales",
      value: String(today.length),
      subtitle: formatIDR(todaySum),
      icon: TrendingUp,
      to: '/voucher/generate',
      iconClass: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'This Month',
      value: String(month.length),
      subtitle: formatIDR(monthSum),
      icon: CalendarDays,
      to: '/voucher/generate',
      iconClass: 'text-sky-600 dark:text-sky-400',
    },
    {
      title: 'Total Sales',
      value: String(voucherSales.length),
      subtitle: formatIDR(totalSum),
      icon: BarChart3,
      to: '/voucher/generate',
      iconClass: 'text-violet-600 dark:text-violet-400',
    },
    {
      title: 'Quick Presets',
      value: String(presetCount),
      subtitle: 'configured',
      icon: Printer,
      to: '/voucher/print',
      iconClass: 'text-amber-600 dark:text-amber-400',
    },
  ]

  return (
    <Main className='flex flex-1 flex-col gap-3 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-xl font-bold tracking-tight sm:text-2xl'>
            Voucher Overview
          </h2>
          <p className='text-sm text-muted-foreground sm:text-base'>
            Sales summary and recent voucher activity
          </p>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={() =>
            toast.info('Refreshed', {
              description: 'Voucher data refreshed.',
            })
          }
        >
          <RefreshCw className='size-4' />
          Refresh
        </Button>
      </div>

      <div className='grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4'>
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Link key={kpi.title} to={kpi.to} className='group block'>
              <Card className='transition-colors group-hover:border-primary/40 group-hover:bg-muted/40'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-xs font-medium tracking-wide uppercase text-muted-foreground sm:text-sm'>
                    {kpi.title}
                  </CardTitle>
                  <Icon className={`size-5 ${kpi.iconClass}`} />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold tabular-nums sm:text-3xl'>
                    {kpi.value}
                  </div>
                  <p className='text-[11px] text-muted-foreground sm:text-xs'>
                    {kpi.subtitle}
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-wrap gap-2'>
          <Button asChild size='sm' className='gap-1.5'>
            <Link to='/voucher/generate'>
              <Plus className='size-4' />
              Generate Vouchers
            </Link>
          </Button>
          <Button asChild variant='outline' size='sm' className='gap-1.5'>
            <Link to='/voucher/print'>
              <Printer className='size-4' />
              Quick Print Presets
            </Link>
          </Button>
          <Button asChild variant='outline' size='sm' className='gap-1.5'>
            <Link to='/report/daily'>
              <BarChart3 className='size-4' />
              View Reports
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Recent Sales</CardTitle>
          <p className='text-xs text-muted-foreground'>
            Last {recent.length} voucher sales
          </p>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sold At</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Profile</TableHead>
                  <TableHead className='text-right'>Price</TableHead>
                  <TableHead>Server</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className='h-24 text-center text-muted-foreground'
                    >
                      <Ticket className='mx-auto mb-1 size-5 opacity-50' />
                      No recent sales.
                    </TableCell>
                  </TableRow>
                ) : (
                  recent.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className='font-mono text-xs'>
                        {dateFormatter.format(sale.soldAt)}
                      </TableCell>
                      <TableCell className='font-mono text-sm font-semibold'>
                        {sale.username}
                      </TableCell>
                      <TableCell className='text-sm'>
                        {sale.profileName}
                      </TableCell>
                      <TableCell className='text-right font-mono text-sm tabular-nums text-emerald-600 dark:text-emerald-400'>
                        {formatIDR(sale.sellingPrice)}
                      </TableCell>
                      <TableCell className='font-mono text-xs'>
                        {sale.server}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </Main>
  )
}
