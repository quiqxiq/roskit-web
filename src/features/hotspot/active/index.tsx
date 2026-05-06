import { Download, Power, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { useHotspotActiveStore } from '@/stores/hotspot-active-store'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'
import { HotspotActiveTable } from './components/hotspot-active-table'
import { DisconnectDialog } from './dialogs/disconnect-dialog'
import { useActiveDialogStore } from './store/active-dialog-store'

export function HotspotActive() {
  const hotspotActives = useHotspotActiveStore((s) => s.items)
  const openDialog = useActiveDialogStore((s) => s.open)
  const totalCount = hotspotActives.length
  const totalIn = hotspotActives.reduce((sum, s) => sum + s.bytesIn, 0)
  const totalOut = hotspotActives.reduce((sum, s) => sum + s.bytesOut, 0)
  const totalGB = ((totalIn + totalOut) / 1_073_741_824).toFixed(1)

  return (
    <Main className='flex flex-1 flex-col gap-3 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-xl font-bold tracking-tight sm:text-2xl'>
            Active Sessions
          </h2>
          <p className='text-sm text-muted-foreground sm:text-base'>
            {totalCount} active · {totalGB} GB total traffic
          </p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() =>
              toast.info('Refreshed', {
                description: 'Active sessions refreshed from RouterOS.',
              })
            }
          >
            <RefreshCw className='size-4' />
            Refresh
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() =>
              toast.info('Export', { description: 'CSV export coming soon.' })
            }
          >
            <Download className='size-4' />
            Export
          </Button>
          <Button
            variant='destructive'
            size='sm'
            className='gap-1.5'
            disabled={totalCount === 0}
            onClick={() => openDialog('disconnect-all')}
          >
            <Power className='size-4' />
            Disconnect All
          </Button>
        </div>
      </div>
      <HotspotActiveTable data={hotspotActives} />
      <DisconnectDialog />
    </Main>
  )
}
