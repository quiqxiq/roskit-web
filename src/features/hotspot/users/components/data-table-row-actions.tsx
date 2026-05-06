import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Copy, Pencil, Trash2, Power } from 'lucide-react'
import { toast } from 'sonner'
import { useHotspotUsersStore } from '@/stores/hotspot-users-store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type HotspotUser } from '../data/schema'
import { useUsersDialogStore } from '../store/users-dialog-store'

type DataTableRowActionsProps = {
  row: Row<HotspotUser>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const user = row.original
  const openDialog = useUsersDialogStore((s) => s.open)
  const updateUser = useHotspotUsersStore((s) => s.update)

  const handleCopyVoucher = () => {
    navigator.clipboard.writeText(`${user.username}\n${user.password}`)
    toast.success('Copied', { description: `${user.username} credentials copied` })
  }

  const handleDisconnect = () => {
    updateUser(user.id, { status: 'offline', uptime: '—' })
    toast.success(`${user.username} disconnected`)
  }

  const handleEdit = () => {
    openDialog('edit', { target: user })
  }

  const handleRemove = () => {
    openDialog('delete', { target: user })
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
      <DropdownMenuContent align='end' className='w-44'>
        <DropdownMenuItem onClick={handleEdit}>
          <Pencil className='size-4' />
          Edit User
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyVoucher}>
          <Copy className='size-4' />
          Copy Credentials
        </DropdownMenuItem>
        {(user.status === 'online' || user.status === 'idle') && (
          <DropdownMenuItem onClick={handleDisconnect}>
            <Power className='size-4' />
            Disconnect
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleRemove} className='text-red-500!'>
          <Trash2 className='size-4' />
          Remove User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
