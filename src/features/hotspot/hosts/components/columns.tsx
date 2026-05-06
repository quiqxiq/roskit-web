import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { hostFlags } from '../data/data'
import { type HotspotHost } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<HotspotHost>[] = [
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
    id: 'flags',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Flags' />
    ),
    cell: ({ row }) => {
      const flags = hostFlags(row.original)
      if (flags.length === 0) {
        return <span className='text-muted-foreground'>—</span>
      }
      return (
        <div className='flex flex-wrap gap-1'>
          {flags.map((f) => (
            <Badge
              key={f.label}
              variant='outline'
              title={f.title}
              className={cn('h-5 px-1.5 font-mono text-[10px]', f.className)}
            >
              {f.label}
            </Badge>
          ))}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'macAddress',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='MAC Address' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-sm'>{row.getValue('macAddress')}</span>
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
    accessorKey: 'toAddress',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='To Address' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-sm'>{row.getValue('toAddress')}</span>
    ),
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
