import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { expModeLabels, formatIDR } from '../data/data'
import { type HotspotProfile } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<HotspotProfile>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      const { name, hasExpiredMonitor } = row.original
      return (
        <span className='inline-flex items-center gap-2 font-semibold'>
          <span
            className={cn(
              'inline-block size-2 rounded-full',
              hasExpiredMonitor ? 'bg-emerald-500' : 'bg-amber-500'
            )}
            title={hasExpiredMonitor ? 'Monitor active' : 'Monitor inactive'}
          />
          {name}
        </span>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: 'sharedUsers',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Shared' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-sm'>{row.getValue('sharedUsers')}</span>
    ),
  },
  {
    accessorKey: 'rateLimit',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Rate Limit' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-sm'>{row.getValue('rateLimit')}</span>
    ),
  },
  {
    accessorKey: 'expMode',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Exp Mode' />
    ),
    cell: ({ row }) => {
      const mode = row.original.expMode
      return (
        <Badge variant='outline' className='font-normal'>
          {expModeLabels[mode]}
        </Badge>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'validity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Validity' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-sm'>{row.getValue('validity')}</span>
    ),
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Price' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-sm tabular-nums'>
        {formatIDR(row.original.price)}
      </span>
    ),
  },
  {
    accessorKey: 'sellingPrice',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Selling Price' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-sm tabular-nums text-emerald-600 dark:text-emerald-400'>
        {formatIDR(row.original.sellingPrice)}
      </span>
    ),
  },
  {
    accessorKey: 'lockUser',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Lock User' />
    ),
    cell: ({ row }) =>
      row.original.lockUser ? (
        <span className='text-emerald-600 dark:text-emerald-400'>✓</span>
      ) : (
        <span className='text-muted-foreground'>—</span>
      ),
  },
  {
    id: 'hasExpiredMonitor',
    accessorFn: (row) => String(row.hasExpiredMonitor),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Monitor' />
    ),
    cell: ({ row }) =>
      row.original.hasExpiredMonitor ? (
        <Badge
          variant='outline'
          className='border-emerald-300 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
        >
          Active
        </Badge>
      ) : (
        <Badge variant='outline' className='text-muted-foreground'>
          Inactive
        </Badge>
      ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
