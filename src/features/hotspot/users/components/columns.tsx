import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { formatBytes } from '../data/data'
import { type HotspotUser } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

const statusIcon: Record<string, string> = {
  online: '●',
  expired: '●',
  idle: '●',
  offline: '●',
}

export const columns: ColumnDef<HotspotUser>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-0.5'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-0.5'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge variant={status as 'online' | 'expired' | 'idle' | 'offline'}>
          <span className='text-[8px]'>{statusIcon[status]}</span>
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'username',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Username' />
    ),
    cell: ({ row }) => (
      <span className='font-semibold'>{row.getValue('username')}</span>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'profile',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Profile' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-sm'>{row.getValue('profile')}</span>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'macAddress',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='MAC Address' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-sm'>{row.getValue('macAddress')}</span>
    ),
  },
  {
    accessorKey: 'server',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Server' />
    ),
    cell: ({ row }) => <span>{row.getValue('server')}</span>,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'uptime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Uptime' />
    ),
    cell: ({ row }) => (
      <span className={cn('font-mono text-sm', row.getValue('uptime') === '—' && 'text-muted-foreground')}>
        {row.getValue('uptime')}
      </span>
    ),
  },
  {
    id: 'bytesTotal',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Traffic' />
    ),
    accessorFn: (row) =>
      row.status === 'online' || row.status === 'idle'
        ? `↓${formatBytes(row.bytesIn)} ↑${formatBytes(row.bytesOut)}`
        : '—',
    cell: ({ row }) => {
      const { bytesIn, bytesOut, status } = row.original
      const isActive = status === 'online' || status === 'idle'
      if (!isActive) {
        return <span className='text-muted-foreground'>—</span>
      }
      return (
        <div className='font-mono text-xs'>
          <span className='text-sky-600 dark:text-sky-400'>
            ↓{formatBytes(bytesIn)}
          </span>
          {' '}
          <span className='text-violet-600 dark:text-violet-400'>
            ↑{formatBytes(bytesOut)}
          </span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
