import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Copy, Power, UserCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type HotspotActive } from '../data/schema'
import { useActiveDialogStore } from '../store/active-dialog-store'

type DataTableRowActionsProps = {
  row: Row<HotspotActive>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const session = row.original
  const openDialog = useActiveDialogStore((s) => s.open)

  const handleDisconnect = () => {
    openDialog('disconnect', { target: session })
  }

  const handleViewUser = () => {
    toast.info('View User', {
      description: `Open user detail for ${session.user}`,
    })
  }

  const handleCopyMac = () => {
    navigator.clipboard.writeText(session.macAddress)
    toast.success('Copied', {
      description: `MAC ${session.macAddress} copied`,
    })
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
        <DropdownMenuItem onClick={handleViewUser}>
          <UserCircle className='size-4' />
          View User
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyMac}>
          <Copy className='size-4' />
          Copy MAC
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDisconnect} className='text-red-500!'>
          <Power className='size-4' />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
