import { type ColumnDef } from '@tanstack/react-table'
import { Lock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type PrintTemplate } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

function formatDateTime(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const columns: ColumnDef<PrintTemplate>[] = [
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
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <span className='font-semibold'>{row.original.name}</span>
        {row.original.isBuiltin && (
          <Lock className='size-3 text-muted-foreground' />
        )}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => (
      <Badge variant='outline' className='font-mono lowercase'>
        {row.original.type}
      </Badge>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: 'origin',
    accessorFn: (row) => (row.isBuiltin ? 'builtin' : 'custom'),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Origin' />
    ),
    cell: ({ row }) =>
      row.original.isBuiltin ? (
        <Badge
          variant='outline'
          className='border-transparent bg-blue-500/10 text-blue-700 dark:text-blue-400'
        >
          Built-in
        </Badge>
      ) : (
        <Badge variant='outline' className='border-transparent bg-muted'>
          Custom
        </Badge>
      ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Updated' />
    ),
    cell: ({ row }) => (
      <span className='text-sm text-muted-foreground'>
        {formatDateTime(row.original.updatedAt)}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
