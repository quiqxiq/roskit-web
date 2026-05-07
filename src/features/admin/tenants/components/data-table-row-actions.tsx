import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Link } from '@tanstack/react-router'
import { Eye, Pause, Pencil, Play, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Tenant } from '../data/schema'
import { useTenantsDialogStore } from '../store/tenants-dialog-store'

type Props = { row: Row<Tenant> }

export function DataTableRowActions({ row }: Props) {
  const tenant = row.original
  const openDialog = useTenantsDialogStore((s) => s.open)

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
        <DropdownMenuItem asChild>
          <Link to='/admin/tenants/$tenantId' params={{ tenantId: tenant.id }}>
            <Eye className='size-4' />
            View Detail
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openDialog('edit-name', { target: tenant })}>
          <Pencil className='size-4' />
          Edit Name
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {tenant.status === 'suspended' ? (
          <DropdownMenuItem onClick={() => openDialog('activate', { target: tenant })}>
            <Play className='size-4' />
            Activate
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => openDialog('suspend', { target: tenant })}>
            <Pause className='size-4' />
            Suspend
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => openDialog('hard-delete', { target: tenant })}
          className='text-red-500!'
        >
          <Trash2 className='size-4' />
          Hard Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
