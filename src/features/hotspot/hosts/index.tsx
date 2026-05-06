import { Link2, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { useHotspotHostsStore } from '@/stores/hotspot-hosts-store'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'
import { HotspotHostsTable } from './components/hotspot-hosts-table'
import { HostDialogs } from './dialogs/host-dialogs'
import { useHostsDialogStore } from './store/hosts-dialog-store'

export function HotspotHosts() {
  const hotspotHosts = useHotspotHostsStore((s) => s.items)
  const openDialog = useHostsDialogStore((s) => s.open)
  const totalCount = hotspotHosts.length
  const authorizedCount = hotspotHosts.filter((h) => h.authorized).length
  const bypassedCount = hotspotHosts.filter((h) => h.bypassed).length

  return (
    <Main className='flex flex-1 flex-col gap-3 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-xl font-bold tracking-tight sm:text-2xl'>
            Hosts
          </h2>
          <p className='text-sm text-muted-foreground sm:text-base'>
            {totalCount} total · {authorizedCount} authorized ·{' '}
            {bypassedCount} bypassed
          </p>
        </div>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() =>
              toast.info('Refreshed', {
                description: 'Host list refreshed from RouterOS.',
              })
            }
          >
            <RefreshCw className='size-4' />
            Refresh
          </Button>
          <Button
            size='sm'
            className='gap-1.5'
            onClick={() => openDialog('bind')}
          >
            <Link2 className='size-4' />
            Make IP Binding
          </Button>
        </div>
      </div>
      <HotspotHostsTable data={hotspotHosts} />
      <HostDialogs />
    </Main>
  )
}
