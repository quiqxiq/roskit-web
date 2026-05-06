import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { formatBytes } from '../data/data'
import { type HotspotActive } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<HotspotActive>[] = [
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
    accessorKey: 'server',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Server' />
    ),
    cell: ({ row }) => (
      <Badge variant='outline' className='font-mono'>
        {row.getValue('server')}
      </Badge>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'user',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='User' />
    ),
    cell: ({ row }) => (
      <span className='font-semibold'>{row.getValue('user')}</span>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'address',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Address' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-sm'>{row.getValue('address')}</span>
    ),
  },
  {
    accessorKey: 'macAddress',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='MAC' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-sm'>{row.getValue('macAddress')}</span>
    ),
  },
  {
    accessorKey: 'uptime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Uptime' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-sm'>{row.getValue('uptime')}</span>
    ),
  },
  {
    id: 'traffic',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Traffic' />
    ),
    accessorFn: (row) => row.bytesIn + row.bytesOut,
    cell: ({ row }) => {
      const { bytesIn, bytesOut } = row.original
      return (
        <div className='font-mono text-xs'>
          <span className='text-sky-600 dark:text-sky-400'>
            ↓{formatBytes(bytesIn)}
          </span>{' '}
          <span className='text-violet-600 dark:text-violet-400'>
            ↑{formatBytes(bytesOut)}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'sessionTimeLeft',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Time Left' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-sm'>
        {row.getValue('sessionTimeLeft')}
      </span>
    ),
  },
  {
    accessorKey: 'loginBy',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Login By' />
    ),
    cell: ({ row }) => (
      <Badge variant='outline' className='font-normal capitalize'>
        {row.getValue('loginBy')}
      </Badge>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'comment',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Comment' />
    ),
    cell: ({ row }) => {
      const comment = row.original.comment
      return comment ? (
        <span className='text-sm text-muted-foreground'>{comment}</span>
      ) : (
        <span className='text-muted-foreground'>—</span>
      )
    },
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
