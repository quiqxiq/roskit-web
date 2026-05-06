import { Plus, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { useHotspotProfilesStore } from '@/stores/hotspot-profiles-store'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'
import { HotspotProfilesTable } from './components/hotspot-profiles-table'
import { ProfileDialogs } from './dialogs/profile-dialogs'
import { useProfilesDialogStore } from './store/profiles-dialog-store'

export function HotspotProfiles() {
  const hotspotProfiles = useHotspotProfilesStore((s) => s.items)
  const openDialog = useProfilesDialogStore((s) => s.open)
  const totalCount = hotspotProfiles.length
  const monitorCount = hotspotProfiles.filter((p) => p.hasExpiredMonitor).length

  return (
    <Main className='flex flex-1 flex-col gap-3 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-xl font-bold tracking-tight sm:text-2xl'>
            User Profiles
          </h2>
          <p className='text-sm text-muted-foreground sm:text-base'>
            {totalCount} profiles · {monitorCount} with active expired monitor
          </p>
        </div>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() =>
              toast.info('Refreshed', {
                description: 'Profile list refreshed from RouterOS.',
              })
            }
          >
            <RefreshCw className='size-4' />
            Refresh
          </Button>
          <Button
            size='sm'
            className='gap-1.5'
            onClick={() => openDialog('add')}
          >
            <Plus className='size-4' />
            Add Profile
          </Button>
        </div>
      </div>
      <HotspotProfilesTable data={hotspotProfiles} />
      <ProfileDialogs />
    </Main>
  )
}
