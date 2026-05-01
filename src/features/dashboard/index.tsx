import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  Users,
  Wifi,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { PingIndicator } from '@/components/ping-indicator'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Analytics } from './components/analytics'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'

type KpiStat = {
  label: string
  value: string
  sub: string
  icon: typeof Wifi
  cls: string
}

const kpiStats: KpiStat[] = [
  {
    label: 'Active',
    value: '38',
    sub: 'Live sessions',
    icon: Wifi,
    cls: 'mk-stat-red',
  },
  {
    label: 'Users',
    value: '142',
    sub: 'Registered',
    icon: Users,
    cls: 'mk-stat-amber',
  },
  {
    label: 'Income Today',
    value: 'Rp 85K',
    sub: 'Month: Rp 1.2M',
    icon: DollarSign,
    cls: 'mk-stat-teal',
  },
  {
    label: 'Download (RX)',
    value: '24.6',
    sub: 'Mbps',
    icon: ArrowDown,
    cls: 'mk-stat-rx',
  },
  {
    label: 'Upload (TX)',
    value: '8.2',
    sub: 'Mbps',
    icon: ArrowUp,
    cls: 'mk-stat-tx',
  },
]

export function Dashboard() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} className='me-auto' />
        <Search />
        <PingIndicator />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <div className='flex items-center space-x-2'>
            <Button>Download</Button>
          </div>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
              <TabsTrigger value='reports' disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value='notifications' disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
              {kpiStats.map((s) => {
                const Icon = s.icon
                return (
                  <div
                    key={s.label}
                    className={`${s.cls} relative overflow-hidden rounded-xl p-4 text-white shadow-md`}
                  >
                    <p className='mb-1 text-xs font-bold tracking-widest uppercase opacity-75'>
                      {s.label}
                    </p>
                    <p className='text-3xl font-extrabold tracking-tight'>
                      {s.value}
                    </p>
                    <p className='mt-1 text-xs opacity-75'>{s.sub}</p>
                    <Icon className='absolute top-1/2 right-3 size-10 -translate-y-1/2 opacity-20' />
                  </div>
                )
              })}
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className='ps-2'>
                  <Overview />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='analytics' className='space-y-4'>
            <Analytics />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
    disabled: true,
  },
]
