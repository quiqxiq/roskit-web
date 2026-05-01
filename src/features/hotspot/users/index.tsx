import { UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { PingIndicator } from '@/components/ping-indicator'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { HotspotUsersTable } from './components/hotspot-users-table'
import { hotspotUsers } from './data/data'

export function HotspotUsers() {
  const onlineCount = hotspotUsers.filter((u) => u.status === 'online').length
  const totalCount = hotspotUsers.length

  return (
    <>
      <Header>
        <Search className='me-auto' />
        <PingIndicator />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Hotspot Users
            </h2>
            <p className='text-muted-foreground'>
              {onlineCount} online · {totalCount} total users
            </p>
          </div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() =>
                toast.info('Export', { description: 'CSV export coming soon' })
              }
            >
              Export
            </Button>
            <Button size='sm' className='gap-1.5'>
              <UserPlus className='size-4' />
              Add User
            </Button>
          </div>
        </div>
        <HotspotUsersTable data={hotspotUsers} />
      </Main>
    </>
  )
}
