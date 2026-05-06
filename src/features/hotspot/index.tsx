import { Link } from '@tanstack/react-router'
import {
  Activity,
  Bell,
  Laptop,
  PieChart,
  RefreshCw,
  Ticket,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import { useHotspotActiveStore } from '@/stores/hotspot-active-store'
import { useHotspotHostsStore } from '@/stores/hotspot-hosts-store'
import { useHotspotProfilesStore } from '@/stores/hotspot-profiles-store'
import { useHotspotUsersStore } from '@/stores/hotspot-users-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Main } from '@/components/layout/main'

type KPI = {
  title: string
  value: string
  subtitle: string
  icon: React.ElementType
  to: string
  iconClass: string
}

export function HotspotOverview() {
  const hotspotUsers = useHotspotUsersStore((s) => s.items)
  const hotspotProfiles = useHotspotProfilesStore((s) => s.items)
  const hotspotActives = useHotspotActiveStore((s) => s.items)
  const hotspotHosts = useHotspotHostsStore((s) => s.items)
  const userCount = hotspotUsers.length
  const onlineUsers = hotspotUsers.filter((u) => u.status === 'online').length
  const profileCount = hotspotProfiles.length
  const monitorCount = hotspotProfiles.filter(
    (p) => p.hasExpiredMonitor
  ).length
  const activeCount = hotspotActives.length
  const totalTrafficGB = (
    hotspotActives.reduce((sum, a) => sum + a.bytesIn + a.bytesOut, 0) /
    1_073_741_824
  ).toFixed(1)
  const hostCount = hotspotHosts.length
  const authorizedHosts = hotspotHosts.filter((h) => h.authorized).length

  const kpis: KPI[] = [
    {
      title: 'Hotspot Users',
      value: String(userCount),
      subtitle: `${onlineUsers} online`,
      icon: Users,
      to: '/hotspot/users',
      iconClass: 'text-sky-600 dark:text-sky-400',
    },
    {
      title: 'Profiles',
      value: String(profileCount),
      subtitle: `${monitorCount} monitor active`,
      icon: PieChart,
      to: '/hotspot/profiles',
      iconClass: 'text-violet-600 dark:text-violet-400',
    },
    {
      title: 'Active Sessions',
      value: String(activeCount),
      subtitle: `${totalTrafficGB} GB traffic`,
      icon: Activity,
      to: '/hotspot/active',
      iconClass: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Hosts',
      value: String(hostCount),
      subtitle: `${authorizedHosts} authorized`,
      icon: Laptop,
      to: '/hotspot/hosts',
      iconClass: 'text-amber-600 dark:text-amber-400',
    },
  ]

  return (
    <Main className='flex flex-1 flex-col gap-3 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-xl font-bold tracking-tight sm:text-2xl'>
            Hotspot Overview
          </h2>
          <p className='text-sm text-muted-foreground sm:text-base'>
            Real-time monitoring of all hotspot resources
          </p>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={() =>
            toast.info('Refreshed', {
              description: 'All hotspot resources refreshed.',
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
              <Ticket className='size-4' />
              Generate Vouchers
            </Link>
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='gap-1.5'
            onClick={() =>
              toast.info('Setup Expired Monitor', {
                description: 'Bulk monitor setup coming in Phase 2.',
              })
            }
          >
            <Bell className='size-4' />
            Setup Expired Monitor
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='gap-1.5'
            onClick={() =>
              toast.info('Refreshed', {
                description: 'Hotspot resources refreshed.',
              })
            }
          >
            <RefreshCw className='size-4' />
            Refresh All
          </Button>
        </CardContent>
      </Card>
    </Main>
  )
}
