import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Bell, BellOff, Pencil, Trash2, Users } from 'lucide-react'
import { toast } from 'sonner'
import { useHotspotProfilesStore } from '@/stores/hotspot-profiles-store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type HotspotProfile } from '../data/schema'
import { useProfilesDialogStore } from '../store/profiles-dialog-store'

type DataTableRowActionsProps = {
  row: Row<HotspotProfile>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const profile = row.original
  const openDialog = useProfilesDialogStore((s) => s.open)
  const setMonitor = useHotspotProfilesStore((s) => s.setMonitor)

  const handleEdit = () => {
    openDialog('edit', { target: profile })
  }

  const handleViewUsers = () => {
    toast.info('View Users', {
      description: `Filter Users by profile: ${profile.name}`,
    })
  }

  const handleToggleMonitor = () => {
    setMonitor(profile.id, !profile.hasExpiredMonitor)
    if (profile.hasExpiredMonitor) {
      toast.success(`Removed expired monitor for ${profile.name}`)
    } else {
      toast.success(`Setup expired monitor for ${profile.name}`)
    }
  }

  const handleDelete = () => {
    openDialog('delete', { target: profile })
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        <DropdownMenuItem onClick={handleEdit}>
          <Pencil className='size-4' />
          Edit Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleViewUsers}>
          <Users className='size-4' />
          View Users
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggleMonitor}>
          {profile.hasExpiredMonitor ? (
            <>
              <BellOff className='size-4' />
              Remove Monitor
            </>
          ) : (
            <>
              <Bell className='size-4' />
              Setup Monitor
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className='text-red-500!'>
          <Trash2 className='size-4' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
